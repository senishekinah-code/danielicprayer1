import { Link } from "@tanstack/react-router";

export function SiteNav() {
  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="font-display text-lg font-semibold text-primary">
          Maombi ya Kidaniel
        </Link>
        <div className="flex items-center gap-1 text-sm md:gap-3">
          <Link to="/" className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-accent" activeOptions={{ exact: true }} activeProps={{ className: "text-accent font-semibold" }}>
            Nyumbani
          </Link>
          <Link to="/viongozi" className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-accent" activeProps={{ className: "text-accent font-semibold" }}>
            Viongozi
          </Link>
          <Link to="/mahudhurio" className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-accent" activeProps={{ className: "text-accent font-semibold" }}>
            Mahudhurio
          </Link>
        </div>
      </div>
    </nav>
  );
}
