import React from "react";

// Map of Swahili Bible book names (and common variants) to Bible Gateway SUV
// All references open https://www.biblegateway.com/?version=SUV
const BOOKS = [
  "Mwanzo","Kutoka","Walawi","Hesabu","Kumbukumbu","Yoshua","Waamuzi","Ruthu",
  "Samweli","Wafalme","Nyakati","Ezra","Nehemia","Esta","Ayubu","Zaburi",
  "Mithali","Mhubiri","Wimbo","Isaya","Yeremia","Maombolezo","Ezekieli","Danieli",
  "Hosea","Yoeli","Amosi","Obadia","Yona","Mika","Nahumu","Habakuki","Sefania",
  "Hagai","Zekaria","Malaki",
  "Mathayo","Marko","Luka","Yohana","Matendo","Warumi","Wakorintho","Wagalatia",
  "Waefeso","Wafilipi","Wakolosai","Wathesalonike","Timotheo","Tito","Filemoni",
  "Waebrania","Yakobo","Petro","Yuda","Ufunuo",
];

// Pattern: optional "1 " or "2 ", then book name, then " 12:34" with optional ranges/commas
const bookAlt = BOOKS.join("|");
const REF_RE = new RegExp(
  `((?:[12]\\s)?(?:${bookAlt})\\s+\\d+:\\d+(?:[-–,\\s\\d:]*\\d)?)`,
  "g",
);

export function bibleUrl(ref: string): string {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}&version=SUV`;
}

function Anchor({ ref: r }: { ref: string }) {
  return (
    <a
      href={bibleUrl(r)}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-accent underline decoration-dotted underline-offset-2 hover:text-primary"
    >
      {r}
    </a>
  );
}

export function BibleText({ text }: { text: string }) {
  const parts = text.split(REF_RE);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? <Anchor key={i} ref={p.trim()} /> : <React.Fragment key={i}>{p}</React.Fragment>,
      )}
    </>
  );
}
