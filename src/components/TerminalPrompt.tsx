import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  HelpCircle, 
  Terminal as TerminalIcon, 
  CornerDownLeft, 
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { CURRENT_STUDIO_VERSION } from '../data/versions';

interface CommandLogEntry {
  id: string;
  command?: string;
  output: React.ReactNode;
  timestamp: string;
  type?: 'info' | 'success' | 'warn' | 'error' | 'ascii';
}

interface TerminalPromptProps {
  onNavigateTab: (tab: string) => void;
  onOpenProject?: (projectId: string) => void;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onToggleFullscreen: () => void;
  onOpenMediaPlayer: () => void;
  onTriggerSmiley: () => void;
  isMusicOn: boolean;
  isSfxOn: boolean;
  isFullscreen: boolean;
  activeTab: string;
}

const QUOTES = [
  "In the quiet hours of the night, we forge whole worlds from the cab of a truck.",
  "Mathematics is the only poetry that never fades.",
  "A clean codebase and an open highway: both require vigilance and respect for the curves.",
  "Low latency in the browser is like high torque pulling over a steep mountain pass.",
  "Measure twice, refactor once, ship with zero bloated dependencies.",
  "Every prime number is an outpost on the frontier of arithmetic."
];

export const TerminalPrompt: React.FC<TerminalPromptProps> = ({
  onNavigateTab,
  onOpenProject,
  onToggleMusic,
  onToggleSfx,
  onToggleFullscreen,
  onOpenMediaPlayer,
  onTriggerSmiley,
  isMusicOn,
  isSfxOn,
  isFullscreen,
  activeTab
}) => {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<CommandLogEntry[]>([
    {
      id: 'init-1',
      output: (
        <div className="space-y-1">
          <div className="text-emerald-400 font-bold">
            Andy's Dev Studio Terminal OS [{CURRENT_STUDIO_VERSION}] — Active Terminal
          </div>
          <div className="text-zinc-500 text-xs">
            Type <span className="text-emerald-400 font-semibold">/help</span> or click the expansion arrow at bottom-right to view all available commands.
          </div>
        </div>
      ),
      timestamp: 'BOOT',
      type: 'info'
    }
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal log when new entries arrive
  useEffect(() => {
    if (isExpanded) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isExpanded]);

  const getTimestamp = () => {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  };

  const addLog = (output: React.ReactNode, type: CommandLogEntry['type'] = 'info', command?: string) => {
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        command,
        output,
        timestamp: getTimestamp(),
        type
      }
    ]);
  };

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Save to history
    setHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Normalize command: remove leading slash if present
    const cleanCmd = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
    const parts = cleanCmd.split(' ').filter(Boolean);
    const cmd = parts[0]?.toLowerCase() || '';
    const args = parts.slice(1);

    // Always expand so user can see result
    setIsExpanded(true);

    switch (cmd) {
      case 'help':
      case '?': {
        addLog(
          <div className="space-y-3 font-mono text-xs text-zinc-300">
            <div className="text-emerald-400 font-bold border-b border-zinc-800 pb-1">
              SYSTEM COMMAND REGISTER — AVAILABLE INSTRUCTIONS
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
              <div>
                <span className="text-emerald-400 font-bold">/help, /?</span>
                <span className="text-zinc-500"> — Display this instruction manifest</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold">/version, /manifest</span>
                <span className="text-zinc-500"> — Show website release notes &amp; commits</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold">/status</span>
                <span className="text-zinc-500"> — View system diagnostics &amp; audio channels</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold">/clear, /cls</span>
                <span className="text-zinc-500"> — Clear terminal log buffer</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold">/expand, /collapse</span>
                <span className="text-zinc-500"> — Toggle terminal console drawer</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold">/fullscreen</span>
                <span className="text-zinc-500"> — Toggle full-screen display mode</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold">/time</span>
                <span className="text-zinc-500"> — Display current timestamp &amp; time</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold">/mp3player</span>
                <span className="text-zinc-500"> — Launch retro desktop audio player</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold">/music [on|off|toggle]</span>
                <span className="text-zinc-500"> — Control ambient looping soundscape</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold">/sfx [on|off|toggle]</span>
                <span className="text-zinc-500"> — Control mechanical CRT terminal SFX</span>
              </div>
            </div>

            <div className="border-t border-zinc-800/80 pt-2">
              <div className="text-amber-400 font-bold mb-1">NAVIGATION SHORTCUTS:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div><span className="text-emerald-300 font-semibold">/desk</span> <span className="text-zinc-500">Field Desk</span></div>
                <div><span className="text-emerald-300 font-semibold">/forge</span> <span className="text-zinc-500">The Forge</span></div>
                <div><span className="text-emerald-300 font-semibold">/ledger</span> <span className="text-zinc-500">The Ledger</span></div>
                <div><span className="text-emerald-300 font-semibold">/cargo</span> <span className="text-zinc-500">Cargo Bay</span></div>
                <div><span className="text-emerald-300 font-semibold">/chronicles</span> <span className="text-zinc-500">Chronicles</span></div>
                <div><span className="text-emerald-300 font-semibold">/guild</span> <span className="text-zinc-500">Guild Hall</span></div>
                <div><span className="text-emerald-300 font-semibold">/rookery</span> <span className="text-zinc-500">The Rookery</span></div>
                <div><span className="text-emerald-300 font-semibold">/version</span> <span className="text-zinc-500">Manifest</span></div>
              </div>
            </div>

            <div className="border-t border-zinc-800/80 pt-2">
              <div className="text-amber-400 font-bold mb-1">EASTER EGGS &amp; DISPATCHES:</div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                <div><span className="text-amber-300 font-bold">/smiley</span> <span className="text-zinc-500">— Animate giant smiling emoji</span></div>
                <div><span className="text-amber-300 font-bold">/truck</span> <span className="text-zinc-500">— Andy's 18-wheeler rig ASCII</span></div>
                <div><span className="text-amber-300 font-bold">/quote</span> <span className="text-zinc-500">— Field log wisdom quote</span></div>
                <div><span className="text-amber-300 font-bold">/coffee</span> <span className="text-zinc-500">— Buy Me A Coffee guild link</span></div>
              </div>
            </div>
          </div>,
          'info',
          trimmed
        );
        break;
      }

      case 'clear':
      case 'cls': {
        setLogs([]);
        break;
      }

      case 'expand': {
        setIsExpanded(true);
        addLog(<div className="text-emerald-400">Terminal console expanded.</div>, 'success', trimmed);
        break;
      }

      case 'collapse': {
        setIsExpanded(false);
        break;
      }

      case 'version':
      case 'manifest':
      case 'changelog': {
        addLog(
          <div className="space-y-1 font-mono text-xs">
            <div className="text-emerald-400 font-bold">Andy's Dev Studio — [{CURRENT_STUDIO_VERSION}]</div>
            <div className="text-zinc-400">Codename: Orion Forge &amp; Navigation Matrix</div>
            <div className="text-zinc-400">Git Branch: <span className="text-emerald-300">main</span> | Head: <span className="text-emerald-300">a7f921d</span></div>
            <div className="text-zinc-500">To inspect the full commit log and architecture, type <span className="text-emerald-400 font-semibold">/goto version</span></div>
          </div>,
          'success',
          trimmed
        );
        break;
      }

      case 'status': {
        addLog(
          <div className="space-y-1 font-mono text-xs">
            <div className="text-emerald-400 font-bold">SYSTEM TELEMETRY REPORT:</div>
            <div className="text-zinc-300">&bull; Active View: <span className="text-emerald-400 uppercase font-semibold">[{activeTab}]</span></div>
            <div className="text-zinc-300">&bull; Ambient Music: <span className={isMusicOn ? 'text-emerald-400' : 'text-zinc-500'}>{isMusicOn ? 'ACTIVE [LOOPING]' : 'MUTED'}</span></div>
            <div className="text-zinc-300">&bull; Sound Effects: <span className={isSfxOn ? 'text-emerald-400' : 'text-zinc-500'}>{isSfxOn ? 'ACTIVE [SYNTHESIS]' : 'MUTED'}</span></div>
            <div className="text-zinc-300">&bull; Display Mode: <span className="text-emerald-300">{isFullscreen ? 'FULLSCREEN' : 'WINDOWED'}</span></div>
            <div className="text-zinc-300">&bull; Core Engine: <span className="text-zinc-400">React 18 + Vite 6 + Web Audio API</span></div>
            <div className="text-emerald-400 font-semibold pt-1">All telemetry nominal. Engine running at 60 FPS.</div>
          </div>,
          'info',
          trimmed
        );
        break;
      }

      case 'time':
      case 'date': {
        const now = new Date();
        addLog(
          <div className="font-mono text-xs text-zinc-300">
            <span className="text-emerald-400 font-bold">LOCAL SYSTEM TIME:</span> {now.toLocaleString()}
          </div>,
          'info',
          trimmed
        );
        break;
      }

      case 'fullscreen': {
        onToggleFullscreen();
        addLog(
          <div className="text-emerald-400 font-mono text-xs">
            Toggled fullscreen display mode.
          </div>,
          'success',
          trimmed
        );
        break;
      }

      case 'mp3player':
      case './mp3player': {
        onOpenMediaPlayer();
        addLog(
          <div className="text-emerald-400 font-mono text-xs">
            Launched retro MP3 Player module.
          </div>,
          'success',
          trimmed
        );
        break;
      }

      case 'music': {
        const arg = args[0]?.toLowerCase();
        if (arg === 'on') {
          if (!isMusicOn) onToggleMusic();
          addLog(<div className="text-emerald-400">Ambient music engaged.</div>, 'success', trimmed);
        } else if (arg === 'off') {
          if (isMusicOn) onToggleMusic();
          addLog(<div className="text-zinc-400">Ambient music muted.</div>, 'info', trimmed);
        } else {
          onToggleMusic();
          addLog(<div className="text-emerald-400">Toggled ambient soundscape.</div>, 'success', trimmed);
        }
        break;
      }

      case 'sfx': {
        const arg = args[0]?.toLowerCase();
        if (arg === 'on') {
          if (!isSfxOn) onToggleSfx();
          addLog(<div className="text-emerald-400">Terminal acoustic SFX enabled.</div>, 'success', trimmed);
        } else if (arg === 'off') {
          if (isSfxOn) onToggleSfx();
          addLog(<div className="text-zinc-400">Terminal acoustic SFX disabled.</div>, 'info', trimmed);
        } else {
          onToggleSfx();
          addLog(<div className="text-emerald-400">Toggled acoustic sound effects.</div>, 'success', trimmed);
        }
        break;
      }

      case 'goto':
      case 'nav': {
        const target = args[0]?.toLowerCase();
        if (!target) {
          addLog(<div className="text-amber-400">Usage: /goto &lt;desk|forge|ledger|cargo|chronicles|guild|rookery|version&gt;</div>, 'warn', trimmed);
          break;
        }

        const tabMap: Record<string, string> = {
          'desk': 'field-desk',
          'field-desk': 'field-desk',
          'forge': 'forge',
          'the-forge': 'forge',
          'ledger': 'ledger',
          'the-ledger': 'ledger',
          'cargo': 'cargo-bay',
          'cargo-bay': 'cargo-bay',
          'chronicles': 'chronicles',
          'logs': 'chronicles',
          'guild': 'guild-hall',
          'guild-hall': 'guild-hall',
          'rookery': 'rookery',
          'version': 'version',
          'manifest': 'version',
          'changelog': 'version'
        };

        const resolved = tabMap[target];
        if (resolved) {
          onNavigateTab(resolved);
          addLog(<div className="text-emerald-400">Routing navigation to [{resolved}]...</div>, 'success', trimmed);
        } else {
          addLog(<div className="text-red-400">Unknown target view: "{target}". Type /help for navigation list.</div>, 'error', trimmed);
        }
        break;
      }

      // Direct navigation shortcuts
      case 'desk':
      case 'field-desk': {
        onNavigateTab('field-desk');
        addLog(<div className="text-emerald-400">Transferred focus to [The Field Desk].</div>, 'success', trimmed);
        break;
      }
      case 'forge':
      case 'the-forge': {
        onNavigateTab('forge');
        addLog(<div className="text-emerald-400">Transferred focus to [The Forge].</div>, 'success', trimmed);
        break;
      }
      case 'ledger':
      case 'the-ledger': {
        onNavigateTab('ledger');
        addLog(<div className="text-emerald-400">Transferred focus to [The Ledger].</div>, 'success', trimmed);
        break;
      }
      case 'cargo':
      case 'cargo-bay': {
        onNavigateTab('cargo-bay');
        addLog(<div className="text-emerald-400">Transferred focus to [The Cargo Bay].</div>, 'success', trimmed);
        break;
      }
      case 'chronicles':
      case 'logs': {
        onNavigateTab('chronicles');
        addLog(<div className="text-emerald-400">Transferred focus to [The Chronicles].</div>, 'success', trimmed);
        break;
      }
      case 'guild':
      case 'guild-hall': {
        onNavigateTab('guild-hall');
        addLog(<div className="text-emerald-400">Transferred focus to [The Guild Hall].</div>, 'success', trimmed);
        break;
      }
      case 'rookery': {
        onNavigateTab('rookery');
        addLog(<div className="text-emerald-400">Transferred focus to [The Rookery].</div>, 'success', trimmed);
        break;
      }

      // Easter Eggs & Fun Commands
      case 'smiley':
      case 'smile':
      case 'happy': {
        onTriggerSmiley();
        addLog(
          <div className="space-y-1 font-mono text-xs">
            <div className="text-amber-400 font-bold flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>[ORBITAL SMILEY DISPATCHED] 😄</span>
            </div>
            <div className="text-zinc-300">Animating giant smiling emoji over cockpit viewport! Have an awesome day!</div>
          </div>,
          'success',
          trimmed
        );
        break;
      }

      case 'truck':
      case 'peterbilt': {
        addLog(
          <pre className="font-mono text-[11px] text-amber-400 leading-tight select-none">
{`    _________________________________          __
   |  ANDY'S DEV STUDIO             |________|  \\___
   |  [ THE FORGE // MATH ENGINE ]  |        |  |   \\
   |________________________________|________|__|____\\
      (O)(O)                  (O)(O)            (O)
   "Forged in code, tested on the road. 18 wheels of pure compute."`}
          </pre>,
          'ascii',
          trimmed
        );
        break;
      }

      case 'quote': {
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        addLog(
          <div className="font-mono text-xs text-zinc-300 border-l-2 border-emerald-500 pl-3 py-1 italic">
            "{randomQuote}"
            <div className="text-[11px] text-emerald-400 font-normal not-italic mt-1">— Andy, Field Log Dispatch</div>
          </div>,
          'info',
          trimmed
        );
        break;
      }

      case 'coffee':
      case 'bmac': {
        addLog(
          <div className="space-y-1 font-mono text-xs">
            <div className="text-[#FFDD00] font-bold">☕ FUEL THE FORGE:</div>
            <div className="text-zinc-300">Support development &amp; long hauls via Buy Me A Coffee:</div>
            <a 
              href="https://www.buymeacoffee.com/kayrugold" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block text-[#FFDD00] hover:underline font-bold"
            >
              https://www.buymeacoffee.com/kayrugold &rarr;
            </a>
          </div>,
          'success',
          trimmed
        );
        break;
      }

      case 'matrix': {
        addLog(
          <div className="text-emerald-400 font-mono text-xs">
            <span className="font-bold">Wake up, Neo...</span> The Matrix has you. Follow the green phosphor terminal.
          </div>,
          'success',
          trimmed
        );
        break;
      }

      default: {
        addLog(
          <div className="font-mono text-xs text-zinc-400">
            <span className="text-red-400 font-bold">Command not recognized:</span> "{trimmed}". Type <span className="text-emerald-400 font-bold">/help</span> to view supported commands.
          </div>,
          'error',
          trimmed
        );
        break;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex] || '');
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 transition-all duration-300 font-mono text-sm bg-zinc-950 border-t border-emerald-500/40 shadow-[0_-6px_25px_rgba(16,185,129,0.15)]">
      {/* Expanded Console Window */}
      {isExpanded && (
        <div className="h-64 sm:h-72 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md overflow-y-auto p-4 space-y-3 relative text-xs">
          {/* Subtle Scanline Effect */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

          {/* Drawer Top Controls */}
          <div className="sticky top-0 z-10 -mt-2 -mx-2 px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
            <div className="flex items-center space-x-2">
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-zinc-200">TERMINAL OUTPUT BUFFER</span>
              <span className="text-zinc-500">({logs.length} logs)</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCommand('/help')}
                className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                title="View /help"
              >
                <HelpCircle className="w-3 h-3" />
                <span>/help</span>
              </button>
              <button
                onClick={() => setLogs([])}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors"
                title="Clear console buffer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                title="Collapse console"
              >
                <ChevronDown className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Rendered Log History */}
          <div className="space-y-2.5 pt-1">
            {logs.map((log) => (
              <div key={log.id} className="space-y-1">
                {log.command && (
                  <div className="flex items-center space-x-2 text-zinc-500 text-[11px]">
                    <span className="text-emerald-500 font-bold">&gt;</span>
                    <span className="text-emerald-400 font-semibold">{log.command}</span>
                    <span className="text-zinc-600 text-[10px]">[{log.timestamp}]</span>
                  </div>
                )}
                <div className="pl-3">{log.output}</div>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}

      {/* Main Bottom Prompt Bar */}
      <div 
        className="p-2.5 px-4 flex items-center justify-between gap-3 cursor-text bg-zinc-950"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center flex-1 min-w-0">
          <span className="text-emerald-400 mr-2 font-bold shrink-0 select-none">root@system:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isExpanded ? "Type /help or a command..." : "Type /help or click arrow to expand terminal..."}
            className="bg-transparent border-none outline-none text-zinc-100 flex-1 caret-emerald-400 placeholder:text-zinc-600 text-xs sm:text-sm font-mono min-w-0"
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        {/* Action Controls & Expansion Arrow */}
        <div className="flex items-center space-x-2 shrink-0 select-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCommand('/help');
            }}
            className="hidden sm:inline-flex items-center space-x-1 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 hover:text-emerald-400 hover:border-zinc-700 transition-colors"
            title="Display /help commands"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>/help</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (input.trim()) {
                handleCommand(input);
                setInput('');
              } else {
                setIsExpanded(prev => !prev);
              }
            }}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-transparent hover:border-zinc-700 transition-all flex items-center justify-center"
            title={input.trim() ? "Execute command (Enter)" : (isExpanded ? "Collapse Terminal" : "Expand Terminal")}
          >
            {input.trim() ? (
              <CornerDownLeft className="w-4 h-4 text-emerald-400" />
            ) : isExpanded ? (
              <ChevronDown className="w-4 h-4 text-emerald-400 transition-transform" />
            ) : (
              <ChevronUp className="w-4 h-4 text-emerald-400 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerminalPrompt;
