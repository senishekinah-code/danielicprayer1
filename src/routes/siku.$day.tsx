import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { days, bookMeta, type Day } from "@/data/book";
import { AttendanceForm } from "@/components/AttendanceForm";
import { BibleText, bibleUrl } from "@/lib/bible";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle, T } from "@/lib/i18n";



export const Route = createFileRoute("/siku/$day")({
  component: DayPage,
  loader: ({ params }) => {
    const n = Number(params.day);
    const day = days.find((d) => d.day === n);
    if (!day) throw notFound();
    return { day };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Siku ya ${loaderData.day.day}: ${loaderData.day.title} | Maombi ya Kidaniel` },
          { name: "description", content: `${loaderData.day.title} — Andiko Kuu: ${loaderData.day.scripture}` },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <Link to="/" className="text-accent underline">Rudi Nyumbani</Link>
    </div>
  ),
});

function DayPage() {
  const { day } = Route.useLoaderData() as { day: Day };
  const prev = days.find((d) => d.day === day.day - 1);
  const next = days.find((d) => d.day === day.day + 1);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-accent">← <T>Yaliyomo</T></Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs uppercase tracking-widest text-muted-foreground sm:inline"><T>{bookMeta.theme}</T></span>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-12 md:py-20">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent"><T>Siku ya</T> {day.day} / 21</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-primary md:text-5xl">
            <T>{day.title}</T>
          </h1>
          <a
            href={bibleUrl(day.scripture)}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mt-6 inline-block rounded-full bg-gold-grad px-5 py-2 text-sm font-semibold text-gold-foreground transition hover:scale-105"
          >
            <T>Andiko Kuu</T>: <T>{day.scripture}</T> ↗
          </a>
        </header>

        <section className="mt-12 text-foreground/90">
          <h2 className="mb-4 font-display text-2xl text-primary"><T>Maelezo</T></h2>
          <div id="siku-maelezo" className="reading-box">
            {day.body.map((p, i) => <p key={i}><BibleText text={p} /></p>)}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h2 className="font-display text-2xl text-primary"><T>Maswali</T></h2>
          <ol className="mt-4 space-y-3">
            {day.questions.map((q, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-display font-bold text-accent">{i + 1}.</span>
                <span className="text-foreground/90"><T>{q}</T></span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-8">
          <h2 className="font-display text-2xl text-primary"><T>Hoja za Kuombea Leo</T></h2>
          <ul className="mt-4 space-y-3">
            {day.prayerPoints.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold-grad" />
                <span className="text-foreground/90"><T>{p}</T></span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl border border-dashed border-accent/50 bg-background/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              <T>Ombi Maalum la Kanisa Lenu</T>
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              <T>Kila kanisa litaje na liombee ombi lake maalum la leo (mfano: uinjilisti, ujenzi, wagonjwa, viongozi, familia, n.k.).</T>
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-hero p-8 text-primary-foreground shadow-elegant">
          <p className="text-xs uppercase tracking-[0.3em] text-gold"><T>Tamko la Imani</T></p>
          <p className="mt-4 font-display text-xl italic leading-relaxed"><T>{day.declaration}</T></p>
        </section>

        <AttendanceForm day={day} />

        <nav className="mt-16 flex items-center justify-between gap-4 border-t border-border pt-8">
          {prev ? (
            <Link to="/siku/$day" params={{ day: String(prev.day) }} className="group flex-1 rounded-xl border border-border p-4 hover:border-accent">
              <p className="text-xs text-muted-foreground">← <T>Siku ya</T> {prev.day}</p>
              <p className="mt-1 font-display text-base text-primary group-hover:text-accent"><T>{prev.title}</T></p>
            </Link>
          ) : <span className="flex-1" />}
          {next ? (
            <Link to="/siku/$day" params={{ day: String(next.day) }} className="group flex-1 rounded-xl border border-border p-4 text-right hover:border-accent">
              <p className="text-xs text-muted-foreground"><T>Siku ya</T> {next.day} →</p>
              <p className="mt-1 font-display text-base text-primary group-hover:text-accent"><T>{next.title}</T></p>
            </Link>
          ) : (
            <Link to="/" className="flex-1 rounded-xl bg-gold-grad p-4 text-right font-semibold text-gold-foreground">
              <T>Umemaliza! Rudi Nyumbani →</T>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
