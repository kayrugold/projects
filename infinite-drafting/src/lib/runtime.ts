// The website entry explicitly opts into a temporary, memory-only demo.
// Standalone PWA builds do not set this marker and retain all save features.
export const isDemo = typeof document !== 'undefined' && document.documentElement.dataset.draftingDemo === 'true';
