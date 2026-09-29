<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f27cf1b2-1cf2-4262-8224-6c42fe4ced98

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## 🎨 Asset & Image Dimension Guide

To ensure all card visuals, diagrams, and logs render crisply across devices without unwanted cropping or distortion, follow these dimension standards:

### 1. The Forge Cards
* **Container**: Responsive **16:9** (`aspect-video`) with `object-contain` on a `bg-zinc-950` backdrop. Guarantees 100% diagram visibility with zero edge clipping.
* **Target Aspect Ratio**: **16:9** (Widescreen)
* **Recommended Dimensions**:
  * **Optimal (Retina / 2x)**: `1280 × 720 px`
  * **High Resolution**: `1600 × 900 px` or `1920 × 1080 px`
  * **Compact Standard**: `1024 × 576 px`
* **Format**: `.webp` (recommended) or `.png`
* **Tip**: For diagrams or parchment illustrations with border annotations (like Gnomon Navigator), keeping critical labels inside a ~5% safe inner margin ensures optimal breathing room within the card frame.

---

### 2. The Ledger Cards (Product Thumbnails)
* **Container**: Square thumbnail container (`md:w-48 h-48`, 192 × 192 px display on desktop) with scanline effect and grayscale hover transition.
* **Target Aspect Ratio**: **1:1** (Square)
* **Recommended Dimensions**:
  * **Optimal (Retina / 2x)**: `800 × 800 px`
  * **Master Asset**: `1024 × 1024 px` or `2048 × 2048 px` (e.g. `infinitedrafting1.webp`)
  * **Minimum**: `400 × 400 px`
* **Format**: `.webp` or `.png`

---

### 3. The Chronicles Listings (Dev Log Media)
* **Container**: `max-w-2xl` (`max-width: 672px`), `w-full h-auto` with CRT scanlines and subtle metadata HUD footer (`SRC: filename`).
* **Target Aspect Ratio**: **16:9** (Flexible landscape; `h-auto` preserves natural height)
* **Recommended Dimensions**:
  * **Optimal (Retina / 2x)**: `1280 × 720 px` or `1344 × 756 px` (exactly 2x the 672px max container width)
  * **Standard**: `1152 × 648 px` or `1024 × 576 px`
  * **Full HD**: `1920 × 1080 px`
* **Format**: `.webp` or `.png`
