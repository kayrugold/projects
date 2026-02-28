import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Code2, BookOpen, Package, Download, Users, Shield, Github, MessageSquare, Facebook, Instagram, Twitter, RefreshCw, Radio, Target, Hash, Swords, Globe, Smartphone, ExternalLink, Calendar, Wrench, Activity, Bug, Copy, Send, Coffee, FileText, ShieldCheck, RefreshCcw, Image, Mail, ArrowLeft, Search, Truck, Maximize, Minimize, Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { chroniclesData } from './data/chronicles';
import { cargoData } from './data/cargo';
import { projectsData } from './data/projects';
import { forgeData } from './data/forge';
import { ledgerData } from './data/ledger';
import { searchIndexData } from './data/searchIndex';
import { audio } from './utils/audio';

const NavItem = ({ icon: Icon, label, onClick, active = false }: { icon: React.ElementType, label: string, onClick: () => void, active?: boolean }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg border transition-all duration-300 group
      ${active 
        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' 
        : 'border-zinc-800 hover:border-emerald-500/30 hover:bg-zinc-900 text-zinc-400 hover:text-emerald-300'
      }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-emerald-400'}`} />
    <span className="font-medium tracking-wide">{label}</span>
  </button>
);

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-8 border-b border-zinc-800 pb-4">
    <h2 className="text-2xl font-bold text-zinc-100 flex items-center space-x-3">
      <span className="text-emerald-500">##</span>
      <span>{title}</span>
    </h2>
    {subtitle && <p className="text-zinc-500 mt-2 italic">"{subtitle}"</p>}
  </div>
);

const SocialLink = ({ icon: Icon, label, href }: { icon: React.ElementType, label: string, href: string }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-2 text-zinc-500 hover:text-emerald-400 transition-colors"
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm">{label}</span>
  </a>
);

const FieldDeskContent = ({ onNavigate }: { onNavigate: (tab: string) => void }) => (
  <div className="space-y-12 animate-in fade-in duration-500">
    {/* Hero / Intro */}
    <div className="border border-zinc-800 bg-zinc-900/50 p-6 md:p-8 rounded-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
      <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-4">Andy's Dev Studio</h2>
      <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
        A digital foundry built from the cab of a truck. This is where high-performance number theory engines, experimental prototypes, and developer tools are forged in code and tested on the road.
      </p>
      <div className="flex flex-wrap gap-4">
        <button onClick={() => onNavigate('forge')} className="px-6 py-3 bg-emerald-500 text-zinc-950 font-bold rounded hover:bg-emerald-400 transition-colors flex items-center space-x-2">
          <Code2 className="w-5 h-5" />
          <span>ENTER THE FORGE</span>
        </button>
        <button onClick={() => onNavigate('chronicles')} className="px-6 py-3 bg-zinc-800 text-zinc-300 font-bold rounded hover:bg-zinc-700 transition-colors flex items-center space-x-2 border border-zinc-700">
          <BookOpen className="w-5 h-5" />
          <span>READ THE LOGS</span>
        </button>
      </div>
    </div>

    {/* The Markets (Front & Center) */}
    <div>
      <SectionHeader title="THE FOUNDRY" subtitle="Select your sector. Test prototypes or acquire finished assets." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        
        <div onClick={() => onNavigate('forge')} className="border border-zinc-800 bg-zinc-900/30 p-6 rounded-lg hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all cursor-pointer group flex flex-col">
          <div className="w-12 h-12 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-zinc-200 font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors">The Forge</h3>
          <p className="text-zinc-500 text-sm flex-1">The sandbox. Play, test, and preview experimental prototypes.</p>
          <div className="mt-4 text-emerald-500 text-xs font-bold tracking-wider flex items-center space-x-1">
            <span>ACCESS PROTOTYPES</span>
            <ArrowLeft className="w-3 h-3 rotate-180" />
          </div>
        </div>

        <div onClick={() => onNavigate('ledger')} className="border border-zinc-800 bg-zinc-900/30 p-6 rounded-lg hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all cursor-pointer group flex flex-col">
          <div className="w-12 h-12 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
            <Download className="w-6 h-6" />
          </div>
          <h3 className="text-zinc-200 font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors">The Ledger</h3>
          <p className="text-zinc-500 text-sm flex-1">The digital market. Download stable, polished Android apps, PC software, sprites, art, phone backgrounds, maps, and music.</p>
          <div className="mt-4 text-emerald-500 text-xs font-bold tracking-wider flex items-center space-x-1">
            <span>BROWSE SOFTWARE</span>
            <ArrowLeft className="w-3 h-3 rotate-180" />
          </div>
        </div>

        <div onClick={() => onNavigate('cargo-bay')} className="border border-zinc-800 bg-zinc-900/30 p-6 rounded-lg hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all cursor-pointer group flex flex-col">
          <div className="w-12 h-12 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-zinc-200 font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors">The Cargo Bay</h3>
          <p className="text-zinc-500 text-sm flex-1">The physical market. Official studio apparel, gear, and provisions forged for the road.</p>
          <div className="mt-4 text-emerald-500 text-xs font-bold tracking-wider flex items-center space-x-1">
            <span>VIEW PROVISIONS</span>
            <ArrowLeft className="w-3 h-3 rotate-180" />
          </div>
        </div>

      </div>
    </div>

    {/* Current Status / The Rookery */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <section className="border border-zinc-800 bg-zinc-900/30 p-6 rounded-lg flex flex-col justify-center">
        <h3 className="text-lg font-bold text-zinc-100 mb-2 flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-400" />
          <span>The Rookery (Active Testing)</span>
        </h3>
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Google requires 20 testers for 14 continuous days before an app can go public. The Rookery is how we clear that gate together. Join the Discord and Google Group to get your security clearance and help ship the next release.
        </p>
        <button onClick={() => onNavigate('rookery')} className="w-full py-3 bg-blue-500/10 text-blue-400 font-bold rounded hover:bg-blue-500/20 transition-colors flex items-center justify-center space-x-2 border border-blue-500/30">
          <Shield className="w-5 h-5" />
          <span>ENTER THE ROOKERY</span>
        </button>
      </section>

      <section className="border border-zinc-800 bg-zinc-900/30 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center space-x-2">
          <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span>Beacon Active</span>
        </h3>
        <div className="font-mono text-sm space-y-3">
          <div className="flex flex-col space-y-1">
            <span className="text-zinc-500">// CURRENT FOCUS</span>
            <span className="text-emerald-400">Factor Hunter (Ultimate) Engine Optimization</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-zinc-500">// LATEST LOG</span>
            <span className="text-zinc-300">Log ID 4.65: The Bellows and the Beacon</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-zinc-500">// LOCATION</span>
            <span className="text-zinc-300">Mobile Command / Northern CA</span>
          </div>
        </div>
      </section>
    </div>
  </div>
);

const TerminalSection = ({ title, subtitle, children }: { title: string, subtitle?: string, children: React.ReactNode }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <SectionHeader title={title} subtitle={subtitle} />
    {children}
  </div>
);

const TheForgeContent = ({ onOpenProject, onLaunchApp }: { onOpenProject: (id: string) => void, onLaunchApp: (url: string) => void }) => (
  <TerminalSection title="The Forge" subtitle="Where raw ideas live. Experimental, rough, sometimes broken.">
    <div className="columns-1 lg:columns-2 gap-6">
      {forgeData.map((project) => (
        <div key={project.id} className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/50 p-6 rounded-lg space-y-4 flex flex-col group hover:border-emerald-500/50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-zinc-200 font-bold text-lg group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border ${
                  project.status === 'LIVE' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' :
                  project.status === 'BETA' ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' :
                  project.status === 'DEV' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' :
                  'border-purple-500/50 text-purple-400 bg-purple-500/10'
                }`}>
                  {project.status}
                </span>
              </div>
              <div className="text-xs text-zinc-500 font-mono mb-3">{project.type} // {project.version}</div>
            </div>
            {project.icon && <span className="text-2xl opacity-50">{project.icon}</span>}
          </div>
          
          {project.image && (
            <div className="w-full h-48 bg-zinc-950 rounded border border-zinc-800 overflow-hidden relative group-hover:border-emerald-500/30 transition-colors">
               <img 
                 src={project.image} 
                 alt={project.title} 
                 className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                 referrerPolicy="no-referrer"
               />
            </div>
          )}

          <p className="text-zinc-400 text-sm leading-relaxed flex-1">{project.description}</p>
          
          <div className="flex gap-2 pt-4 border-t border-zinc-800/50 mt-auto">
            <button 
              onClick={() => {
                if (project.action.includes('launchApp')) {
                  const match = project.action.match(/'([^']+)'/);
                  if (match && match[1]) {
                    onLaunchApp(match[1]);
                  }
                } else {
                  alert(`Execute: ${project.action}`);
                }
              }}
              className="flex-1 py-2 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 transition-colors text-sm font-bold flex items-center justify-center space-x-2"
            >
              <Terminal className="w-4 h-4" />
              <span>{project.buttonText}</span>
            </button>
            
            {project.projectPage && (
              <button 
                onClick={() => onOpenProject(project.projectPage!)}
                className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded hover:bg-emerald-500/20 transition-colors text-sm font-bold flex items-center space-x-2"
                title="View Project Specs"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Specs</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </TerminalSection>
);

const TheLedgerContent = () => (
  <TerminalSection title="The Ledger" subtitle="Where finished work lands. Verified releases, utility packs, and digital assets.">
    <div className="space-y-6">
      {ledgerData.map((item) => (
        <div key={item.id} className="flex flex-col md:flex-row gap-6 border border-zinc-800 bg-zinc-900/30 p-6 rounded-lg hover:bg-zinc-900/50 transition-colors group">
          {/* Image */}
          <div className="w-full md:w-48 h-48 bg-zinc-950 rounded border border-zinc-800 overflow-hidden shrink-0 relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20 group-hover:opacity-10 transition-opacity" />
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-zinc-100 font-bold text-xl tracking-tight">{item.title}</h3>
              <span className="text-emerald-400 font-bold font-mono bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30 text-sm">
                {item.price}
              </span>
            </div>
            
            <p className="text-zinc-400 text-sm leading-relaxed mb-4 flex-1 border-l-2 border-zinc-800 pl-4">
              {item.description}
            </p>

            {item.features && (
              <div className="flex flex-wrap gap-2 mb-6">
                {item.features.map(feature => (
                  <span key={feature} className="px-2 py-1 bg-zinc-950 border border-zinc-800 text-zinc-500 text-xs rounded font-mono">
                    {feature}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between">
              <span className="text-xs text-zinc-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
                Verified Release
              </span>
              <button 
                onClick={() => window.open(item.url, '_blank')}
                className="px-6 py-2 bg-emerald-500 text-zinc-950 rounded hover:bg-emerald-400 transition-colors text-sm font-bold flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Get on {item.platform}</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </TerminalSection>
);

const TheCargoBayContent = () => (
  <TerminalSection title="The Cargo Bay" subtitle="The quartermaster's stash. Official studio provisions.">
    <div className="columns-1 sm:columns-2 gap-6">
      {cargoData.map((item) => (
        <div key={item.id} className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg text-center space-y-4 flex flex-col group">
          <div className="w-full aspect-square bg-zinc-950 border border-zinc-800 rounded flex items-center justify-center mb-4 overflow-hidden relative">
            {item.image ? (
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Image className="w-12 h-12 text-zinc-700" />
            )}
          </div>
          <div className="flex-1 flex flex-col">
            <h3 className="text-zinc-200 font-bold text-lg mb-1">{item.title}</h3>
            <span className="text-emerald-500 font-bold text-sm mb-3">{item.price}</span>
            <p className="text-zinc-500 text-sm mb-6 flex-1">{item.description}</p>
            
            <div className="mt-auto">
              <button 
                onClick={() => window.open(item.actionUrl, '_blank')}
                className="w-full py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded hover:bg-emerald-500/20 transition-colors text-sm font-bold flex items-center justify-center space-x-2"
              >
                <span>{item.icon}</span>
                <span>{item.buttonText}</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </TerminalSection>
);

const TheChroniclesContent = () => {
  const [visibleCount, setVisibleCount] = useState(5);
  const visibleEntries = chroniclesData.slice(0, visibleCount);
  const hasMore = visibleCount < chroniclesData.length;

  useEffect(() => {
    const handleDeepLink = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;

      const index = chroniclesData.findIndex(e => e.id === hash);
      if (index >= 0 && index >= visibleCount) {
        // Expand to show this entry
        setVisibleCount(Math.ceil((index + 1) / 5) * 5);
        
        // Scroll to it after render
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            const yOffset = -100; // Increased offset for header
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
      } else if (index >= 0) {
        // Entry is already visible, just scroll
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            const yOffset = -100;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
      }
    };

    // Check on mount
    handleDeepLink();

    // Listen for hash changes
    window.addEventListener('hashchange', handleDeepLink);
    return () => window.removeEventListener('hashchange', handleDeepLink);
  }, [visibleCount]); // Re-run if visibleCount changes to ensure we don't miss scroll? No, that might cause loops. 
  // Actually, we only need to run this when hash changes. 
  // If we update visibleCount, the component re-renders, and we might want to scroll then?
  // Let's keep it simple: run on mount and hashchange.

  return (
    <TerminalSection title="The Chronicles" subtitle="The developer's logbook. Patch notes and field dispatches.">
      <div className="space-y-12 mt-8">
        {visibleEntries.map((entry, index) => (
          <div key={entry.id} id={entry.id} className="flex gap-6 group scroll-mt-24">
            {/* Timeline line & dot */}
            <div className="relative flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-zinc-950 border-2 border-emerald-500 group-hover:bg-emerald-500 transition-colors z-10 mt-1" />
              {index !== visibleEntries.length - 1 && (
                <div className="absolute top-5 -bottom-12 w-px bg-zinc-800 group-hover:bg-emerald-500/30 transition-colors" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-2">
              <div className="text-emerald-500 text-sm mb-2 font-bold tracking-wider">{entry.date.toUpperCase()}</div>
              <h3 className="text-zinc-100 font-bold text-xl mb-3">{entry.title}</h3>
              
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {entry.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {entry.image && (
                <div className="mb-6 border border-zinc-800 bg-zinc-950/50 p-1 rounded max-w-2xl group/image">
                  <div className="relative overflow-hidden rounded border border-zinc-900">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20 group-hover/image:opacity-10 transition-opacity" />
                    <img 
                      src={entry.image} 
                      alt={`Asset for ${entry.title}`}
                      className="w-full h-auto object-cover opacity-80 group-hover/image:opacity-100 transition-opacity duration-500 grayscale group-hover/image:grayscale-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm px-3 py-1.5 border-t border-zinc-800 flex justify-between items-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-wider">
                        SRC: {entry.image.split('/').pop()}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        LIVE
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-300 font-medium text-base leading-relaxed">{entry.summary}</p>
                {entry.content && (
                  <div 
                    className="text-zinc-400 mt-4 text-sm leading-relaxed prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-headings:text-zinc-200 prose-strong:text-zinc-300 [&_p]:mb-4 [&_p:last-child]:mb-0"
                    dangerouslySetInnerHTML={{ __html: entry.content }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        {hasMore && (
          <div className="flex justify-center pt-8 border-t border-zinc-800/50">
            <button 
              onClick={() => setVisibleCount(prev => prev + 5)}
              className="group flex items-center space-x-3 px-6 py-3 bg-zinc-900 border border-zinc-700 hover:border-emerald-500/50 text-zinc-400 hover:text-emerald-400 rounded transition-all"
            >
              <RefreshCw className="w-4 h-4 group-hover:animate-spin" />
              <span className="font-mono text-sm tracking-wider">EXECUTE: LOAD_ARCHIVES_BATCH()</span>
            </button>
          </div>
        )}
      </div>
    </TerminalSection>
  );
};

const TheGuildHallContent = ({ onNavigate }: { onNavigate: (tab: string) => void }) => (
  <TerminalSection title="The Guild Hall & Records" subtitle="The community hub and studio documentation.">
    
    {/* Guild Access - New Section */}
    <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border border-indigo-500/30 bg-zinc-900/80 p-6 rounded-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <h3 className="text-xl font-bold text-indigo-400 mb-2 flex items-center space-x-2 relative z-10">
          <MessageSquare className="w-5 h-5" />
          <span>The Live Feed</span>
        </h3>
        <p className="text-sm text-zinc-400 mb-6 relative z-10">
          Join the Discord server for real-time chat, voice channels, and instant support from the testing guild.
        </p>
        <a 
          href="https://discord.gg/WHhnBXpDSW" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative z-10 block w-full py-3 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold rounded hover:bg-indigo-500/20 transition-colors text-center"
        >
          CONNECT TO NEURAL LINK
        </a>
      </div>

      <div className="border border-emerald-500/30 bg-zinc-900/80 p-6 rounded-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <h3 className="text-xl font-bold text-emerald-400 mb-2 flex items-center space-x-2 relative z-10">
          <BookOpen className="w-5 h-5" />
          <span>The Async Archive</span>
        </h3>
        <p className="text-sm text-zinc-400 mb-6 relative z-10">
          Access the developer's logbook. Patch notes, field reports, and video dispatches from the road.
        </p>
        <button 
          onClick={() => onNavigate('chronicles')}
          className="relative z-10 block w-full py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded hover:bg-emerald-500/20 transition-colors text-center"
        >
          ACCESS LOGBOOKS
        </button>
      </div>
    </div>

    <div className="columns-1 lg:columns-2 gap-6">
      
      {/* Send a Raven */}
      <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center space-x-2">
          <Send className="w-5 h-5 text-emerald-400" />
          <span>Send a Raven</span>
        </h3>
        <div className="space-y-4">
          <input type="text" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-3 rounded text-sm focus:outline-none focus:border-emerald-500/50" placeholder="Your Name" />
          <input type="email" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-3 rounded text-sm focus:outline-none focus:border-emerald-500/50" placeholder="Your Email" />
          <textarea className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-3 rounded text-sm focus:outline-none focus:border-emerald-500/50 min-h-[100px] resize-y" placeholder="Your Missive..."></textarea>
          <button className="w-full py-3 bg-emerald-500 text-zinc-950 font-bold rounded hover:bg-emerald-400 transition-colors flex items-center justify-center space-x-2">
            <span>SEAL & SEND</span>
          </button>
        </div>
      </div>

      {/* Smith's Contact */}
      <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center space-x-2">
          <Mail className="w-5 h-5 text-indigo-400" />
          <span>Smith's Contact</span>
        </h3>
        <p className="text-sm text-zinc-400 mb-6">Prefer to reach me directly? Use the Send a Raven form above, or find me on Discord.</p>
        
        <hr className="border-t border-dashed border-zinc-700 my-6" />
        
        <p className="text-sm text-zinc-500 italic mb-4">If you find value in these tools, please consider leaving a donation. Every bit helps me keep the lights on in the Forge while I'm out on the next shift.</p>
        
        <a href="https://www.buymeacoffee.com/kayrugold" target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-[#FFDD00] text-black border-2 border-black font-bold rounded shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all text-center flex items-center justify-center space-x-2">
          <Coffee className="w-5 h-5" />
          <span>BUY ME A COFFEE</span>
        </a>
      </div>

      {/* Merchant's License */}
      <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-zinc-400" />
          <span>Merchant's License</span>
        </h3>
        <p className="text-sm text-zinc-400 mb-4">Authorized to trade and operate within the realm of California.</p>
        <div className="bg-zinc-950 p-2 rounded border border-zinc-800 flex items-center justify-center min-h-[200px] overflow-hidden group">
          <img 
            src="/assets/sellers_permit.webp" 
            alt="California Seller's Permit" 
            className="w-full h-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* About Andy's Dev Studio */}
      <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center space-x-2">
          <Wrench className="w-5 h-5 text-zinc-400" />
          <span>About Andy's Dev Studio</span>
        </h3>
        <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
          <p>Welcome to The Forge. My name is Andy. By day, I am a professional truck driver; by night, I am a developer and a dedicated father.</p>
          <p>My "development studio" is rarely a desk. It is often the cab of my truck or a bedside table after the kids have drifted off to sleep. Most of the logic you see here was written directly on my phone in those quiet hours, tapping out code one line at a time.</p>
          <p>When I can secure a few hours at my laptop, I forge these web prototypes into full Android applications. If you are part of the testing guild, I can provide you with direct Play Store links or secure download keys to try the native versions.</p>
        </div>

        <hr className="border-t border-dashed border-zinc-700 my-6" />

        <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-amber-400" />
          <span>The Creator's Note</span>
        </h3>
        <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
          <p><strong className="text-zinc-300">The Logic:</strong> The mathematical architectures and system designs are born from my own research, often sketched out on napkins at rest stops.</p>
          <p><strong className="text-zinc-300">The Method:</strong> To bridge the gap between concept and reality while on the road, I utilize modern tools and AI as a "digital co-pilot." This allows me to focus purely on the complex math and logic without getting bogged down by the syntax.</p>
          <p><strong className="text-zinc-300">The Goal:</strong> I build these tools for the sheer love of number theory and system design.</p>
        </div>
      </div>

      {/* The Legal Scrolls */}
      <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-zinc-100 mb-6 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-zinc-400" />
          <span>The Legal Scrolls</span>
        </h3>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-md font-bold text-zinc-200 mb-1 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Privacy Policy</span>
            </h4>
            <p className="text-xs text-zinc-500 italic mb-4">Effective Date: Oct 24, 2023</p>
            <p className="text-sm text-zinc-400 mb-4">I, Andy Davis, operate Andy's Dev Studio as a personal portfolio. I respect your privacy because I have no interest in your data.</p>
            <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
              <li><strong className="text-zinc-300">Data Collection:</strong> This site does not use cookies for tracking or analytics. Any saved data (like Tester progress) stays on your device via <code className="bg-zinc-950 px-1 py-0.5 rounded text-emerald-300">localStorage</code>.</li>
              <li><strong className="text-zinc-300">Communications:</strong> If you contact me, I will see your info. I will never sell it or share it.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-bold text-zinc-200 mb-1 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>End User License Agreement (EULA)</span>
            </h4>
            <p className="text-sm text-zinc-400 mb-4 mt-6">By downloading software from Andy's Dev Studio, you agree:</p>
            <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
              <li><strong className="text-zinc-300">License:</strong> You are granted a non-exclusive license to use the software. You own the files you download.</li>
              <li><strong className="text-zinc-300">Warranty:</strong> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. I am a solo dev, not a QA department. Bugs may exist.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Shipping Policy */}
      <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-zinc-100 mb-1 flex items-center space-x-2">
          <Truck className="w-5 h-5 text-zinc-400" />
          <span>Shipping Policy</span>
        </h3>
        <p className="text-xs text-zinc-500 italic mb-4">Fulfilled by Printify</p>
        <p className="text-sm text-zinc-400 mb-4">All physical goods (apparel, mugs, etc.) are made to order and shipped directly from our print partners.</p>
        
        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
          <li><strong className="text-zinc-300">Production Time:</strong> Please allow 2-5 business days for your item to be created.</li>
          <li><strong className="text-zinc-300">Shipping:</strong> Standard shipping typically takes 2-5 business days within the US. International times vary.</li>
          <li><strong className="text-zinc-300">Rates:</strong> Accurate shipping costs are calculated at checkout based on your delivery address.</li>
        </ul>
      </div>

      {/* Return Policy: Physical Goods */}
      <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg" id="return-policy-physical">
        <h3 className="text-lg font-bold text-zinc-100 mb-1 flex items-center space-x-2">
          <Package className="w-5 h-5 text-amber-400" />
          <span>Return Policy: Physical Goods</span>
        </h3>
        <p className="text-xs text-zinc-500 italic mb-4">Effective Date: Feb 22, 2026</p>
        <p className="text-sm text-zinc-400 mb-6">I stand behind everything that ships from the Forge. If something you purchased does not work as described, I will make it right.</p>

        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
          <li><strong className="text-zinc-300">Eligibility:</strong> Items may be returned within <strong className="text-zinc-300">30 days</strong> of delivery, provided they are unused and in their original condition.</li>
          <li><strong className="text-zinc-300">Process:</strong> Send a Raven using the contact form above with your order number and the reason for the return. I will dispatch return instructions within 3 business days.</li>
          <li><strong className="text-zinc-300">Defective Items:</strong> If your item arrived damaged or defective, I will cover return shipping and issue a full replacement or refund — no argument.</li>
          <li><strong className="text-zinc-300">Non-Returnable:</strong> Custom or made-to-order items cannot be returned unless they arrive defective.</li>
        </ul>
      </div>

      {/* Return Policy: Digital Goods */}
      <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg" id="return-policy-digital">
        <h3 className="text-lg font-bold text-zinc-100 mb-1 flex items-center space-x-2">
          <Download className="w-5 h-5 text-emerald-400" />
          <span>Return Policy: Digital Goods</span>
        </h3>
        <p className="text-xs text-zinc-500 italic mb-4">Effective Date: Feb 22, 2026</p>
        
        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
          <li><strong className="text-zinc-300">General Policy:</strong> Due to the nature of digital downloads, all sales are final once a file has been accessed or downloaded.</li>
          <li><strong className="text-zinc-300">Exceptions:</strong> If a digital product is non-functional, corrupted, or materially different from its description, contact me within <strong className="text-zinc-300">14 days</strong> of purchase for a full refund.</li>
          <li><strong className="text-zinc-300">Apps (Google Play):</strong> Refund requests for Android applications are governed by Google Play's standard refund policy. For issues beyond their window, send a raven and I will review it case by case.</li>
        </ul>

        <hr className="border-t border-dashed border-zinc-700 my-6" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-sm text-zinc-500 italic max-w-2xl">I am one person running this operation between shifts. I cannot promise instant replies, but I can promise I will read every message and respond fairly.</p>
        </div>
      </div>

    </div>
  </TerminalSection>
);

const TheRookeryContent = () => {
  const [copied, setCopied] = useState(false);
  const [beaconMessage, setBeaconMessage] = useState('Fetching latest transmission...');
  const [isRefreshing, setIsRefreshing] = useState(false);
  


  const fetchBeaconMessage = async () => {
    setIsRefreshing(true);
    try {
      // Fetch CSV export of the Google Sheet
      const response = await fetch('https://docs.google.com/spreadsheets/d/18fv0W3ePvgzqyZ4RBcrqE7NUZZw-gf7_K-qat0kHDgs/export?format=csv&gid=0');
      const text = await response.text();
      
      // Parse CSV (assuming message is in cell A1, so it's the first item)
      // CSV format: "Cell A1","Cell B1",...
      // We just want the first cell of the first line
      const firstLine = text.split('\n')[0];
      // Handle quotes if present
      let message = firstLine.split(',')[0];
      if (message.startsWith('"') && message.endsWith('"')) {
        message = message.substring(1, message.length - 1);
      }
      
      // Decode double quotes if CSV escaped them ("" -> ")
      message = message.replace(/""/g, '"');
      
      if (message) {
        setBeaconMessage(message);
      }
    } catch (error) {
      console.error('Failed to fetch beacon:', error);
      setBeaconMessage('Signal lost. Retrying...');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBeaconMessage();
    // Poll every 60 seconds
    const interval = setInterval(fetchBeaconMessage, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('8923749823749823749238749283749823749');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TerminalSection title="The Rookery" subtitle="The 14-Day Watch. We clear the gate together.">
      {/* Dispatch Beacon */}
      <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg mb-8">
        <div className="flex items-center space-x-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-bold text-emerald-400">BEACON ACTIVE: <span className="text-zinc-400 font-normal">{beaconMessage}</span></span>
        </div>
        <button 
          onClick={fetchBeaconMessage} 
          className={`text-emerald-500 hover:text-emerald-400 transition-colors ${isRefreshing ? 'animate-spin' : ''}`} 
          title="Refresh Transmission"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="columns-1 lg:columns-2 gap-6">
        {/* Testing Directives */}
        <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
          <h3 className="text-xl font-bold text-zinc-100 mb-4">Testing Directives</h3>
          <ol className="space-y-4 text-sm text-zinc-400 list-decimal list-inside">
            <li><strong className="text-zinc-200">Step 1: Get Clearance.</strong> Join the Discord Guild Hall using the button below.</li>
            <li><strong className="text-zinc-200">Step 2: Bypass the Airlock.</strong> Answer the Discord onboarding question to prove you are human. This grants you the <em className="text-emerald-400 not-italic">Elite Raven</em> security badge.</li>
            <li><strong className="text-zinc-200">Step 3: Enter the Vault.</strong> With your new badge, the hidden <code className="bg-zinc-950 px-1 py-0.5 rounded text-emerald-300">#the-watch-roster</code> channel will appear in Discord. Go there to grab the secure Google Play testing links.</li>
            <li><strong className="text-zinc-200">Step 4: The 14-Day Watch.</strong> Open Factor Hunter every single day. Tap the Ledger below to mark your streak, and use the Bellows to dispatch bug reports.</li>
          </ol>
          <div className="mt-8 text-center">
            <a href="https://discord.gg/2RtH68T9fn" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-zinc-100 text-zinc-950 font-bold rounded hover:bg-white transition-colors">
              Enter the Guild Hall
            </a>
          </div>
          <div className="mt-6 text-right text-emerald-500 font-bold">- Andy</div>
        </div>



        {/* The Bounty Board */}
        <div className="break-inside-avoid mb-6 border border-red-500/30 bg-zinc-900/80 p-6 rounded-lg relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2 flex items-center space-x-2">
            <Target className="w-5 h-5 text-red-400" />
            <span>The Bounty Board</span>
          </h3>
          <p className="text-sm text-zinc-400 mb-4">High priority targets for <strong className="text-zinc-200">Factor Hunter</strong>. Report findings in the Guild Hall.</p>
          
          <div className="space-y-4">
            <div className="bg-zinc-950 border border-red-900/50 rounded p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1">
                <div className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">CRITICAL PRIORITY</span>
                <span className="text-xs text-amber-400">Reward: Forge Master Role</span>
              </div>
              <h4 className="text-zinc-200 font-bold mb-2">The BigInt Overflow</h4>
              <div className="text-sm text-zinc-400 space-y-1">
                <p><strong className="text-zinc-300">Target:</strong> Factor Hunter v2.1.0</p>
                <p><strong className="text-zinc-300">Mission:</strong> Input a 50+ digit number. If the app crashes or hangs for &gt;5s, report the exact number and device model.</p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded">UX BOUNTY</span>
                <span className="text-xs text-zinc-500">Reward: Beta Tester Role</span>
              </div>
              <h4 className="text-zinc-200 font-bold mb-2">The "Back" Button Loop</h4>
              <div className="text-sm text-zinc-400 space-y-1">
                <p><strong className="text-zinc-300">Target:</strong> Navigation Stack</p>
                <p><strong className="text-zinc-300">Mission:</strong> Navigate deep into the Factor Tree, then spam the back button. Does it exit the app or loop infinitely?</p>
              </div>
            </div>
          </div>
        </div>

        {/* The Daily Composite */}
        <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-zinc-100 mb-2 flex items-center space-x-2">
            <Hash className="w-5 h-5 text-emerald-400" />
            <span>The Daily Composite</span>
          </h3>
          <p className="text-sm text-zinc-400 mb-4">Today's target for the Factor Hunter. Can you break it?</p>
          
          <button 
            onClick={handleCopy}
            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded text-emerald-400 font-bold text-lg md:text-xl break-all hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all relative group"
            title="Tap to copy"
          >
            8923749823749823749238749283749823749
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/90 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="flex items-center space-x-2">
                {copied ? <span className="text-emerald-400">Copied!</span> : <><Copy className="w-5 h-5" /> <span>Copy to Clipboard</span></>}
              </span>
            </div>
          </button>
          <p className="text-xs text-zinc-500 text-center mt-4">
            Report factors in the <a href="https://discord.gg/WHhnBXpDSW" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline font-bold">Guild Hall</a>.
          </p>
        </div>

        {/* The Anvil: Active Alloys */}
        <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-zinc-100 mb-2 flex items-center space-x-2">
            <Swords className="w-5 h-5 text-zinc-400" />
            <span>The Anvil: Active Alloys</span>
          </h3>
          <p className="text-sm text-zinc-400 mb-4">Select a prototype below to begin stress testing.</p>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-950 border border-zinc-800 p-4 rounded gap-4">
              <div>
                <div className="font-bold text-zinc-200">Factor Hunter v2.1.0</div>
                <div className="text-xs text-zinc-500">BigInt Engine Stress & App Test</div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => window.launchApp('./apps/factorhunter0.0.0.html')}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs font-bold rounded hover:bg-zinc-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>WEB</span>
                </button>
                <button 
                  onClick={() => {
                    if(window.confirm('SYSTEM CHECK: Have you received clearance from the Discord Guild Hall first? If not, Google Play will reject this link. Proceed?')) {
                      window.open('https://play.google.com/store/apps/details?id=com.andysdevstudio.factorhunter&pli=1', '_blank');
                    }
                  }}
                  className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded hover:bg-emerald-500/20 transition-colors flex items-center justify-center space-x-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>ANDROID</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* The 14-Day Watch */}
        <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-zinc-100 mb-2 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>The 14-Day Watch</span>
          </h3>
          <p className="text-sm text-zinc-400 mb-4">Google requires 20 testers for 14 continuous days. Tap a day to mark your attendance.</p>
          
          <div className="grid grid-cols-7 gap-2 mb-6">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="aspect-square bg-zinc-950 border border-zinc-800 rounded flex items-center justify-center text-xs text-zinc-600 hover:border-emerald-500/50 hover:text-emerald-400 cursor-pointer transition-colors">
                {i + 1}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-amber-400 text-amber-950 text-xs font-bold rounded">ACTIVE TESTER</span>
          </div>
        </div>

        {/* QA Arsenal */}
        <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-zinc-100 mb-2 flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-zinc-400" />
            <span>QA Arsenal</span>
          </h3>
          <p className="text-sm text-zinc-400 mb-4">Tester utilities for deep-diving the lattice.</p>
          
          <div className="space-y-3">
            <button className="w-full py-3 bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm font-bold rounded hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-2">
              <Smartphone className="w-4 h-4" />
              <span>TOGGLE MOBILE VIEWPORT</span>
            </button>
            <button className="w-full py-3 bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm font-bold rounded hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>SNAG SYSTEM SPECS</span>
            </button>
          </div>
        </div>

        {/* Dispatch Bug Report */}
        <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-zinc-100 mb-2 flex items-center space-x-2">
            <Bug className="w-5 h-5 text-emerald-400" />
            <span>Dispatch Bug Report</span>
          </h3>
          <p className="text-sm text-zinc-400 mb-4">Found a glitch in the matrix? Let me know exactly where it broke.</p>
          
          <div className="space-y-4">
            <select className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-3 rounded text-sm focus:outline-none focus:border-emerald-500/50">
              <option value="email">📬 Send to Andy via Email</option>
              <option value="discord">💬 Send to Discord Guild</option>
            </select>
            
            <select className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-3 rounded text-sm focus:outline-none focus:border-emerald-500/50" defaultValue="">
              <option value="" disabled>Select Project...</option>
              <option value="Gnomon Navigator">Gnomon Navigator</option>
              <option value="Factor Hunter">Factor Hunter</option>
              <option value="Website/PWA">The Website / PWA</option>
            </select>

            <select className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-3 rounded text-sm focus:outline-none focus:border-emerald-500/50">
              <option value="Bug">🐛 Bug / Crash</option>
              <option value="UI">🎨 Visual / UI Issue</option>
              <option value="Idea">💡 Feature Idea</option>
            </select>

            <textarea 
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-3 rounded text-sm focus:outline-none focus:border-emerald-500/50 min-h-[100px] resize-y" 
              placeholder="Describe what happened..."
            ></textarea>
            
            <button className="w-full py-3 bg-emerald-500 text-zinc-950 font-bold rounded hover:bg-emerald-400 transition-colors flex items-center justify-center space-x-2">
              <span>🚀 LAUNCH REPORT</span>
            </button>
          </div>
        </div>

        {/* The Guild Hall */}
        <div className="border-l-4 border-indigo-500 bg-zinc-900/80 p-6 rounded-r-lg lg:col-span-2">
          <h3 className="text-lg font-bold text-zinc-100 mb-2 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <span>The Guild Hall</span>
          </h3>
          <p className="text-sm text-zinc-400 mb-4">Join our Discord server to chat with other testers, see upcoming features, and get instant support.</p>
          <a href="https://discord.gg/WHhnBXpDSW" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold rounded hover:bg-indigo-500/20 transition-colors">
            OPEN COMMS (DISCORD)
          </a>
        </div>

      </div>
    </TerminalSection>
  );
};

export default function App() {
  const [bootSequence, setBootSequence] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('field-desk');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [launchedAppUrl, setLaunchedAppUrl] = useState<string | null>(null);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isSfxOn, setIsSfxOn] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof searchIndexData>([]);

  const scrollToContent = () => {
    if (window.innerWidth < 1024 && mainRef.current) {
      const yOffset = -20; 
      const y = mainRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = searchIndexData.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );
    setSearchResults(results);
  }, [searchQuery]);

  const handleSearchClick = (item: typeof searchIndexData[0]) => {
    setSearchQuery('');
    setSearchResults([]);
    
    if (item.url.includes('window.open')) {
      const match = item.url.match(/'([^']+)'/);
      if (match && match[1]) {
        window.open(match[1], '_blank');
        return;
      }
    } else if (item.url.includes('launchApp')) {
      const match = item.url.match(/'([^']+)'/);
      if (match && match[1]) {
        handleLaunchApp(match[1]);
      }
      return;
    }
    
    window.location.hash = item.id;
  };

  const handleLaunchApp = (url: string) => {
    // Use relative URLs directly, allowing them to work on any host (Cloudflare, localhost, etc.)
    // The 'apps' folder must be present in the 'public' directory for this to work.
    let finalUrl = url;
    if (url.startsWith('./')) {
      finalUrl = url.substring(2); // Remove './' to make it relative to root, e.g., 'apps/factorhunter...'
    }
    setLaunchedAppUrl(finalUrl);
  };

  useEffect(() => {
    (window as any).launchApp = handleLaunchApp;
    return () => {
      delete (window as any).launchApp;
    };
  }, []);

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => setProgress(p => Math.min(p + Math.random() * 15, 100)), 100);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setBootSequence(false), 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;

      const validTabs = ['field-desk', 'forge', 'ledger', 'cargo-bay', 'chronicles', 'guild-hall', 'rookery'];
      
      setIsTransitioning(true);
      setTimeout(() => {
        if (validTabs.includes(hash)) {
          setActiveTab(hash);
          setActiveProject(null);
        } else if (projectsData[hash]) {
          setActiveProject(hash);
        } else if (chroniclesData.some(e => e.id === hash)) {
          setActiveTab('chronicles');
          setActiveProject(null);
          // Wait for render then scroll to element
          setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) {
              const yOffset = -20;
              const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }, 100);
          setIsTransitioning(false);
          return;
        }
        setIsTransitioning(false);
        scrollToContent();
      }, 400);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['field-desk', 'forge', 'ledger', 'cargo-bay', 'chronicles', 'guild-hall', 'rookery'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      } else if (projectsData[hash]) {
        setActiveProject(hash);
      } else if (chroniclesData.some(e => e.id === hash)) {
        setActiveTab('chronicles');
        // Scroll handled by useEffect if needed, or just let it be for initial load
      }
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    if (isSfxOn) audio.playClick();
    if (tab === activeTab && !activeProject) {
      scrollToContent();
      return;
    }
    window.location.hash = tab;
  };

  const handleOpenProject = (projectId: string) => {
    if (isSfxOn) audio.playClick();
    window.location.hash = projectId;
  };

  const toggleFullscreen = () => {
    if (isSfxOn) audio.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleMusic = () => {
    const newState = !isMusicOn;
    setIsMusicOn(newState);
    audio.toggleMusic(newState);
    if (isSfxOn) audio.playClick();
  };

  const toggleSfx = () => {
    const newState = !isSfxOn;
    setIsSfxOn(newState);
    if (newState) audio.playClick();
  };

  const renderContent = () => {
    if (isTransitioning) {
      return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-emerald-500 font-mono">
          <Terminal className="w-8 h-8 animate-pulse" />
          <div className="text-sm tracking-widest animate-pulse">[ ACCESSING DIRECTORY... ]</div>
        </div>
      );
    }

    if (activeProject) {
      const projectHtml = projectsData[activeProject] || `<div class="text-zinc-400">Project data not found for: ${activeProject}</div>`;
      return (
        <div className="animate-in fade-in duration-500">
          <button 
            onClick={() => handleTabChange(activeTab)}
            className="mb-8 flex items-center space-x-2 text-zinc-500 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Back to {activeTab.replace('-', ' ')}</span>
          </button>
          
          <div 
            className="prose prose-invert prose-zinc max-w-none prose-a:text-emerald-400 hover:prose-a:text-emerald-300"
            dangerouslySetInnerHTML={{ __html: projectHtml }}
          />
        </div>
      );
    }

    switch (activeTab) {
      case 'field-desk': return <FieldDeskContent onNavigate={handleTabChange} />;
      case 'forge': return <TheForgeContent onOpenProject={handleOpenProject} onLaunchApp={handleLaunchApp} />;
      case 'ledger': return <TheLedgerContent />;
      case 'cargo-bay': return <TheCargoBayContent />;
      case 'chronicles': return <TheChroniclesContent />;
      case 'guild-hall': return <TheGuildHallContent onNavigate={handleTabChange} />;
      case 'rookery': return <TheRookeryContent />;
      default: return <FieldDeskContent onNavigate={handleTabChange} />;
    }
  };

  if (bootSequence) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 font-mono">
        <div className="w-full max-w-md space-y-4">
          <div className="text-emerald-500 text-sm mb-2">## SYSTEM UPDATE</div>
          <div className="text-zinc-400 text-xs">Downloading New Assets...</div>
          <div className="flex items-center space-x-4">
            <div className="text-emerald-400">[{progress < 100 ? 'v---' : ' OK '}]</div>
            <div className="flex-1 h-1 bg-zinc-900 rounded overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-zinc-500 text-xs w-12 text-right">{Math.floor(progress)}%</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-mono relative selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="crt-overlay" />
      
      {/* App Launch Overlay */}
      {launchedAppUrl && (
        <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col animate-in fade-in duration-300">
          <div className="h-12 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4">
            <div className="flex items-center space-x-2 text-emerald-500 font-bold text-sm">
              <Terminal className="w-4 h-4" />
              <span>APP_RUNNING</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.open(launchedAppUrl, '_blank')}
                className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center space-x-1 text-xs font-bold"
              >
                <ExternalLink className="w-3 h-3" />
                <span>OPEN IN NEW TAB</span>
              </button>
              <button 
                onClick={() => setLaunchedAppUrl(null)}
                className="text-zinc-400 hover:text-red-400 transition-colors text-sm font-bold tracking-wider"
              >
                [ CLOSE ]
              </button>
            </div>
          </div>
          <iframe 
            src={launchedAppUrl} 
            className="w-full flex-1 border-none bg-zinc-950"
            title="Launched App"
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Sidebar / Navigation */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-emerald-400 terminal-glow">Andy's Dev Studio</h1>
            <div className="text-xs text-zinc-500 space-y-1">
              <div>Version: ---</div>
              <div className="flex items-center space-x-2">
                <span>System:</span>
                <span className="text-emerald-500 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-400 italic mt-4">"Forged in code, tested on the road."</p>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search archives..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
            
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="p-2 space-y-1">
                    {searchResults.slice(0, 5).map(item => (
                      <button 
                        key={item.id}
                        onClick={() => handleSearchClick(item)}
                        className="w-full text-left p-3 hover:bg-zinc-800 rounded transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">{item.title}</span>
                          <span className="text-[10px] uppercase tracking-wider text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">{item.category}</span>
                        </div>
                        <p className="text-xs text-zinc-500 line-clamp-2">{item.description}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-sm text-red-400 font-bold">
                    {"> NO MATCHES FOUND"}
                  </div>
                )}
              </div>
            )}
          </div>

          <nav className="space-y-2">
            <NavItem icon={Terminal} label="The Field Desk" onClick={() => handleTabChange('field-desk')} active={activeTab === 'field-desk'} />
            <NavItem icon={Code2} label="The Forge" onClick={() => handleTabChange('forge')} active={activeTab === 'forge'} />
            <NavItem icon={Download} label="The Ledger" onClick={() => handleTabChange('ledger')} active={activeTab === 'ledger'} />
            <NavItem icon={Package} label="The Cargo Bay" onClick={() => handleTabChange('cargo-bay')} active={activeTab === 'cargo-bay'} />
            <NavItem icon={BookOpen} label="The Chronicles" onClick={() => handleTabChange('chronicles')} active={activeTab === 'chronicles'} />
            <NavItem icon={Shield} label="The Guild Hall" onClick={() => handleTabChange('guild-hall')} active={activeTab === 'guild-hall'} />
            <NavItem icon={Users} label="The Rookery" onClick={() => handleTabChange('rookery')} active={activeTab === 'rookery'} />
          </nav>

          <div className="pt-8 border-t border-zinc-800/50">
            <div className="text-xs text-zinc-500 mb-4 uppercase tracking-wider">Comms</div>
            <div className="grid grid-cols-2 gap-4">
              <SocialLink icon={Github} label="GitHub" href="https://github.com/kayrugold" />
              <SocialLink icon={MessageSquare} label="Discord" href="https://discord.gg/2RtH68T9fn" />
              <SocialLink icon={Smartphone} label="Xbox" href="https://www.xbox.com/en-US/play/user/Kayrugold7036" />
              <SocialLink icon={Facebook} label="Facebook" href="https://facebook.com/andysdevstudio/" />
              <SocialLink icon={Instagram} label="Insta" href="https://instagram.com/andysdevstudio" />
              <SocialLink icon={Twitter} label="X.com" href="https://x.com/@andysdevstudio" />
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-zinc-800/50">
              <button 
                onClick={toggleFullscreen}
                className={`p-2 rounded border transition-all flex items-center justify-center ${isFullscreen ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/30'}`}
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={toggleMusic}
                className={`p-2 rounded border transition-all flex items-center justify-center ${isMusicOn ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/30'}`}
                title="Toggle Music"
              >
                {isMusicOn ? <Music2 className="w-4 h-4 animate-pulse" /> : <Music className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={toggleSfx}
                className={`p-2 rounded border transition-all flex items-center justify-center ${isSfxOn ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/30'}`}
                title="Toggle SFX"
              >
                {isSfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              
              <a 
                href="https://www.buymeacoffee.com/kayrugold" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded border bg-[#FFDD00]/10 border-[#FFDD00]/30 text-[#FFDD00] hover:bg-[#FFDD00]/20 transition-all flex items-center justify-center"
                title="Buy Me A Coffee"
              >
                <Coffee className="w-4 h-4" />
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main ref={mainRef} className="lg:col-span-9 scroll-mt-8">
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50 bg-zinc-950/80 py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 font-mono">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span>&copy; {new Date().getFullYear()} Andy's Dev Studio. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              System Online
            </span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Forged in code, tested on the road.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
