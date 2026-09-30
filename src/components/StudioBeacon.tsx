import React, { useCallback, useEffect, useState } from 'react';
import { Radio, RefreshCw } from 'lucide-react';

// Existing studio bulletin source: the first cell (A1) of the published sheet.
const SOURCE = 'https://docs.google.com/spreadsheets/d/18fv0W3ePvgzqyZ4RBcrqE7NUZZw-gf7_K-qat0kHDgs/export?format=csv&gid=0';
const FALLBACK = 'Preparing Infinite Drafting for release and refining the studio website. Visit The Rookery to share feedback.';
let saved: { message: string; checked: number } | null = null;
let pending: Promise<{ message: string; checked: number }> | null = null;

export function firstCsvCell(csv: string): string {
  const value = csv.replace(/^\uFEFF/, '');
  if (!value.startsWith('"')) return value.split(/[,\r\n]/, 1)[0].trim();
  let result = '';
  for (let i = 1; i < value.length; i++) {
    if (value[i] === '"') {
      if (value[i + 1] === '"') { result += '"'; i++; }
      else return result.trim();
    } else result += value[i];
  }
  throw new Error('Incomplete bulletin');
}

async function readBeacon(force: boolean) {
  if (!force && saved && Date.now() - saved.checked < 60_000) return saved;
  if (pending) return pending;
  pending = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetch(SOURCE, { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error('Bulletin unavailable');
      const text = await response.text();
      if (/^\s*</.test(text) || /text\/html/i.test(response.headers.get('content-type') || '')) throw new Error('Expected CSV');
      const message = firstCsvCell(text);
      if (!message || message.length > 2000) throw new Error('Invalid bulletin');
      saved = { message, checked: Date.now() };
      return saved;
    } finally { clearTimeout(timeout); }
  })();
  try { return await pending; } finally { pending = null; }
}

export function StudioBeacon({ poll = false, compact = false }: { poll?: boolean; compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [signal, setSignal] = useState(saved);
  const [status, setStatus] = useState<'loading' | 'live' | 'offline'>('loading');
  const [refresh, setRefresh] = useState(0);
  const refreshSignal = useCallback(() => setRefresh(n => n + 1), []);
  useEffect(() => {
    let active = true;
    setStatus('loading');
    readBeacon(refresh > 0).then(value => { if (active) { setSignal(value); setStatus('live'); } }).catch(() => { if (active) setStatus('offline'); });
    return () => { active = false; };
  }, [refresh]);
  useEffect(() => {
    if (!poll || (compact && !expanded)) return;
    const timer = setInterval(() => { if (document.visibilityState === 'visible') refreshSignal(); }, 60_000);
    return () => clearInterval(timer);
  }, [poll, compact, expanded, refreshSignal]);
  const panel = <section className="studio-beacon" aria-label="Studio Beacon"><div className="studio-beacon-heading"><div><span className="studio-kicker">TRANSMISSION FROM THE WORKBENCH</span><h3><Radio size={18} aria-hidden="true" />Beacon Active</h3></div><button type="button" className="studio-button" disabled={status === 'loading'} onClick={refreshSignal} aria-label="Refresh Beacon"><RefreshCw size={15} /></button></div><p>{signal?.message || FALLBACK}</p><div className="studio-footnote" role="status">{status === 'loading' ? 'Checking for a transmission…' : status === 'live' ? `Connected · checked ${new Date(signal!.checked).toLocaleTimeString()}` : signal ? 'Connection unavailable · showing the last received message' : 'Connection unavailable · showing the studio bulletin'}</div></section>;
  return compact ? <details className="studio-beacon-strip" onToggle={event => setExpanded(event.currentTarget.open)}><summary><Radio size={14} aria-hidden="true" /><strong>Beacon Active</strong><span>A transmission from Andy's workbench</span><small>Read transmission</small></summary>{panel}</details> : panel;
}
