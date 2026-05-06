export const churchInfo = {
  primaryChurch: "Shekinah Presbyterian Church",
  note: "Kijitabu hiki kinatumika na makanisa yote ya Shekinah Presbyterian. Wachungaji wanakaribishwa kukitumia kwa ajili ya maombi ya siku 21.",
};

export type Person = { name: string; phone: string; role?: string };
export type Section = { title: string; subtitle?: string; people: Person[] };

export const leadership: Section[] = [
  {
    title: "Baraza la Wazee",
    people: [
      { name: "Mch. Dkt. Daniel Seni", phone: "0769 080 629" },
      { name: "Mzee Ernest Shimbi", phone: "0753 995 923" },
      { name: "Mzee Eliya John", phone: "0757 676 808" },
    ],
  },
  {
    title: "Wachungaji Wasaidizi",
    people: [
      { name: "Mch. Benson Yona Makasi", phone: "0685 222 806" },
      { name: "Mch. Manyanda Charles Masoda", phone: "0785 621 014" },
    ],
  },
  {
    title: "Bodi ya Mashemasi",
    people: [
      { name: "Shemasi Jovin Mrembwe", phone: "0716 559 190" },
      { name: "Shemasi Jackson Ishengoma", phone: "0786 399 445" },
      { name: "Shemasi Salome Stephano", phone: "0656 423 916" },
      { name: "Shemasi Dorcus Halord", phone: "0656 201 893" },
      { name: "Shemasi Scholar Joseph", phone: "0689 278 090" },
      { name: "Shemasi Lameck Buswelu", phone: "0753 347 177" },
      { name: "Shemasi Yolanda Mrope", phone: "0786 407 425" },
    ],
  },
];

export const departments: Section[] = [
  {
    title: "Idara ya Wanawake",
    people: [
      { role: "Mwenyekiti", name: "Dorcus Halord", phone: "0656 201 893" },
      { role: "Katibu", name: "Magreth Bwire", phone: "0686 300 283" },
      { role: "Mhazini", name: "Scholar Joseph", phone: "0689 278 090" },
      { role: "Mshauri", name: "Mama Mchungaji (Esther Seni)", phone: "0787 287 843" },
    ],
  },
  {
    title: "Idara ya Wababa",
    people: [
      { role: "Mwenyekiti", name: "Jackson Ishengoma", phone: "0786 399 445" },
      { role: "Katibu", name: "Jovin Mrembwe", phone: "0716 559 190" },
      { role: "Mhazini", name: "Samwel Mbaga", phone: "0620 306 558" },
    ],
  },
  {
    title: "Idara ya Vijana",
    people: [
      { role: "Mwenyekiti", name: "Furaha Paskali", phone: "0756 326 596" },
      { role: "Katibu", name: "Musa John", phone: "0763 544 154" },
      { role: "Mhazini", name: "Rafael Daudi", phone: "0695 586 426" },
    ],
  },
  {
    title: "Idara ya Watoto",
    people: [
      { role: "Mwenyekiti", name: "Anastanzia Simon", phone: "0760 515 506" },
      { role: "Katibu", name: "Faraja Sendeu", phone: "0746 301 026" },
      { role: "Mhazini", name: "Witness Mfalingundi", phone: "0748 019 077" },
    ],
  },
  {
    title: "Idara ya Uimbaji (Kwaya)",
    people: [
      { role: "Mwenyekiti", name: "Salome Gunda", phone: "0656 423 916" },
      { role: "Katibu", name: "Witness Mfalingundi", phone: "0748 019 077" },
      { role: "Mhazini", name: "Scholar Joseph", phone: "0689 278 090" },
      { role: "Mwalimu Mkuu", name: "Rafael Daudi", phone: "0693 586 426" },
    ],
  },
];

export const prayerGroups = [
  {
    name: "Kundi la 1",
    members: ["Shemasi Jovin Mrembwe", "Mzee Eliya John", "Grace Hindamongo (Mama Shimbi)"],
  },
  {
    name: "Kundi la 2",
    members: ["Shemasi Jackson Ishengoma", "Mzee Ernest Shimbi", "Mama Mchungaji Seni (Esther Seni)"],
  },
  {
    name: "Kundi la 3",
    members: ["Shemasi Salome Stephano", "Shemasi Scholar Joseph", "Anastanzia Simoni (Mama Eliya)"],
  },
  {
    name: "Kundi la 4",
    members: ["Shemasi Dorcus Halord", "Shemasi Lameck Buswelu", "Shemasi Yolanda Mrope"],
  },
];

export const churchGroups = [
  {
    department: "Watoto",
    description: "Mtoto mwenye umri wa miaka 0–12.",
    groups: ["Watoto wadogo (0–5)", "Watoto wakubwa (6–12)"],
  },
  {
    department: "Vijana",
    description: "Mwanaume au mwanamke mwenye umri wa miaka 13–35 (iwe ameoa/ameolewa au la).",
    groups: ["Vijana wasiooa/wasioolewa", "Vijana wanandoa (waliooa/olewa)"],
  },
  {
    department: "Wanawake",
    description: "Mwanamke mwenye umri wa miaka 36 na kuendelea (iwe ameolewa au la).",
    groups: ["Kundi moja la wanawake"],
  },
  {
    department: "Wababa",
    description: "Mwanaume mwenye umri wa miaka 36 na kuendelea (iwe ameoa au la).",
    groups: ["Kundi moja la wababa"],
  },
];
