import { useEffect, useRef, useState } from "react";

const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

function isFemaleVoice(v: SpeechSynthesisVoice) {
  return /female|wanawake|mwanamke|woman|samantha|victoria|zira|susan|karen|moira|tessa|fiona|amani|imani|google.*female/i.test(
    v.name
  );
}

export function ReadAloud({ text }: { text: string }) {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [rate, setRate] = useState<number>(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const ok = typeof window !== "undefined" && "speechSynthesis" in window;
    setSupported(ok);
    if (!ok) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!supported) return null;

  const pickFemaleVoice = () => {
    const sw = voices.filter((v) => v.lang?.toLowerCase().startsWith("sw"));
    return (
      sw.find(isFemaleVoice) ||
      sw[0] ||
      voices.find((v) => isFemaleVoice(v) && v.lang?.toLowerCase().startsWith("en")) ||
      voices.find(isFemaleVoice) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
      voices[0] ||
      null
    );
  };

  const start = (r: number = rate) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "sw-KE";
    const v = pickFemaleVoice();
    if (v) u.voice = v;
    u.rate = r;
    u.pitch = 1.15;
    u.onend = () => setState("idle");
    u.onerror = () => setState("idle");
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setState("playing");
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setState("paused");
  };
  const resume = () => {
    window.speechSynthesis.resume();
    setState("playing");
  };
  const stop = () => {
    window.speechSynthesis.cancel();
    setState("idle");
  };

  const changeSpeed = (r: number) => {
    setRate(r);
    if (state !== "idle") start(r);
  };

  return (
    <div className="mt-6 rounded-xl border border-accent/30 bg-accent/5 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-accent">Sikiliza</span>
        {state === "idle" && (
          <button
            onClick={() => start()}
            className="ml-auto rounded-full bg-gold-grad px-4 py-1.5 text-sm font-semibold text-gold-foreground transition hover:scale-105"
          >
            ▶ Cheza
          </button>
        )}
        {state === "playing" && (
          <div className="ml-auto flex gap-2">
            <button onClick={pause} className="rounded-full border border-accent px-4 py-1.5 text-sm font-semibold text-accent">
              ⏸ Sitisha
            </button>
            <button onClick={stop} className="rounded-full border border-border px-3 py-1.5 text-sm">⏹</button>
          </div>
        )}
        {state === "paused" && (
          <div className="ml-auto flex gap-2">
            <button onClick={resume} className="rounded-full bg-gold-grad px-4 py-1.5 text-sm font-semibold text-gold-foreground">
              ▶ Endelea
            </button>
            <button onClick={stop} className="rounded-full border border-border px-3 py-1.5 text-sm">⏹</button>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted-foreground mr-1">Kasi:</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => changeSpeed(s)}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
              rate === s
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-foreground/70 hover:border-accent"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
