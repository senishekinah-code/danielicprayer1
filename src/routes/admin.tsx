import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { fetchAttendanceAdmin } from "@/lib/admin.functions";
import { days } from "@/data/book";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Majibu ya Washirika" }] }),
});

type Row = {
  id: string;
  day: number;
  full_name: string;
  phone: string;
  group_name: string | null;
  learned: string | null;
  answers: unknown;
  created_at: string;
};

function AdminPage() {
  const fetchFn = useServerFn(fetchAttendanceAdmin);
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("admin-pw");
    if (stored) {
      setPassword(stored);
      void load(stored);
    }
  }, []);

  async function load(pw: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn({ data: { password: pw } });
      if (!res.ok) {
        setError(res.error);
        sessionStorage.removeItem("admin-pw");
        setRows(null);
      } else {
        setRows(res.rows as Row[]);
        sessionStorage.setItem("admin-pw", pw);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hitilafu");
      sessionStorage.removeItem("admin-pw");
      setRows(null);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (selectedDay !== "all" && r.day !== selectedDay) return false;
      if (!q) return true;
      return (
        r.full_name.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        (r.group_name ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, selectedDay, search]);

  const dayCounts = useMemo(() => {
    const m = new Map<number, number>();
    rows?.forEach((r) => m.set(r.day, (m.get(r.day) ?? 0) + 1));
    return m;
  }, [rows]);

  if (!rows) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <form
          onSubmit={(e) => { e.preventDefault(); void load(password); }}
          className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-elegant"
        >
          <h1 className="font-display text-2xl text-primary">Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">Ingiza nywila ya admin kuona majibu ya washirika.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nywila"
            autoFocus
            className="mt-5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          />
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="mt-5 w-full rounded-lg bg-gold-grad px-4 py-2.5 font-semibold text-gold-foreground disabled:opacity-50"
          >
            {loading ? "Inapakia..." : "Ingia"}
          </button>
          <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-accent">← Rudi Nyumbani</Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-accent">← Nyumbani</Link>
          <h1 className="font-display text-base text-primary sm:text-lg">Majibu ya Washirika ({rows.length})</h1>
          <button
            onClick={() => { sessionStorage.removeItem("admin-pw"); setRows(null); setPassword(""); }}
            className="text-xs text-muted-foreground hover:text-destructive"
          >Toka</button>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={selectedDay === "all" ? "all" : String(selectedDay)}
            onChange={(e) => setSelectedDay(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
          >
            <option value="all">Siku zote ({rows.length})</option>
            {days.map((d) => (
              <option key={d.day} value={d.day}>
                Siku {d.day} — {d.title} ({dayCounts.get(d.day) ?? 0})
              </option>
            ))}
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tafuta jina, simu au kikundi..."
            className="flex-1 rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <p className="mt-4 text-xs text-muted-foreground">{filtered.length} majibu</p>

        <div className="mt-3 space-y-4">
          {filtered.map((r) => {
            const dayInfo = days.find((d) => d.day === r.day);
            const answers = Array.isArray(r.answers) ? (r.answers as string[]) : [];
            return (
              <article key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <p className="font-display text-lg text-primary">{r.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.phone}{r.group_name ? ` · ${r.group_name}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-widest text-accent">Siku {r.day}</p>
                    <p className="text-[11px] text-muted-foreground">{new Date(r.created_at).toLocaleString("sw-TZ")}</p>
                  </div>
                </header>

                {r.learned && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alichojifunza</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">{r.learned}</p>
                  </div>
                )}

                {answers.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Majibu ya Maswali</p>
                    {answers.map((ans, i) => (
                      <div key={i} className="rounded-lg border border-border/60 bg-background/40 p-3">
                        <p className="text-xs font-medium text-accent">
                          Swali {i + 1}{dayInfo?.questions[i] ? `: ${dayInfo.questions[i]}` : ""}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">{ans || <em className="text-muted-foreground">(hakuna jibu)</em>}</p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
          {filtered.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Hakuna majibu yanayolingana.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
