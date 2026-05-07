import { useEffect, useState } from "react";

const FONT_OPTIONS = [
  { id: "serif", label: "Garamond", css: '"Cormorant Garamond", Georgia, serif' },
  { id: "sans", label: "Inter", css: '"Inter", system-ui, sans-serif' },
  { id: "system", label: "Mfumo", css: 'system-ui, -apple-system, sans-serif' },
  { id: "mono", label: "Mono", css: 'ui-monospace, "Courier New", monospace' },
];

const SIZES = [
  { id: "sm", label: "A−", px: 16 },
  { id: "md", label: "A", px: 18 },
  { id: "lg", label: "A+", px: 20 },
  { id: "xl", label: "A++", px: 23 },
];

export function ReadingControls({ targetSelector = ".reading-target" }: { targetSelector?: string }) {
  const [font, setFont] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem("rc-font") || "serif" : "serif",
  );
  const [size, setSize] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem("rc-size") || "md" : "md",
  );

  useEffect(() => {
    const target = document.querySelector(targetSelector) as HTMLElement | null;
    if (!target) return;
    const f = FONT_OPTIONS.find((x) => x.id === font) || FONT_OPTIONS[0];
    const s = SIZES.find((x) => x.id === size) || SIZES[1];
    target.style.fontFamily = f.css;
    target.style.fontSize = `${s.px}px`;
    localStorage.setItem("rc-font", font);
    localStorage.setItem("rc-size", size);
  }, [font, size, targetSelector]);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card/60 p-3">
      <div className="flex items-center gap-1.5">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mr-1">Fonti:</span>
        {FONT_OPTIONS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFont(f.id)}
            style={{ fontFamily: f.css }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              font === f.id
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-foreground/70 hover:border-accent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mr-1">Ukubwa:</span>
        {SIZES.map((s) => (
          <button
            key={s.id}
            onClick={() => setSize(s.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              size === s.id
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-foreground/70 hover:border-accent"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
