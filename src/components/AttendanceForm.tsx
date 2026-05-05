import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { Day } from "@/data/book";

const groups = ["Kundi la 1", "Kundi la 2", "Kundi la 3", "Kundi la 4", "Mgeni / Kanisa lingine"];

const baseSchema = z.object({
  full_name: z.string().trim().min(2, "Andika jina kamili").max(100),
  phone: z.string().trim().min(7, "Namba si sahihi").max(20),
  learned: z.string().trim().min(5, "Andika ulichojifunza (angalau herufi 5)").max(5000),
});

export function AttendanceForm({ day }: { day: Day }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("");
  const [learned, setLearned] = useState("");
  const [answers, setAnswers] = useState<string[]>(() => day.questions.map(() => ""));
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function setAnswer(i: number, val: string) {
    setAnswers((prev) => prev.map((a, idx) => (idx === i ? val : a)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsed = baseSchema.safeParse({ full_name: fullName, phone, learned });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    // Ensure all questions answered
    const missing = answers.findIndex((a) => a.trim().length < 2);
    if (missing !== -1) {
      setError(`Tafadhali jibu Swali la ${missing + 1}.`);
      return;
    }

    setStatus("loading");
    const payload = answers.map((a, i) => ({
      question: day.questions[i],
      answer: a.trim(),
    }));

    const { error: dbError } = await supabase.from("attendance").insert({
      day: day.day,
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      group_name: group || null,
      learned: parsed.data.learned,
      answers: payload,
    });

    if (dbError) {
      setStatus("error");
      setError(dbError.message);
      return;
    }
    setStatus("success");
    setFullName(""); setPhone(""); setGroup(""); setLearned("");
    setAnswers(day.questions.map(() => ""));
  }

  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
      <h2 className="font-display text-2xl text-primary">Sajili Mahudhurio</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Jaza fomu hii kuthibitisha umehudhuria maombi ya Siku ya {day.day} — pamoja na kile ulichojifunza na majibu ya maswali.
      </p>

      {status === "success" ? (
        <div className="mt-6 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-foreground">
          ✓ Asante! Mahudhurio yako ya Siku ya {day.day} yamerekodiwa pamoja na majibu yako.
          <button onClick={() => setStatus("idle")} className="ml-2 underline text-accent">Sajili mwingine</button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">Jina kamili</label>
              <input
                type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                placeholder="John Doe" maxLength={100} required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Namba ya simu</label>
              <input
                type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                placeholder="0712 345 678" maxLength={20} required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Kundi (hiari)</label>
            <select
              value={group} onChange={(e) => setGroup(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
            >
              <option value="">— Chagua kundi —</option>
              {groups.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Nilichojifunza leo</label>
            <textarea
              value={learned} onChange={(e) => setLearned(e.target.value)}
              rows={4} maxLength={5000} required
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
              placeholder="Andika kwa ufupi mafunzo uliyopata kutoka Siku ya {day.day}…"
            />
          </div>

          <div className="space-y-4 rounded-xl border border-accent/30 bg-accent/5 p-5">
            <p className="font-display text-lg text-primary">Majibu ya Maswali</p>
            {day.questions.map((q, i) => (
              <div key={i}>
                <label className="text-sm font-medium text-foreground">
                  <span className="font-bold text-accent">Swali {i + 1}.</span> {q}
                </label>
                <textarea
                  value={answers[i] ?? ""}
                  onChange={(e) => setAnswer(i, e.target.value)}
                  rows={3} maxLength={3000} required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  placeholder="Jibu lako…"
                />
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit" disabled={status === "loading"}
            className="rounded-full bg-gold-grad px-6 py-3 text-sm font-semibold text-gold-foreground shadow-elegant transition hover:scale-[1.02] disabled:opacity-50"
          >
            {status === "loading" ? "Inahifadhi…" : "✓ Tuma Mahudhurio"}
          </button>
        </form>
      )}
    </section>
  );
}
