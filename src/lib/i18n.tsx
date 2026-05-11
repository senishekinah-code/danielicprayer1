import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useServerFn } from "@tanstack/react-start";
import { translateBatch } from "@/lib/translate.functions";

export type Lang = "sw" | "en";
const STORAGE_LANG = "spct-lang";
const STORAGE_CACHE = "spct-i18n-cache-v1";

type CacheShape = Record<Lang, Record<string, string>>;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (text: string) => string;
};

const I18nContext = createContext<Ctx | null>(null);

function loadCache(): CacheShape {
  if (typeof window === "undefined") return { sw: {}, en: {} };
  try {
    const raw = localStorage.getItem(STORAGE_CACHE);
    if (!raw) return { sw: {}, en: {} };
    const parsed = JSON.parse(raw) as Partial<CacheShape>;
    return { sw: parsed.sw ?? {}, en: parsed.en ?? {} };
  } catch {
    return { sw: {}, en: {} };
  }
}

function saveCache(c: CacheShape) {
  try {
    localStorage.setItem(STORAGE_CACHE, JSON.stringify(c));
  } catch {
    /* ignore quota */
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sw");
  const cacheRef = useRef<CacheShape>({ sw: {}, en: {} });
  const [, force] = useState(0);
  const pendingRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inflightRef = useRef<Set<string>>(new Set());
  const translateFn = useServerFn(translateBatch);

  // hydrate
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_LANG) as Lang | null) ?? "sw";
    setLangState(saved);
    cacheRef.current = loadCache();
    force((n) => n + 1);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_LANG, l);
    } catch {
      /* ignore */
    }
  }, []);

  const flush = useCallback(async () => {
    timerRef.current = null;
    if (lang === "sw") {
      pendingRef.current.clear();
      return;
    }
    const items = [...pendingRef.current].filter(
      (s) => !inflightRef.current.has(s) && !cacheRef.current[lang][s],
    );
    pendingRef.current.clear();
    if (items.length === 0) return;
    items.forEach((s) => inflightRef.current.add(s));

    // chunk to 50
    const chunks: string[][] = [];
    for (let i = 0; i < items.length; i += 50) chunks.push(items.slice(i, i + 50));

    await Promise.all(
      chunks.map(async (chunk) => {
        try {
          const res = await translateFn({
            data: { texts: chunk, target: lang, source: lang === "en" ? "sw" : "en" },
          });
          if (res.ok) {
            chunk.forEach((src, i) => {
              cacheRef.current[lang][src] = res.translations[i] ?? src;
            });
            saveCache(cacheRef.current);
            force((n) => n + 1);
          }
        } catch {
          /* ignore */
        } finally {
          chunk.forEach((s) => inflightRef.current.delete(s));
        }
      }),
    );
  }, [lang, translateFn]);

  const enqueue = useCallback(
    (text: string) => {
      if (lang === "sw") return;
      if (cacheRef.current[lang][text]) return;
      if (inflightRef.current.has(text)) return;
      pendingRef.current.add(text);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => void flush(), 120);
    },
    [lang, flush],
  );

  const t = useCallback(
    (text: string) => {
      if (!text) return text;
      if (lang === "sw") return text;
      const hit = cacheRef.current[lang][text];
      if (hit) return hit;
      enqueue(text);
      return text; // show original until translation arrives
    },
    [lang, enqueue],
  );

  const value = useMemo<Ctx>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback so SSR/non-wrapped trees still render
    return { lang: "sw", setLang: () => {}, t: (s) => s };
  }
  return ctx;
}

export function T({ children }: { children: string }) {
  const { t } = useI18n();
  return <>{t(children)}</>;
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "sw" ? "en" : "sw")}
      aria-label="Language / Lugha"
      className={
        "inline-flex h-9 min-w-[3rem] items-center justify-center rounded-md border border-border px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-accent " +
        className
      }
    >
      {lang === "sw" ? "EN" : "SW"}
    </button>
  );
}
