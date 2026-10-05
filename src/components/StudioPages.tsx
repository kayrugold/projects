import { CommunityHub, ContextDiscussion, DiscordInvitation } from './Community';
import { ProductDemo } from './ProductDemo';
import { XyrtaniaConsole } from './XyrtaniaConsole';
import { StudioBeacon } from './StudioBeacon';
import React, { useState } from 'react';
import { ArrowRight, Play, FileText, Copy, Mail, Terminal, Compass, MessageSquare } from 'lucide-react';
import { forgeData, ForgeEntry } from '../data/forge';
import { projectGuides } from '../data/projectGuides';

const launchUrl = (project: ForgeEntry) => project.action.match(/launchApp\('([^']+)'\)/)?.[1];
const statusLabel = (status: string) => ({ DEV: 'In development', ALPHA: 'Alpha', BETA: 'Beta', LIVE: 'Available' }[status] || status);
export const projectForPage = (id: string) => forgeData.find(p => p.projectPage === id || p.id === id);
const Header = ({ code, title, children }: { code: string; title: string; children: React.ReactNode }) => <header className="studio-header"><span className="studio-kicker">{code}</span><h2>{title}</h2><p>{children}</p></header>;

export function StudioHome({ onNavigate, onOpenProject }: { onNavigate: (id: string) => void; onOpenProject: (id: string) => void }) {
  return <div className="studio-page">
    <header className="studio-welcome drafting-grid"><span className="studio-kicker">~/FIELD-DESK · WELCOME TO THE WORKSHOP</span><h2>Curiosity, written<br />in code<span className="studio-cursor" aria-hidden="true">_</span></h2><p>I'm Andy. I build useful tools, explore the mathematics of numbers, and make room for the occasional adventure—all from a studio that travels with me.</p><div className="studio-actions"><a className="drafting-button" href="https://xyrtania.andy-596.workers.dev">Enter Xyrtania <ArrowRight size={16} /></a><button className="studio-button" onClick={() => onNavigate('forge')}>Explore the tools</button><button className="studio-button" onClick={() => onNavigate('developer')}>Meet the developer</button></div><span className="studio-footnote">Forged in code, tested on the road.</span></header>
    <section className="studio-flagship"><div><span className="studio-kicker">FLAGSHIP GAME / EARLY ALPHA</span><h3>XYRTANIA</h3><p>A world beyond the workshop.</p><div className="studio-actions"><a className="drafting-button" href="https://xyrtania.andy-596.workers.dev">Enter Xyrtania <ArrowRight size={16}/></a><button className="studio-text-link" onClick={()=>onOpenProject('xyrtania-specs')}>Project details →</button></div><small>Enter the game in this tab.</small></div><img src="/assets/xyrtania_card.webp" alt="Xyrtania fire and ice concept artwork"/></section>
    <section className="studio-feature"><div><span className="studio-kicker">OUT NOW / FIRST GOOGLE PLAY RELEASE</span><h3>Infinite Drafting</h3><p>Room for your next big idea. An infinite graph-paper canvas for sketches, layouts, and the patterns you haven't quite figured out yet.</p><div className="studio-tags"><span>Android · $1.99</span><span>Free on itch.io</span></div><button className="drafting-button" onClick={() => onOpenProject('infinite-drafting')}>Discover Infinite Drafting <ArrowRight size={16} /></button></div><img src="/assets/infinitedrafting1.webp" alt="Infinite Drafting promotional artwork" width="2048" height="2048" /></section>
    <section><Header code="CHOOSE A DIRECTION" title="Find something worth exploring.">A working studio, with finished tools and experiments still taking shape.</Header><div className="studio-paths">{[
      ['forge', '01', 'The Forge', 'Tools & experiments', 'Launch a browser tool, explore a mathematical idea, or try a game.'],
      ['chronicles', '02', 'The Chronicles', 'Development journal', 'Follow the discoveries, changes, and work behind the projects.'],
      ['rookery', '03', 'The Rookery', 'Feedback workshop', 'Try an experiment and help make the next iteration better.'],
    ].map(([id, number, title, subtitle, description]) => <button className="studio-path" key={id} onClick={() => onNavigate(id)}><span className="studio-kicker">{number} / {subtitle}</span><h3>{title}</h3><p>{description}</p><ArrowRight size={18} aria-hidden="true" /></button>)}</div></section>
    <StudioBeacon compact poll />
    <div className="studio-terminal-tip"><Terminal size={20} /><p>There's another way around the studio.<br /><span>Try <code>/help</code> in the terminal below. Click a suggestion or complete a command with Tab.</span></p></div>
  </div>;
}

export function ForgeGallery({ onOpenProject, onLaunchApp }: { onOpenProject: (id: string) => void; onLaunchApp: (url: string) => void }) {
  const [filter, setFilter] = useState('All projects');
  const groups = ['All projects', 'Number theory', 'Creative tools', 'Games'];
  const entries = forgeData.filter(p => filter === 'All projects' || projectGuides[p.id]?.group === filter);
  return <div className="studio-page"><Header code="~/FORGE · TOOLS & EXPERIMENTS" title="Follow your curiosity.">Explore number theory, shape a sound, or step into a browser game. Each project has a working purpose—and room to improve.</Header>
    <div className="studio-filters" role="group" aria-label="Filter projects">{groups.map(group => <button key={group} aria-pressed={filter === group} onClick={() => setFilter(group)}>{group}</button>)}</div><p className="studio-count" aria-live="polite">{entries.length} {entries.length === 1 ? 'project' : 'projects'} · Runs in your browser</p>
    <div className="studio-project-grid">{entries.map(p => <article key={p.id} className="studio-project-card"><div className="studio-card-image">{p.image && <img src={p.image} alt={`${p.title} project artwork`} loading="lazy" />}</div><div className="studio-card-body"><div className="studio-card-meta"><span>{projectGuides[p.id]?.group}</span><span className={`studio-badge ${p.status === 'LIVE' ? 'available' : ''}`}>{statusLabel(p.status)}</span></div><h3>{p.title}</h3><p>{projectGuides[p.id]?.purpose || p.description}</p><span className="studio-version">{p.version} · Browser project</span><div className="studio-actions"><button className="drafting-button" onClick={() => { const url = launchUrl(p); if (url) onLaunchApp(url); }}><Play size={14} />{p.id === 'xyrtania' ? 'Enter Xyrtania' : 'Launch'}</button><button className="studio-button" onClick={() => onOpenProject(p.projectPage || p.id)}><FileText size={14} />Details</button></div></div></article>)}</div>
  </div>;
}

export function ProjectOverview({ project, technicalHtml, onLaunchApp }: { key?: React.Key; project: ForgeEntry; technicalHtml?: string; onLaunchApp: (url: string) => void }) {
  const guide = projectGuides[project.id];
  return <article className="studio-page"><Header code={`~/FORGE / ${guide?.group || project.type}`} title={project.title}>{guide?.purpose || project.description}</Header><div className="studio-project-intro"><span className="studio-badge">{statusLabel(project.status)}</span><span>{project.version} · Runs in your browser</span></div><div className="studio-actions"><button className="drafting-button" onClick={() => { const url = launchUrl(project); if (url) onLaunchApp(url); }}><Play size={16} />{project.id === 'xyrtania' ? 'Enter Xyrtania' : `Launch ${project.title}`}</button><a className="studio-button" href="#rookery">Share feedback <MessageSquare size={16} /></a></div>
    {project.id === 'xyrtania' && <XyrtaniaConsole />}
    {project.image && <figure className="studio-project-art"><img src={project.image} alt={`${project.title} promotional artwork`} /><figcaption>Project artwork · Explore the working interface with Launch</figcaption></figure>}
    <div className="studio-two-column"><section className="studio-panel"><span className="studio-kicker">YOUR FIRST EXPLORATION</span><h3>Start here.</h3><p>{guide?.tryIt}</p></section><section className="studio-panel"><span className="studio-kicker">DEVELOPMENT NOTES</span><h3>Know what to expect.</h3><p>{guide?.note}</p></section></div>
    {project.features && <section className="studio-panel"><h3>Inside the toolkit</h3><ul className="studio-feature-list">{project.features.map(f => <li key={f}>{f}</li>)}</ul></section>}
    {project.tech && <div className="studio-tags">{project.tech.map(t => <span key={t}>{t}</span>)}</div>}
    {technicalHtml && project.id !== 'xyrtania' && <details className="studio-technical"><summary>Open the technical notebook <span>Algorithms, implementation & original project notes</span></summary><div className="studio-legacy" dangerouslySetInnerHTML={{ __html: technicalHtml }} /></details>}
    {project.id !== 'xyrtania' && launchUrl(project) && <ProductDemo title={project.title} url={launchUrl(project)!} />}
    <ContextDiscussion scope={project.title} title={project.title} />
  </article>;
}

export function FeedbackWorkshop({ onLaunchApp }: { onLaunchApp: (url: string) => void }) {
  const [project, setProject] = useState('Website');
  const [category, setCategory] = useState('Something went wrong');
  const [description, setDescription] = useState('');
  const [includeDevice, setIncludeDevice] = useState(false);
  const [notice, setNotice] = useState('');
  const report = () => `Project: ${project}\nFeedback: ${category}\n\n${description.trim()}${includeDevice ? `\n\nBrowser: ${navigator.userAgent}\nViewport: ${window.innerWidth} × ${window.innerHeight}\nPixel ratio: ${window.devicePixelRatio}` : ''}`;
  const validate = () => { if (!description.trim()) { setNotice('Add a few details before preparing your report.'); return false; } return true; };
  const copy = async () => { if (!validate()) return; try { await navigator.clipboard.writeText(report()); setNotice('Report copied. Paste it into an email or a message when you’re ready.'); } catch { setNotice('Clipboard unavailable. You can select and copy the report preview below.'); } };
  const bounties = [
    { id: 'lattice-explorer', title: 'Take the grid for a spin.', task: 'Try panning and zooming on your usual device. Tell me where navigation feels awkward.' },
    { id: 'andysaudiolooper', title: 'Listen for the join.', task: 'Try a short track and listen across the loop boundary. Share the settings if you hear a click or a gap.' },
    { id: 'factor-hunter-ultimate', title: 'Check a familiar number.', task: 'Use a composite number whose factors you already know. Report an unexpected result or an unclear step.' },
  ];
  return <div className="studio-page"><StudioBeacon poll /><Header code="~/ROOKERY · FEEDBACK WORKSHOP" title="Try something. Tell me what happened.">You don't need a badge, a streak, or a Discord account to help. A useful observation from one person can make the next version better.</Header>
    <DiscordInvitation /><CommunityHub />
    <details className="rookery-disclosure"><summary>Looking for something to explore?<span>Small tasks from the workbench</span></summary><div className="studio-bounties">{bounties.map(b => { const p = forgeData.find(p => p.id === b.id)!; return <article className="studio-panel" key={b.id}><span className="studio-kicker">{p.title}</span><h3>{b.title}</h3><p>{b.task}</p><button className="studio-button" onClick={() => { const url = launchUrl(p); if (url) onLaunchApp(url); }}>Try this project <ArrowRight size={14} /></button></article>; })}</div></details>
    <details className="studio-report rookery-disclosure"><summary>Send a private note<span>Prepare an email or copy a report</span></summary><form onSubmit={e => { e.preventDefault(); if (!validate()) return; window.location.href = `mailto:andys.dev.studio@gmail.com?subject=${encodeURIComponent(`[Studio feedback] ${project}: ${category}`)}&body=${encodeURIComponent(report())}`; setNotice('Your email app was requested. Review the draft and send it there; nothing has been sent by this website.'); }}>
      <div className="studio-two-column"><label>Project<select value={project} onChange={e => setProject(e.target.value)}><option>Website</option><option>Infinite Drafting</option>{forgeData.map(p => <option key={p.id}>{p.title}</option>)}</select></label><label>Type of feedback<select value={category} onChange={e => setCategory(e.target.value)}><option>Something went wrong</option><option>A control was confusing</option><option>An idea or suggestion</option><option>Something worked well</option></select></label></div>
      <label>Your notes<textarea required rows={5} value={description} onChange={e => { setDescription(e.target.value); setNotice(''); }} placeholder="What were you trying to do? What happened? Steps to reproduce are especially useful." /></label>
      <label className="studio-checkbox"><input type="checkbox" checked={includeDevice} onChange={e => setIncludeDevice(e.target.checked)} />Include browser and screen details in my report</label>
      <details className="studio-report-preview"><summary>Preview the report</summary><pre>{report()}</pre></details>
      <div className="studio-actions"><button className="drafting-button" type="submit"><Mail size={16} />Open email draft</button><button className="studio-button" type="button" onClick={copy}><Copy size={16} />Copy report</button></div><p className="studio-footnote">Opens your email app. Or copy the report and email andys.dev.studio@gmail.com.</p><p className="studio-notice" role="status">{notice}</p>
    </form></details>
  </div>;
}
