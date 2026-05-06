import { useEffect, useRef, useState } from "react";

export function ReadAloud({ text }: { text: string }) {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported) return null;

  const pickVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang?.toLowerCase().startsWith("sw")) ||
      voices.find((v) => /swahili/i.test(v.name)) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
      voices[0] ||
      null
    );
  };

  const start = () => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "sw-KE";
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = 0.95;
    u.pitch = 1;
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

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 p-3">
      <span className="text-xs uppercase tracking-widest text-accent">Sikiliza kwa Sauti</span>
      {state === "idle" && (
        <button
          onClick={start}
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
          <button onClick={stop} className="rounded-full border border-border px-3 py-1.5 text-sm">
            ⏹
          </button>
        </div>
      )}
      {state === "paused" && (
        <div className="ml-auto flex gap-2">
          <button onClick={resume} className="rounded-full bg-gold-grad px-4 py-1.5 text-sm font-semibold text-gold-foreground">
            ▶ Endelea
          </button>
          <button onClick={stop} className="rounded-full border border-border px-3 py-1.5 text-sm">
            ⏹
          </button>
        </div>
      )}
    </div>
  );
}
