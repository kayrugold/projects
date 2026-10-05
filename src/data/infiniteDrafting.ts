// Live release links supplied by Andy.
const desktopScreenshots = [
  ['Title sketch', 'Infinite Drafting v1.0 handwritten on the desktop canvas', 1672, 941],
  ['Sketch your next idea', 'Desktop workspace with a stylus drawing geometric lines', 1672, 941],
  ['Explore angles', 'Protractor guide over a geometric drawing', 1536, 1024],
  ['Find your line', 'Ruler guide positioned on the desktop canvas', 1672, 941],
  ['Organize your layers', 'Layer controls beside a drawing and numbered grids', 1672, 941],
  ['Choose how to start', 'Welcome screen with Google sign-in and guest access', 1672, 941],
  ['Keep your drafts together', 'Draft Library with device, cloud, import and export controls', 1672, 941],
  ['Follow a pattern', 'Numbered cells and grids arranged on the desktop canvas', 1672, 941],
  ['Start with an open canvas', 'Empty desktop graph-paper workspace with drawing tools', 1672, 941],
] as const;
const mobileScreenshots = [
  ['An idea in your pocket', 'Infinite Drafting v1.0 title sketch on a portrait phone canvas', 1080, 2238],
  ['Sketch on your phone', 'Portrait workspace with geometric lines and a stylus', 688, 1529],
  ['Explore numbered grids', 'Numbered cells and grids on the mobile canvas', 688, 1529],
  ['Launch from your home screen', 'Infinite Drafting app icon on an Android home screen', 688, 1529],
  ['Choose how to start', 'Mobile welcome screen with Google sign-in and guest access', 688, 1529],
  ['Bring your drafts along', 'Draft Library displayed on a phone', 688, 1529],
  ['Draw with a touch', 'A finger drawing geometric lines on the portrait canvas', 688, 1529],
  ['Install as a web app', 'Android app information for the installed Infinite Drafting PWA', 688, 1529],
  ['Room to begin', 'Empty portrait graph-paper workspace with drawing controls', 1080, 2400],
] as const;
const screenshotGallery = (edition: string, screenshots: typeof desktopScreenshots | typeof mobileScreenshots) => screenshots.map(([caption, alt, width, height], index) => `
      <figure><a href="/assets/infinite-drafting/${edition}-${index + 1}.webp" data-drafting-image aria-haspopup="dialog" aria-label="View ${caption.toLowerCase()} screenshot full size"><img src="/assets/infinite-drafting/${edition}-${index + 1}.webp" width="${width}" height="${height}" alt="${alt}" loading="lazy" decoding="async" /></a><figcaption>${caption}</figcaption></figure>`).join('');

export const infiniteDraftingPage = `
<article class="drafting-page">
  <header class="drafting-hero drafting-grid">
    <div class="drafting-eyebrow">ANDY'S DEV STUDIO / INDEPENDENT TOOLS</div>
    <div class="drafting-status"><span></span> Available now</div>
    <h1>Infinite Drafting<span>Room for your<br>next big idea.</span></h1>
    <p class="drafting-lead">Graph paper that keeps up with your thinking. Sketch, measure, and explore on a canvas that gives your ideas room to grow.</p>



  <section class="drafting-editions drafting-section" id="drafting-editions" aria-labelledby="drafting-editions-heading">

    <h2 id="drafting-editions-heading" class="drafting-choose-heading">Choose your edition</h2>

    <div class="drafting-edition-grid">
      <div class="drafting-edition drafting-edition-android"><div class="drafting-edition-top"><span>ANDROID EDITION</span><span class="drafting-pill">Available now</span></div><div class="drafting-price">$1.99 <span>USD</span></div><p>For your Android phone or tablet.</p><a class="drafting-button drafting-availability" href="https://play.google.com/store/apps/details?id=com.andysdevstudio.infinitedrafting" target="_blank" rel="noopener noreferrer">Buy on Google Play ↗</a></div>
      <div class="drafting-edition"><div class="drafting-edition-top"><span>WEB / COMMUNITY EDITION</span><span class="drafting-pill">Available now</span></div><div class="drafting-price">Free <span>· donations welcome</span></div><p>For your browser or desktop PWA.</p><a class="drafting-button drafting-availability" href="https://kayrugold.itch.io/infinite-drafting" target="_blank" rel="noopener noreferrer">Get it on itch.io ↗</a></div>
    </div>

  </section>

  </header>

  <figure class="drafting-showcase">
    <video controls playsinline preload="none" poster="/assets/infinite-drafting/promo-poster.webp" aria-label="Infinite Drafting promotional video"><source src="/assets/infinite-drafting/promo.webm" type="video/webm" /><source src="/assets/infinite-drafting/promo.mp4" type="video/mp4" />Your browser does not support this video. <a href="/assets/infinite-drafting/promo.mp4">Watch the promotional video</a>.</video>
    <figcaption><span>A little structure. A lot of possibility.</span><a href="/assets/infinite-drafting/promo.webm" target="_blank" rel="noopener noreferrer">Open promotional video ↗</a></figcaption>
  </figure>

  <section class="drafting-section drafting-media" aria-labelledby="drafting-media-heading">
    <div class="drafting-eyebrow">A LOOK INSIDE THE WORKSPACE</div>
    <h2 id="drafting-media-heading">From your desk to your pocket.</h2>
    <p class="drafting-intro">Explore the drawing tools, grids, and draft library on desktop and mobile. Select a screenshot to see it full size.</p>
    <details open><summary>Desktop preview <span>9 screenshots</span></summary><div class="drafting-screenshots drafting-screenshots-desktop">${screenshotGallery('desktop', desktopScreenshots)}
    </div></details>
    <details><summary>Mobile preview <span>9 screenshots</span></summary><div class="drafting-screenshots drafting-screenshots-mobile">${screenshotGallery('mobile', mobileScreenshots)}
    </div></details>
  </section>

  <section class="drafting-section" aria-labelledby="drafting-tools-heading">
    <div class="drafting-eyebrow">FROM FIRST LINE TO NEXT ITERATION</div>
    <h2 id="drafting-tools-heading">A small toolkit for expansive thinking.</h2>
    <p class="drafting-intro">For developers mapping a level, makers sketching a project, and curious minds following a pattern. Keep the process visual, flexible, and yours.</p>
    <div class="drafting-features">
      <div><span class="drafting-number">01 / EXPLORE</span><h3>Keep the idea going.</h3><p>Pan and zoom across an infinite canvas. Draw freely, lay down straight lines, and build out a sketch without choosing a page size first.</p></div>
      <div><span class="drafting-number">02 / FIND YOUR LINE</span><h3>Give your sketches structure.</h3><p>Use snap-to-grid, a ruler guide, and a protractor guide to work through shapes and angles. Add numbered grids to explore sequences and layouts.</p></div>
      <div><span class="drafting-number">03 / REFINE</span><h3>Try another direction.</h3><p>Separate ideas into layers. Hide or lock a layer, select and move strokes, and use undo and redo as you work through alternatives.</p></div>
      <div><span class="drafting-number">04 / RETURN TO IT</span><h3>Carry the project forward.</h3><p>Save drafts on your device and export editable project files. Import a saved file when you're ready to pick up the idea again.</p></div>
    </div>
  </section>



  <section class="drafting-faq drafting-section" aria-labelledby="drafting-faq-heading">
    <div class="drafting-eyebrow">A FEW USEFUL DETAILS</div><h2 id="drafting-faq-heading">Before you start sketching.</h2>
    <details><summary>Why a paid Android edition and a free web edition?</summary><p>The free itch.io release is a friendly gesture to the developer and maker community. The $1.99 Android release gives people a way to get the app through Google Play and support independent development. Donations on itch.io are optional.</p></details>
    <details><summary>What can I save and export?</summary><p>The app supports local drafts and editable JSON project files that you can export and import. Keep an exported copy of work you want to preserve, since clearing browser storage can remove locally saved drafts.</p></details>
    <details><summary>Is this a CAD application?</summary><p>Infinite Drafting is a space for sketching, planning, and exploring geometry. Its grid and guides help you develop an idea; they do not replace engineering software or verified measurements for a finished build.</p></details>
    <details><summary>Where can I get Infinite Drafting?</summary><p>Both editions are available now. Choose Google Play for the $1.99 Android app or itch.io for the free web edition, with optional donations. The links are at the top of this page.</p></details>
  </section>

  <footer class="drafting-note"><span class="drafting-eyebrow">A NOTE FROM THE STUDIO</span><p>Built by Andy Davis to give ideas a place to take shape. The free web edition is a friendly gesture to the developers, makers, and curious minds who might find it useful.</p><span>Andy Davis · Andy's Dev Studio</span><p><a href="#developer">Meet the developer →</a> · <a href="https://discord.gg/nXtrdRYWfH" target="_blank" rel="noopener noreferrer">Join Discord ↗</a></p></footer>
</article>
`;
