import { useEffect, useState } from "react";

const SIZES = [
  { id: "sm", label: "A−", px: 12 },
  { id: "md", label: "A", px: 14 },
  { id: "lg", label: "A+", px: 16 },
  { id: "xl", label: "A++", px: 19 },
];

export function ReadingControls({ targetSelector = ".reading-target" }: { targetSelector?: string }) {
  const [size, setSize] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem("rc-size") || "sm" : "sm",
  );

  useEffect(() => {
    const target = document.querySelector(targetSelector) as HTMLElement | null;
    if (!target) return;
    const s = SIZES.find((x) => x.id === size) || SIZES[0];
    target.style.fontFamily = "Arial, Helvetica, sans-serif";
    target.style.fontSize = `${s.px}px`;
    target.style.lineHeight = "1.1";
    localStorage.setItem("rc-size", size);
  }, [size, targetSelector]);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card/60 p-3">
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
