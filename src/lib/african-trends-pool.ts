/**
 * Pool étendu de trends africains. Le composant pioche un snapshot
 * différent toutes les 4 minutes via seeded shuffle déterministe.
 *
 * Ajouter / éditer ici → reflète sur la landing à la prochaine fenêtre
 * de 4 min (ou au premier scroll si l'utilisateur revient).
 */

export type Sound = { artist: string; track: string; baseUses: number };
export type Hashtag = { tag: string; baseVolume: number };
export type Slot = { day: string; hours: string };

export type CountryPool = {
  id: string;
  flag: string;
  name: string;
  short: string;
  baseRpm: number;       // USD
  baseGrowth: number;    // %
  baseCreators: number;
  color: string;
  sounds: Sound[];
  hashtags: Hashtag[];
  slots: Slot[];
};

export const COUNTRY_POOLS: CountryPool[] = [
  {
    id: "sn",
    flag: "🇸🇳", name: "Sénégal", short: "Dakar",
    baseRpm: 1.80, baseGrowth: 34, baseCreators: 2480, color: "#FF8A00",
    sounds: [
      { artist: "Wally B. Seck", track: "Naari", baseUses: 412_000 },
      { artist: "ISS 814", track: "Bayil", baseUses: 284_000 },
      { artist: "Sidiki Diabaté", track: "Diarabi", baseUses: 196_000 },
      { artist: "Ngaaka Blindé", track: "Mama Africa", baseUses: 152_000 },
      { artist: "Youssou N'Dour", track: "7 Seconds 2026", baseUses: 248_000 },
      { artist: "Viviane Chidid", track: "Wendiou", baseUses: 178_000 },
      { artist: "Akon", track: "Konfusion (feat. Wally)", baseUses: 312_000 },
      { artist: "OMG", track: "Bantamba", baseUses: 134_000 },
      { artist: "Dieyla", track: "Sama Yaay", baseUses: 96_000 },
      { artist: "Pape Diouf", track: "Lambi Dakar", baseUses: 218_000 },
    ],
    hashtags: [
      { tag: "#dakartwitter", baseVolume: 1_200_000 },
      { tag: "#senegal2026", baseVolume: 840_000 },
      { tag: "#mbalax", baseVolume: 612_000 },
      { tag: "#tiktokdakar", baseVolume: 498_000 },
      { tag: "#senegalfood", baseVolume: 342_000 },
      { tag: "#xessal", baseVolume: 286_000 },
      { tag: "#lions2026", baseVolume: 728_000 },
      { tag: "#wakhal", baseVolume: 218_000 },
    ],
    slots: [
      { day: "Lun", hours: "20h–22h" },
      { day: "Mar", hours: "19h–21h" },
      { day: "Mer", hours: "19h–21h" },
      { day: "Jeu", hours: "20h–22h" },
      { day: "Ven", hours: "21h–23h" },
      { day: "Sam", hours: "20h–23h" },
      { day: "Dim", hours: "18h–20h" },
    ],
  },
  {
    id: "ci",
    flag: "🇨🇮", name: "Côte d'Ivoire", short: "Abidjan",
    baseRpm: 1.60, baseGrowth: 42, baseCreators: 1920, color: "#FF8A00",
    sounds: [
      { artist: "Didi B", track: "Lou Pra", baseUses: 528_000 },
      { artist: "Suspect 95", track: "Banyam", baseUses: 362_000 },
      { artist: "Tam Sir", track: "Coup du marteau", baseUses: 248_000 },
      { artist: "Roseline Layo", track: "Femme du forgeron", baseUses: 184_000 },
      { artist: "Serge Beynaud", track: "Talehi", baseUses: 296_000 },
      { artist: "Magic System", track: "Premier Gaou 2026", baseUses: 412_000 },
      { artist: "Josey", track: "Diaspora", baseUses: 158_000 },
      { artist: "DJ Arafat (tribute)", track: "Moto Moto", baseUses: 224_000 },
      { artist: "Safarel Obiang", track: "Bonheur", baseUses: 132_000 },
    ],
    hashtags: [
      { tag: "#abidjantiktok", baseVolume: 1_800_000 },
      { tag: "#coupedecaler", baseVolume: 920_000 },
      { tag: "#civ225", baseVolume: 742_000 },
      { tag: "#zouglou", baseVolume: 412_000 },
      { tag: "#ivorianfood", baseVolume: 286_000 },
      { tag: "#elephantsci", baseVolume: 538_000 },
      { tag: "#yopougon", baseVolume: 348_000 },
    ],
    slots: [
      { day: "Lun", hours: "19h–21h" },
      { day: "Mar", hours: "19h–21h" },
      { day: "Mer", hours: "20h–22h" },
      { day: "Jeu", hours: "20h–22h" },
      { day: "Ven", hours: "21h–23h" },
      { day: "Sam", hours: "21h–00h" },
      { day: "Dim", hours: "17h–19h" },
    ],
  },
  {
    id: "ng",
    flag: "🇳🇬", name: "Nigeria", short: "Lagos",
    baseRpm: 2.40, baseGrowth: 58, baseCreators: 8760, color: "#10B981",
    sounds: [
      { artist: "Davido", track: "Awuke", baseUses: 1_400_000 },
      { artist: "Asake", track: "Lonely at the Top", baseUses: 892_000 },
      { artist: "Burna Boy", track: "Higher", baseUses: 682_000 },
      { artist: "Rema", track: "Hehehe", baseUses: 548_000 },
      { artist: "Wizkid", track: "Slow Wine", baseUses: 1_120_000 },
      { artist: "Tems", track: "Love Me Jeje", baseUses: 738_000 },
      { artist: "Ayra Starr", track: "Commas", baseUses: 612_000 },
      { artist: "Shallipopi", track: "Cast", baseUses: 482_000 },
      { artist: "Omah Lay", track: "Holy Ghost", baseUses: 396_000 },
      { artist: "Ckay", track: "Yenge", baseUses: 528_000 },
    ],
    hashtags: [
      { tag: "#nigeriatiktok", baseVolume: 3_200_000 },
      { tag: "#afrobeats", baseVolume: 2_400_000 },
      { tag: "#lagoslife", baseVolume: 1_600_000 },
      { tag: "#9jatwitter", baseVolume: 1_100_000 },
      { tag: "#superfalcons", baseVolume: 824_000 },
      { tag: "#nairalife", baseVolume: 642_000 },
      { tag: "#nollywood", baseVolume: 1_280_000 },
      { tag: "#ekoatlantic", baseVolume: 468_000 },
    ],
    slots: [
      { day: "Lun", hours: "21h–23h" },
      { day: "Mar", hours: "20h–22h" },
      { day: "Mer", hours: "20h–22h" },
      { day: "Jeu", hours: "21h–23h" },
      { day: "Ven", hours: "22h–01h" },
      { day: "Sam", hours: "19h–21h" },
      { day: "Dim", hours: "18h–20h" },
    ],
  },
  {
    id: "ma",
    flag: "🇲🇦", name: "Maroc", short: "Casablanca",
    baseRpm: 3.10, baseGrowth: 27, baseCreators: 3240, color: "#EC4899",
    sounds: [
      { artist: "ElGrandeToto", track: "Madrid", baseUses: 624_000 },
      { artist: "Inkonnu", track: "Mafia", baseUses: 412_000 },
      { artist: "Hatim Ammor", track: "Galbi Habba", baseUses: 284_000 },
      { artist: "Manal", track: "Slay", baseUses: 198_000 },
      { artist: "Dystinct", track: "Hbibi", baseUses: 412_000 },
      { artist: "Tagne", track: "Bayna", baseUses: 156_000 },
      { artist: "Issam Kamal", track: "Atlas", baseUses: 228_000 },
      { artist: "ToTo", track: "Rabat", baseUses: 184_000 },
    ],
    hashtags: [
      { tag: "#maroctiktok", baseVolume: 1_600_000 },
      { tag: "#darija", baseVolume: 920_000 },
      { tag: "#casablancalife", baseVolume: 612_000 },
      { tag: "#raimaroc", baseVolume: 384_000 },
      { tag: "#dimaschelma", baseVolume: 286_000 },
      { tag: "#atlas2026", baseVolume: 524_000 },
      { tag: "#marrakech", baseVolume: 412_000 },
    ],
    slots: [
      { day: "Lun", hours: "21h–00h" },
      { day: "Mar", hours: "21h–23h" },
      { day: "Mer", hours: "22h–01h" },
      { day: "Jeu", hours: "21h–23h" },
      { day: "Ven", hours: "23h–02h" },
      { day: "Sam", hours: "20h–22h" },
      { day: "Dim", hours: "19h–21h" },
    ],
  },
  {
    id: "cm",
    flag: "🇨🇲", name: "Cameroun", short: "Douala",
    baseRpm: 1.40, baseGrowth: 31, baseCreators: 1480, color: "#F43F5E",
    sounds: [
      { artist: "Locko", track: "Margo", baseUses: 286_000 },
      { artist: "Mr Leo", track: "Partout", baseUses: 184_000 },
      { artist: "Daphne", track: "Calee", baseUses: 148_000 },
      { artist: "Salatiel", track: "Anita", baseUses: 112_000 },
      { artist: "Tenor", track: "Da Vinci", baseUses: 218_000 },
      { artist: "Magasco", track: "Wule Bang", baseUses: 124_000 },
      { artist: "Stanley Enow", track: "Hein Père", baseUses: 162_000 },
    ],
    hashtags: [
      { tag: "#camerountiktok", baseVolume: 780_000 },
      { tag: "#makossa", baseVolume: 412_000 },
      { tag: "#237", baseVolume: 362_000 },
      { tag: "#doualalife", baseVolume: 284_000 },
      { tag: "#bikutsi", baseVolume: 186_000 },
      { tag: "#lionsindomptables", baseVolume: 542_000 },
    ],
    slots: [
      { day: "Lun", hours: "20h–22h" },
      { day: "Mar", hours: "20h–22h" },
      { day: "Mer", hours: "20h–22h" },
      { day: "Jeu", hours: "21h–23h" },
      { day: "Ven", hours: "21h–23h" },
      { day: "Sam", hours: "19h–21h" },
      { day: "Dim", hours: "18h–20h" },
    ],
  },
  {
    id: "za",
    flag: "🇿🇦", name: "Afrique du Sud", short: "Johannesburg",
    baseRpm: 2.90, baseGrowth: 45, baseCreators: 4120, color: "#FBBF24",
    sounds: [
      { artist: "Tyla", track: "Water (Remix)", baseUses: 1_100_000 },
      { artist: "DJ Maphorisa", track: "Bambolelo", baseUses: 428_000 },
      { artist: "Uncle Waffles", track: "Tanzania", baseUses: 324_000 },
      { artist: "Kabza De Small", track: "Imithandazo", baseUses: 262_000 },
      { artist: "Master KG", track: "Jerusalema 2026", baseUses: 824_000 },
      { artist: "Sho Madjozi", track: "John Cena 2", baseUses: 386_000 },
      { artist: "Cassper Nyovest", track: "Siyathandana", baseUses: 248_000 },
      { artist: "Nasty C", track: "Eazy", baseUses: 312_000 },
    ],
    hashtags: [
      { tag: "#sazn", baseVolume: 1_400_000 },
      { tag: "#amapiano", baseVolume: 1_200_000 },
      { tag: "#joburglife", baseVolume: 684_000 },
      { tag: "#mzansi", baseVolume: 498_000 },
      { tag: "#bafanabafana", baseVolume: 712_000 },
      { tag: "#capetown", baseVolume: 836_000 },
      { tag: "#yano", baseVolume: 542_000 },
    ],
    slots: [
      { day: "Lun", hours: "19h–22h" },
      { day: "Mar", hours: "19h–21h" },
      { day: "Mer", hours: "20h–22h" },
      { day: "Jeu", hours: "20h–22h" },
      { day: "Ven", hours: "21h–00h" },
      { day: "Sam", hours: "18h–20h" },
      { day: "Dim", hours: "18h–20h" },
    ],
  },
];

/* ──────────────────────────────────────────────────────────────────
 * Snapshot generator — déterministe par bucket de 4 min
 * ────────────────────────────────────────────────────────────────── */

export const REFRESH_INTERVAL_MS = 4 * 60 * 1000; // 4 minutes

/** Mulberry32 — PRNG déterministe rapide, idempotent par seed. */
function rand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash string → int 32. */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h >>> 0;
}

function shuffleSeeded<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".0", "")}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

export type Snapshot = {
  bucket: number;
  countryId: string;
  rpm: string;
  growth: string;
  creators: string;
  sounds: { artist: string; track: string; uses: string; momentum: number }[];
  hashtags: { tag: string; volume: string; trend: "up" | "hot" }[];
  schedule: { day: string; hours: string; intensity: number }[];
};

/**
 * Génère un snapshot déterministe pour un pays donné, basé sur le
 * bucket de 4 min courant. À chaque nouveau bucket : nouveau seed →
 * shuffle différent + perturbations différentes des volumes.
 */
export function snapshotFor(country: CountryPool, nowMs: number = Date.now()): Snapshot {
  const bucket = Math.floor(nowMs / REFRESH_INTERVAL_MS);
  const seed = hashStr(country.id) ^ bucket;
  const rng = rand(seed);

  // Sounds : shuffle + take 4 + perturb ±15% + compute momentum
  const sortedSounds = shuffleSeeded(country.sounds, rng).slice(0, 4);
  const sounds = sortedSounds
    .map((s) => {
      const variance = 0.85 + rng() * 0.30; // [0.85, 1.15]
      const uses = Math.round(s.baseUses * variance);
      return {
        artist: s.artist,
        track: s.track,
        uses: formatNumber(uses),
        momentum: 0,
        _raw: uses,
      };
    })
    .sort((a, b) => b._raw - a._raw)
    .map((s, i, arr) => {
      const max = arr[0]._raw;
      return {
        artist: s.artist,
        track: s.track,
        uses: s.uses,
        momentum: Math.round((s._raw / max) * 100),
      };
    });

  // Hashtags : shuffle + take 4 + perturb + sort
  const sortedHashtags = shuffleSeeded(country.hashtags, rand(seed + 1)).slice(0, 4);
  const hashtags = sortedHashtags
    .map((h) => {
      const variance = 0.88 + rng() * 0.24;
      const vol = Math.round(h.baseVolume * variance);
      return { tag: h.tag, volume: vol, trend: "up" as "up" | "hot" };
    })
    .sort((a, b) => b.volume - a.volume)
    .map((h, i) => ({
      tag: h.tag,
      volume: formatNumber(h.volume),
      trend: (i === 0 ? "hot" : "up") as "up" | "hot",
    }));

  // Schedule : pick 4 jours + intensité variable
  const sortedSlots = shuffleSeeded(country.slots, rand(seed + 2)).slice(0, 4);
  const schedule = sortedSlots.map((s) => ({
    day: s.day,
    hours: s.hours,
    intensity: 65 + Math.floor(rng() * 35), // [65, 100]
  }));

  // RPM / growth / creators : perturbations légères ±5%
  const rpm = (country.baseRpm * (0.95 + rand(seed + 3)() * 0.10)).toFixed(2);
  const growth = Math.round(country.baseGrowth * (0.92 + rand(seed + 4)() * 0.16));
  const creators = Math.round(country.baseCreators * (0.96 + rand(seed + 5)() * 0.08));

  return {
    bucket,
    countryId: country.id,
    rpm: `$${rpm}`,
    growth: `+${growth}%`,
    creators: creators.toLocaleString("fr-FR"),
    sounds,
    hashtags,
    schedule,
  };
}
