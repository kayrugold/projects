import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Play, Volume2, VolumeX, Monitor } from 'lucide-react';
interface XyrtaniaCinematicSiteProps {
  onBackToStudio: () => void;
  onLaunchGame: (url: string) => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
}
const GAME_URL = 'https://xyrtania.andy-596.workers.dev';
const guide = [
  { title: 'First visit', heading: 'Beyond the title screen.', text: 'Open the game, let the world finish loading, then choose Enter Xyrtania on its title screen. The game offers its own soundtrack and fullscreen controls. Explore at your own pace.', note: 'The game opens in a separate tab. Your place in the studio stays here.' },
  { title: 'Your setup', heading: 'Make room for the world.', text: 'Use a browser with WebGL support. Follow the controls inside the game, and use its Options and performance diagnostics to find a comfortable setup for your device.', note: 'Early alpha: features, performance, and availability may change.' },
  { title: 'Field notes', heading: 'Bring a discovery back.', text: 'Found a strange corner, a camera problem, or an idea worth exploring? Share what you were doing, what happened, and which device you used. A few clear steps help Andy investigate.', note: 'Visit the Rookery for feedback, or talk with the studio on Discord.' },
];
export default function XyrtaniaCinematicSite({ onBackToStudio, crtEnabled, onToggleCrt }: XyrtaniaCinematicSiteProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false), [audioNotice, setAudioNotice] = useState('');
  const [chapter,setChapter] = useState(0), [artOpen,setArtOpen]=useState(false), [rune,setRune]=useState(false);
  useEffect(() => { const track = new Audio('/assets/stonebridgedawn.ogg'); track.loop = true; track.volume = .35; audioRef.current = track; return () => { track.pause(); audioRef.current = null; }; }, []);
  const stopMusic = () => { audioRef.current?.pause(); setPlaying(false); };
  const toggleMusic = async () => { if (playing) { stopMusic(); return; } try { await audioRef.current?.play(); setPlaying(true); setAudioNotice(''); } catch { setAudioNotice('Audio could not start. Please try again.'); } };
  return <main className="gateway gateway-interactive">
    <header className="gateway-top"><button className="studio-button" onClick={onBackToStudio}><ArrowLeft size={16}/>Back to the studio</button><div className="gateway-controls"><button className="studio-crt-toggle" aria-pressed={crtEnabled} onClick={onToggleCrt}><Monitor size={14}/>CRT {crtEnabled?'on':'off'}</button><button className="studio-button" aria-pressed={playing} onClick={toggleMusic}>{playing?<Volume2 size={16}/>:<VolumeX size={16}/>} {playing?'Pause soundtrack':'Play soundtrack'}</button></div></header>
    <p role="status" className="studio-footnote">{audioNotice}</p>
    <section className="gateway-portal"><div className="gateway-portal-copy"><span className="studio-kicker">THE FLAGSHIP WORLD OF ANDY'S DEV STUDIO</span><h1>XYRTANIA</h1><p className="gateway-tagline">The workshop has a doorway.<br/>See where it leads.</p><p>An experimental 3D world, taking shape one discovery at a time. Step into the current alpha and find your own way through.</p><div className="studio-actions"><a className="drafting-button" href={GAME_URL} target="_blank" rel="noopener noreferrer" onClick={stopMusic}><Play size={17}/>Enter Xyrtania <ArrowRight size={17}/></a><a className="studio-text-link" href="#xyrtania-specs" onClick={stopMusic}>Project details →</a></div><span className="studio-footnote">EARLY ALPHA · BROWSER GAME · OPENS IN A NEW TAB</span></div><button className="gateway-art-button" onClick={()=>setArtOpen(v=>!v)} aria-expanded={artOpen} aria-controls="gateway-full-art"><img src="/assets/xyrtania_card.webp" alt="Xyrtania concept artwork: fire and ice framing a world in the making"/><span>{artOpen?'Close artwork −':'Inspect the concept artwork +'}</span></button></section>
    {artOpen&&<figure id="gateway-full-art" className="gateway-full-art"><img src="/assets/xyrtania_card.webp" alt="Full Xyrtania concept artwork"/><figcaption>Concept artwork. Dates and features shown in the illustration are exploratory.</figcaption></figure>}
    <div className="gateway-readout"><span>01 / ENTER THE WORLD</span><span>02 / FOLLOW YOUR CURIOSITY</span><button onClick={()=>setRune(v=>!v)} aria-expanded={rune}>◇ Inspect the rune</button></div>{rune&&<p className="gateway-rune" role="status">The rune reads: “Every world began as somebody's unfinished idea.” Back at the studio, try /adventure.</p>}
    <section className="gateway-guide"><div><span className="studio-kicker">BEFORE YOU CROSS</span><h2>A small field guide.</h2><div className="gateway-guide-controls" role="group" aria-label="Field guide sections">{guide.map((item,i)=><button key={item.title} aria-pressed={chapter===i} onClick={()=>setChapter(i)}>{String(i+1).padStart(2,'0')} / {item.title}<ArrowRight size={14}/></button>)}</div></div><article aria-live="polite"><span className="studio-kicker">{guide[chapter].title}</span><h3>{guide[chapter].heading}</h3><p>{guide[chapter].text}</p><small>{guide[chapter].note}</small>{chapter===2&&<div className="studio-actions"><a className="studio-text-link" href="#rookery">Open the Rookery →</a><a className="studio-text-link" href="https://discord.gg/2RtH68T9fn" target="_blank" rel="noopener noreferrer">Join Discord ↗</a></div>}</article></section>
    <footer className="gateway-footer">Xyrtania · An independent game by Andy Davis · Built one discovery at a time.</footer>
  </main>;
}
