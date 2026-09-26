export interface LedgerEntry {
  id: string;
  title: string;
  price: string;
  description: string;
  image: string;
  platform: 'Itch.io' | 'Play Store' | 'Other';
  url: string;
  features?: string[];
  projectPage?: string;
}

export const ledgerData: LedgerEntry[] = [
  {
    id: "infinite-drafting",
    title: "INFINITE DRAFTING",
    price: "$1.99",
    description: "An instant-open, infinite-canvas graph paper utility designed to capture technical ideas the moment inspiration strikes, bypassing the bloat and loading times of heavy design software. A zero-friction pocket tool for immediate drafting access.",
    image: "/assets/infinitedrafting1.webp",
    platform: "Play Store",
    url: "https://play.google.com",
    features: [
      "Zero-Friction Startup",
      "The Boundless Canvas",
      "Precision Ruler & Protractor",
      "Snap Directional Grids",
      "Android & HTML5"
    ],
    projectPage: "infinite-drafting"
  }
];
