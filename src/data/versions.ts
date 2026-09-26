export interface GitCommit {
  hash: string;
  date: string;
  message: string;
  author: string;
  scope: 'core' | 'ui' | 'routing' | 'audio' | 'comms' | 'forge' | 'pwa' | 'perf';
}

export interface VersionRelease {
  version: string;
  codename: string;
  releaseDate: string;
  status: 'Current Release' | 'Stable' | 'Legacy';
  tagline: string;
  summary: string;
  highlights: string[];
  commits: GitCommit[];
  techSpecs: {
    framework: string;
    engine: string;
    styling: string;
    audio: string;
    bundle: string;
  };
}

export const CURRENT_STUDIO_VERSION = 'v4.70';

export const versionsData: VersionRelease[] = [
  {
    version: 'v4.70',
    codename: 'Orion Forge & Navigation Matrix',
    releaseDate: 'September 26, 2026',
    status: 'Current Release',
    tagline: 'Dedicated website version manifest, COMMS array overhaul, and deep-link routing isolation.',
    summary: 'Version 4.70 introduces a dedicated Version & Git Commit manifest for Andy\'s Dev Studio, overhauls the Comms grid with Pinterest integration and full Instagram labelling, and hardens deep-link routing to isolate standalone 3D gateways from dev log anchors.',
    highlights: [
      'Dedicated Version Manifest & Git Commit ledger (#version / #changelog)',
      'Direct interactive Version badge in system header with SFX navigation',
      'COMMS Array update: Pinterest integration and clean 2x3 social grid layout',
      'Full "Instagram" typography expansion replacing legacy "Insta" tag',
      'Hardened URL routing isolating standalone Xyrtania 3D gateway from studio log deep links',
      'Preserved Web Audio SFX synthesis and background looper channels'
    ],
    techSpecs: {
      framework: 'React 18 + TypeScript 5.8',
      engine: 'Vite 6 SPA Architecture',
      styling: 'Tailwind CSS + Custom CRT Terminal FX',
      audio: 'Web Audio API Realtime Synthesizer',
      bundle: 'Zero-lag Static Assets & Web Worker Pipelines'
    },
    commits: [
      {
        hash: 'c8d41e2',
        date: '2026-09-26 04:28',
        message: 'fix(specs): resolve unescaped attribute quote syntax error in live telemetry logger',
        author: 'Andy (Kayrugold)',
        scope: 'core'
      },
      {
        hash: 'e6b21c4',
        date: '2026-09-26 04:22',
        message: 'fix(mobile): optimize Xyrtania specs layout for Galaxy Note 20 and sticky pin flagship in Forge',
        author: 'Andy (Kayrugold)',
        scope: 'ui'
      },
      {
        hash: 'b391d8a',
        date: '2026-09-26 04:12',
        message: 'feat(terminal): add expandable terminal drawer, /help register, and animated /smiley',
        author: 'Andy (Kayrugold)',
        scope: 'core'
      },
      {
        hash: 'a7f921d',
        date: '2026-09-26 03:55',
        message: 'feat(version): add dedicated version manifest and commit history log (#version)',
        author: 'Andy (Kayrugold)',
        scope: 'core'
      },
      {
        hash: '4e8c1b9',
        date: '2026-09-26 03:54',
        message: 'fix(routing): isolate standalone Xyrtania 3D gateway from chronicle deep links',
        author: 'Andy (Kayrugold)',
        scope: 'routing'
      },
      {
        hash: '9c31fa7',
        date: '2026-09-26 03:49',
        message: 'feat(comms): integrate Pinterest, reorder social links grid, and spell out Instagram',
        author: 'Andy (Kayrugold)',
        scope: 'comms'
      },
      {
        hash: '8d20ae5',
        date: '2026-09-26 03:45',
        message: 'feat(system): wire interactive system version badge v4.70 to version dashboard',
        author: 'Andy (Kayrugold)',
        scope: 'ui'
      },
      {
        hash: '7c14e03',
        date: '2026-09-26 03:30',
        message: 'refactor(nav): synchronize deep-link hash changes with instant view transition',
        author: 'Andy (Kayrugold)',
        scope: 'routing'
      }
    ]
  },
  {
    version: 'v4.66',
    codename: 'Acoustic Looper & Audio Bus',
    releaseDate: 'March 1, 2026',
    status: 'Stable',
    tagline: 'Infinite seamless audio looping and Web Audio synthesis for terminal immersion.',
    summary: 'Engineered Andy\'s Audio Looper in The Forge with custom Web Audio API buffer scheduling, crossfade loops, and retro CRT terminal acoustic clicks.',
    highlights: [
      'Web Audio API soundscapes: Stonebridge Dawn, Cyber Drift, Neon Horizon',
      'Dual-channel audio controls: independent soundtrack loop & synthesized UI clicks',
      'Custom frequency generator replacing external sound file dependencies',
      'Added fullscreen workspace mode with hotkey toggle'
    ],
    techSpecs: {
      framework: 'React 18 + TypeScript',
      engine: 'Vite 6 SPA',
      styling: 'Tailwind CSS Retro Theme',
      audio: 'Web Audio API Multi-track Buffer Scheduler',
      bundle: 'Compressed WebP & Procedural Synth'
    },
    commits: [
      {
        hash: '2d81f4a',
        date: '2026-03-01 18:22',
        message: 'feat(audio): deploy Web Audio API looper and retro terminal frequency generators',
        author: 'Andy (Kayrugold)',
        scope: 'audio'
      },
      {
        hash: 'f039ab6',
        date: '2026-02-28 21:05',
        message: 'feat(forge): integrate audio looper into the forge interactive tools matrix',
        author: 'Andy (Kayrugold)',
        scope: 'forge'
      },
      {
        hash: '84b1ce2',
        date: '2026-02-25 14:40',
        message: 'perf(assets): convert audio looper demo assets to modern WebP format',
        author: 'Andy (Kayrugold)',
        scope: 'perf'
      }
    ]
  },
  {
    version: 'v4.65',
    codename: 'The Bellows & The Beacon',
    releaseDate: 'February 10, 2026',
    status: 'Legacy',
    tagline: 'Search index indexing engine, unified legal scrolls, and high-contrast terminal theme.',
    summary: 'Implemented instant terminal search across projects, forge tools, and dispatches, along with complete Guild Hall legal documentation (EULA, Privacy Policy, Digital/Physical Return Policies).',
    highlights: [
      'Instant Search Index indexing all projects, logs, and cargo items with keyboard navigation',
      'Complete Guild Hall legal scrolls & return policy documentation',
      'Added Buy Me A Coffee guild contribution widget and persistent audio state'
    ],
    techSpecs: {
      framework: 'React 18 + TypeScript',
      engine: 'Vite 6 SPA',
      styling: 'Tailwind CSS Cyber-Terminal',
      audio: 'Web Audio Oscillators',
      bundle: 'Dynamic Search Indexing'
    },
    commits: [
      {
        hash: 'b1192e4',
        date: '2026-02-10 11:15',
        message: 'feat(search): add instant keyboard-driven search index and quick result launcher',
        author: 'Andy (Kayrugold)',
        scope: 'ui'
      },
      {
        hash: 'e98a3c1',
        date: '2026-02-08 09:30',
        message: 'docs(legal): add comprehensive EULA, Privacy Policy, and Return policies in Guild Hall',
        author: 'Andy (Kayrugold)',
        scope: 'core'
      },
      {
        hash: 'd65f029',
        date: '2026-02-05 16:10',
        message: 'feat(comms): integrate Buy Me A Coffee widget and footer terminal telemetry',
        author: 'Andy (Kayrugold)',
        scope: 'ui'
      }
    ]
  },
  {
    version: 'v4.60',
    codename: 'Foundry Genesis',
    releaseDate: 'January 15, 2026',
    status: 'Legacy',
    tagline: 'Initial release of the mobile-first CRT terminal design for Andy\'s Dev Studio.',
    summary: 'The initial foundation of Andy\'s Dev Studio. Engineered while on the road in the Peterbilt cab, combining developer portfolio, interactive math engines, and open source dispatches into a cohesive retro workstation.',
    highlights: [
      'Retro CRT terminal styling with phosphor glow and scanlines',
      'Interactive boot sequence and sound triggers',
      'The Forge: Project Collatz, Prime Forge, and audio experiments',
      'PWA installation manifest for offline mobile & desktop launch'
    ],
    techSpecs: {
      framework: 'React 18 + TypeScript',
      engine: 'Vite 6 SPA',
      styling: 'Tailwind CSS',
      audio: 'Web Audio Beeps',
      bundle: 'PWA Service Worker + Web Manifest'
    },
    commits: [
      {
        hash: 'c8301fa',
        date: '2026-01-15 08:00',
        message: 'feat(core): initial release of Andy Dev Studio retro terminal portfolio',
        author: 'Andy (Kayrugold)',
        scope: 'core'
      },
      {
        hash: '59a11ef',
        date: '2026-01-12 19:40',
        message: 'feat(pwa): add progressive web app manifest and offline icon sets',
        author: 'Andy (Kayrugold)',
        scope: 'pwa'
      },
      {
        hash: '30f47d9',
        date: '2026-01-10 14:15',
        message: 'feat(boot): synthesize terminal BIOS boot sequence and status diagnostics',
        author: 'Andy (Kayrugold)',
        scope: 'ui'
      }
    ]
  }
];
