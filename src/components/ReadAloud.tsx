import { useEffect, useMemo, useRef, useState } from "react";

const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

const FEMALE_RX =
  /female|woman|wanawake|mwanamke|samantha|victoria|zira|susan|karen|moira|tessa|fiona|amani|imani|asha|zuri|neema|google.*female|microsoft.*(zira|aria|jenny|libby|sonia|natasha)/i;
const MALE_RX = /male|man|mwanaume|david|mark|james|george|daniel|google.*male/i;

function isFemaleVoice(v: SpeechSynthesisVoice) {
  if (MALE_RX.test(v.name) && !FEMALE_RX.test(v.name)) return false;
  return FEMALE_RX.test(v.name);
}

function isSwahili(v: SpeechSynthesisVoice) {
  return v.lang?.toLowerCase().startsWith("sw");
}

type Quality = "sw-female" | "sw-any" | "en-female" | "fallback" | "none";

export function ReadAloud({ text }: { text: string }) {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [rate, setRate] = useState<number>(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedURI, setSelectedURI] = useState<string>("");
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

  const swahiliVoices = useMemo(() => voices.filter(isSwahili), [voices]);
  const femaleSwahili = useMemo(() => swahiliVoices.filter(isFemaleVoice), [swahiliVoices]);
  const femaleAny = useMemo(() => voices.filter(isFemaleVoice), [voices]);

  const auto = useMemo<SpeechSynthesisVoice | null>(() => {
    return (
      femaleSwahili[0] ||
      swahiliVoices[0] ||
      femaleAny.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
      femaleAny[0] ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
      voices[0] ||
      null
    );
  }, [voices, swahiliVoices, femaleSwahili, femaleAny]);

  const current = useMemo<SpeechSynthesisVoice | null>(() => {
    if (selectedURI) {
      return voices.find((v) => v.voiceURI === selectedURI) || auto;
    }
    return auto;
  }, [selectedURI, voices, auto]);

  const quality: Quality = useMemo(() => {
    if (!current) return "none";
    if (isSwahili(current) && isFemaleVoice(current)) return "sw-female";
    if (isSwahili(current)) return "sw-any";
    if (isFemaleVoice(current) && current.lang?.toLowerCase().startsWith("en")) return "en-female";
    return "fallback";
  }, [current]);

  if (!supported) return null;

  const start = (r: number = rate) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = current?.lang || "sw-KE";
    if (current) u.voice = current;
    u.rate = r;
    u.pitch = isFemaleVoice(current as SpeechSynthesisVoice) ? 1 : 1.2;
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

  const statusText: Record<Quality, string> = {
    "sw-female": "✓ Sauti ya Kiswahili (mwanamke) imepatikana",
    "sw-any": "⚠ Sauti ya Kiswahili imepatikana, lakini si ya mwanamke",
    "en-female": "⚠ Hakuna sauti ya Kiswahili — inatumika sauti ya Kiingereza ya mwanamke",
    "fallback": "⚠ Sauti ya kifaa chako pekee — Kiswahili/mwanamke hakipatikani",
    "none": "✗ Hakuna sauti yoyote iliyopatikana kwenye kifaa hiki",
  };

  const statusColor: Record<Quality, string> = {
    "sw-female": "text-emerald-600 dark:text-emerald-400",
    "sw-any": "text-amber-600 dark:text-amber-400",
    "en-female": "text-amber-600 dark:text-amber-400",
    "fallback": "text-amber-600 dark:text-amber-400",
    "none": "text-destructive",
  };

  // Order voices: Swahili female → Swahili → female → others
  const orderedVoices = useMemo(() => {
    const score = (v: SpeechSynthesisVoice) => {
      if (isSwahili(v) && isFemaleVoice(v)) return 0;
      if (isSwahili(v)) return 1;
      if (isFemaleVoice(v)) return 2;
      return 3;
    };
    return [...voices].sort((a, b) => score(a) - score(b) || a.name.localeCompare(b.name));
  }, [voices]);

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

      <div className="mt-3">
        <p className={`text-xs font-medium ${statusColor[quality]}`}>{statusText[quality]}</p>
        {current && (
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Sauti inayotumika: <span className="font-medium text-foreground/80">{current.name}</span>
            {" · "}<span className="uppercase">{current.lang}</span>
          </p>
        )}
        {(quality === "en-female" || quality === "fallback" || quality === "sw-any") && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            Kidokezo: Kwenye Android sakinisha sauti ya Kiswahili kupitia <em>Settings → Language → Text-to-speech → Google → Install voice data → Swahili</em>.
          </p>
        )}
      </div>

      {orderedVoices.length > 1 && (
        <div className="mt-3">
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Chagua Sauti
          </label>
          <select
            value={selectedURI || current?.voiceURI || ""}
            onChange={(e) => {
              setSelectedURI(e.target.value);
              if (state !== "idle") {
                window.speechSynthesis.cancel();
                setState("idle");
              }
            }}
            className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs"
          >
            {orderedVoices.map((v) => {
              const tags: string[] = [];
              if (isSwahili(v)) tags.push("Kiswahili");
              if (isFemaleVoice(v)) tags.push("Mwanamke");
              const tag = tags.length ? ` — ${tags.join(", ")}` : "";
              return (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang}){tag}
                </option>
              );
            })}
          </select>
        </div>
      )}

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
