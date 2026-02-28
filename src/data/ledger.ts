export interface LedgerEntry {
  id: string;
  title: string;
  price: string;
  description: string;
  image: string;
  platform: 'Itch.io' | 'Play Store' | 'Other';
  url: string;
  features?: string[];
}

export const ledgerData: LedgerEntry[] = [
  {
    id: "win-dev-utility",
    title: "WIN DEV UTILITY PACK",
    price: "9.99 Gold",
    description: "Regex parsers, sprite packers, and JSON smithing tools. A collection of essential scripts for the modern digital blacksmith.",
    image: "/assets/devpack.webp",
    platform: "Itch.io",
    url: "https://itch.io",
    features: ["Regex Library", "Sprite Packer", "JSON Tools"]
  },
  {
    id: "aether-audio",
    title: "AETHER AUDIO MODULE",
    price: "4.99 Gold",
    description: "Procedural soundscapes for the modern web weaver. Generate infinite ambient textures for your applications.",
    image: "/assets/aether_audio.webp",
    platform: "Itch.io",
    url: "https://itch.io",
    features: ["Procedural Audio", "Web Audio API", "Zero Dependencies"]
  }
];
