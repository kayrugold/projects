import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Play, ExternalLink, Compass, Shield, Activity, 
  Cpu, Layers, Heart, Sparkles, Code2, Server, Smartphone, 
  ArrowLeft, ArrowRight, Volume2, VolumeX, RefreshCw, HelpCircle, 
  Wifi, Users, Disc, Database, Layout, BookOpen
} from 'lucide-react';

interface XyrtaniaCinematicSiteProps {
  onBackToStudio: () => void;
  onLaunchGame: (url: string) => void;
}

export default function XyrtaniaCinematicSite({ onBackToStudio, onLaunchGame }: XyrtaniaCinematicSiteProps) {
  // HUD state variables
  const [health, setHealth] = useState(85);
  const [energy, setEnergy] = useState(90);
  const [mana, setMana] = useState(60);
  const [posX, setPosX] = useState(479.23);
  const [posY, setPosY] = useState(102.84);
  const [posZ, setPosZ] = useState(-884.12);

  // Holographic 3D Prism Control state
  const [warpSpeed, setWarpSpeed] = useState(16); // 1 to 28 speed level

  // Real-time server telemetry variables
  const [activePlayers, setActivePlayers] = useState(24);
  const [pingLatency, setPingLatency] = useState(42);
  const [logs, setLogs] = useState<Array<{ time: string; msg: string; type: 'info' | 'warn' | 'warp' | 'sys' }>>([]);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Audio preview controls for the cinematic site using the uploaded track
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [expandedLore, setExpandedLore] = useState<string | null>(null);

  useEffect(() => {
    // Create the audio element with the correct public assets URL
    const audioInstance = new Audio('/assets/stonebridgedawn.ogg');
    audioInstance.loop = true;
    audioInstance.volume = 0.45;
    audioRef.current = audioInstance;

    // Helper: check formatted time inside the nested effect
    const getLogTime = () => new Date().toTimeString().split(' ')[0];

    // Try to auto-play when the component loads
    const startPlay = () => {
      if (!audioRef.current) return;
      audioRef.current.play()
        .then(() => {
          setIsPlayingTeaser(true);
          setLogs(prev => [
            ...prev,
            { time: getLogTime(), msg: 'AUDIO: Ambient soundtrack [Stonebridge Dawn] initialized and streaming.', type: 'info' }
          ]);
        })
        .catch(err => {
          console.log("Autoplay blocked or failed:", err);
          
          // Fallback: wait for the first user interaction anywhere on the document to start the soundtrack
          const handleFirstInteraction = () => {
            if (audioRef.current) {
              audioRef.current.play()
                .then(() => {
                  setIsPlayingTeaser(true);
                  setLogs(prev => [
                    ...prev,
                    { time: getLogTime(), msg: 'AUDIO: Ambient soundtrack [Stonebridge Dawn] unlocked on interaction.', type: 'info' }
                  ]);
                })
                .catch(e => console.error("Interaction audio start failed:", e));
            }
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
          };
          document.addEventListener('click', handleFirstInteraction);
          document.addEventListener('keydown', handleFirstInteraction);
        });
    };

    // Small delay to allow react lifecycle to paint, then trigger the soundtrack
    const timer = setTimeout(startPlay, 200);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingTeaser) {
      audioRef.current.pause();
      setIsPlayingTeaser(false);
      setLogs(prev => [
        ...prev,
        { time: getFormattedTime(), msg: 'AUDIO: Ambient soundtrack paused by user.', type: 'sys' }
      ]);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlayingTeaser(true);
          setLogs(prev => [
            ...prev,
            { time: getFormattedTime(), msg: 'AUDIO: Ambient soundtrack [Stonebridge Dawn] resumed.', type: 'info' }
          ]);
        })
        .catch(err => console.error("Play failed:", err));
    }
  };

  const handleLaunchAndPause = (url: string) => {
    if (audioRef.current && isPlayingTeaser) {
      audioRef.current.pause();
      setIsPlayingTeaser(false);
      setLogs(prev => [
        ...prev,
        { time: getFormattedTime(), msg: 'AUDIO: Auto-paused soundtrack for live game instance launch.', type: 'sys' }
      ]);
    }
    onLaunchGame(url);
  };

  // Live ticker array
  const mockTelemetryMessages = [
    { msg: 'Synced state coordinates with Cloudflare Node-West-B.', type: 'sys' as const },
    { msg: 'Spatial anchors verified. Stream status: EXTREMELY_SMOOTH.', type: 'info' as const },
    { msg: 'Procedural terrain cluster [Rift_Hollows_C] generated.', type: 'info' as const },
    { msg: 'Wanderer_901 joined shard lobby #12.', type: 'sys' as const },
    { msg: 'Anomalous energy fluctuation detected at chunk [Monolith_Grid_6].', type: 'warn' as const },
    { msg: 'Rift anchor verified. Dimensional mesh integrity: 99.1%.', type: 'info' as const },
    { msg: 'Heartbeat ping updated: latency optimal.', type: 'info' as const },
    { msg: 'Aether audio streams pre-rendered and synchronized.', type: 'sys' as const },
    { msg: 'Wanderer_344 logged out. Connection dropped cleanly.', type: 'warn' as const },
    { msg: 'Matrix transform complete. Chunk loading queued.', type: 'warp' as const },
    { msg: 'Warp vector alignment locked inside dimensional coordinates.', type: 'warp' as const }
  ];

  // Initialize terminal logs and start background updates
  useEffect(() => {
    // Add initial setup logs
    const initialLogs = [
      { time: getFormattedTime(), msg: 'SYSTEM: Initializing Xyrtania Gateway Client...', type: 'sys' as const },
      { time: getFormattedTime(), msg: 'SYSTEM: Fetching remote cluster state from Render.com Node East...', type: 'sys' as const },
      { time: getFormattedTime(), msg: 'CONNECTION: WebSocket established on wss://xyrtania.andy-596.workers.dev/relay', type: 'info' as const },
      { time: getFormattedTime(), msg: 'TELEMETRY: Interface online. Active rendering pipeline established.', type: 'info' as const }
    ];
    setLogs(initialLogs);

    // Periodic updater for console logs, player counts, and latency
    const interval = setInterval(() => {
      // 1. Add random console message
      const randomMsgObj = mockTelemetryMessages[Math.floor(Math.random() * mockTelemetryMessages.length)];
      setLogs(prev => [
        ...prev.slice(-24), // Cap logs size for memory performance
        { time: getFormattedTime(), msg: randomMsgObj.msg, type: randomMsgObj.type }
      ]);

      // 2. Fluctuat player count slightly
      setActivePlayers(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(12, Math.min(48, prev + delta));
      });

      // 3. Fluctuate ping
      setPingLatency(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(35, Math.min(58, prev + delta));
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll terminal container to bottom
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Helper: formatted time
  function getFormattedTime() {
    return new Date().toTimeString().split(' ')[0];
  }

  // Interactive Controls: HUD
  const handleSimulateCombat = () => {
    setHealth(prev => Math.max(18, prev - Math.floor(Math.random() * 20 + 8)));
    setEnergy(prev => Math.max(10, prev - Math.floor(Math.random() * 15 + 10)));
    setMana(prev => Math.max(5, prev - Math.floor(Math.random() * 12 + 6)));
    
    setLogs(prev => [
      ...prev,
      { time: getFormattedTime(), msg: 'COMBAT: Modeled physical rift skirmish. Vitals drained.', type: 'warn' }
    ]);
  };

  const handleUseElixir = () => {
    setHealth(prev => Math.min(100, prev + 25));
    setEnergy(prev => Math.min(100, prev + 30));
    setMana(prev => Math.min(100, prev + 40));
    
    setLogs(prev => [
      ...prev,
      { time: getFormattedTime(), msg: 'RECOVERY: Consumed aether cell restorative. Vitals maximized.', type: 'info' }
    ]);
  };

  const handleRiftShift = () => {
    setPosX(prev => prev + (Math.random() - 0.5) * 80);
    setPosY(prev => prev + (Math.random() - 0.5) * 15);
    setPosZ(prev => prev + (Math.random() - 0.5) * 80);
    
    setLogs(prev => [
      ...prev,
      { time: getFormattedTime(), msg: 'WARP: Spatial coordinates shifted. Neural drift detected.', type: 'warp' }
    ]);
  };

  // Interactive Controls: Speed Slider
  const handleWarpSpeedChange = (val: number) => {
    setWarpSpeed(val);
    setLogs(prev => [
      ...prev,
      { time: getFormattedTime(), msg: `CONTROL: Rotating prism warp frequency modulated to ${val} Hz.`, type: 'sys' }
    ]);
  };

  const loreArchives = [
    {
      id: 'rifts',
      title: 'THE FLOATING RIFTS',
      excerpt: 'Massive, unanchored fragments of modular mathematical geometry hovering in the void...',
      content: 'The floating rifts represent ancient, decentralized shards of a long-collapsed reality. Engineered entirely through optimized WebGL chunk rendering buffers, these structures defy standard gravitational mechanics. Within the rifts, terrain is procedurally generated using high-frequency noise fields, feeding coordinate matrices instantly to all connected clients over high-speed socket lines.'
    },
    {
      id: 'synchronization',
      title: 'LOW-LATENCY CHUNK SYNC',
      excerpt: 'How coordinates, velocities, and spell targets align instantly across the network...',
      content: 'At the heart of Xyrtania lies a custom-engineered network replication layer. Movements, animations, and combat variables are compressed into highly efficient packet grids before being dispatched over persistent WebSockets. The client interpolates positional data smoothly, predicting coordinates based on user input vectors and preventing latency spikes from degrading the immersion.'
    },
    {
      id: 'relics',
      title: 'THE MONOLITH ANCHORS',
      excerpt: 'Gigantic, rotating monoliths that hum with localized warp energy...',
      content: 'Wanderers map out the world to locate the Rift Monoliths. These ancient objects serve as spatial anchors. When activated, they project energy fields that enable trans-coordinate shifts, unlocking new quadrants in the modular world layout. Legend says the monoliths are constructed from concentrated raw code, acting as access gates for alpha exploration.'
    }
  ];

  const handleLoreToggle = (id: string) => {
    setExpandedLore(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-mono relative overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Cinematic Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-zinc-950/95 border-b border-zinc-800/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse" />
              <span className="absolute inset-0 rounded-full bg-emerald-500/50 animate-ping" />
            </div>
            <span className="font-black text-zinc-100 tracking-[0.25em] text-sm md:text-base">XYRTANIA // GATEWAY</span>
          </div>

          <div className="hidden lg:flex items-center space-x-8 text-xs text-zinc-400">
            <a href="#archives" className="hover:text-amber-400 transition-colors tracking-widest">[ ARCHIVES ]</a>
            <a href="#core" className="hover:text-amber-400 transition-colors tracking-widest">[ RIFT_CORE ]</a>
            <a href="#telemetry" className="hover:text-amber-400 transition-colors tracking-widest">[ HUD_TELEMETRY ]</a>
            <a href="#specs" className="hover:text-amber-400 transition-colors tracking-widest">[ COMPATIBILITY ]</a>
          </div>

          <div className="flex items-center space-x-3">
            {/* Ambient Soundtrack Toggle */}
            <button 
              onClick={toggleMusic}
              className={`text-[10px] md:text-xs flex items-center space-x-1.5 border border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/5 px-2.5 py-1.5 rounded transition-all tracking-wider ${isPlayingTeaser ? 'text-amber-400 border-amber-500/30 bg-amber-500/5' : 'text-zinc-500'}`}
              title="Ambient Soundtrack"
            >
              {isPlayingTeaser ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                  <span className="hidden sm:inline font-bold">STONEBRIDGE DAWN</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="hidden sm:inline">SOUNDTRACK OFF</span>
                </>
              )}
            </button>

            <button 
              onClick={onBackToStudio}
              className="text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded transition-all tracking-wider"
            >
              [ DEV_STUDIO ]
            </button>
            <button 
              onClick={() => handleLaunchAndPause('https://xyrtania.andy-596.workers.dev')}
              className="bg-amber-500 text-black font-black text-xs px-4 py-2 rounded shadow-md hover:bg-amber-400 transition-all flex items-center space-x-1 tracking-wider"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>PLAY IN BROWSER</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Epic Hero Banner */}
      <header className="relative py-24 md:py-36 border-b border-zinc-900 overflow-hidden bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.06)_0%,rgba(9,9,11,0)_80%)]">
        {/* Abstract background graphics */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gradient-to-r from-emerald-500/5 to-amber-500/5 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/[0.02] blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CINEMATIC RELEASE SERVER STATUS: ACTIVE</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-400 text-glow leading-none select-none">
              XYRTANIA
            </h1>
            <p className="font-mono text-zinc-500 text-xs md:text-sm tracking-[0.2em] uppercase">
              MULTIPLAYER 3D EXPLORATION RPG // WEBGL PIPELINE
            </p>
          </div>

          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-mono">
            Traverse a procedurally generated floating ecosystem from any device, mapped in real-time inside your browser. No downloads, no plugins. Connect instantly, discover anomalous dimensional rifts, and coordinate with active wanderers inside a living, low-latency 3D socket network.
          </p>

          {/* Action Callouts */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => handleLaunchAndPause('https://xyrtania.andy-596.workers.dev')}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black text-sm font-black px-8 py-4 rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center space-x-3 group cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span className="tracking-widest">PLAY XYRTANIA NOW</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button 
              onClick={() => window.open('https://xyrtania.andy-596.workers.dev', '_blank')}
              className="w-full sm:w-auto border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50 px-8 py-4 rounded-lg text-sm font-bold tracking-widest transition-all flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>LAUNCH IN NEW TAB</span>
            </button>
          </div>

          <div className="pt-6 text-[10px] text-zinc-600 tracking-widest uppercase">
            Built using Native Three.js &bull; Render Nodes &bull; Low-latency WebSockets
          </div>
        </div>
      </header>

      {/* MAIN CONTENT BENTO INTERACTION SCHEME */}
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        
        {/* Section 1: Interactive Monolith & Dynamic Telemetry Console */}
        <section id="core" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Holographic Rift Core Resonator (Interactive 3D Prism Grid) */}
          <div className="lg:col-span-7 bg-zinc-900/40 border border-zinc-900 rounded-xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500/60" />
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                  <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: `${30 - warpSpeed}s` }} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-100 text-sm tracking-widest uppercase">RIFT CORE MONOLITH RESONANCE</h3>
                  <p className="text-[10px] text-zinc-500">DYNAMIC WIREFRAME MATRIX SIMULATOR</p>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700 font-bold uppercase">
                VELOCITY: {warpSpeed} Hz
              </span>
            </div>

            {/* 3D Prism Simulation Box */}
            <div className="py-8 flex flex-col items-center justify-center relative bg-[radial-gradient(circle,rgba(251,191,36,0.06)_0%,rgba(0,0,0,0)_70%)]">
              {/* Spinning 3D CSS container */}
              <div 
                className="relative w-24 h-44 cursor-pointer"
                style={{ 
                  perspective: '600px',
                }}
              >
                <div 
                  className="w-full h-full relative"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    animation: `xyrtania_spin ${30 - warpSpeed}s linear infinite`,
                    transform: 'rotateX(12deg)'
                  }}
                >
                  {/* Style block for keyframe animation scoped to this element */}
                  <style>{`
                    @keyframes xyrtania_spin {
                      0% { transform: rotateY(0deg) rotateX(12deg); }
                      100% { transform: rotateY(360deg) rotateX(12deg); }
                    }
                  `}</style>
                  {/* Front Face */}
                  <div className="absolute inset-0 border border-amber-500/40 bg-zinc-950/90 flex flex-col items-center justify-center text-[10px] text-amber-500/80 font-bold select-none backface-hidden shadow-[inset_0_0_15px_rgba(251,191,36,0.15)]" style={{ transform: 'translateZ(48px)' }}>
                    <span>RIFT_A</span>
                    <span className="text-[8px] text-zinc-600 mt-1">SGS_01</span>
                  </div>
                  {/* Back Face */}
                  <div className="absolute inset-0 border border-amber-500/40 bg-zinc-950/90 flex flex-col items-center justify-center text-[10px] text-amber-500/80 font-bold select-none backface-hidden shadow-[inset_0_0_15px_rgba(251,191,36,0.15)]" style={{ transform: 'rotateY(180deg) translateZ(48px)' }}>
                    <span>RIFT_B</span>
                    <span className="text-[8px] text-zinc-600 mt-1">SGS_02</span>
                  </div>
                  {/* Left Face */}
                  <div className="absolute inset-0 border border-amber-500/40 bg-zinc-950/90 flex flex-col items-center justify-center text-[10px] text-amber-500/80 font-bold select-none backface-hidden shadow-[inset_0_0_15px_rgba(251,191,36,0.15)]" style={{ transform: 'rotateY(-90deg) translateZ(48px)' }}>
                    <span>RIFT_C</span>
                    <span className="text-[8px] text-zinc-600 mt-1">SGS_03</span>
                  </div>
                  {/* Right Face */}
                  <div className="absolute inset-0 border border-amber-500/40 bg-zinc-950/90 flex flex-col items-center justify-center text-[10px] text-amber-500/80 font-bold select-none backface-hidden shadow-[inset_0_0_15px_rgba(251,191,36,0.15)]" style={{ transform: 'rotateY(90deg) translateZ(48px)' }}>
                    <span>RIFT_D</span>
                    <span className="text-[8px] text-zinc-600 mt-1">SGS_04</span>
                  </div>
                  {/* Top Cap */}
                  <div className="absolute top-0 left-0 w-24 h-24 border border-emerald-500/40 bg-zinc-950/90 flex items-center justify-center text-[8px] text-emerald-400 font-bold select-none backface-hidden shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]" style={{ transform: 'rotateX(90deg) translateZ(48px)', height: '96px' }}>
                    <span>MONOLITH</span>
                  </div>
                  {/* Bottom Cap */}
                  <div className="absolute top-0 left-0 w-24 h-24 border border-emerald-500/40 bg-zinc-950/90 flex items-center justify-center text-[8px] text-emerald-400 font-bold select-none backface-hidden shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]" style={{ transform: 'rotateX(-90deg) translateZ(128px)', height: '96px' }}>
                    <span>CORE_NODE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Matrix adjustment controls */}
            <div className="space-y-4 pt-4 border-t border-zinc-800/80">
              <p className="text-xs text-zinc-400 leading-relaxed">
                The 3D wireframe represents the client's Three.js matrix rotation vectors. Recalibrating the frequency forces localized asset synchronization, mimicking the core mechanics used to map structural rifts inside the multiplayer engine.
              </p>
              <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                  <span>Modulate Rotation Frequency</span>
                  <span>{warpSpeed} Hz</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="28" 
                  value={warpSpeed}
                  onChange={(e) => handleWarpSpeedChange(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-zinc-500 uppercase">
                  <span>Slow Resonance (1Hz)</span>
                  <span>Maximum Warp Speed (28Hz)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling Terminal Socket Console */}
          <div className="lg:col-span-5 bg-zinc-900/20 border border-zinc-900 rounded-xl p-6 flex flex-col justify-between space-y-4 relative backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-zinc-100 text-xs tracking-widest uppercase">SOCKET TELEMETRY MONITOR</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-zinc-400 font-bold tracking-wider">SECURE_LINK</span>
              </div>
            </div>

            {/* Network Statistics Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-lg text-center flex flex-col justify-center">
                <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Active Wanderers</div>
                <div className="text-xl font-bold text-emerald-400 flex items-center justify-center space-x-1">
                  <Users className="w-4 h-4 text-emerald-500 mr-1" />
                  <span>{activePlayers}</span>
                </div>
              </div>
              <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-lg text-center flex flex-col justify-center">
                <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Latency (WS Ping)</div>
                <div className="text-xl font-bold text-emerald-400 flex items-center justify-center space-x-1">
                  <Activity className="w-4 h-4 text-emerald-500 mr-1" />
                  <span>{pingLatency}ms</span>
                </div>
              </div>
            </div>

            {/* Terminal lines box */}
            <div className="flex-1 min-h-[220px] bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-[10px] flex flex-col overflow-hidden relative shadow-inner">
              <div ref={terminalContainerRef} className="flex-1 overflow-y-auto scrollbar-thin pr-1 max-h-[240px] space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className="leading-relaxed flex items-start space-x-1.5">
                    <span className="text-emerald-500 shrink-0 select-none">[{log.time}]</span>
                    <span className={
                      log.type === 'warn' ? 'text-amber-400' :
                      log.type === 'warp' ? 'text-purple-400' :
                      log.type === 'sys' ? 'text-blue-400' : 'text-zinc-400'
                    }>
                      {log.msg}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-1 right-2 text-[8px] text-zinc-600 font-bold">CLIENT_RELAY_SYS_v0.1</div>
            </div>

            <p className="text-[10px] text-zinc-500 leading-relaxed">
              * The connection panel monitors simulated packets passing through our high-speed Cloudflare Worker group. Data remains secure, establishing instant coordinate sync.
            </p>
          </div>
        </section>

        {/* Section 2: Interactive Survival HUD Simulator */}
        <section id="telemetry" className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-8 space-y-8 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.01] rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-6 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                <Heart className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-100 text-base tracking-widest uppercase">VITAL SYSTEMS TELEMETRY</h3>
                <p className="text-xs text-zinc-500">CLIENT-SIDE TACTICAL SURVIVAL INTERFACE</p>
              </div>
            </div>
            
            {/* Quick Status indicators */}
            <div className="flex items-center space-x-4 text-xs">
              <span className="text-zinc-500 uppercase">ANOMALIES DETECTED: <span className="text-amber-500 font-bold">00</span></span>
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-500 uppercase">LOCATION STATUS: <span className="text-emerald-400 font-bold">RUST_RIFTS</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Real React progress bars recreating the actual game HUD gauges */}
            <div className="lg:col-span-5 bg-zinc-950/80 border border-zinc-800 p-6 rounded-xl space-y-5 shadow-inner">
              
              {/* Cognitive Integrity (Health) */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-rose-400 uppercase tracking-widest flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-rose-950" />
                    Cognitive Integrity (Health)
                  </span>
                  <span className="text-rose-400 font-mono font-black">{health}%</span>
                </div>
                <div className="h-2.5 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                    style={{ width: `${health}%` }}
                  />
                </div>
              </div>

              {/* Kinetic Capacitance (Energy) */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-amber-400 uppercase tracking-widest flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    Kinetic Capacitance (Energy)
                  </span>
                  <span className="text-amber-400 font-mono font-black">{energy}%</span>
                </div>
                <div className="h-2.5 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                    style={{ width: `${energy}%` }}
                  />
                </div>
              </div>

              {/* Anomalous Reserve (Mana) */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-blue-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Anomalous Reserve (Mana)
                  </span>
                  <span className="text-blue-400 font-mono font-black">{mana}%</span>
                </div>
                <div className="h-2.5 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                    style={{ width: `${mana}%` }}
                  />
                </div>
              </div>

              {/* Dynamic Coordinate readout */}
              <div className="pt-4 border-t border-zinc-800 grid grid-cols-3 gap-2 text-center">
                <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 uppercase tracking-wider mb-0.5">COORD_X</div>
                  <div className="text-xs font-bold text-emerald-400 font-mono">{posX.toFixed(2)}</div>
                </div>
                <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 uppercase tracking-wider mb-0.5">COORD_Y</div>
                  <div className="text-xs font-bold text-emerald-400 font-mono">{posY.toFixed(2)}</div>
                </div>
                <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 uppercase tracking-wider mb-0.5">COORD_Z</div>
                  <div className="text-xs font-bold text-emerald-400 font-mono">{posZ.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Explanatory description and interactive testing controls */}
            <div className="lg:col-span-7 space-y-6">
              <h4 className="text-zinc-100 font-bold text-lg tracking-wide">Simulate Client interactions</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Survival in Xyrtania requires meticulous management of active parameters. In the real client, combat actions drain Kinetic energy, physical hits disrupt Cognitive Integrity, and executing spatial dimensional warps drains Anomalous Reserves.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={handleSimulateCombat}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                >
                  <Activity className="w-5 h-5 mb-2 text-red-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold tracking-wider uppercase">SIMULATE SKIRMISH</span>
                  <span className="text-[8px] text-zinc-500 mt-1">Drains Integrity</span>
                </button>
                <button 
                  onClick={handleUseElixir}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                >
                  <Heart className="w-5 h-5 mb-2 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold tracking-wider uppercase">DRINK RESTORATIVE</span>
                  <span className="text-[8px] text-zinc-500 mt-1">Heals Vitality</span>
                </button>
                <button 
                  onClick={handleRiftShift}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group sm:col-span-1"
                >
                  <Compass className="w-5 h-5 mb-2 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold tracking-wider uppercase">WARP COORDINATES</span>
                  <span className="text-[8px] text-zinc-500 mt-1">Alters Position Matrix</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Game Lore Expandable Archives */}
        <section id="archives" className="space-y-6">
          <div className="flex items-center space-x-3 border-b border-zinc-800 pb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-100 text-lg tracking-widest uppercase">THE RIFT CODES ARCHIVES</h3>
              <p className="text-xs text-zinc-500">LORE LOGS AND DECENTRALIZED DATA FILES</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loreArchives.map((archive) => (
              <div 
                key={archive.id}
                className={`bg-zinc-900/20 border transition-all duration-300 rounded-xl p-5 flex flex-col justify-between space-y-4 cursor-pointer hover:border-zinc-700/60 ${expandedLore === archive.id ? 'border-amber-500/50 bg-zinc-900/40 ring-1 ring-amber-500/20 shadow-lg shadow-amber-500/5' : 'border-zinc-900'}`}
                onClick={() => handleLoreToggle(archive.id)}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-amber-500 font-bold uppercase tracking-widest">
                    <span>ARCHIVE_CODE: {archive.id.toUpperCase()}_LOG</span>
                    <span>{expandedLore === archive.id ? '[ COLLAPSE ]' : '[ DECRYPT ]'}</span>
                  </div>
                  <h4 className="font-black text-zinc-100 text-sm tracking-widest group-hover:text-amber-400 transition-colors">{archive.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                    {archive.excerpt}
                  </p>
                </div>

                {expandedLore === archive.id && (
                  <p className="text-xs text-zinc-500 leading-relaxed pt-3 border-t border-zinc-800/80 animate-in fade-in duration-300 font-mono">
                    {archive.content}
                  </p>
                )}

                <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                  ACCESS: OPEN_ALPHA_AUTH
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Specifications Sheet */}
        <section id="specs" className="bg-zinc-900/10 border border-zinc-900 rounded-xl p-6 space-y-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 border-b border-zinc-800 pb-4">
            <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-100 text-base tracking-widest uppercase">RUNTIME HARDWARE REQUIREMENTS</h3>
              <p className="text-xs text-zinc-500">BROWSER AND HOST COMPATIBILITY STANDARD</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs text-zinc-400">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-amber-500 font-bold">API STANDARDS</span>
                <span className="text-right">WebGL 2.0 / GLSL ES 3.0 / Canvas2D</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-amber-500 font-bold">SOCKET PROTOCOL</span>
                <span className="text-right">WebSockets (wss://) Low Latency</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-amber-500 font-bold">HOST RELAY CLUSTER</span>
                <span className="text-right">Render.com Gateway / Node-Group East</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-amber-500 font-bold">AUDIO ENGINE</span>
                <span className="text-right">Native Web Audio API Streams</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-amber-500 font-bold">COMPATIBLE BROWSERS</span>
                <span className="text-right">Safari 15+ / Chrome 102+ / Firefox 98+</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-amber-500 font-bold">SYSTEM CONTROLS</span>
                <span className="text-right">Mobile Joystick (Touch) / WASD (Desktop)</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-amber-500 font-bold">DEPLOYMENT ECOSYSTEM</span>
                <span className="text-right">Cloudflare Shard Edge / Pages Deployment</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-amber-500 font-bold">ASSETS PIPELINE</span>
                <span className="text-right">Compressed WebP &bull; Low-Bitrate OGG Streams</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer and Backdoor Studio Redirect */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-6">
          <div className="flex items-center space-x-3">
            <Terminal className="w-4 h-4 text-amber-500" />
            <span>&copy; {new Date().getFullYear()} Xyrtania Shard Group. All rights reserved.</span>
          </div>

          {/* Core connection details */}
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Gateway Online
            </span>
            <span>|</span>
            <button 
              onClick={onBackToStudio}
              className="text-amber-500 hover:text-amber-400 font-bold underline cursor-pointer hover:no-underline transition-all"
            >
              [ 💻 ACCESS DEV_STUDIO PORTFOLIO ]
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
