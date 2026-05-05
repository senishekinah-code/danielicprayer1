import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  full_name: z.string().trim().min(2, "Andika jina kamili").max(100),
  phone: z.string().trim().min(7, "Namba si sahihi").max(20),
  group_name: z.string().trim().max(50).optional().or(z.literal("")),
});

const groups = ["Kundi la 1", "Kundi la 2", "Kundi la 3", "Kundi la 4", "Mgeni / Kanisa lingine"];

export function AttendanceForm({ day }: { day: number }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = schema.safeParse({ full_name: fullName, phone, group_name: group });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setStatus("loading");
    const { error: dbError } = await supabase.from("attendance").insert({
      day,
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      group_name: parsed.data.group_name || null,
    });
    if (dbError) {
      setStatus("error");
      setError(dbError.message);
      return;
    }
    setStatus("success");
    setFullName(""); setPhone(""); setGroup("");
  }

  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
      <h2 className="font-display text-2xl text-primary">Sajili Mahudhurio</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Bonyeza hapa kuthibitisha umehudhuria maombi ya Siku ya {day}.
      </p>

      {status === "success" ? (
        <div className="mt-6 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-foreground">
          ✓ Asante! Mahudhurio yako ya Siku ya {day} yamerekodiwa.
          <button onClick={() => setStatus("idle")} className="ml-2 underline text-accent">Sajili mwingine</button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Jina kamili</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
              placeholder="John Doe"
              maxLength={100}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Namba ya simu</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
              placeholder="0712 345 678"
              maxLength={20}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Kundi (hiari)</label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
            >
              <option value="">— Chagua kundi —</option>
              {groups.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-gold-grad px-6 py-3 text-sm font-semibold text-gold-foreground shadow-elegant transition hover:scale-[1.02] disabled:opacity-50"
          >
            {status === "loading" ? "Inahifadhi…" : "✓ Nimehudhuria"}
          </button>
        </form>
      )}
    </section>
  );
}
