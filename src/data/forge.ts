export interface ForgeEntry {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  features?: string[];
  tech?: string[];
  projectPage?: string;
  type: string;
  version: string;
  status: string;
  statusClass: string;
  buttonText: string;
  icon?: string;
  image?: string;
  action: string;
  pinned?: boolean;
}

export const forgeData: ForgeEntry[] = [
  {
    "id": "xyrtania",
    "title": "XYRTANIA",
    "pinned": true,
    "description": "An immersive, multiplayer 3D online RPG being forged for modern browsers. Explore a long-lost realm in real-time.",
    "longDescription": "A massive 3D single and multiplayer exploration RPG built using Three.js, customized responsive web sockets, and procedural world design. Embark on a journey to discover a long-lost realm of floating peaks and mystical structures, optimized for standard desktop and mobile browsers.",
    "features": [
      "Real-time Multiplayer Sync (custom backend)",
      "Three.js 3D Rendering & Procedural World",
      "Compact Survival HUD Layout",
      "Touch-responsive Joystick Navigation"
    ],
    "tech": [
      "Three.js / WebGL",
      "WebSockets",
      "Node.js Server",
      "Tailwind CSS"
    ],
    "projectPage": "xyrtania-specs",
    "type": "Games",
    "version": "V0.1-alpha",
    "status": "DEV",
    "statusClass": "badge-alpha",
    "buttonText": "ENTER XYRTANIA",
    "icon": "⚔️",
    "image": "/assets/xyrtania_card.webp",
    "action": "launchApp('https://xyrtania.andy-596.workers.dev')"
  },
  {
    "id": "sector-04",
    "title": "SECTOR 04",
    "description": "Night Watch air traffic control & emergency radar sim. Manage live weather cells, Mayday calls, and runway slots under pressure.",
    "longDescription": "Sector 04 · Night Watch is a browser-based air traffic control and emergency consequences game. Monitor radar traffic, track storm cells, answer recorded Mayday radio calls, and issue heading, altitude, and runway clearance orders before fuel or fire timers run out.",
    "features": [
      "Live Radar & Weather Cell Tracking",
      "Recorded Pilot Voice & Serialized Radio Queue",
      "Three Authored Shifts (Oxygen Masks, One Runway, The Long Way Home)",
      "Deterministic Replay Seeds & Pause/Resume"
    ],
    "tech": [
      "HTML5 / Vanilla JS",
      "Web Audio & Recorded Voice",
      "Deterministic Simulation"
    ],
    "projectPage": "sector-04",
    "type": "Games",
    "version": "V0.9.0",
    "status": "LIVE",
    "statusClass": "badge-live",
    "buttonText": "ENTER TOWER",
    "icon": "📡",
    "image": "/assets/sector04.jpg",
    "action": "launchApp('https://sector04.pages.dev')"
  },
  {
    "id": "the-sky-courier",
    "title": "THE SKY COURIER",
    "description": "A 3D hoverboard delivery runner through a stylized neighborhood. Snag packages, hitch vehicles, deploy your glider, and beat the clock.",
    "longDescription": "The Sky Courier · Sunset Express is a fast-paced 3D neighborhood delivery game built with Three.js and Vite. Carve down city streets, jump and glide off ramps, hitch rides behind moving trucks, and complete 6 bonus deliveries in a 2.5-minute run—with no accounts or purchases.",
    "features": [
      "Three.js 3D Neighborhood & Stylized Character",
      "Hoverboard Steering, Sliding, Jumping & Glider Flight",
      "Vehicle Hitching & Boost (NOS) Mechanics",
      "Offline-Ready PWA Support"
    ],
    "tech": [
      "Three.js / WebGL",
      "Vite",
      "Service Worker / PWA"
    ],
    "projectPage": "the-sky-courier",
    "type": "Games",
    "version": "V0.3",
    "status": "LIVE",
    "statusClass": "badge-live",
    "buttonText": "LET'S RIDE",
    "icon": "📦",
    "image": "/assets/the-sky-courier.jpg",
    "action": "launchApp('https://theskycourier.pages.dev')"
  },
  {
    "id": "the-daily-absurd",
    "title": "THE DAILY ABSURD",
    "description": "A living satire web publication featuring an interactive animated cover, living comic strips, sketches, and breaking nonsense.",
    "longDescription": "The Daily Absurd is an interactive satirical newspaper and living comic experiment. Browse Issue No. 001 with an animated cover ('The Great Button Crisis!'), a breaking-news ticker, living strips, and playable/watchable comedy bits.",
    "features": [
      "Interactive Animated Newspaper Cover",
      "Live Breaking Nonsense Ticker",
      "Living Strips & Sketch Showcase",
      "Editorial Manifesto & Issue Archive Layout"
    ],
    "tech": [
      "HTML5 / CSS3",
      "Interactive SVG / DOM Animation",
      "Cloudflare Pages"
    ],
    "projectPage": "the-daily-absurd",
    "type": "Interactive",
    "version": "ISSUE 001",
    "status": "LIVE",
    "statusClass": "badge-live",
    "buttonText": "READ ISSUE",
    "icon": "📰",
    "image": "/assets/the-daily-absurd.jpg",
    "action": "launchApp('https://the-daily-absurd.pages.dev')"
  },
  {
    "id": "factor-hunter-ultimate",
    "title": "FACTOR HUNTER (ULTIMATE)",
    "description": "High-performance number theory engine. Hunt factors using algebraic forms, quadratic reciprocity, and parallel sieves.",
    "longDescription": "The Ultimate Version of the Factor Finder engine. It moves beyond brute force by implementing smart filters like Quadratic Reciprocity and Algebraic Form detection (a^n  b^n) before deploying a multi-threaded Wheel-30 sieve to scan for primes.",
    "features": [
      "Algebraic Pre-computation (nth roots)",
      "Quadratic Reciprocity (QR) Filtering",
      "Multi-threaded Miller-Rabin Tests"
    ],
    "tech": [
      "Web Workers",
      "BigInt Arithmetic",
      "Wheel Factorization"
    ],
    "projectPage": "factor-hunter-ultimate",
    "type": "Tools",
    "version": "V0.0.0",
    "status": "DEV",
    "statusClass": "badge-alpha",
    "buttonText": "CALCULATE",
    "icon": "",
    "image": "/assets/factorhunter1.webp",
    "action": "launchApp('./apps/factorhunter0.0.0.html')"
  },
  {
    "id": "lattice-explorer",
    "title": "LATTICE EXPLORER",
    "description": "Interactive cartography for the modular plane. Visualize the geometric soul of integers.",
    "longDescription": "A multi-layered visualization engine that renders the hidden geometry of Number Theory. From the 'Core' hyperbolas to the 'Diamond' factor intersections, the Lattice Explorer allows for real-time navigation of modular space using a touch-responsive infinite canvas.",
    "features": [
      "Infinite Pan & Zoom Canvas",
      "Multi-Layer Rendering (Core, Diamonds, Parabolas)",
      "Real-time Modulus Grid Visualization"
    ],
    "tech": [
      "HTML5 Canvas",
      "Web Workers",
      "BigInt Precision"
    ],
    "projectPage": "lattice-explorer",
    "type": "Math",
    "version": "V0.0.3",
    "status": "ALPHA",
    "statusClass": "badge-alpha",
    "buttonText": "EXPLORE",
    "image": "/assets/lattice_explorer.webp",
    "action": "launchApp('./apps/latticeexplorer0.0.3.html')"
  },
  {
    "id": "stride-hunter",
    "title": "STRIDE HUNTER",
    "description": "The Perfected Alignment Engine. Deploy a fleet of threads to hunt for factors using geometric sieving.",
    "longDescription": "Stride Hunter utilizes the 'Geometric Soul of the Sieve' to find collisions in modular space. It utilizes multi-threaded Web Workers to scan high-altitude exponents for prime factors while keeping computation off the main interface thread.",
    "features": [
      "Multi-core Fleet Deployment",
      "Geometric Sieve Theorem Integration",
      "Real-time Mission Progress Tracking"
    ],
    "tech": [
      "Web Workers (Parallel Processing)",
      "BigInt Precision",
      "Tailwind CSS"
    ],
    "projectPage": "stride-hunter",
    "type": "Math",
    "version": "V13.3",
    "status": "BETA",
    "statusClass": "badge-beta",
    "buttonText": "DEPLOY",
    "image": "/assets/stride_hunter.webp",
    "action": "launchApp('./apps/stridehunterv13-3.html')"
  },
  {
    "id": "gnomonicus",
    "title": "GNOMONICUS",
    "description": "Interactive visualizer for Gnomon Volume Sums and infinite lattice arithmetic.",
    "longDescription": "An experimental arithmetic engine that visualizes the 'Gnomon' structure of integer space. It renders an infinite triangular grid where every node represents a vector slope, allowing for the real-time calculation of Volume Sums and Tape IDs using BigInt precision.",
    "features": [
      "Infinite Pan & Zoom Canvas",
      "Real-time Gnomon Summation",
      "BigInt Arithmetic Support"
    ],
    "tech": [
      "HTML5 Canvas",
      "Touch Physics",
      "Vanilla JS"
    ],
    "projectPage": "gnomonicus",
    "type": "Math",
    "version": "V0.0.0",
    "status": "ALPHA",
    "statusClass": "badge-alpha",
    "buttonText": "EXPLORE",
    "icon": "",
    "image": "/assets/gnomonicus.webp",
    "action": "launchApp('./apps/gnomonicus0.0.0.html')"
  },
  {
    "id": "thegeneral",
    "title": "THE GENERAL",
    "description": "Hunt factors with the SGS Poly-algo squad in real time in your browser and fast.",
    "longDescription": "A high-performance modular visualizer and factor hunting engine. Built to utilize parallel browser threads for intense number crunching using background workers.",
    "features": ["Real-time visual lattice", "SGS Poly-algo integration", "Multi-threaded processing"],
    "tech": ["JS BigInt", "Web Workers", "Canvas API"],
    "projectPage": "thegeneral",
    "type": "Math",
    "version": "V0.0.34",
    "status": "ALPHA",
    "statusClass": "badge-alpha",
    "buttonText": "HUNT",
    "image": "/assets/thegeneral.webp",
    "action": "launchApp('./apps/thegeneral0.0.34.html')"
  },
  {
    "id": "gnomon-navigator",
    "title": "GNOMON NAVIGATOR",
    "description": "Visualize the 'DNA' of integers. Navigate the infinite lattice of Gnomon indexing and vector slopes.",
    "type": "Prototypes",
    "version": "V0.0.6",
    "status": "ALPHA",
    "statusClass": "badge-alpha",
    "buttonText": "NAVIGATE",
    "icon": "",
    "image": "/assets/gnomonnavigator.webp",
    "action": "launchApp('./apps/gnomonnavigator0.0.6.html')"
  },
  {
    "id": "factor-monster-hunter",
    "title": "FACTOR MONSTER HUNTER",
    "description": "Strike composite beasts with Prime weapons.",
    "type": "Games",
    "version": "V1.2",
    "status": "LIVE",
    "statusClass": "badge-live",
    "buttonText": "HUNT",
    "icon": "👾",
    "image": "/assets/factorhunter.webp",
    "action": "launchApp('./apps/factor-hunter.html')"
  },
  {
    "id": "residue-scanner",
    "title": "RESIDUE SCANNER",
    "description": "The Gnomon Navigator. Modular visualizer.",
    "type": "Tools",
    "version": "V0.8",
    "status": "BETA",
    "statusClass": "badge-beta",
    "buttonText": "SCAN",
    "icon": "🔭",
    "image": "/assets/residuescanner.webp",
    "action": "launchApp('./apps/residue-scanner.html')"
  },
  {
    "id": "andysaudiolooper",
    "title": "ANDY'S AUDIO LOOPER",
    "description": "Crossfades tracks to create a pretty solid audio loop from any mp3, wav, or ogg.",
    "longDescription": "A dynamic loop generator that utilizes the Web Audio API to analyze an audio file, calculate the optimal crossfade points based on a target BPM, and generate a crossfaded loop. Designed for game developers and audio engineers who need quick, reliable background tracks.",
    "features": [
      "Client-Side Processing",
      "Equal-Power Crossfading",
      "Standard Web Audio Format Support"
    ],
    "tech": [
      "Web Audio API",
      "Vanilla JS",
      "HTML5 Canvas"
    ],
    "projectPage": "andysaudiolooper",
    "type": "Tools",
    "version": "V1.0",
    "status": "LIVE",
    "statusClass": "badge-live",
    "buttonText": "INITIALIZE",
    "icon": "🎵",
    "image": "/assets/andysaudiolooper1.webp",
    "action": "launchApp('./apps/andysaudiolooper.html')"
  }
];
