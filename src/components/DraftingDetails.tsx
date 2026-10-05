import { useEffect, useRef, useState } from 'react';
import { audio } from '../utils/audio';

type Slide = { src: string; alt: string; caption: string };

export function DraftingDetails({ html }: { html: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLAnchorElement | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  useEffect(() => () => audio.setMusicDucked(false), []);

  useEffect(() => {
    if (!slide) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [slides]);

  const close = () => {
    dialog.current?.close();
    setSlides([]);
    opener.current?.focus({ preventScroll: true });
  };
  const step = (direction: number) => setIndex(i => (i + direction + slides.length) % slides.length);

  return <>
    <div className="prose prose-invert prose-zinc max-w-none prose-a:text-emerald-400 hover:prose-a:text-emerald-300"
      onPlayCapture={event => { if (event.target instanceof HTMLVideoElement) audio.setMusicDucked(true); }}
      onPauseCapture={event => { if (event.target instanceof HTMLVideoElement) audio.setMusicDucked(false); }}
      onEndedCapture={event => { if (event.target instanceof HTMLVideoElement) audio.setMusicDucked(false); }}
      onErrorCapture={event => { if (event.target instanceof HTMLVideoElement) audio.setMusicDucked(false); }}
      onEmptiedCapture={event => { if (event.target instanceof HTMLVideoElement) audio.setMusicDucked(false); }}
      onClick={event => {
        const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-drafting-image]');
        if (!link) return;
        event.preventDefault();
        const links = Array.from(link.closest('.drafting-screenshots')!.querySelectorAll<HTMLAnchorElement>('a[data-drafting-image]'));
        opener.current = link;
        setIndex(links.indexOf(link));
        setSlides(links.map(a => ({ src: a.href, alt: a.querySelector('img')?.alt || '', caption: a.closest('figure')?.querySelector('figcaption')?.textContent || '' })));
      }} dangerouslySetInnerHTML={{ __html: html }} />
    <dialog ref={dialog} className="drafting-lightbox" aria-label="Infinite Drafting screenshot viewer"
      onCancel={event => { event.preventDefault(); close(); }}
      onClick={event => { if (event.target === event.currentTarget) close(); }}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
      }}>
      {slide && <div className="drafting-lightbox-content">
        <header><span aria-live="polite">{index + 1} / {slides.length} · {slide.caption}</span><button type="button" onClick={close} autoFocus aria-label="Close screenshot viewer">Close ×</button></header>
        <img src={slide.src} alt={slide.alt} />
        <footer><button type="button" onClick={() => step(-1)} aria-label="Previous screenshot">← Previous</button><span>← → to browse · Esc to close</span><button type="button" onClick={() => step(1)} aria-label="Next screenshot">Next →</button></footer>
      </div>}
    </dialog>
  </>;
}
