import React from "react";

// Swahili book name -> USFM code used by YouVersion (bible.com)
// SUV (Swahili Union Version) version id on YouVersion = 1126
const SUV_ID = 1126;

const BOOK_CODES: Record<string, string> = {
  "Mwanzo": "GEN", "Kutoka": "EXO", "Walawi": "LEV", "Hesabu": "NUM",
  "Kumbukumbu": "DEU", "Yoshua": "JOS", "Waamuzi": "JDG", "Ruthu": "RUT",
  "1 Samweli": "1SA", "2 Samweli": "2SA", "1 Wafalme": "1KI", "2 Wafalme": "2KI",
  "1 Nyakati": "1CH", "2 Nyakati": "2CH", "Ezra": "EZR", "Nehemia": "NEH",
  "Esta": "EST", "Ayubu": "JOB", "Zaburi": "PSA", "Mithali": "PRO",
  "Mhubiri": "ECC", "Wimbo": "SNG", "Wimbo Ulio Bora": "SNG",
  "Isaya": "ISA", "Yeremia": "JER", "Maombolezo": "LAM", "Ezekieli": "EZK",
  "Danieli": "DAN", "Hosea": "HOS", "Yoeli": "JOL", "Amosi": "AMO",
  "Obadia": "OBA", "Yona": "JON", "Mika": "MIC", "Nahumu": "NAM",
  "Habakuki": "HAB", "Sefania": "ZEP", "Hagai": "HAG", "Zekaria": "ZEC",
  "Malaki": "MAL",
  "Mathayo": "MAT", "Marko": "MRK", "Luka": "LUK", "Yohana": "JHN",
  "Matendo": "ACT", "Warumi": "ROM",
  "1 Wakorintho": "1CO", "2 Wakorintho": "2CO",
  "Wagalatia": "GAL", "Waefeso": "EPH", "Wafilipi": "PHP", "Wakolosai": "COL",
  "1 Wathesalonike": "1TH", "2 Wathesalonike": "2TH",
  "1 Timotheo": "1TI", "2 Timotheo": "2TI",
  "Tito": "TIT", "Filemoni": "PHM", "Waebrania": "HEB", "Yakobo": "JAS",
  "1 Petro": "1PE", "2 Petro": "2PE",
  "1 Yohana": "1JN", "2 Yohana": "2JN", "3 Yohana": "3JN",
  "Yuda": "JUD", "Ufunuo": "REV",
};

const BOOK_NAMES = Object.keys(BOOK_CODES).sort((a, b) => b.length - a.length);
const bookAlt = BOOK_NAMES.map((b) => b.replace(/\s/g, "\\s+")).join("|");
// Match: Book Chapter:Verse(-Verse)?
const REF_RE = new RegExp(
  `((?:${bookAlt})\\s+(\\d+):(\\d+)(?:[-–](\\d+))?)`,
  "g",
);

export function bibleUrl(ref: string): string {
  const m = ref.match(new RegExp(`^(${bookAlt})\\s+(\\d+):(\\d+)(?:[-–](\\d+))?`));
  if (!m) {
    return `https://www.bible.com/bible/${SUV_ID}/GEN.1.SUV`;
  }
  const bookName = m[1].replace(/\s+/g, " ");
  const code = BOOK_CODES[bookName] ?? "GEN";
  const chapter = m[2];
  const v1 = m[3];
  const v2 = m[4];
  const verse = v2 ? `${v1}-${v2}` : v1;
  return `https://www.bible.com/bible/${SUV_ID}/${code}.${chapter}.${verse}.SUV`;
}

function Anchor({ refText }: { refText: string }) {
  return (
    <a
      href={bibleUrl(refText)}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-primary"
    >
      {refText}
    </a>
  );
}

export function BibleText({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  REF_RE.lastIndex = 0;
  while ((match = REF_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push(<Anchor key={match.index} refText={match[1]} />);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return <>{nodes.map((n, i) => <React.Fragment key={i}>{n}</React.Fragment>)}</>;
}
