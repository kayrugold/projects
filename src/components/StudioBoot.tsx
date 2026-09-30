import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import './boot.css';

export function StudioBoot({onEnter,onInstall,installable}:{onEnter:()=>void;onInstall:()=>void;installable:boolean}) {
  const [progress,setProgress]=useState(20),[status,setStatus]=useState('Checking studio files…');
  const [installed,setInstalled]=useState(()=>window.matchMedia('(display-mode: standalone)').matches || !!(navigator as Navigator & {standalone?:boolean}).standalone);
  const [guide,setGuide]=useState(false);
  useEffect(()=>{
    const display=window.matchMedia('(display-mode: standalone)');
    const detect=()=>setInstalled(display.matches || !!(navigator as Navigator & {standalone?:boolean}).standalone);
    const didInstall=()=>setInstalled(true);
    display.addEventListener('change',detect);window.addEventListener('appinstalled',didInstall);
    return()=>{display.removeEventListener('change',detect);window.removeEventListener('appinstalled',didInstall);};
  },[]);
  useEffect(()=>{
    let disposed=false,finished=false;
    const cleanups:(()=>void)[]=[];
    const finish=(message:string)=>{if(disposed||finished)return;finished=true;setStatus(message);setProgress(100);};
    // Always allow entry when offline, registration is blocked, or an update is slow.
    const deadline=setTimeout(()=>finish('Studio ready. Update check continues in background.'),10000);
    async function check(){
      if(import.meta.env.DEV){finish('Local preview ready. Offline cache is enabled on the live site.');return;}
      if(!('serviceWorker' in navigator)){finish('Studio ready. Offline storage unavailable in this browser.');return;}
      try {
        const registration=await navigator.serviceWorker.ready;
        if(disposed||finished)return;
        setProgress(60);setStatus(navigator.onLine?'Checking for new studio assets…':'Offline. Using saved studio files.');
        if(navigator.onLine)await registration.update();
        if(disposed||finished)return;
        const worker=registration.installing || registration.waiting;
        if(worker && !['activated','redundant'].includes(worker.state)){
          setProgress(80);setStatus('Downloading and preparing updated studio files…');
          const changed=()=>{
            if(worker.state==='activated')finish('Service Worker ready. Local cache verified.');
            else if(worker.state==='redundant')finish('Studio ready. Update unavailable; using current files.');
            else if(worker.state==='installed' && registration.waiting)finish('Updated files saved. Ready to enter studio.');
          };
          worker.addEventListener('statechange',changed);cleanups.push(()=>worker.removeEventListener('statechange',changed));changed();
        }else finish(navigator.onLine?'Service Worker ready. Local cache verified.':'Offline. Saved studio files ready.');
      }catch{finish('Studio ready. Update check unavailable; try again later.');}
    }
    check();
    return()=>{disposed=true;clearTimeout(deadline);cleanups.forEach(fn=>fn());};
  },[]);
  return <main className="studio-boot" aria-label="Studio startup">
    <section className="bios-panel" aria-labelledby="bios-title">
      <header><h1 id="bios-title">ANDY'S DEV STUDIO BIOS</h1><span>{progress===100?'100% READY':'BOOTING…'}</span></header>
      <div className="bios-checks"><div><span>System Update:</span><strong title={status} role="status">{status}</strong></div><div><span>PWA Install Status:</span><span>{installed?'INSTALLED':'WEB BROWSER'}</span></div></div>
      <div className="bios-progress"><span>{progress===100?'[ OK ]':'[ .. ]'}</span><div role="progressbar" aria-label="Studio startup checks" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><i style={{width:progress+'%'}}/></div><b>{progress}%</b></div>
      <button className="bios-power" disabled={progress<100} onClick={onEnter}><Volume2 size={16} aria-hidden="true"/>POWER ON CRT &amp; ENTER STUDIO</button>
      {!installed&&<div className="bios-install">{installable&&<button onClick={onInstall}>Install studio on this device</button>}<button onClick={()=>setGuide(v=>!v)} aria-expanded={guide} aria-controls="bios-guide">PWA Installation Guide →</button>{guide&&<p id="bios-guide">Use your browser's Install app option. On iPhone or iPad, open Safari's Share menu and choose Add to Home Screen. Installation is optional; you can enter the studio here.</p>}</div>}
    </section>
  </main>;
}
