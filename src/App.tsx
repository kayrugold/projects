import { ContextDiscussion } from './components/Community';
import { ProductDemo } from './components/ProductDemo';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Menu, X, Monitor } from 'lucide-react';
import { StudioHome, ForgeGallery, FeedbackWorkshop, ProjectOverview, projectForPage } from './components/StudioPages';
import './studio.css';
import { Terminal, Code2, BookOpen, Package, Download, Users, Shield, Github, MessageSquare, Facebook, Instagram, Youtube, RefreshCw, Radio, Target, Hash, Swords, Globe, Smartphone, ExternalLink, Calendar, Wrench, Activity, Bug, Copy, Send, Coffee, FileText, ShieldCheck, RefreshCcw, Image, Mail, ArrowLeft, Search, Truck, Maximize, Minimize, Volume2, VolumeX, Music, Music2, SkipForward, SkipBack, Play, Pause, Sparkles, GitCommit, Check, CheckCircle2 } from 'lucide-react';
import { chroniclesData } from './data/chronicles';
import { cargoData } from './data/cargo';
import { projectsData } from './data/projects';
import { forgeData } from './data/forge';
import { ledgerData } from './data/ledger';
import { searchIndexData } from './data/searchIndex';
import { CURRENT_STUDIO_VERSION } from './data/versions';
import { audio } from './utils/audio';
import { TheVersionContent } from './components/TheVersionContent';
import { TerminalPrompt } from './components/TerminalPrompt';
import { SmileyOverlay } from './components/SmileyOverlay';

const STUDIO_VERSION = CURRENT_STUDIO_VERSION;

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
    <span className="font-medium tracking-wide">{label}<span className="studio-nav-subtitle">{({'The Field Desk': 'Start here', 'The Forge': 'Tools & experiments', 'The Ledger': 'Software & releases', 'The Cargo Bay': 'Studio merchandise', 'The Chronicles': 'Development journal', 'The Guild Hall': 'About, contact & policies', 'The Rookery': 'Feedback workshop', 'The Manifest': 'Website changelog'} as Record<string, string>)[label]}</span></span>
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

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
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

const TerminalSection = ({ title, subtitle, children }: { title: string, subtitle?: string, children: React.ReactNode }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <SectionHeader title={title} subtitle={subtitle} />
    {children}
  </div>
);

const TheLedgerContent = ({ onOpenProject }: { onOpenProject?: (id: string) => void }) => (
  <TerminalSection title="The Ledger" subtitle="Independent tools, thoughtful utilities, and the next studio release.">
    <div className="space-y-6">
      {ledgerData.map((item) => (
        <article key={item.id} className="drafting-card">
          <div className="drafting-card-art">
            <img src={item.image} alt="Infinite Drafting promotional artwork with an architectural sketch on graph paper" width="2048" height="2048" />
            <span>MADE FOR PEOPLE WHO MAKE THINGS</span>
          </div>
          <div className="drafting-card-copy drafting-grid">
            <div className="drafting-eyebrow">FEATURED STUDIO TOOL</div>
            <h3>{item.title}</h3>
            <p className="drafting-card-tagline">Your ideas don't end<br />at the edge of a page.</p>
            <p className="drafting-card-description">{item.description}</p>
            <ul className="drafting-card-features">{item.features?.map(feature => <li key={feature}>{feature}</li>)}</ul>
            <div className="drafting-card-pricing"><span><strong>{item.price}</strong> on Android</span><span>Free on itch.io · donations welcome</span></div>
            <div className="drafting-card-actions">
              <span className="drafting-status"><span></span>{item.releaseStatus || 'Available now'}</span>
              {item.projectPage && <button className="drafting-button" onClick={() => onOpenProject?.(item.projectPage!)}>Explore Infinite Drafting <ArrowRight size={16} aria-hidden="true" /></button>}
              {item.url && <a className="drafting-button" href={item.url} target="_blank" rel="noopener noreferrer">Get on {item.platform}</a>}
            </div>
          </div>
        </article>
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
              <ContextDiscussion scope={`article:${entry.id}`} title={entry.title} />
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

const TheGuildHallContent = ({ onNavigate }: { onNavigate: (tab: string) => void }) => {
  useEffect(() => {
    const handleDeepLink = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      let targetId = hash;
      if (hash === 'privacy') targetId = 'privacy-policy';
      if (hash === 'terms') targetId = 'eula';
      if (hash === 'shipping') targetId = 'shipping-policy';
      if (hash === 'return-policy' || hash === 'returns') targetId = 'return-policy-physical';
      const el = document.getElementById(targetId);
      if (el) {
        const yOffset = -100;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    handleDeepLink();
    const t1 = setTimeout(handleDeepLink, 100);
    const t2 = setTimeout(handleDeepLink, 300);
    window.addEventListener('hashchange', handleDeepLink);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('hashchange', handleDeepLink);
    };
  }, []);

  return (
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
          Join a new community for studio updates, project discussions, and sharing what you are working on.
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
        <p className="text-sm text-zinc-400 mb-6">Prefer to reach me directly? Use the Send a Raven form above, email me at <a href="mailto:andys.dev.studio@gmail.com" className="text-emerald-400 underline">andys.dev.studio@gmail.com</a>, or find me on Discord.</p>
        
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
      <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg" id="legal-scrolls">
        <h3 className="text-lg font-bold text-zinc-100 mb-6 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-zinc-400" />
          <span>The Legal Scrolls</span>
        </h3>
        
        <div className="space-y-8">
          <div id="privacy-policy" className="scroll-mt-24">
            <h4 className="text-md font-bold text-zinc-200 mb-1 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Privacy Policy</span>
            </h4>
            <p className="text-xs text-zinc-500 italic mb-4">Effective Date: Oct 24, 2023 (Updated: Feb 2026)</p>
            <p className="text-sm text-zinc-400 mb-4">I, Andy Davis, operate Andy's Dev Studio as a personal portfolio. I respect your privacy because I have no interest in your data. Applies to Infinite Drafting, Factor Hunter, and all studio software.</p>
            <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
              <li><strong className="text-zinc-300">Data Collection:</strong> This site does not use cookies for tracking or analytics. Any saved data (like Tester progress or drafting state) stays on your device via <code className="bg-zinc-950 px-1 py-0.5 rounded text-emerald-300">localStorage</code>.</li>
              <li><strong className="text-zinc-300">Communications:</strong> If you contact me at <a href="mailto:andys.dev.studio@gmail.com" className="text-emerald-400 underline">andys.dev.studio@gmail.com</a>, I will see your info. I will never sell it or share it.</li>
            </ul>
            <div className="mt-4 pt-3 border-t border-zinc-800">
              <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center space-x-1">
                <span>View Full Standalone Privacy Policy Page (Google Play Verified) &rarr;</span>
              </a>
            </div>
          </div>

          <div id="eula" className="scroll-mt-24">
            <h4 className="text-md font-bold text-zinc-200 mb-1 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>End User License Agreement (EULA)</span>
            </h4>
            <p className="text-sm text-zinc-400 mb-4 mt-6">By downloading software from Andy's Dev Studio, you agree:</p>
            <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
              <li><strong className="text-zinc-300">License:</strong> You are granted a non-exclusive license to use the software. You own the files you download.</li>
              <li><strong className="text-zinc-300">Warranty:</strong> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. I am a solo dev, not a QA department. Bugs may exist.</li>
            </ul>
            <div className="mt-4 pt-3 border-t border-zinc-800">
              <a href="/eula.html" target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center space-x-1">
                <span>View Full Standalone EULA & Terms Page &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Policy */}
      <div className="break-inside-avoid mb-6 border border-zinc-800 bg-zinc-900/80 p-6 rounded-lg" id="shipping-policy">
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
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <a href="/shipping-policy.html" target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center space-x-1">
            <span>View Full Standalone Shipping Policy Page &rarr;</span>
          </a>
        </div>
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
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <a href="/return-policy.html#physical" target="_blank" rel="noopener noreferrer" className="text-xs text-amber-400 hover:text-amber-300 font-bold underline flex items-center space-x-1">
            <span>View Full Standalone Return Policy (Physical Goods) &rarr;</span>
          </a>
        </div>
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
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <a href="/return-policy.html#digital" target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center space-x-1">
            <span>View Full Standalone Return Policy (Digital & Play Store) &rarr;</span>
          </a>
        </div>

        <hr className="border-t border-dashed border-zinc-700 my-6" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-sm text-zinc-500 italic max-w-2xl">I am one person running this operation between shifts. I cannot promise instant replies, but I can promise I will read every message and respond fairly.</p>
        </div>
      </div>

    </div>
  </TerminalSection>
  );
};

const MediaPlayer = ({ onClose, audioMode, setAudioMode, isMusicOn, toggleMusic }: { onClose: () => void, audioMode: string, setAudioMode: (mode: 'file' | 'procedural') => void, isMusicOn: boolean, toggleMusic: () => void }) => {
  const [currentTrack, setCurrentTrack] = useState(audio.getCurrentTrack());

  // Update track name periodically in case it changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrack(audio.getCurrentTrack());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    audio.nextTrack();
    setCurrentTrack(audio.getCurrentTrack());
  };

  const handlePrev = () => {
    audio.prevTrack();
    setCurrentTrack(audio.getCurrentTrack());
  };

  return (
    <div className="fixed top-4 right-4 w-72 bg-zinc-900 border border-zinc-700 rounded shadow-2xl z-50 font-mono text-xs overflow-hidden">
      <div className="bg-zinc-800 p-2 flex justify-between items-center border-b border-zinc-700 cursor-move">
        <span className="text-zinc-400 font-bold">MEDIA_PLAYER_V1.1</span>
        <button onClick={onClose} className="text-zinc-500 hover:text-red-400 font-bold px-2">X</button>
      </div>
      <div className="p-4 bg-black/50">
        <div className="text-emerald-400 mb-4 truncate text-sm flex items-center justify-between">
          <span className="truncate mr-2">
            {audioMode === 'file' ? `> Playing: ${currentTrack}` : '> Playing: Lo-Fi Cyber Chill'}
          </span>
        </div>
        
        <div className="flex justify-center items-center gap-4 mb-4">
          <button onClick={handlePrev} disabled={audioMode !== 'file'} className={`p-1 transition-colors ${audioMode === 'file' ? 'text-zinc-400 hover:text-emerald-400' : 'text-zinc-700 cursor-not-allowed'}`}>
            <SkipBack className="w-5 h-5" />
          </button>
          <button onClick={toggleMusic} className="text-zinc-400 hover:text-emerald-400 p-1 transition-colors">
            {isMusicOn ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <button onClick={handleNext} disabled={audioMode !== 'file'} className={`p-1 transition-colors ${audioMode === 'file' ? 'text-zinc-400 hover:text-emerald-400' : 'text-zinc-700 cursor-not-allowed'}`}>
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-2">
          <button 
            onClick={() => setAudioMode('file')} 
            className={`flex-1 py-2 border transition-colors ${audioMode === 'file' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}
          >
            PLAYLIST
          </button>
          <button 
            onClick={() => setAudioMode('procedural')} 
            className={`flex-1 py-2 border transition-colors ${audioMode === 'procedural' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}
          >
            PROCEDURAL
          </button>
        </div>
        <div className="text-zinc-600 text-[10px] mt-4">Use terminal to close: 'kill mp3player'</div>
      </div>
    </div>
  );
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(() => { try { return localStorage.getItem('studio-crt-effects') !== 'off'; } catch { return true; } });
  const toggleCrt = () => setCrtEnabled(value => { const next = !value; try { localStorage.setItem('studio-crt-effects', next ? 'on' : 'off'); } catch {} return next; });
  // Check if we are running inside an iframe as a fallback for a missing .html app
  let isIframeFallback = false;
  try {
    isIframeFallback = window !== window.top && window.location.pathname.endsWith('.html') && window.location.pathname !== '/index.html';
  } catch (e) {
    // Ignore cross-origin errors
  }

  if (isIframeFallback) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 font-mono text-zinc-300">
        <div className="text-red-500 text-xl font-bold mb-4">ERROR 404: APP NOT FOUND</div>
        <div className="text-zinc-400 text-sm mb-8 text-center max-w-md">
          The requested application file (<span className="text-emerald-400">{window.location.pathname}</span>) could not be found on the server.
        </div>
        <div className="text-zinc-500 text-xs">
          Please ensure the file has been uploaded to the correct directory in the public folder.
        </div>
      </div>
    );
  }

  const initialHash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
  const guildSubAnchors = ['privacy-policy', 'privacy', 'eula', 'terms', 'legal-scrolls', 'shipping-policy', 'shipping', 'return-policy-physical', 'return-policy-digital', 'return-policy', 'returns'];
  const hasDirectDeepLink = Boolean(initialHash && initialHash !== '');
  const [bootSequence, setBootSequence] = useState(!hasDirectDeepLink);
  const [progress, setProgress] = useState(hasDirectDeepLink ? 100 : 0);
  
  const isXyrtaniaGatewayHash = (hashStr: string) => {
    const clean = hashStr.replace(/^#/, '');
    return clean === 'xyrtania' || clean === 'xyrtania-gateway' || clean === 'gateway';
  };

  // Smart domain-level or query/hash-level routing to serve Xyrtania cinematic site automatically
  const isXyrtaniaDomain = typeof window !== 'undefined' && (
    window.location.hostname.includes('xyrtania') || 
    window.location.search.includes('site=xyrtania') || 
    isXyrtaniaGatewayHash(window.location.hash)
  );
  const [siteMode, setSiteMode] = useState<'studio' | 'xyrtania'>('studio');

  const getInitialTab = () => {
    if (initialHash === 'version' || initialHash === 'changelog' || initialHash === 'manifest' || initialHash === 'system-version') return 'version';
    if (guildSubAnchors.includes(initialHash)) return 'guild-hall';
    if (initialHash === 'emulator' || initialHash === 'the-forge') return 'forge';
    const validTabs = ['field-desk', 'forge', 'ledger', 'cargo-bay', 'chronicles', 'guild-hall', 'rookery', 'version'];
    if (validTabs.includes(initialHash)) return initialHash;
    if (chroniclesData.some(e => e.id === initialHash)) return 'chronicles';
    return 'field-desk';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [launchedAppUrl, setLaunchedAppUrl] = useState<string | null>(null);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isSfxOn, setIsSfxOn] = useState(false);
  const [showMediaPlayer, setShowMediaPlayer] = useState(false);
  const [audioMode, setAudioMode] = useState<'file' | 'procedural'>('file');
  const [showSmiley, setShowSmiley] = useState(false);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

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
    if (isSfxOn) {
      audio.playClick();
      audio.triggerInteraction();
    }
    if (new URL(url, window.location.href).hostname === 'xyrtania.andy-596.workers.dev') {
      window.location.assign(url);
      return;
    }
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
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Turn off any studio music when entering the Xyrtania cinematic site to prevent overlapping music
  useEffect(() => {
    if (siteMode === 'xyrtania') {
      if (isMusicOn) {
        setIsMusicOn(false);
        audio.toggleMusic(false);
      }
    }
  }, [siteMode, isMusicOn]);

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
      setMobileMenuOpen(false);
      const hash = window.location.hash.replace('#', '');
      
      if (isXyrtaniaGatewayHash(hash)) {
        setSiteMode('studio'); setActiveTab('forge'); setActiveProject('xyrtania-specs'); window.history.replaceState(null, '', '#xyrtania-specs');
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      } else {
        setSiteMode('studio');
      }

      if (!hash) return;

      const validTabs = ['field-desk', 'forge', 'ledger', 'cargo-bay', 'chronicles', 'guild-hall', 'rookery', 'version'];
      const guildSubAnchors = ['privacy-policy', 'privacy', 'eula', 'terms', 'legal-scrolls', 'shipping-policy', 'shipping', 'return-policy-physical', 'return-policy-digital', 'return-policy', 'returns'];
      
      // Direct app launcher via deep link: #launch=app-id or #play=app-id
      if (hash.startsWith('launch=') || hash.startsWith('play=') || hash.startsWith('emulator=')) {
        const appId = hash.split('=')[1];
        const forgeItem = forgeData.find(f => f.id === appId || f.id.replace(/-/g, '') === appId.replace(/-/g, ''));
        if (forgeItem && forgeItem.action.includes('launchApp')) {
          const match = forgeItem.action.match(/'([^']+)'/);
          if (match && match[1]) {
            setActiveTab('forge');
            setActiveProject(null);
            handleLaunchApp(match[1]);
            return;
          }
        }
      }

      setIsTransitioning(true);
      setTimeout(() => {
        if (hash === 'emulator' || hash === 'the-forge') {
          setActiveTab('forge');
          setActiveProject(null);
        } else if (hash === 'version' || hash === 'changelog' || hash === 'manifest' || hash === 'system-version') {
          setActiveTab('version');
          setActiveProject(null);
        } else if (validTabs.includes(hash)) {
          setActiveTab(hash);
          setActiveProject(null);
        } else if (guildSubAnchors.includes(hash)) {
          setActiveTab('guild-hall');
          setActiveProject(null);
          setTimeout(() => {
            let targetId = hash;
            if (hash === 'privacy') targetId = 'privacy-policy';
            if (hash === 'terms') targetId = 'eula';
            if (hash === 'shipping') targetId = 'shipping-policy';
            if (hash === 'return-policy' || hash === 'returns') targetId = 'return-policy-physical';
            const el = document.getElementById(targetId);
            if (el) {
              const yOffset = -100;
              const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }, 100);
          setIsTransitioning(false);
          return;
        } else if (projectsData[hash] || projectForPage(hash)) {
          setActiveTab(hash === 'infinite-drafting' ? 'ledger' : 'forge');
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
      if (isXyrtaniaGatewayHash(hash)) {
        setSiteMode('studio'); setActiveTab('forge'); setActiveProject('xyrtania-specs'); window.history.replaceState(null, '', '#xyrtania-specs');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.startsWith('launch=') || hash.startsWith('play=') || hash.startsWith('emulator=')) {
        const appId = hash.split('=')[1];
        const forgeItem = forgeData.find(f => f.id === appId || f.id.replace(/-/g, '') === appId.replace(/-/g, ''));
        if (forgeItem && forgeItem.action.includes('launchApp')) {
          const match = forgeItem.action.match(/'([^']+)'/);
          if (match && match[1]) {
            setActiveTab('forge');
            setTimeout(() => handleLaunchApp(match[1]), 200);
          }
        }
      } else {
        const validTabs = ['field-desk', 'forge', 'ledger', 'cargo-bay', 'chronicles', 'guild-hall', 'rookery', 'version'];
        const guildSubAnchors = ['privacy-policy', 'privacy', 'eula', 'terms', 'legal-scrolls', 'shipping-policy', 'shipping', 'return-policy-physical', 'return-policy-digital', 'return-policy', 'returns'];
        if (hash === 'emulator' || hash === 'the-forge') {
          setActiveTab('forge');
        } else if (hash === 'version' || hash === 'changelog' || hash === 'manifest' || hash === 'system-version') {
          setActiveTab('version');
        } else if (validTabs.includes(hash)) {
          setActiveTab(hash);
        } else if (guildSubAnchors.includes(hash)) {
          setActiveTab('guild-hall');
          setTimeout(() => {
            let targetId = hash;
            if (hash === 'privacy') targetId = 'privacy-policy';
            if (hash === 'terms') targetId = 'eula';
            if (hash === 'shipping') targetId = 'shipping-policy';
            if (hash === 'return-policy' || hash === 'returns') targetId = 'return-policy-physical';
            const el = document.getElementById(targetId);
            if (el) {
              const yOffset = -100;
              const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }, 300);
        } else if (projectsData[hash] || projectForPage(hash)) {
          setActiveTab(hash === 'infinite-drafting' ? 'ledger' : 'forge');
          setActiveProject(hash);
        } else if (chroniclesData.some(e => e.id === hash)) {
          setActiveTab('chronicles');
        }
      }
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    setMobileMenuOpen(false);
    if (isSfxOn) {
      audio.playClick();
      audio.triggerInteraction();
    }
    if (tab === activeTab && !activeProject) {
      scrollToContent();
      return;
    }
    window.location.hash = tab;
  };

  const handleOpenProject = (projectId: string) => {
    setMobileMenuOpen(false);
    if (isSfxOn) {
      audio.playClick();
      audio.triggerInteraction();
    }
    window.location.hash = projectId;
  };

  useEffect(() => {
    let lastMove = 0;
    const handleMouseMove = () => {
      const now = Date.now();
      if (now - lastMove > 2000) { // Throttle to every 2 seconds
        audio.triggerInteraction();
        lastMove = now;
      }
    };

    if (isMusicOn) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMusicOn]);

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

  const handleSetAudioMode = (mode: 'file' | 'procedural') => {
    setAudioMode(mode);
    audio.setMode(mode);
  };

  const handleTerminalCommand = (cmd: string) => {
    const command = cmd.toLowerCase();
    if (command === './mp3player' || command === 'start mp3player') {
      setShowMediaPlayer(true);
    } else if (command === 'kill mp3player' || command === 'exit mp3player') {
      setShowMediaPlayer(false);
    }
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
      const project = projectForPage(activeProject);
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
          
          {project ? <ProjectOverview key={project.id} project={project} technicalHtml={projectsData[activeProject]} onLaunchApp={handleLaunchApp} /> : <div
            className="prose prose-invert prose-zinc max-w-none prose-a:text-emerald-400 hover:prose-a:text-emerald-300"
            dangerouslySetInnerHTML={{ __html: projectHtml }}
          />}
          {activeProject === 'infinite-drafting' && <><ProductDemo title="Infinite Drafting" url="/demo.html" drafting /><ContextDiscussion scope="INFINITE DRAFTING" title="Infinite Drafting" /></>}
        </div>
      );
    }

    switch (activeTab) {
      case 'field-desk': return <StudioHome onNavigate={handleTabChange} onOpenProject={handleOpenProject} />;
      case 'forge': return <ForgeGallery onOpenProject={handleOpenProject} onLaunchApp={handleLaunchApp} />;
      case 'ledger': return <TheLedgerContent onOpenProject={handleOpenProject} />;
      case 'cargo-bay': return <TheCargoBayContent />;
      case 'chronicles': return <TheChroniclesContent />;
      case 'guild-hall': return <TheGuildHallContent onNavigate={handleTabChange} />;
      case 'rookery': return <FeedbackWorkshop onLaunchApp={handleLaunchApp} />;
      case 'version': return <TheVersionContent onNavigate={handleTabChange} />;
      default: return <StudioHome onNavigate={handleTabChange} onOpenProject={handleOpenProject} />;
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
      {crtEnabled && <div className="crt-overlay" aria-hidden="true" />}
      
      {/* App Launch Overlay */}
      {launchedAppUrl && (
        <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col animate-in fade-in duration-300">
          <div className="app-launch-header h-12 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4">
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
                <span>NEW TAB</span>
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

      <div className="studio-shell max-w-6xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Sidebar / Navigation */}
        <aside className="studio-sidebar lg:col-span-3 space-y-8">
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-emerald-400 terminal-glow">Andy's Dev Studio</h1>
            <div className="text-xs text-zinc-500 space-y-1">
              <div className="flex items-center space-x-1.5 font-mono">
                <span>Version:</span>
                <button
                  type="button"
                  onClick={() => {
                    if (isSfxOn) audio.playClick();
                    setSiteMode('studio');
                    setActiveProject(null);
                    handleTabChange('version');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer tracking-wider hover:underline"
                  title="View System Version & Git Commits Manifest"
                >
                  {CURRENT_STUDIO_VERSION}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span>System:</span>
                <span className="text-emerald-500 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  Online
                </span>
              </div>
              {isInstallable && (
                <button 
                  onClick={handleInstallClick}
                  className="mt-4 w-full py-2 px-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded hover:bg-emerald-500/30 transition-colors flex items-center justify-center space-x-2 font-bold tracking-wider"
                >
                  <Download className="w-4 h-4" />
                  <span>INSTALL SYSTEM</span>
                </button>
              )}
            </div>
            <p className="text-sm text-zinc-400 italic mt-4">"Forged in code, tested on the road."</p>
          </div>

          <div className="studio-sidebar-controls"><button className="studio-button studio-mobile-toggle" aria-expanded={mobileMenuOpen} aria-controls="studio-navigation" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}{mobileMenuOpen ? 'Close menu' : 'Explore the studio'}</button></div>
          <div id="studio-navigation" className={`studio-navigation ${mobileMenuOpen ? 'is-open' : ''}`}>
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
            <NavItem icon={GitCommit} label="The Manifest" onClick={() => handleTabChange('version')} active={activeTab === 'version'} />
          </nav>

          <button 
            onClick={() => {
              if (isSfxOn) {
                audio.playClick();
                audio.triggerInteraction();
              }
              window.location.hash = 'xyrtania-specs';
              setSiteMode('studio'); setActiveTab('forge'); setActiveProject('xyrtania-specs'); window.history.replaceState(null, '', '#xyrtania-specs');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className="w-full py-3 px-4 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-all flex items-center justify-center space-x-2 font-bold tracking-wider text-xs shadow-md shadow-amber-500/5 hover:border-amber-500/50"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>XYRTANIA DOSSIER</span>
          </button>

          <div className="pt-8 border-t border-zinc-800/50">
            <div className="text-xs text-zinc-500 mb-4 uppercase tracking-wider">Comms</div>
            <div className="grid grid-cols-2 gap-4">
              <SocialLink icon={Facebook} label="Facebook" href="https://www.facebook.com/andysdevstudio.pages.dev" />
              <SocialLink icon={Github} label="GitHub" href="https://github.com/kayrugold" />
              <SocialLink icon={PinterestIcon} label="Pinterest" href="https://www.pinterest.com/andysdevstudio/" />
              <SocialLink icon={MessageSquare} label="Discord" href="https://discord.gg/2RtH68T9fn" />
              <SocialLink icon={Instagram} label="Instagram" href="https://instagram.com/andysdevstudio" />
              <SocialLink icon={Youtube} label="YouTube" href="https://www.youtube.com/@andysdevstudio" />
            </div>

            <div className="grid grid-cols-5 gap-2 mt-4 pt-4 border-t border-zinc-800/50">
              <button 
                onClick={toggleFullscreen}
                className={`p-2 rounded border transition-all flex items-center justify-center ${isFullscreen ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/30'}`}
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
              
              <button onClick={toggleCrt} aria-pressed={crtEnabled} aria-label={`CRT effects ${crtEnabled ? 'on' : 'off'}`} title="Toggle CRT effects" className="p-2 rounded border border-zinc-700 text-emerald-400 flex items-center justify-center"><Monitor className="w-4 h-4" /></button>
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
          </div>
        </aside>

        {/* Main Content */}
        <main ref={mainRef} className="min-w-0 lg:col-span-9 scroll-mt-8">
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50 bg-zinc-950/80 py-8 mt-8 mb-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 font-mono">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span>&copy; {new Date().getFullYear()} Andy's Dev Studio. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => handleTabChange('version')}
              className="flex items-center hover:text-emerald-400 transition-colors cursor-pointer"
              title="View Version Manifest & Git Commits"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              <span>System Online ({CURRENT_STUDIO_VERSION})</span>
            </button>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Forged in code, tested on the road.</span>
          </div>
        </div>
      </footer>
      
      {showMediaPlayer && (
        <MediaPlayer 
          onClose={() => setShowMediaPlayer(false)} 
          audioMode={audioMode} 
          setAudioMode={handleSetAudioMode} 
          isMusicOn={isMusicOn}
          toggleMusic={toggleMusic}
        />
      )}
      
      {showSmiley && (
        <SmileyOverlay onComplete={() => setShowSmiley(false)} />
      )}
      
      <TerminalPrompt 
        onNavigateTab={handleTabChange}
        onOpenProject={handleOpenProject}
        onToggleMusic={toggleMusic}
        onToggleSfx={toggleSfx}
        onToggleFullscreen={toggleFullscreen}
        onOpenMediaPlayer={() => setShowMediaPlayer(true)}
        onTriggerSmiley={() => {
          if (isSfxOn) audio.triggerInteraction();
          setShowSmiley(true);
        }}
        isMusicOn={isMusicOn}
        isSfxOn={isSfxOn}
        isFullscreen={isFullscreen}
        activeTab={activeTab}
      />
    </div>
  );
}
