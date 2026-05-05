import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { churchInfo, leadership, departments, prayerGroups, churchGroups } from "@/data/church";

export const Route = createFileRoute("/viongozi")({
  head: () => ({
    meta: [
      { title: "Viongozi wa Kanisa | Shekinah Presbyterian – Madale" },
      { name: "description", content: "Viongozi wa Shekinah Presbyterian Church – Madale: Wazee, Wachungaji, Mashemasi, Idara, na Makundi ya Maombi." },
    ],
  }),
  component: ViongoziPage,
});

function PeopleTable({ people }: { people: { name: string; phone: string; role?: string }[] }) {
  const hasRole = people.some((p) => p.role);
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            {hasRole && <th className="px-4 py-3">Nafasi</th>}
            <th className="px-4 py-3">Jina</th>
            <th className="px-4 py-3">Simu</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {people.map((p, i) => (
            <tr key={i}>
              {hasRole && <td className="px-4 py-3 font-medium text-primary">{p.role}</td>}
              <td className="px-4 py-3 text-foreground">{p.name}</td>
              <td className="px-4 py-3">
                <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="text-accent hover:underline">{p.phone}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ViongoziPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <header className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{churchInfo.primaryChurch}</p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">Viongozi wa Kanisa</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-primary-foreground/80">{churchInfo.note}</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-12 px-6 py-12">
        {/* Leadership */}
        <section>
          <h2 className="font-display text-3xl text-primary">Uongozi</h2>
          <div className="mt-6 space-y-8">
            {leadership.map((s) => (
              <div key={s.title}>
                <h3 className="mb-3 font-display text-xl text-primary">{s.title}</h3>
                <PeopleTable people={s.people} />
              </div>
            ))}
          </div>
        </section>

        {/* Departments */}
        <section>
          <h2 className="font-display text-3xl text-primary">Idara za Kanisa</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {departments.map((s) => (
              <div key={s.title}>
                <h3 className="mb-3 font-display text-xl text-primary">{s.title}</h3>
                <PeopleTable people={s.people} />
              </div>
            ))}
          </div>
        </section>

        {/* Prayer Groups */}
        <section>
          <h2 className="font-display text-3xl text-primary">Waombaji – Kila Ibada ya Jumapili 2026</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {prayerGroups.map((g) => (
              <div key={g.name} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display text-lg text-accent">{g.name}</h3>
                <ul className="mt-3 space-y-1 text-sm text-foreground/90">
                  {g.members.map((m) => <li key={m}>• {m}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Church Groups */}
        <section>
          <h2 className="font-display text-3xl text-primary">Makundi ya Idara Ndani ya Kanisa</h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Idara</th>
                  <th className="px-4 py-3">Sifa</th>
                  <th className="px-4 py-3">Makundi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card align-top">
                {churchGroups.map((g) => (
                  <tr key={g.department}>
                    <td className="px-4 py-3 font-medium text-primary">{g.department}</td>
                    <td className="px-4 py-3 text-foreground/90">{g.description}</td>
                    <td className="px-4 py-3 text-foreground/90">
                      <ul className="space-y-1">
                        {g.groups.map((x) => <li key={x}>• {x}</li>)}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-primary py-8 text-center text-sm text-primary-foreground/70">
        © 2026 {churchInfo.primaryChurch}
      </footer>
    </div>
  );
}
