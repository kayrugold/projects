// Store links belong here once the product listings are live.
export const infiniteDraftingPage = `
<article class="drafting-page">
  <header class="drafting-hero drafting-grid">
    <div class="drafting-eyebrow">ANDY'S DEV STUDIO / INDEPENDENT TOOLS</div>
    <div class="drafting-status"><span></span> Preparing for launch</div>
    <h1>Infinite Drafting<span>Room for your<br>next big idea.</span></h1>
    <p class="drafting-lead">Graph paper that keeps up with your thinking. Sketch, measure, and explore on a canvas that gives your ideas room to grow.</p>
    <div class="drafting-hero-footer"><a class="drafting-button" href="#drafting-editions" onclick="event.preventDefault(); document.getElementById('drafting-editions').scrollIntoView({behavior: 'smooth'});">Explore the editions <span aria-hidden="true">↗</span></a><span>Android · Web · Desktop PWA</span></div>
  </header>

  <figure class="drafting-showcase">
    <img src="/assets/infinitedrafting0.webp" width="2752" height="1536" alt="Infinite Drafting promotional illustration featuring a graph-paper workspace and an architectural sketch" />
    <figcaption><span>A little structure. A lot of possibility.</span><span>Product illustration</span></figcaption>
  </figure>

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

  <section class="drafting-editions drafting-section" id="drafting-editions" aria-labelledby="drafting-editions-heading">
    <div class="drafting-eyebrow">CHOOSE YOUR WORKSPACE</div>
    <h2 id="drafting-editions-heading">A pocket tool. A community offering.</h2>
    <p class="drafting-intro">Two planned releases, with a simple idea behind both: make a useful place to think on paper, wherever you work.</p>
    <div class="drafting-edition-grid">
      <div class="drafting-edition drafting-edition-android"><div class="drafting-edition-top"><span>ANDROID EDITION</span><span class="drafting-pill">Coming soon</span></div><h3>Take your ideas along.</h3><div class="drafting-price">$1.99 <span>USD · planned price</span></div><p>A dedicated Android app, planned for Google Play. A convenient home for your sketches on your phone or tablet.</p><div class="drafting-availability">Google Play listing coming soon</div></div>
      <div class="drafting-edition"><div class="drafting-edition-top"><span>WEB / COMMUNITY EDITION</span><span class="drafting-pill">Coming soon</span></div><h3>A little gift to fellow makers.</h3><div class="drafting-price">Free <span>· donations welcome</span></div><p>A browser edition, planned for itch.io. Use it for your next experiment, project, or game idea. If it helps, an optional donation supports the studio.</p><div class="drafting-availability">itch.io listing coming soon</div></div>
    </div>
    <p class="drafting-desktop-note"><strong>Prefer a laptop?</strong> The web app is designed to support installation as a progressive web app (PWA) in compatible browsers, giving it its own window on your desktop.</p>
  </section>

  <section class="drafting-faq drafting-section" aria-labelledby="drafting-faq-heading">
    <div class="drafting-eyebrow">A FEW USEFUL DETAILS</div><h2 id="drafting-faq-heading">Before you start sketching.</h2>
    <details><summary>Why a paid Android edition and a free web edition?</summary><p>The free itch.io release is a friendly gesture to the developer and maker community. The $1.99 Android release gives people a way to get the app through Google Play and support independent development. Donations on itch.io are optional.</p></details>
    <details><summary>What can I save and export?</summary><p>The app supports local drafts and editable JSON project files that you can export and import. Keep an exported copy of work you want to preserve, since clearing browser storage can remove locally saved drafts.</p></details>
    <details><summary>Is this a CAD application?</summary><p>Infinite Drafting is a space for sketching, planning, and exploring geometry. Its grid and guides help you develop an idea; they do not replace engineering software or verified measurements for a finished build.</p></details>
    <details><summary>Where will the download links appear?</summary><p>The Google Play and itch.io links will appear here when their product listings are ready. Both editions are currently being prepared for release.</p></details>
  </section>

  <footer class="drafting-note"><span class="drafting-eyebrow">A NOTE FROM THE STUDIO</span><p>Built by Andy Davis to give ideas a place to take shape. The free web edition is a friendly gesture to the developers, makers, and curious minds who might find it useful.</p><span>Andy Davis · Andy's Dev Studio</span></footer>
</article>
`;
