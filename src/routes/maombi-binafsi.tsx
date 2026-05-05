import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/maombi-binafsi")({
  head: () => ({
    meta: [
      { title: "Ombi la Kuombewa | Maombi ya Kidaniel" },
      { name: "description", content: "Tuma ombi lako la kuombewa kwa wachungaji." },
    ],
  }),
  component: PrayerRequestPage,
});

const recipients = [
  { label: "Mch. Dkt. Daniel Seni", phone: "255769080629" },
  { label: "Mch. Manyanda Charles Masoda", phone: "255785621014" },
];

function PrayerRequestPage() {
  const [name, setName] = useState("");
  const [request, setRequest] = useState("");
  const [error, setError] = useState("");

  function buildLink(phone: string) {
    const msg =
      `*OMBI LA KUOMBEWA*\n` +
      `🙏 Kutoka: ${name.trim() || "Bila jina"}\n\n` +
      `${request.trim()}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  function handleSend(href: string, e: React.MouseEvent) {
    if (request.trim().length < 5) {
      e.preventDefault();
      setError("Tafadhali andika ombi lako (angalau herufi 5).");
      return;
    }
    setError("");
    window.open(href, "_blank", "noopener,noreferrer");
    e.preventDefault();
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <header className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-3xl px-6 py-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl">Ombi la Kuombewa</h1>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Tuma ombi lako moja kwa moja kwa Mchungaji ili uombewe.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="grid gap-5">
            <div>
              <label className="text-sm font-medium text-foreground">Jina lako (hiari)</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Ombi lako</label>
              <textarea
                value={request} onChange={(e) => setRequest(e.target.value)}
                rows={6} maxLength={3000} required
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                placeholder="Andika ombi lako hapa…"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Chagua mchungaji wa kumtumia ombi lako
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {recipients.map((r) => (
                  <a
                    key={r.phone}
                    href={buildLink(r.phone)}
                    onClick={(e) => handleSend(buildLink(r.phone), e)}
                    className="rounded-xl bg-[#25D366] px-5 py-4 text-center text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  >
                    ↗ Tuma kwa<br />
                    <span className="font-display text-base">{r.label}</span>
                  </a>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Utafunguliwa WhatsApp ukiwa na ujumbe tayari — bonyeza tu *Send*.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
