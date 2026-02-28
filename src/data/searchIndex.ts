export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  tags: string[];
}

export const searchIndexData: SearchItem[] = [
  {
    "id": "factor-hunter-ultimate",
    "title": "FACTOR HUNTER (ULTIMATE)",
    "description": "High-performance number theory engine. Hunt factors using algebraic forms, quadratic reciprocity, and parallel sieves.",
    "category": "Forge",
    "url": "javascript:openProjectPage('./forge/projects/factor-hunter.html')",
    "tags": ["Tools", "Web Workers", "BigInt Arithmetic", "Wheel Factorization", "Math"]
  },
  {
    "id": "lattice-explorer",
    "title": "LATTICE EXPLORER",
    "description": "Interactive cartography for the modular plane. Visualize the geometric soul of integers.",
    "category": "Forge",
    "url": "javascript:openProjectPage('./forge/projects/lattice-explorer.html')",
    "tags": ["Math", "HTML5 Canvas", "Web Workers", "BigInt Precision"]
  },
  {
    "id": "stride-hunter",
    "title": "STRIDE HUNTER",
    "description": "The Perfected Alignment Engine. Deploy a fleet of threads to hunt for factors using geometric sieving.",
    "category": "Forge",
    "url": "javascript:openProjectPage('./forge/projects/stride-hunter.html')",
    "tags": ["Math", "Web Workers", "BigInt Precision", "Parallel Processing"]
  },
  {
    "id": "gnomonicus",
    "title": "GNOMONICUS",
    "description": "Interactive visualizer for Gnomon Volume Sums and infinite lattice arithmetic.",
    "category": "Forge",
    "url": "javascript:openProjectPage('./forge/projects/gnomonicus.html')",
    "tags": ["Math", "HTML5 Canvas", "Touch Physics", "Vanilla JS"]
  },
  {
    "id": "thegeneral",
    "title": "THE GENERAL",
    "description": "Hunt factors with the SGS Poly-algo squad in real time in your browser and fast.",
    "category": "Forge",
    "url": "javascript:openProjectPage('./forge/projects/thegeneral0.0.34.html')",
    "tags": ["Math", "JS BigInt", "Web Workers", "Canvas API", "SGS"]
  },
  {
    "id": "gnomon-navigator",
    "title": "GNOMON NAVIGATOR",
    "description": "Visualize the 'DNA' of integers. Navigate the infinite lattice of Gnomon indexing and vector slopes.",
    "category": "Forge",
    "url": "javascript:launchApp('./apps/gnomonnavigator0.0.6.html')",
    "tags": ["Prototypes", "Math", "Grid"]
  },
  {
    "id": "factor-monster-hunter",
    "title": "FACTOR MONSTER HUNTER",
    "description": "Strike composite beasts with Prime weapons.",
    "category": "Forge",
    "url": "javascript:launchApp('./apps/factor-hunter.html')",
    "tags": ["Games", "Math", "Primes"]
  },
  {
    "id": "residue-scanner",
    "title": "RESIDUE SCANNER",
    "description": "The Gnomon Navigator. Modular visualizer.",
    "category": "Forge",
    "url": "javascript:launchApp('./apps/residue-scanner.html')",
    "tags": ["Tools", "Math", "Modulus"]
  },
  {
    "id": "pixel-alchemist",
    "title": "PIXEL ALCHEMIST",
    "description": "Transmute sprites into code arrays.",
    "category": "Forge",
    "url": "javascript:launchApp('./forge/entries/pixel-alchemist/index.html')",
    "tags": ["Tools", "Sprites", "Graphics"]
  },
  {
    "id": "void-compass",
    "title": "VOID COMPASS",
    "description": "Procedural map generation for dungeons.",
    "category": "Forge",
    "url": "javascript:launchApp('./forge/entries/void-compass/index.html')",
    "tags": ["Prototypes", "Procedural", "Generation"]
  },
  {
    "id": "win-dev-pack",
    "title": "WIN DEV UTILITY PACK",
    "description": "Regex parsers, sprite packers, and JSON smithing tools.",
    "category": "Ledger",
    "url": "javascript:openProjectPage('./market/projects/win-dev-pack.html')",
    "tags": ["Windows x64", "Standalone .exe", "Portable", "SGS Regex", "SpriteSmith", "JSON"]
  },
  {
    "id": "sound-module",
    "title": "AETHER AUDIO MODULE",
    "description": "Procedural soundscapes for the modern web weaver.",
    "category": "Ledger",
    "url": "javascript:window.open('https://itch.io', '_blank')",
    "tags": ["Web Audio API", "JavaScript", "Zero Dependencies", "Procedural Generation"]
  },
  {
    "id": "factor-hunter-shirt",
    "title": "Factor Hunter Official Tee",
    "description": "High-quality cotton tee featuring the Ink on Parchment design. Forged for comfort.",
    "category": "Cargo",
    "url": "javascript:window.open('https://andys-dev-studio.printify.me/product/26691699', '_blank')",
    "tags": ["Apparel", "Shirt", "Merch", "Factor Hunter"]
  },
  {
    "id": "eulers-cc-gear",
    "title": "Euler's CC Collection",
    "description": "Official Euler's CC apparel. The mathematics of the road, printed on high-quality fabric.",
    "category": "Cargo",
    "url": "javascript:openProjectPage('./market/productentries/eulers-cc.html')",
    "tags": ["Apparel", "Euler", "Math", "Merch"]
  },
  {
    "id": "log-4-65",
    "title": "Log ID 4.65: The Bellows and the Beacon",
    "description": "Deploying sound-enabled UI elements, hashtag routing, and a revamped Guild Hall testing pipeline. Pushing the physical apparel project pages live.",
    "category": "Chronicles",
    "url": "javascript:openJournalEntry('log-4-65')",
    "tags": ["Update", "UI", "Guild", "Video"]
  },
  {
    "id": "log-video-tour",
    "title": "Video Log: Navigating the Studio",
    "description": "A complete video walkthrough recorded from the cab. Explaining the Google 14-day requirement, the testing pipeline, and a tour of the site.",
    "category": "Chronicles",
    "url": "javascript:openJournalEntry('log-video-tour')",
    "tags": ["Video", "Update", "Pipeline", "Cab"]
  },
  {
    "id": "forge-to-ledger",
    "title": "From The Forge to The Ledger",
    "description": "This entry demystifies the studio's development pipeline, breaking down the journey from raw idea to polished release.",
    "category": "Chronicles",
    "url": "javascript:openJournalEntry('forge-to-ledger')",
    "tags": ["Update", "Forge", "Ledger", "Pipeline"]
  },
  {
    "id": "cargo-bay-launch",
    "title": "Log Entry: The Cargo Bay is Open",
    "description": "Bridging the gap between digital code and physical freight. The Cargo Bay is now live at Andy's Dev Studio.",
    "category": "Chronicles",
    "url": "javascript:openJournalEntry('cargo-bay-launch')",
    "tags": ["Update", "Merch", "Trucking", "Apparel"]
  },
  {
    "id": "log-factor-ultimate",
    "title": "The Siege of the Composite",
    "description": "Brute force is dead. How we used Quadratic Reciprocity, Web Workers, and Algebraic forms to hunt factors in the browser.",
    "category": "Chronicles",
    "url": "javascript:openJournalEntry('log-factor-ultimate')",
    "tags": ["Math", "Factors", "Web Workers"]
  },
  {
    "id": "log-4-64",
    "title": "Log ID 4.64: The Cartography of Integers",
    "description": "Deploying the Lattice Explorer. Moving from brute force hunting to geometric mapping. Visualizing the 'Diamond' regions and modulus grids.",
    "category": "Chronicles",
    "url": "javascript:openJournalEntry('log-4-64')",
    "tags": ["Update", "Math", "Lattice"]
  },
  {
    "id": "log-4-63",
    "title": "Log ID 4.63: The Peterbilt Studio",
    "description": "Late night dispatch from the cab. A raw look at squashing a critical caching bug at 2 AM with the help of the AI Squire. The reality of the double shift.",
    "category": "Chronicles",
    "url": "javascript:openJournalEntry('log-4-63')",
    "tags": ["Bug", "Update", "Trucking", "AI"]
  },
  {
    "id": "theironspine",
    "title": "Log ID 4.62: The Stillness of the Forge",
    "description": "Brakes set in the North Country. After a heavy haul through the Nexus and the Foundry, the Forge is quiet. Reflected on the standstill and the architecture of the journey.",
    "category": "Chronicles",
    "url": "javascript:openJournalEntry('theironspine')",
    "tags": ["Trucking", "Forge", "Thoughts"]
  },
  {
    "id": "gnomon-release",
    "title": "PROJECT: GNOMONICUS",
    "description": "We have breached the integer limit. A visualizer for the infinite Gnomon lattice is now live in the Forge.",
    "category": "Chronicles",
    "url": "javascript:openJournalEntry('gnomon-release')",
    "tags": ["Prototype", "Release", "Math"]
  },
  {
    "id": "update-v4-61",
    "title": "SYSTEM UPGRADE V4.61",
    "description": "Stabilized the bookmark rail physics, expanded the Ledger's data capacity, and established deep-link project archives.",
    "category": "Chronicles",
    "url": "javascript:openJournalEntry('update-v4-61')",
    "tags": ["Update", "UI", "Bookmarks"]
  },
  {
    "id": "entry-general",
    "title": "The General: Commanding the Poly-Algo Squad",
    "description": "Brute force is a blunt instrument. To conquer 60-digit composites, we need a tactical squad. Introducing 'The General,' a multi-threaded factorization command center.",
    "category": "Chronicles",
    "url": "javascript:openJournalEntry('entry-general')",
    "tags": ["Math", "Algorithms", "Parallel"]
  },
  {
    "id": "entry_004",
    "title": "Forging Code on the Open Road",
    "description": "Why a truck driver is using AI to build number theory tools. The philosophy behind the studio.",
    "category": "Chronicles",
    "url": "javascript:openJournalEntry('entry_004')",
    "tags": ["Philosophy", "Trucking", "AI"]
  },
  {
    "id": "entry_003",
    "title": "Newton's Dice",
    "description": "Early tests of the 2D physics engine. Collision detection is stable, but the bounce damping needs tuning.",
    "category": "Chronicles",
    "url": "javascript:openJournalEntry('entry_003')",
    "tags": ["Physics", "Dev", "Game"]
  }
];
