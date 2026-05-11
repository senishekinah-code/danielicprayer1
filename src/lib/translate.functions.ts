import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type Result = { ok: true; translations: string[] } | { ok: false; error: string };

export const translateBatch = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        texts: z.array(z.string()).min(1).max(200),
        target: z.enum(["en", "sw"]),
        source: z.enum(["en", "sw"]),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<Result> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { ok: false, error: "LOVABLE_API_KEY not set" };

    const langName = (l: string) => (l === "en" ? "English" : "Swahili");
    const sys = `You are a professional translator for a Christian devotional book.
Translate the user's array of strings from ${langName(data.source)} to ${langName(data.target)}.
Rules:
- Return ONLY a valid JSON object: {"t": ["...","..."]} with the same number of items, in the same order.
- Preserve Bible references exactly (e.g. "Yohana 11:1-44" -> "John 11:1-44"; "Mithali 4:23" -> "Proverbs 4:23").
- Translate person names ONLY if they are biblical (Yusufu->Joseph, Daudi->David, Musa->Moses, Yohana->John, Petro->Peter). Keep modern Tanzanian names unchanged.
- Keep punctuation, quotes, em-dashes, and line breaks.
- Do not add commentary.`;

    const userPayload = JSON.stringify({ items: data.texts });

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: sys },
            { role: "user", content: userPayload },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        return { ok: false, error: `AI gateway ${res.status}: ${txt.slice(0, 200)}` };
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = json.choices?.[0]?.message?.content ?? "";
      let parsed: { t?: unknown };
      try {
        parsed = JSON.parse(content);
      } catch {
        return { ok: false, error: "Invalid JSON from translator" };
      }
      const arr = parsed.t;
      if (!Array.isArray(arr) || arr.length !== data.texts.length) {
        return { ok: false, error: "Translation array mismatch" };
      }
      return { ok: true, translations: arr.map((s) => String(s)) };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Translate failed" };
    }
  });
