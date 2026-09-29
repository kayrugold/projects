export interface LedgerEntry {
  id: string;
  title: string;
  price: string;
  description: string;
  image: string;
  platform: 'Itch.io' | 'Play Store' | 'Other';
  url?: string;
  releaseStatus?: string;
  features?: string[];
  projectPage?: string;
}

export const ledgerData: LedgerEntry[] = [
  {
    id: "infinite-drafting",
    title: "INFINITE DRAFTING",
    price: "$1.99",
    description: "Sketch a level, explore a pattern, or work through your next build. An open-ended graph-paper canvas with drawing tools, layers, and guides to help turn a passing idea into a plan.",
    image: "/assets/infinitedrafting1.webp",
    platform: "Play Store",
    releaseStatus: "Preparing for launch",
    features: [
      "Infinite canvas",
      "Ruler & angle guides",
      "Layers & project files"
    ],
    projectPage: "infinite-drafting"
  }
];
