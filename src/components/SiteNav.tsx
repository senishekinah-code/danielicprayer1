import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-spct.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle, T } from "@/lib/i18n";

export function SiteNav() {
  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
          <img src={logo} alt="SPCT logo" className="h-9 w-9 object-contain" />
          <span className="hidden sm:inline"><T>Maombi ya Kidaniel</T></span>
        </Link>
        <div className="flex items-center gap-1 text-sm md:gap-2">
          <Link to="/" className="rounded-md px-2.5 py-1.5 text-muted-foreground hover:text-accent md:px-3" activeOptions={{ exact: true }} activeProps={{ className: "text-accent font-semibold" }}>
            <T>Nyumbani</T>
          </Link>
          <Link to="/ahadi" className="rounded-md px-2.5 py-1.5 text-muted-foreground hover:text-accent md:px-3" activeProps={{ className: "text-accent font-semibold" }}>
            <T>Ahadi</T>
          </Link>
          <Link to="/maombi-binafsi" className="rounded-md px-2.5 py-1.5 text-muted-foreground hover:text-accent md:px-3" activeProps={{ className: "text-accent font-semibold" }}>
            <T>Ombi la Kuombewa</T>
          </Link>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
