import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { Day } from "@/data/book";

const groups = ["Kundi la 1", "Kundi la 2", "Kundi la 3", "Kundi la 4", "Mgeni / Kanisa lingine"];

const baseSchema = z.object({
  full_name: z.string().trim().min(2, "Andika jina kamili").max(100),
  phone: z.string().trim().min(7, "Namba si sahihi").max(20),
  learned: z.string().trim().min(5, "Andika ulichojifunza (angalau herufi 5)").max(5000),
});

type SavedRecord = { id: string; token: string };
const storageKey = (day: number) => `attendance:day:${day}`;

function loadSaved(day: number): SavedRecord | null {
  try {
    const raw = localStorage.getItem(storageKey(day));
    return raw ? (JSON.parse(raw) as SavedRecord) : null;
  } catch { return null; }
}

export function AttendanceForm({ day }: { day: Day }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("");
  const [learned, setLearned] = useState("");
  const [answers, setAnswers] = useState<string[]>(() => day.questions.map(() => ""));
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const [saved, setSaved] = useState<SavedRecord | null>(null);
  const [editing, setEditing] = useState(false);

  // Load saved record for this day
  useEffect(() => {
    setSaved(loadSaved(day.day));
    setEditing(false);
    setStatus("idle");
    setError("");
    setFullName(""); setPhone(""); setGroup(""); setLearned("");
    setAnswers(day.questions.map(() => ""));
  }, [day.day, day.questions]);

  async function startEdit() {
    if (!saved) return;
    setError("");
    const { data, error: e } = await supabase
      .from("attendance")
      .select("full_name, phone, group_name, learned, answers")
      .eq("id", saved.id)
      .maybeSingle();
    if (e || !data) {
      setError("Imeshindikana kupakia rekodi yako.");
      return;
    }
    setFullName(data.full_name);
    setPhone(data.phone);
    setGroup(data.group_name ?? "");
    setLearned(data.learned ?? "");
    const incoming = (data.answers as { question: string; answer: string }[] | null) ?? [];
    setAnswers(day.questions.map((_, i) => incoming[i]?.answer ?? ""));
    setEditing(true);
    setStatus("idle");
  }

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

    if (editing && saved) {
      const { error: rpcError } = await supabase.rpc("update_attendance", {
        p_id: saved.id,
        p_token: saved.token,
        p_full_name: parsed.data.full_name,
        p_phone: parsed.data.phone,
        p_group_name: group || "",
        p_learned: parsed.data.learned,
        p_answers: payload,
      });
      if (rpcError) {
        setStatus("error");
        setError("Imeshindikana kuhariri: " + rpcError.message);
        return;
      }
    } else {
      const token = crypto.randomUUID();
      const { data: inserted, error: dbError } = await supabase
        .from("attendance")
        .insert({
          day: day.day,
          full_name: parsed.data.full_name,
          phone: parsed.data.phone,
          group_name: group || null,
          learned: parsed.data.learned,
          answers: payload,
          edit_token: token,
        })
        .select("id")
        .single();
      if (dbError || !inserted) {
        setStatus("error");
        setError(dbError?.message ?? "Hitilafu");
        return;
      }
      const rec: SavedRecord = { id: inserted.id, token };
      try { localStorage.setItem(storageKey(day.day), JSON.stringify(rec)); } catch { /* ignore */ }
      setSaved(rec);
    }

    setStatus("success");
    setEditing(false);
  }

  // Already submitted, not editing — show summary CTA
  if (saved && !editing && status !== "success") {
    return (
      <section className="mt-8 rounded-2xl border border-accent/40 bg-accent/5 p-8 shadow-sm">
        <h2 className="font-display text-2xl text-primary">✓ Umehudhuria Siku ya {day.day}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Mahudhurio yako tayari yamerekodiwa. Unaweza kuhariri mafunzo na majibu ikiwa umebadili mawazo.
        </p>
        <button
          onClick={startEdit}
          className="mt-5 rounded-full border border-accent bg-card px-6 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent hover:text-accent-foreground"
        >
          ✎ Hariri Mahudhurio Yangu
        </button>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
      <h2 className="font-display text-2xl text-primary">
        {editing ? "Hariri Mahudhurio Yako" : "Sajili Mahudhurio"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {editing
          ? `Badilisha mafunzo au majibu ya Siku ya ${day.day}, kisha bonyeza Hifadhi.`
          : `Jaza fomu hii kuthibitisha umehudhuria maombi ya Siku ya ${day.day} — pamoja na kile ulichojifunza na majibu ya maswali.`}
      </p>

      {status === "success" ? (
        <div className="mt-6 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-foreground">
          ✓ Asante! {editing ? "Mabadiliko" : "Mahudhurio"} ya Siku ya {day.day} yamehifadhiwa.
          <button
            onClick={() => { setStatus("idle"); }}
            className="ml-2 underline text-accent"
          >
            Sawa
          </button>
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
              placeholder={`Andika kwa ufupi mafunzo uliyopata kutoka Siku ya ${day.day}…`}
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

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit" disabled={status === "loading"}
              className="rounded-full bg-gold-grad px-6 py-3 text-sm font-semibold text-gold-foreground shadow-elegant transition hover:scale-[1.02] disabled:opacity-50"
            >
              {status === "loading"
                ? "Inahifadhi…"
                : editing ? "✓ Hifadhi Mabadiliko" : "✓ Tuma Mahudhurio"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => { setEditing(false); setError(""); }}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Ghairi
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
