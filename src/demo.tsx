import React from 'react';
import { createRoot } from 'react-dom/client';
import InfiniteDrafting from '../infinite-drafting/src/App';
import '../infinite-drafting/src/index.css';

// Embed the same application used by the standalone release. Its separate entry
// owns PWA registration; this page must not replace the studio's service worker.
createRoot(document.getElementById('root')!).render(<InfiniteDrafting embedded />);
