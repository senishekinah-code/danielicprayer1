import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">Ukurasa haukupatikana.</p>
        <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Rudi Nyumbani</Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Maombi ya Kidaniel — Siku 21 | Shekinah Presbyterian Church" },
      { name: "description", content: "Kijitabu cha maombi ya siku 21 — Maombi ya Kidaniel. Mada Kuu: Muujiza Wangu. Mei 4–24, 2026." },
      { property: "og:title", content: "Maombi ya Kidaniel — Siku 21 | Shekinah Presbyterian Church" },
      { name: "twitter:title", content: "Maombi ya Kidaniel — Siku 21 | Shekinah Presbyterian Church" },
      { property: "og:description", content: "Kijitabu cha maombi ya siku 21 — Maombi ya Kidaniel. Mada Kuu: Muujiza Wangu. Mei 4–24, 2026." },
      { name: "twitter:description", content: "Kijitabu cha maombi ya siku 21 — Maombi ya Kidaniel. Mada Kuu: Muujiza Wangu. Mei 4–24, 2026." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b5e90b4b-a6cd-4099-94a6-e093026da781/id-preview-1c678c0b--64d1e78b-3da8-4e5c-b9e8-22c6ca293782.lovable.app-1777997821656.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b5e90b4b-a6cd-4099-94a6-e093026da781/id-preview-1c678c0b--64d1e78b-3da8-4e5c-b9e8-22c6ca293782.lovable.app-1777997821656.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: ({ children }: { children: React.ReactNode }) => (
    <html lang="sw">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  ),
  component: () => <Outlet />,
  notFoundComponent: NotFoundComponent,
});
