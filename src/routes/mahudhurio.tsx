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
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-primary">
              Siku ya {selectedDay} — {rows.length} waliohudhuria
            </h2>
            <Link
              to="/siku/$day"
              params={{ day: String(selectedDay) }}
              className="text-sm text-accent hover:underline"
            >
              Soma somo →
            </Link>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-muted-foreground">Inapakia…</p>
          ) : rows.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Bado hakuna mtu aliyejisajili kwa siku hii.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Jina</th>
                    <th className="px-4 py-3">Simu</th>
                    <th className="px-4 py-3">Kundi</th>
                    <th className="px-4 py-3">Muda</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((r, i) => (
                    <tr key={r.id}>
                      <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{r.full_name}</td>
                      <td className="px-4 py-3">
                        <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="text-accent hover:underline">{r.phone}</a>
                      </td>
                      <td className="px-4 py-3 text-foreground/80">{r.group_name || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(r.created_at).toLocaleString("sw-TZ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
