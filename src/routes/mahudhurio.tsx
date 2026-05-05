import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { supabase } from "@/integrations/supabase/client";
import { days } from "@/data/book";

export const Route = createFileRoute("/mahudhurio")({
  head: () => ({
    meta: [
      { title: "Mahudhurio | Maombi ya Kidaniel" },
      { name: "description", content: "Angalia waliohudhuria maombi ya siku 21." },
    ],
  }),
  component: AttendancePage,
});

type Answer = { question: string; answer: string };
type Row = {
  id: string;
  day: number;
  full_name: string;
  phone: string;
  group_name: string | null;
  learned: string | null;
  answers: Answer[] | null;
  created_at: string;
};

function AttendancePage() {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  async function loadCounts() {
    const { data } = await supabase.from("attendance").select("day");
    if (data) {
      const c: Record<number, number> = {};
      data.forEach((r: { day: number }) => { c[r.day] = (c[r.day] || 0) + 1; });
      setCounts(c);
    }
  }

  async function loadDay(d: number) {
    setLoading(true);
    const { data } = await supabase
      .from("attendance")
      .select("*")
      .eq("day", d)
      .order("created_at", { ascending: false });
    setRows((data as Row[]) || []);
    setLoading(false);
  }

  useEffect(() => { loadCounts(); }, []);
  useEffect(() => { loadDay(selectedDay); }, [selectedDay]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <header className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 py-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl">Mahudhurio ya Maombi</h1>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Angalia waliojisajili kuhudhuria maombi ya kila siku.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Day selector */}
        <div className="flex flex-wrap gap-2">
          {days.map((d) => (
            <button
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                selectedDay === d.day
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-foreground hover:border-accent"
              }`}
            >
              Siku {d.day}
              {counts[d.day] ? <span className="ml-2 text-xs opacity-80">({counts[d.day]})</span> : null}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-primary">
              Siku ya {selectedDay} — {rows.length} waliohudhuria
            </h2>
            <div className="flex items-center gap-3">
              <a
                href={(() => {
                  const lines = rows.map((r, i) =>
                    `${i + 1}. ${r.full_name} (${r.phone})${r.group_name ? " · " + r.group_name : ""}`
                  );
                  const msg =
                    `*Mahudhurio — Siku ya ${selectedDay}*\n` +
                    `Jumla: ${rows.length}\n\n` +
                    (lines.length ? lines.join("\n") : "Hakuna aliyejisajili bado.");
                  return `https://wa.me/255769080629?text=${encodeURIComponent(msg)}`;
                })()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                ↗ Tuma WhatsApp
              </a>
              <Link
                to="/siku/$day"
                params={{ day: String(selectedDay) }}
                className="text-sm text-accent hover:underline"
              >
                Soma somo →
              </Link>
            </div>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-muted-foreground">Inapakia…</p>
          ) : rows.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Bado hakuna mtu aliyejisajili kwa siku hii.
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {rows.map((r, i) => (
                <li key={r.id} className="rounded-xl border border-border bg-background p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg text-primary">
                        {i + 1}. {r.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="text-accent hover:underline">{r.phone}</a>
                        {r.group_name ? <> · {r.group_name}</> : null}
                        {" · "}
                        {new Date(r.created_at).toLocaleString("sw-TZ")}
                      </p>
                    </div>
                  </div>

                  {r.learned && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent">Alichojifunza</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">{r.learned}</p>
                    </div>
                  )}

                  {r.answers && r.answers.length > 0 && (
                    <details className="mt-4 group">
                      <summary className="cursor-pointer text-sm font-semibold text-accent hover:underline">
                        Onyesha majibu ya maswali ({r.answers.length})
                      </summary>
                      <ol className="mt-3 space-y-3 border-l-2 border-accent/30 pl-4">
                        {r.answers.map((a, idx) => (
                          <li key={idx}>
                            <p className="text-xs font-medium text-muted-foreground">Swali {idx + 1}: {a.question}</p>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">{a.answer}</p>
                          </li>
                        ))}
                      </ol>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
