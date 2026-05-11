import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { pledges, pledgesMeta } from "@/data/pledges";
import { T, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/ahadi")({
  head: () => ({
    meta: [
      { title: "Ahadi za Washirika 2026 | Maombi ya Kidaniel" },
      { name: "description", content: "Orodha ya ahadi za washirika kwa Bwana mwaka 2026 — majina, simu, na huduma." },
    ],
  }),
  component: PledgesPage,
});

function PledgesPage() {
  const [search, setSearch] = useState("");
  const { t } = useI18n();
  const q = search.trim().toLowerCase();
  const filtered = pledges.filter((p) =>
    !q ||
    p.name.toLowerCase().includes(q) ||
    p.phone.toLowerCase().includes(q) ||
    p.services.toLowerCase().includes(q),
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <header className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            <T>Mwaka 2026</T>
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
            <T>{pledgesMeta.title}</T>
          </h1>
          <p className="mt-3 text-sm italic text-gold">
            <T>{pledgesMeta.subtitle}</T>
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-sm opacity-90">
            <T>{pledgesMeta.note}</T>
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Tafuta jina, simu au huduma…")}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent sm:max-w-sm"
          />
          <p className="text-xs text-muted-foreground">
            {filtered.length} / {pledges.length} <T>washirika</T>
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Desktop table */}
          <table className="hidden w-full table-fixed border-collapse md:table">
            <thead className="bg-secondary/60 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-1/4 px-5 py-3"><T>Jina la Mshirika</T></th>
                <th className="w-1/6 px-5 py-3"><T>Simu</T></th>
                <th className="px-5 py-3"><T>Huduma Zake</T></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.name + i} className="border-t border-border align-top">
                  <td className="px-5 py-4 font-display text-base text-primary">
                    <T>{p.name}</T>
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground/80">
                    {p.phone === "—" ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <a href={`tel:${p.phone.replace(/\s+/g, "")}`} className="hover:text-accent">
                        {p.phone}
                      </a>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground/85">
                    <T>{p.services}</T>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="divide-y divide-border md:hidden">
            {filtered.map((p, i) => (
              <li key={p.name + i} className="p-5">
                <p className="font-display text-lg text-primary">
                  <T>{p.name}</T>
                </p>
                {p.phone !== "—" ? (
                  <a href={`tel:${p.phone.replace(/\s+/g, "")}`} className="mt-1 block text-sm text-accent">
                    {p.phone}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">—</p>
                )}
                <p className="mt-2 text-sm text-foreground/85">
                  <T>{p.services}</T>
                </p>
              </li>
            ))}
          </ul>

          {filtered.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              <T>Hakuna mshirika anayelingana na utafutaji.</T>
            </p>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-accent hover:underline">
            ← <T>Rudi Nyumbani</T>
          </Link>
        </div>
      </section>
    </div>
  );
}
