import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  Tag, 
  Calendar, 
  CheckCircle2, 
  Copy, 
  Check, 
  Terminal, 
  Cpu, 
  Layers, 
  Clock, 
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { versionsData, CURRENT_STUDIO_VERSION, VersionRelease, GitCommit as GitCommitType } from '../data/versions';

interface TheVersionContentProps {
  onNavigate?: (tab: string) => void;
}

export const TheVersionContent: React.FC<TheVersionContentProps> = ({ onNavigate }) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedScope, setSelectedScope] = useState<string>('all');
  const [expandedVersions, setExpandedVersions] = useState<Record<string, boolean>>({
    'v4.70': true,
    'v4.66': true
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 1800);
  };

  const toggleVersionExpand = (version: string) => {
    setExpandedVersions(prev => ({
      ...prev,
      [version]: !prev[version]
    }));
  };

  const allScopes = ['all', 'core', 'routing', 'ui', 'comms', 'audio', 'forge', 'pwa'];

  const filterCommits = (commits: GitCommitType[]) => {
    if (selectedScope === 'all') return commits;
    return commits.filter(c => c.scope === selectedScope);
  };

  const totalCommits = versionsData.reduce((acc, v) => acc + v.commits.length, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold text-zinc-100 flex items-center space-x-3">
          <span className="text-emerald-500">##</span>
          <span>System Manifest &amp; Version Control</span>
        </h2>
        <p className="text-zinc-500 mt-2 italic font-mono text-sm">
          "Logged in code, tracked through git, forged on the open road."
        </p>
      </div>

      {/* Primary Status Diagnostic Banner */}
      <div className="border border-emerald-500/40 bg-zinc-900/90 rounded-xl p-5 shadow-lg shadow-emerald-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-mono font-bold tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ACTIVE BUILD: {CURRENT_STUDIO_VERSION}</span>
              </span>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded border border-zinc-700/60 flex items-center space-x-1">
                <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                <span>branch: main</span>
              </span>
              <span className="text-xs font-mono text-zinc-500 hidden sm:inline-flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>Integrity Verified</span>
              </span>
            </div>

            <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
              {versionsData[0]?.codename || "Orion Forge & Navigation Matrix"}
            </h3>
            <p className="text-sm text-zinc-400 max-w-2xl">
              {versionsData[0]?.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleCopy(CURRENT_STUDIO_VERSION, 'current-version')}
              className="px-3.5 py-2 rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 text-xs font-mono transition-all flex items-center space-x-2"
              title="Copy version tag to clipboard"
            >
              {copiedHash === 'current-version' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Tag Copied!</span>
                </>
              ) : (
                <>
                  <Tag className="w-4 h-4 text-zinc-400" />
                  <span>Copy Version Tag</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('commit-ledger');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-mono font-bold tracking-wider transition-all flex items-center space-x-2"
            >
              <GitCommit className="w-4 h-4" />
              <span>Jump to Commits ({totalCommits})</span>
            </button>
          </div>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-zinc-800/80 font-mono text-xs">
          <div className="bg-zinc-950/60 p-2.5 rounded border border-zinc-800">
            <div className="text-zinc-500">Framework</div>
            <div className="text-zinc-200 font-semibold mt-0.5">React 18 + TypeScript</div>
          </div>
          <div className="bg-zinc-950/60 p-2.5 rounded border border-zinc-800">
            <div className="text-zinc-500">Build Tool</div>
            <div className="text-zinc-200 font-semibold mt-0.5">Vite 6 SPA Engine</div>
          </div>
          <div className="bg-zinc-950/60 p-2.5 rounded border border-zinc-800">
            <div className="text-zinc-500">Audio Synthesis</div>
            <div className="text-zinc-200 font-semibold mt-0.5">Web Audio API Bus</div>
          </div>
          <div className="bg-zinc-950/60 p-2.5 rounded border border-zinc-800">
            <div className="text-zinc-500">Environment</div>
            <div className="text-emerald-400 font-semibold mt-0.5">Production Client</div>
          </div>
        </div>
      </div>

      {/* Scope Filter for Git Commits */}
      <div id="commit-ledger" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-zinc-100 flex items-center space-x-2">
              <GitCommit className="w-5 h-5 text-emerald-400" />
              <span>Version Releases &amp; Git Commits</span>
            </h3>
            <p className="text-xs text-zinc-500 font-mono">
              Chronological log of releases, scope updates, and engineering commits.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-zinc-500 mr-1 shrink-0" />
            {allScopes.map(scope => (
              <button
                key={scope}
                onClick={() => setSelectedScope(scope)}
                className={`px-2.5 py-1 rounded transition-colors uppercase tracking-wider text-[11px] ${
                  selectedScope === scope
                    ? 'bg-emerald-500 text-zinc-950 font-bold'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {scope}
              </button>
            ))}
          </div>
        </div>

        {/* Release Cards List */}
        <div className="space-y-6">
          {versionsData.map((rel: VersionRelease) => {
            const isExpanded = expandedVersions[rel.version] ?? false;
            const filteredCommits = filterCommits(rel.commits);
            const isCurrent = rel.status === 'Current Release';

            return (
              <div 
                key={rel.version}
                id={`release-${rel.version.replace('.', '-')}`}
                className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                  isCurrent
                    ? 'border-emerald-500/50 bg-zinc-900/70 shadow-md shadow-emerald-500/5'
                    : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                }`}
              >
                {/* Header */}
                <div 
                  onClick={() => toggleVersionExpand(rel.version)}
                  className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                      <span className={`px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                        isCurrent 
                          ? 'bg-emerald-500 text-zinc-950' 
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}>
                        {rel.version}
                      </span>
                      <span className="font-bold text-zinc-200 tracking-wide text-base">
                        {rel.codename}
                      </span>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                        isCurrent 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : rel.status === 'Stable' 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : 'bg-zinc-800/80 text-zinc-500 border border-zinc-700/50'
                      }`}>
                        {rel.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400">
                      {rel.summary}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 self-end md:self-auto font-mono text-xs text-zinc-500 shrink-0">
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{rel.releaseDate}</span>
                    </span>
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-zinc-800/70 space-y-6">
                    {/* Highlights */}
                    <div className="space-y-2">
                      <div className="text-xs uppercase tracking-wider text-emerald-400 font-mono font-bold flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Key Release Milestones</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {rel.highlights.map((h, i) => (
                          <div key={i} className="flex items-start space-x-2 text-zinc-300 bg-zinc-950/40 p-2.5 rounded border border-zinc-800/50">
                            <span className="text-emerald-400 font-bold shrink-0">&gt;</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Git Commits Ledger */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="text-zinc-400 uppercase tracking-wider font-bold flex items-center space-x-1.5">
                          <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Git Commits ({filteredCommits.length})</span>
                        </div>
                        {selectedScope !== 'all' && (
                          <span className="text-zinc-500 text-[11px]">
                            Filtered by scope: <strong className="text-emerald-400">{selectedScope}</strong>
                          </span>
                        )}
                      </div>

                      {filteredCommits.length === 0 ? (
                        <div className="p-4 text-xs font-mono text-zinc-500 text-center bg-zinc-950/40 rounded border border-zinc-800/50">
                          No commits match scope [{selectedScope}] in {rel.version}.
                        </div>
                      ) : (
                        <div className="divide-y divide-zinc-800/60 rounded-lg border border-zinc-800/80 bg-zinc-950/60 font-mono text-xs overflow-hidden">
                          {filteredCommits.map((c) => {
                            const isCopied = copiedHash === c.hash;
                            return (
                              <div 
                                key={c.hash} 
                                className="p-3 hover:bg-zinc-900/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                <div className="flex items-start sm:items-center space-x-3">
                                  <button
                                    onClick={() => handleCopy(c.hash, c.hash)}
                                    className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700/80 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/50 text-[11px] font-bold tracking-wider shrink-0 flex items-center space-x-1"
                                    title="Click to copy git commit hash"
                                  >
                                    <span>{c.hash}</span>
                                    {isCopied ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3 text-zinc-500" />
                                    )}
                                  </button>

                                  <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-[10px] uppercase text-zinc-400 border border-zinc-700/50 shrink-0">
                                    {c.scope}
                                  </span>

                                  <span className="text-zinc-300 font-sans sm:font-mono text-xs">
                                    {c.message}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-3 text-[11px] text-zinc-500 shrink-0 pl-7 sm:pl-0">
                                  <span>{c.author}</span>
                                  <span>&bull;</span>
                                  <span>{c.date}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Architecture Matrix */}
                    <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap items-center gap-2 text-[11px] font-mono text-zinc-500">
                      <span className="text-zinc-400">STACK:</span>
                      <span className="bg-zinc-800/60 px-2 py-0.5 rounded text-zinc-300">{rel.techSpecs.framework}</span>
                      <span className="bg-zinc-800/60 px-2 py-0.5 rounded text-zinc-300">{rel.techSpecs.engine}</span>
                      <span className="bg-zinc-800/60 px-2 py-0.5 rounded text-zinc-300">{rel.techSpecs.styling}</span>
                      <span className="bg-zinc-800/60 px-2 py-0.5 rounded text-zinc-300">{rel.techSpecs.audio}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Developer Maintenance Guide */}
      <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <Terminal className="w-4 h-4" />
            <span>DEVELOPER WORKFLOW // UPDATING SYSTEM VERSIONS</span>
          </div>
          <span className="text-zinc-500">src/data/versions.ts</span>
        </div>

        <p className="text-zinc-400 font-sans text-xs leading-relaxed">
          When releasing a new update to Andy's Dev Studio, add a new release block to <code className="text-emerald-400 bg-zinc-900 px-1 py-0.5 rounded">src/data/versions.ts</code> with the new version tag (e.g. <code className="text-emerald-400 bg-zinc-900 px-1 py-0.5 rounded">v4.71</code>), its codename, release notes, and git commit hashes. The system header badge, diagnostics, and routing will automatically reflect the latest build.
        </p>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-3 text-zinc-300 overflow-x-auto text-[11px]">
          <pre className="text-emerald-300">
{`// 1. Update package.json version
{ "version": "4.7.0" }

// 2. Add git commit entry in src/data/versions.ts
export const CURRENT_STUDIO_VERSION = 'v4.70';
export const versionsData: VersionRelease[] = [
  {
    version: 'v4.70',
    codename: '...',
    commits: [ { hash: 'a7f921d', message: '...', scope: 'core' } ]
  }
];`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TheVersionContent;
