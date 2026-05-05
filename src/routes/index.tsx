import { createFileRoute, Link } from "@tanstack/react-router";
import { bookMeta, intro, days } from "@/data/book";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{bookMeta.church}</p>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-tight md:text-7xl">
            {bookMeta.subtitle}
          </h1>
          <p className="mt-3 text-lg italic text-gold">{bookMeta.title}</p>
          <div className="mx-auto mt-8 inline-block border-y border-gold/40 px-6 py-3">
            <p className="text-xs uppercase tracking-widest text-gold/80">Mada Kuu</p>
            <p className="font-display text-3xl">{bookMeta.theme}</p>
          </div>
          <p className="mt-6 text-sm tracking-wider opacity-80">{bookMeta.dates}</p>
          <blockquote className="mx-auto mt-10 max-w-2xl font-display text-xl italic opacity-90">
            “{bookMeta.epigraph}”
          </blockquote>
          <p className="mt-3 text-sm text-gold">{bookMeta.verse}</p>
          <a href="#yaliyomo" className="mt-10 inline-block rounded-full bg-gold-grad px-8 py-3 text-sm font-semibold text-gold-foreground shadow-elegant transition hover:scale-105">
            Anza Kusoma →
          </a>
        </div>
      </header>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="font-display text-3xl text-primary md:text-4xl">{intro.heading}</h2>
        <div className="prose-reading mt-6 text-foreground/90">
          {intro.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      {/* Yaliyomo */}
      <section id="yaliyomo" className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Yaliyomo</p>
            <h2 className="mt-2 font-display text-4xl text-primary">Siku 21 za Maombi</h2>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {days.map((d) => (
              <Link
                key={d.day}
                to="/siku/$day"
                params={{ day: String(d.day) }}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition hover:border-accent hover:shadow-elegant"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-grad font-display text-lg font-bold text-gold-foreground">
                  {d.day}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Siku ya {d.day}</p>
                  <p className="mt-1 font-display text-lg leading-snug text-primary group-hover:text-accent">{d.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-primary py-8 text-center text-sm text-primary-foreground/70">
        © 2026 {bookMeta.church}
      </footer>
    </div>
  );
}
