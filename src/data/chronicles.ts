export interface ChronicleEntry {
  id: string;
  title: string;
  date: string;
  summary: string;
  content?: string;
  image?: string;
  tags?: string[];
  file?: string;
}

export const chroniclesData: ChronicleEntry[] = [
  {
    id: 'route-weather-demo-and-feedback',
    title: 'Route Atlas: GPS & Weather — Try a Trip and Tell Me What You Find',
    date: 'November 21, 2026',
    summary: 'The live demo has a home in the studio, and there’s a place to leave questions, bug reports, and ideas.',
    tags: ['Route Atlas: GPS & Weather', 'Browser demo', 'Community'],
    content: `
<p><a href="#route-weather">Route Atlas: GPS &amp; Weather has its own page in the studio</a>, with the live demo at the top. Pick a drive you know, enter the start and destination, and tap a forecast marker to see what conditions are expected when you get there.</p>
<p>I’ve opened a discussion at the bottom of the project page. I’d like to know what you looked for first, what you missed, and whether the forecast markers helped you make a decision about your drive. If something went wrong, tell me what device you used and the steps that led up to it. Town names are plenty for an example route.</p>
<p>The Android release is planned for Google Play at $9.99 in the US. The browser demo is available now, and the <a href="https://github.com/kayrugold/route-weather/tree/v0.21">source for version 0.21 is public</a>.</p>
<section class="chronicle-route-weather" aria-labelledby="route-weather-gallery-title">
  <h3 id="route-weather-gallery-title">A look inside Route Atlas: GPS &amp; Weather</h3>
  <div class="chronicle-route-weather-gallery">
    <figure><a href="/assets/route-weather/Route-Weather-desktop-route-1600x900.webp" target="_blank" rel="noopener"><img src="/assets/route-weather/Route-Weather-desktop-route-1600x900.webp" width="1600" height="900" loading="lazy" alt="Anderson-to-Redding route with three weather forecasts marked on the map"></a><figcaption>Forecasts at your estimated arrival times</figcaption></figure>
    <figure><a href="/assets/route-weather/Route-Weather-desktop-hourly-1600x900.webp" target="_blank" rel="noopener"><img src="/assets/route-weather/Route-Weather-desktop-hourly-1600x900.webp" width="1600" height="900" loading="lazy" alt="Hourly forecast table with the closest hour to arrival highlighted"></a><figcaption>Hourly conditions for a point along the route</figcaption></figure>
    <figure><a href="/assets/route-weather/Tab-Forecast-radar-Redding-to-Portland.webp" target="_blank" rel="noopener"><img src="/assets/route-weather/Tab-Forecast-radar-Redding-to-Portland.webp" width="1920" height="1080" loading="lazy" alt="Forecast precipitation bands crossing the 422-mile route from Redding to Portland"></a><figcaption>Forecast radar along the Redding-to-Portland drive</figcaption></figure>
    <figure><a href="/assets/route-weather/tab-05-Caltrans-QuickMap-road-reports.webp" target="_blank" rel="noopener"><img src="/assets/route-weather/tab-05-Caltrans-QuickMap-road-reports.webp" width="1920" height="1080" loading="lazy" alt="Caltrans road-report markers and an open closure detail in the San Francisco Bay Area"></a><figcaption>Caltrans road reports from the QuickMap feeds</figcaption></figure>
    <figure><a href="/assets/route-weather/tab-06-Toll-roads-and-managed-lanes.webp" target="_blank" rel="noopener"><img src="/assets/route-weather/tab-06-Toll-roads-and-managed-lanes.webp" width="1920" height="1080" loading="lazy" alt="Purple toll roads and a report for the Dolphin Expressway near Miami"></a><figcaption>Mapped toll roads and managed lanes</figcaption></figure>
    <figure><a href="/assets/route-weather/tab-07-Reported-low-clearances.webp" target="_blank" rel="noopener"><img src="/assets/route-weather/tab-07-Reported-low-clearances.webp" width="1920" height="1080" loading="lazy" alt="Reported low-clearance markers and source details on a New York City map"></a><figcaption>Reported low clearances with source links</figcaption></figure>
    <figure><a href="/assets/route-weather/tab-09-Satellite-hotspots.webp" target="_blank" rel="noopener"><img src="/assets/route-weather/tab-09-Satellite-hotspots.webp" width="1920" height="1080" loading="lazy" alt="Satellite heat detections in the northern Sierra Nevada with their report details"></a><figcaption>Satellite hotspot detections</figcaption></figure>
    <figure><a href="/assets/route-weather/tab-10-Reported-wildfires.webp" target="_blank" rel="noopener"><img src="/assets/route-weather/tab-10-Reported-wildfires.webp" width="1920" height="1080" loading="lazy" alt="The Grasshopper wildfire report and a mapped fire perimeter in Oregon"></a><figcaption>Reported wildfires and mapped perimeters</figcaption></figure>
  </div>
  <h3 id="route-weather-video-title">Redding to Portland in Route Atlas: GPS &amp; Weather</h3>
  <iframe
    src="https://www.youtube-nocookie.com/embed/JA3ckbB4Flg?rel=0"
    title="Route Atlas: GPS & Weather — Official App Preview"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
    aria-labelledby="route-weather-video-title"
  ></iframe>
  <p style="margin-top:8px;font-size:.82rem"><a href="https://www.youtube.com/watch?v=JA3ckbB4Flg" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></p>
</section>
    `,
  },
  {
    id: 'route-weather-field-notes',
    title: 'Route Atlas: GPS & Weather — Planning a Drive Around the Forecast',
    date: 'November 21, 2026',
    summary: 'Why I built Route Atlas: GPS & Weather, what the live demo can show you, and where I’d like feedback from other drivers.',
    tags: ['Route Atlas: GPS & Weather', 'Android', 'Field notes'],
    content: `
<p>I built Route Atlas: GPS &amp; Weather to answer a question I run into on long drives: what will the weather be doing when I get there? A forecast for home and one for the destination can miss a lot in between.</p>
<p>Enter the start and destination and the app puts forecasts along the route at your expected arrival times. GPS follow and optional spoken directions are there when you want them. Live traffic uses a limited allowance, so I’ve worked on reducing how many requests the map makes during a drive.</p>
<p><a href="#route-weather">Try the live Route Atlas: GPS &amp; Weather demo</a> and run a trip you know. If something is confusing or there’s a feature that would make your drive easier, <a href="mailto:andys.dev.studio@gmail.com?subject=Route%20Atlas%20feedback">tell me what you’d change</a>.</p>
    `,
  },
  {
    id: 'three-new-drops-november-2026',
    title: 'Three New Drops in The Forge: Sector 04, The Sky Courier, and The Daily Absurd',
    date: 'November 12, 2026',
    summary: 'A triple-header studio update: emergency night-watch air traffic control in Sector 04, a playable 3D hoverboard delivery run in The Sky Courier, and Issue No. 001 of The Daily Absurd—all live in your browser.',
    image: '/assets/the-sky-courier.jpg',
    tags: ['Release', 'Sector 04', 'The Sky Courier', 'The Daily Absurd', 'Gamedev', 'Three.js'],
    content: `
<p><strong>The Forge just got a lot busier.</strong></p>
<p>Over the past few weeks, I have been pushing hard on three very different browser projects—and all three are now live on Cloudflare Pages and wired straight into <a href="#forge">The Forge</a>.</p>
<p>Whether you want high-stakes air traffic control under storm pressure, a 2.5-minute 3D hoverboard delivery sprint through a neighborhood, or a satirical broadsheet with animated illustrations that have opinions of their own, there is something new waiting for you to test.</p>

<hr style="border: 0; border-top: 1px dashed #3f3f46; margin: 28px 0;">

<h3>1. SECTOR 04 · Night Watch</h3>
<p><em>"Mayday, mayday, mayday. Harbor two fourteen. We have smoke entering the cockpit."</em></p>
<figure style="margin: 18px 0;">
  <img src="/assets/sector04.jpg" alt="SECTOR 04 Night Watch radar and Mayday call interface" style="width: 100%; border-radius: 6px; border: 1px solid rgba(52, 211, 153, 0.35);" />
</figure>
<p><strong>Sector 04</strong> is a deterministic air traffic control and emergency consequences prototype (v0.9.0). You are on the night watch radar scope at Harbor, juggling active traffic, moving weather cells (Moderate to Heavy), and incoming Mayday radio calls.</p>
<ul>
  <li><strong>Real Radio &amp; Consequences:</strong> Recorded pilot distress calls and a serialized radio queue where urgent safety breaks can interrupt readbacks, while fuel and fire timers keep ticking.</li>
  <li><strong>Three Authored Shifts:</strong> Test your prioritization across <em>Oxygen Masks</em>, <em>One Runway</em>, and <em>The Long Way Home</em>.</li>
  <li><strong>Deterministic Seeds:</strong> Replay the exact same shift seed to refine your response, or roll a new seed in the briefing.</li>
</ul>
<p><a href="https://sector04.pages.dev" target="_blank" rel="noopener noreferrer" style="color: #34d399; font-weight: 700;">Play Sector 04 at sector04.pages.dev ↗</a> · <a href="#sector-04">View in The Forge →</a></p>

<hr style="border: 0; border-top: 1px dashed #3f3f46; margin: 28px 0;">

<h3>2. THE SKY COURIER · Sunset Express (Playable Demo v.03)</h3>
<p><em>Pick your road. Snag a package. Slingshot through the neighborhood.</em></p>
<figure style="margin: 18px 0;">
  <img src="/assets/the-sky-courier.jpg" alt="The Sky Courier 3D neighborhood hoverboard delivery game" style="width: 100%; border-radius: 6px; border: 1px solid rgba(163, 230, 53, 0.35);" />
</figure>
<p>Earlier in the Chronicles I mentioned pouring late-night hours into <strong>The Sky Courier</strong>. Now the playable v.03 demo is live! Built with Three.js and Vite, it drops you onto a stylized city street with 2½ minutes on the clock and 6 bonus deliveries to pull off.</p>
<ul>
  <li><strong>Flow &amp; Momentum:</strong> Carve onto sidewalks for package handoffs, slide under barriers, hit launch ramps to deploy your cyan glider, and tap BOOST for NOS.</li>
  <li><strong>Vehicle Hitching:</strong> Tap a passing truck or car to hitch a ride, then release to slingshot ahead.</li>
  <li><strong>Zero Friction:</strong> No accounts, no tracking, no purchases—just play in your desktop or mobile browser (and installable via Add to Home Screen).</li>
</ul>
<p><a href="https://theskycourier.pages.dev" target="_blank" rel="noopener noreferrer" style="color: #a3e635; font-weight: 700;">Ride now at theskycourier.pages.dev ↗</a> · <a href="#the-sky-courier">View in The Forge →</a></p>

<hr style="border: 0; border-top: 1px dashed #3f3f46; margin: 28px 0;">

<h3>3. THE DAILY ABSURD · Issue No. 001</h3>
<p><em>Independent Nonsense Since Tomorrow — The world's most unreliable source of extremely reliable laughter.</em></p>
<figure style="margin: 18px 0;">
  <img src="/assets/the-daily-absurd.jpg" alt="The Daily Absurd Issue No. 001 interactive satire cover" style="width: 100%; border-radius: 6px; border: 1px solid rgba(248, 113, 113, 0.35);" />
</figure>
<p>Sometimes you need a break from radar scopes and collision physics to build something purely weird. <strong>The Daily Absurd</strong> is a living satire web publication—part Sunday broadsheet, part animated comic strip.</p>
<ul>
  <li><strong>The Interactive Cover:</strong> Issue No. 001 opens with <em>The Great Button Crisis!</em> alongside animated illustrations that react right on the front page.</li>
  <li><strong>Living Strips &amp; Sketches:</strong> Dive into pieces like <em>Democracy Tries Turning It Off and On Again</em> ("After six meetings, everyone agrees the problem is probably someone else's department") and a live breaking-nonsense ticker.</li>
</ul>
<p><a href="https://the-daily-absurd.pages.dev" target="_blank" rel="noopener noreferrer" style="color: #f87171; font-weight: 700;">Read Issue 001 at the-daily-absurd.pages.dev ↗</a> · <a href="#the-daily-absurd">View in The Forge →</a></p>

<hr style="border: 0; border-top: 1px dashed #3f3f46; margin: 28px 0;">

<h3>Try Them &amp; Share What Broke</h3>
<p>All three projects are now listed in <a href="#forge">The Forge</a> with direct launch buttons and project details. If you spot a bug, an awkward mobile control, or have an idea for the next shift, delivery route, or absurd headline, drop a note in <a href="#rookery">The Rookery</a> or hop into our <a href="https://discord.gg/nXtrdRYWfH" target="_blank" rel="noopener noreferrer">Discord</a>.</p>
<p style="color: #10b981; font-family: monospace; font-size: 0.9em; margin-top: 24px;">#Sector04 #TheSkyCourier #TheDailyAbsurd #IndieDev #ThreeJS #WebGames #AndysDevStudio</p>
<p>See you out there,<br>— Andy</p>`
  },
  {
    id: 'bear-cutout-freebie',
    title: 'Free Community Asset: Grizzly Bear Vector & Cricut Cutout Pack',
    date: 'October 17, 2026',
    summary: 'A free gift for makers, crafters, and woodworkers: high-res vector SVG, cut-ready Cricut stencil, vector PDF, and detailed woodcut illustration. Free for personal and commercial craft projects. Plus what is coming next in The Cargo Bay and late-night game progress on "The Sky Courier".',
    image: '/assets/freebies/bear_detailed.jpg',
    tags: ['Freebie', 'Vector', 'Cricut', 'Crafting', 'Woodworking', 'LaserCutting', 'Gamedev'],
    content: `
<p><strong>To everyone joining from Instagram, Pinterest, and the maker community: welcome to the workshop!</strong></p>
<p>If you tapped the link in my Instagram bio looking for the Grizzly Bear illustration—you're in the right place, and it's completely yours to download and create with.</p>

<p>As a developer and maker who builds software and designs physical goods from the cab of a truck and quiet rest stops, I know how hard it can be to find clean, genuinely cut-friendly vectors that don't shatter into a thousand useless slivers the moment you send them to Cricut Design Space or a laser cutter. So I created this bundle and decided to put it out into the wild for free.</p>

<div style="background: rgba(16, 27, 20, 0.85); border: 1px solid rgba(110, 231, 183, 0.35); border-radius: 10px; padding: 22px; margin: 24px 0;">
  <h4 style="color: #6ee7b7; margin-top: 0; font-size: 1.15em; font-family: ui-sans-serif, system-ui, sans-serif; display: flex; align-items: center; gap: 8px;">
    <span>⚡</span> Quick Download & Cloud Mirrors
  </h4>
  <p style="color: #d1fae5; font-size: 0.95em; margin-bottom: 16px;">
    Get the complete bundle formatted and ready for Cricut, Silhouette, Glowforge, xTool, LightBurn, or print:
  </p>
  <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px;">
    <a href="/assets/freebies/bear0_ads_bundle.zip" download style="display: inline-flex; align-items: center; gap: 8px; background: #6ee7b7; color: #064e3b; font-weight: 700; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-size: 0.9em;">
      💾 Download Complete ZIP Bundle (740 KB)
    </a>
    <a href="https://drive.google.com/drive/folders/1YhRrwpVc1RhrvKal8aJruCLTmqRw3rzQ?usp=drive_link" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(30, 41, 59, 0.8); border: 1px solid #64748b; color: #f1f5f9; font-weight: 600; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-size: 0.9em;">
      ☁️ Open Google Drive Folder ↗
    </a>
    <a href="#cargo-bay" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #a7f3d0; font-weight: 600; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-size: 0.9em;">
      📦 View in The Cargo Bay →
    </a>
  </div>
  <div style="font-size: 0.85em; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px; display: flex; flex-wrap: wrap; gap: 16px;">
    <span>Direct files:</span>
    <a href="/assets/freebies/bear0.svg" download style="color: #6ee7b7; text-decoration: underline;">bear0.svg</a>
    <a href="/assets/freebies/bear0_ads.png" download style="color: #6ee7b7; text-decoration: underline;">bear0_ads.png</a>
    <a href="/assets/freebies/bear0_ads.pdf" download style="color: #6ee7b7; text-decoration: underline;">bear0_ads.pdf</a>
    <a href="/assets/freebies/bear_detailed.jpg" download style="color: #6ee7b7; text-decoration: underline;">bear_detailed.jpg</a>
  </div>
</div>

<h3>Two Editions in One Bundle</h3>
<p>Inside the download package, you will find two distinct variations of the design:</p>
<ul>
  <li><strong>1. The Cricut / Laser Cutout Stencil (SVG, PNG, PDF):</strong> Engineered with thick, continuous geometry. All positive and negative cut paths are bridge-supported so that vinyl cutters weed cleanly and laser cutters / scroll saws don't drop loose islands or tear thin paper and cardstock.</li>
  <li><strong>2. The Detailed Woodcut Wildlife Illustration (High-Res JPG):</strong> A 2752×1536 high-resolution woodcut line-art graphic featuring the grizzly framed with mountain pine boughs. Perfect for sublimation printing, screen-printed t-shirts, framed wall posters, or raster laser engraving on hardwood.</li>
</ul>

<h3>License & Usage: 100% Free For Your Crafts</h3>
<p>You have full permission to use these files for <strong>both personal projects and commercial physical items</strong>. Make t-shirts, laser-cut signs, vinyl decals, coffee mugs, or scroll saw gifts for your shop, craft fair, or friends. The only rule is simple: please don't resell or redistribute the digital design files themselves.</p>
<p>If you make something awesome with it, tag me on Instagram <a href="https://instagram.com/andysdevstudio" target="_blank" rel="noopener noreferrer">@andysdevstudio</a> or pop into our <a href="https://discord.gg/nXtrdRYWfH" target="_blank" rel="noopener noreferrer">Discord community</a>—I would love to see your finished work!</p>

<h3>What's Next: Freebies, Paid Packs & "The Sky Courier"</h3>
<p>This bear is just the beginning. I am setting up <strong>The Cargo Bay</strong> right here on the site as a home for both free community design drops and future paid premium vector packs (including multi-layer laser inlay sets and geometric precision patterns). Be sure to bookmark the site or check back often.</p>

<p>When I'm not drafting vector designs or hauling freight across the highway, I spend my late-night hours writing code. Right now, in the quiet 4:00 AM hours, I am pouring heart and soul into <strong>"The Sky Courier"</strong>, my upcoming video game project, as well as our browser 3D multiplayer world <strong>Xyrtania</strong>.</p>

<p>Keep your blades sharp, your lasers focused, and thank you for supporting an independent builder.</p>
<p style="color: #10b981; font-family: monospace; font-size: 0.9em; margin-top: 24px;">#Cricut #LaserCutting #Glowforge #Woodworking #FreeSVG #MakerCommunity #IndieDev #TheSkyCourier #AndysDevStudio</p>
<p>Stay creative,<br>— Andy</p>`
  },
  {
    id: 'infinite-drafting-walkthrough',
    title: 'The 23-Minute Tour, The Social Media Blitz, and Exactly One Sale',
    date: 'October 7, 2026',
    summary: 'Infinite Drafting is officially out in the wild. I sat down for a complete 23-minute deep-dive walkthrough covering every tool and nuance of the app. Then came the launch day reality check: blasting every social platform, and celebrating my very first sale.',
    image: '/assets/infinite-drafting/walkthrough-canvas.webp',
    tags: ['Infinite Drafting', 'Walkthrough', 'Video', 'IndieDev', 'Milestone'],
    content: `
<p><strong>The hands-on demonstration is finally here—and the reality of being an indie developer has officially arrived.</strong></p>
<p>In my last post, I announced that Infinite Drafting had crossed the finish line from the workbench to Google Play and itch.io. But a short promo clip only shows the polish. Today, I'm delivering on my promise: a full, uncut, 23-minute deep-dive walkthrough showing exactly how the engine runs, how the tools feel, and what you can build with it.</p>
<h3>23 Minutes Under the Hood</h3>
<p>In this video, I take you across the entire graph-paper workspace. We cover freehand drawing, straight-line snapping, custom layer stacks, the interactive protractor and angle guides, numbered grids, and project import/export. Whether you're planning out a garage build, drafting a floor layout, or just letting a stray idea run across an infinite canvas, this walkthrough covers every single knob and lever.</p>
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px; border: 1px solid rgba(255,215,0,0.3); margin-top: 20px;">
  <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube-nocookie.com/embed/lys0ESPFk30?rel=0&playsinline=1" title="Infinite Drafting 23-minute deep-dive walkthrough" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>
<p><a href="https://youtu.be/lys0ESPFk30" target="_blank" rel="noopener noreferrer">Watch the 23-minute walkthrough on YouTube ↗</a></p>
<h3>The Social Media Gauntlet</h3>
<p>Finishing the code is only half the battle—and honestly, for a guy whose natural habitat is the cab of a semi-truck with a laptop balanced on the steering wheel, it might be the easy half. Once the builds were uploaded to Google Play and itch.io, the next gauntlet began: marketing.</p>
<p>I took screenshots, generated packages, wrote descriptions, and blasted announcements across every social media outlet I could find. Reddit threads, Discord servers, X/Twitter posts, developer forums—you name it, I posted it. If you've ever tried shouting into the roaring wind of the internet on launch day, you know that surreal feeling of hitting "Submit" and waiting for the floodgates to open.</p>
<h3>The Grand Total: Exactly One Sale (And I Couldn't Be Prouder)</h3>
<p>So, what was the grand return after days of compiling, tweaking store graphics, and launching across the web?</p>
<p><strong>Exactly one sale.</strong></p>
<p>And you know what? That one sale put a smile on my face that lasted for miles. In the world of tech startups, people talk about venture rounds and viral metrics. But out here on the road, where I spend 11 hours behind the wheel hauling freight and every spare minute learning TypeScript and canvas rendering engines, <em>someone out there in the world decided my app was worth $1.99 of their hard-earned money</em>.</p>
<p>Whoever you are: thank you. You bought my very first software sale as a self-taught developer. That milestone is locked in forever.</p>
<h3>From Highway Miles to Code Lines</h3>
<p>The journey from truck driver to software developer isn't glamorous. It's written in rest-area Wi-Fi passwords, late-night keyboard clatter while the diesel engine cools down, and an unrelenting itch to create something lasting with code. Infinite Drafting is out there. It works, it's fast, and it's built with genuine care.</p>
<p>If you'd like to check it out or support the project:</p>
<ul>
  <li><a href="https://play.google.com/store/apps/details?id=com.andysdevstudio.infinitedrafting" target="_blank" rel="noopener noreferrer">Infinite Drafting on Google Play ($1.99 USD)</a></li>
  <li><a href="https://kayrugold.itch.io/infinite-drafting" target="_blank" rel="noopener noreferrer">Web & Desktop Edition on itch.io (Free / Pay-what-you-want)</a></li>
  <li><a href="#infinite-drafting">Try the interactive preview right here in The Ledger</a></li>
</ul>
<p>Drop by the <a href="https://discord.gg/nXtrdRYWfH" target="_blank" rel="noopener noreferrer">Discord community</a> to share your thoughts, critique my code, or just say hello.</p>
<p style="color: #10b981; font-family: monospace; font-size: 0.9em; margin-top: 24px;">#IndieDev #TruckerDev #InfiniteDrafting #SoloDev #BuildInPublic #GooglePlay #itchio #DevJourney</p>
<p>Keep the wheels turning and the drafts rolling.<br>— Andy</p>`
  },
  {
    id: 'infinite-drafting-launch',
    title: 'Infinite Drafting Is Live — From the Workbench to Google Play',
    date: 'October 5, 2026',
    summary: 'My first Google Play release is here. Infinite Drafting is now available on Android and itch.io—an open canvas for sketches, plans, and the next idea.',
    image: '/assets/infinite-drafting/promo-poster.webp',
    tags: ['Release', 'Infinite Drafting', 'Android', 'Video'],
    content: `
<p><strong>Infinite Drafting has made it from the workbench to The Ledger—and onto Google Play.</strong></p>
<p>This is my first Google Play release, and it means a lot to see it available. I built Infinite Drafting to give ideas room to grow: a graph-paper workspace where you can sketch a layout, explore a pattern, or work through a plan without running out of page.</p>
<h3>A little structure. A lot of possibility.</h3>
<p>The app brings together freehand drawing, straight lines, layers, numbered grids, and ruler and angle guides. You can keep drafts on your device and import or export editable project files. It is a place to sketch and explore, rather than a replacement for engineering or CAD software.</p>
<h3>Choose your workspace</h3>
<p><a href="https://play.google.com/store/apps/details?id=com.andysdevstudio.infinitedrafting" target="_blank" rel="noopener noreferrer">Infinite Drafting on Google Play</a> is $1.99 USD. The <a href="https://kayrugold.itch.io/infinite-drafting" target="_blank" rel="noopener noreferrer">web edition on itch.io</a> is free, with donations welcome. That free edition is a friendly gesture to the developers, makers, and curious people who might find it useful.</p>
<p>You can also <a href="#infinite-drafting">try the temporary demo in The Ledger</a> before choosing an edition.</p>
<h3>Visual Dispatch: Infinite Drafting</h3>
<p>Here is the promotional video to mark the launch. A hands-on demonstration will follow in a separate post.</p>
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px; border: 1px solid rgba(255,215,0,0.3); margin-top: 20px;">
  <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube-nocookie.com/embed/wY9mfjGC5B8?rel=0&playsinline=1" title="Infinite Drafting promotional video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>
<p><a href="https://youtu.be/wY9mfjGC5B8" target="_blank" rel="noopener noreferrer">Watch the promo on YouTube ↗</a></p>
<p>If you try it, I would love to hear what you make and what could work better. Leave a note on the product page or <a href="https://discord.gg/nXtrdRYWfH" target="_blank" rel="noopener noreferrer">join the studio on Discord</a>.</p>
<p>Thank you for supporting this first release.<br>— Andy</p>`
  },
  {
    "id": "log-xyrtania-alpha",
    "title": "Log ID 4.70: Entering Xyrtania — 3D Multiplayer in the Browser",
    "date": "August 4, 2026",
    "summary": "Deploying the first public gateway for Xyrtania. Setting up low-latency WebSockets via Render.com and custom Three.js render loops. The road to our December release starts now.",
    "image": "/assets/xyrtania_chronicles.webp",
    "tags": ["Update", "Multiplayer", "3D", "WebSockets"],
    "content": `
<p><strong>The Forge is echoing with the chords of the Ancient Chorus.</strong></p>
<p>For months, between long hauls on the interstate and late-night hours after the family is asleep, I've been sketching out a massive vision. I wanted to build a real, high-performance 3D RPG that runs entirely in the browser—no heavy clients, no installers, just pure web-engineered power. Today, I am proud to announce the first official open-alpha gateway for <strong>Xyrtania</strong>.</p>
<p><strong>Low-Latency Multiplayer Architecture</strong></p>
<p>Multiplayer in a 3D environment requires solid, reliable pipes. For Xyrtania, I have engineered a dedicated real-time socket relay server hosted on <strong>Render.com</strong>. This handles player positions, rotation updates, and state synchronization. It's built on WebSockets to ensure that latency is kept to an absolute minimum, ensuring a buttery-smooth experience as multiple explorers traverse the rifts.</p>
<p><strong>Procedural 3D World Design via Three.js</strong></p>
<p>The visual framework is built using a custom-optimized <strong>Three.js / WebGL 2.0</strong> render pipeline. Sprawling floating monoliths and ancient ruins are procedurally synthesized on the fly, saving bandwidth and memory. To keep performance high on mobile screens and standard notebooks, the asset streaming system handles texture mipmapping dynamically.</p>
<p><strong>The Compact Survival HUD</strong></p>
<p>One of the design pillars of Xyrtania is immersion. To preserve visual real estate, I've designed a highly compact, responsive survival HUD. Vital statistics (Health, Energy, and local spatial coordinates) are pinned with a minimal footprint, leaving the screen open for exploration. This UI adapts gracefully, offering comfortable touch-joystick controls on mobile and precise mouse/keyboard mapping on desktops.</p>
<p><strong>The Long Road to December</strong></p>
<p>Make no mistake: we are in the early hours of this journey. My target is a full standalone release in <strong>December 2026</strong>. Between now and then, there are dungeon systems, loot tables, and full combat loops to forge. But a project this ambitious shouldn't be built in isolation. I want the guild to be a part of this from day one.</p>
<p>The gateway is now open in <strong>The Forge</strong>. Click <strong>ENTER XYRTANIA</strong> to load the system, sync with the relay server, and begin mapping out the long-lost peaks.</p>
<hr style="border: 0; border-top: 1px dashed #3f3f46; margin: 30px 0;">
<p style="font-style: italic; text-align: center;">"In the quiet hours of the night, we forge whole worlds from the cab of a truck."</p>`
  },
  {
    "id": "log-audio-looper",
    "title": "Log ID 4.66: Seamless Audio in the Browser",
    "date": "March 1, 2026",
    "summary": "Deploying Andy's Audio Looper to The Forge. A tool for generating infinite, seamless audio loops directly in the browser using the Web Audio API.",
    "image": "/assets/andysaudiolooper0.webp",
    "tags": ["Update", "Audio", "Tools"],
    "content": `
<p><strong>The Forge is now generating soundwaves.</strong></p>
<p>I've just added a new tool to The Forge: <strong>Andy's Audio Looper</strong>. This is a project born out of necessity. When you're building games or interactive experiences, you often need background music that loops seamlessly. Opening up a heavy Digital Audio Workstation (DAW) just to crossfade a track is overkill.</p>
<p><strong>The Web Audio API Solution</strong></p>
<p>I wanted a tool that could handle this directly in the browser, without uploading files to a server. Andy's Audio Looper uses the Web Audio API to analyze an audio file (mp3, wav, or ogg), calculate the optimal crossfade points based on a target BPM, and generate a perfectly seamless loop using equal-power crossfading.</p>
<p><strong>Client-Side Power</strong></p>
<p>The best part? All the processing happens locally on your machine. It's fast, secure, and doesn't require any backend infrastructure. It's a perfect example of the kind of lightweight, high-performance tools I want to build for the studio.</p>
<p>You can find the new tool in <strong>The Forge</strong>. Load up an audio file, set your BPM, and let the engine do the rest.</p>
<hr style="border: 0; border-top: 1px dashed #3f3f46; margin: 30px 0;">
<p style="font-style: italic; text-align: center;">"Seamless loops, forged in the browser."</p>`
  },
  {
    "id": "log-4-65",
    "title": "Log ID 4.65: The Bellows and the Beacon",
    "date": "February 22, 2026",
    "summary": "Deploying sound-enabled UI elements, hashtag routing, and a revamped Guild Hall testing pipeline. Pushing the physical apparel project pages live.",
    "image": "/assets/thebellows.webp",
    "tags": ["Update", "UI", "Guild", "Video"],
    "content": `
<p><strong>The Forge is breathing.</strong></p>
<h4 style="font-family:'Cinzel', serif; margin-top:25px;">Visual Dispatch: Log 4.65</h4>
<p><strong>The Bellows and The Beacon:</strong></p><p> A walkthrough of the new UI features and the Guild Hall expansion.</p>
<p>It’s been a busy weekend at the forge! I’ve been hard at work pushing several new features and refinements to the site. Here is a breakdown of what’s new at Andy’s Development Studio.</p>
<p><strong>The "Field Desk" & UI Upgrades</strong></p>
<p>The first thing you’ll notice is a revamped introduction to the Field Desk [01:34]. This section now includes specific "tear-away" descriptions for our studio protocol, the community, and an official closure message.</p>
<p>For those who like a bit of tactile feedback while browsing: The Bellows Button: Look for the new bellows icon in the lower-left corner [00:51]. Give it a click—it now triggers custom sound effects to bring a bit of life to the interface.</p>
<p><strong>Enhanced Navigation:</strong> The menu system has been rebuilt from the ground up [03:11]. You can now jump directly to specific projects or items without clicking through multiple layers.</p>
<p><strong>Navigation & Studio Logistics</strong></p>
<p>I’ve implemented Hashtag Routing to make finding specific information much faster [03:55]. You can now append specific tags to the URL to jump directly where you need to go, such as:</p>
<p>#guild<br>#chronicles<br>#returnpolicies</p>
<p>Speaking of policies, I’ve updated the Guild Records with a clear 30-day return policy [04:43]. I’ve also reorganized the layout to make these documents easier to read on both desktop and mobile.</p>
<p><strong>The Guild Hall & Tester Updates</strong></p>
<p>The Guild Hall is evolving into our official testing grounds [04:50].</p>
<p><strong>Beacon Active Updates:</strong></p>
<p>A new section where I’ll provide real-time status on what I’m working on.</p>
<p><strong>Discord Integration:</strong> Our testing directives now point directly to our Discord community [05:02]. This will help us coordinate better and keep the bots at bay.</p>
<p><strong>Contact Security:</strong> To keep things secure, I’ve moved my direct phone and email off the main pages [05:24]. If you need to reach me, please use the new contact form—it goes straight to my inbox!</p>
<p><strong>Project & Apparel Pages</strong></p>
<p>The Apparel section is no longer just a gallery [02:17]. Clicking on a design will now take you to a dedicated project page where you can see the specific details of each shirt and design I’m creating. I’m also working on a Bounty Board system [05:43]. Soon, guild members who help with testing will be able to earn unique titles and discover "Easter eggs" hidden throughout the site.</p>
<p><strong>Daily Composite & The Forge</strong></p>
<p>The Daily Composite is now live [06:05]. You can grab the current daily number and take it straight to the Forge to test out the Factor Hunter program. Whether you’re using the web version or the Android app (now available in the Play Store), the integration is smoother than ever.</p>
<p>I recorded a quick walkthrough of these updates from the cab before heading out on my next shift, so feel free to watch the full update video if you want to see these features in action.</p>
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px; border: 1px solid rgba(255,215,0,0.3); margin-top: 20px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube-nocookie.com/embed/gCG8WJh_pwA?rel=0&modestbranding=1&playsinline=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>`
  },
  {
    "id": "log-video-tour",
    "title": "Video Log: Navigating the Studio",
    "date": "February 17, 2026",
    "summary": "A complete video walkthrough recorded from the cab. Explaining the Google 14-day requirement, the testing pipeline, and a tour of the site.",
    "image": "/assets/video_tour.webp",
    "tags": ["Video", "Update", "Pipeline"],
    "content": `
<p>I had to bail on my original recording spot because my coworkers were rolling in, so I retreated to the cab of the truck to film this. The lighting isn't great, and I actually ended up jump-scaring myself with my own hand reflection in the window at the 10-minute mark, but we got the mission parameters outlined.</p>
<p><strong>Current studio note:</strong> This older entry describes the studio’s original testing plan. The studio now uses an organization account, and The Rookery is an open feedback workshop with no attendance requirement.</p>
<p>In this video, I walk through exactly why Andy's Dev Studio exists. I break down Google's rigorous 14-Day/20-Tester requirement for new developers, and how this community is the ultimate answer to that hurdle. I also give a tour of how to use <strong>The Forge</strong> for free prototypes, and how to get your security clearance to test professional apps in <strong>The Rookery</strong>.</p>
<p>Give it a watch, and if you haven't yet, join the Discord to get your Elite Raven badge.</p>
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px; border: 1px solid rgba(255,215,0,0.3); margin-top: 20px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube-nocookie.com/embed/Qv1JYSUhmV4?rel=0&modestbranding=1&playsinline=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>`
  },
  {
    "id": "forge-to-ledger",
    "title": "From The Forge to The Ledger",
    "date": "February 11, 2026",
    "summary": "This entry demystifies the studio's development pipeline, breaking down the journey from raw idea to polished release.",
    "image": "/assets/forgetoledger.webp",
    "tags": ["Update", "Forge", "Ledger"],
    "content": `
<p><strong>This site isn't just a portfolio. It’s a foundry.</strong></p>
<p>If you’ve been clicking around the shelves, you’ve noticed the distinct sectors: The Forge, The Rookery, and The Ledger. This structure isn't accidental—it’s the actual lifecycle of every piece of software built at Andy's Dev Studio. I want to break down exactly how a raw idea travels from a late-night prototype to a finished release, and where you fit into the machine.</p>
<p><strong>Phase 1: The Forge (Raw Iron)</strong></p>
<p>Everything begins in <strong>The Forge</strong>. This is the sandbox. It’s where I drop experimental math engines, game mechanics, and utility prototypes that are still rough around the edges. When you load a project here, you aren't just playing a game—you are stress-testing the metal. </p>
<p>If a prototype sparks joy (or breaks spectacularly), use the <strong>Send a Raven</strong> link. Your feedback is the hammer that shapes the next version.</p>
<p><strong>Phase 2: The Rookery (The Crucible)</strong></p>
<p><strong>Current studio note:</strong> The testing plan below is historical. The studio now uses an organization account. Visit The Rookery to share feedback without a roster or daily check-in.</p>
<p>This is where things get serious. For an Android app to reach the Play Store today, Google demands a rigorous standard: <strong>20 testers opted-in for 14 continuous days</strong>. That is a massive hurdle for independent developers.</p>
<p><strong>The Rookery</strong> is our answer to that gate. When a project graduates from The Forge, it lands here for "The 14-Day Watch." This isn't just checking for bugs; it’s a community mission to clear the gates for release. If you see an app in the Rookery, I am asking for your shield and your time to get it across the finish line.</p>
<p><strong>Phase 3: The Ledger (The Market)</strong></p>
<p>The final destination. Once the code is stabilized and the gates are cleared, the project moves to <strong>The Ledger</strong>. This is where you find the polished releases—available on the Play Store, Itch.io, or physically in the Cargo Bay. </p>
<p>The pipeline is simple: I forge the code, you test the limits, and together we ship the product. Welcome to the crew.</p>
<hr style="border: 0; border-top: 1px dashed #3f3f46; margin: 30px 0;">
<p style="font-style: italic; text-align: center;">"You test the iron, I swing the hammer."</p>
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px; border: 1px solid rgba(255,215,0,0.3);">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube-nocookie.com/embed/ivFaQqbYdls?rel=0&modestbranding=1&playsinline=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>`
  },
  {
    "id": "cargo-bay-launch",
    "title": "Log Entry: The Cargo Bay is Open",
    "date": "February 6, 2026",
    "summary": "Bridging the gap between digital code and physical freight. The Cargo Bay is now live at Andy's Dev Studio.",
    "image": "/assets/merch_shirt_factor.webp",
    "tags": ["Update", "Merch", "Trucking"],
    "content": `
<p>I just got back from a heavy 500-mile shift, and while I’m definitely feeling the hours, I couldn't go to sleep without hitting "publish" on a major update to the site.</p>
<h3>Beyond the Digital Forge</h3>
<p>Up until now, my focus at <strong>Andy’s Dev Studio</strong> has been almost entirely on the code—building math engines like <strong>Factor Hunter</strong> and trying to make browser-based processing as efficient as possible. But as a trucker, I know that at the end of the day, someone has to move the physical freight.</p>
<p>That’s why I’ve added <strong>The Cargo Bay</strong> to the main library.</p>
<h3>Physical Provisions for the Modern Forger</h3>
<p>The Cargo Bay is a dedicated space for physical goods and gear. I’m starting small while I finalize the inventory, but the first prototype is already on the shelf: the <strong>Official Factor Hunter Tee</strong>.</p>
<p>It features the "Ink on Parchment" design we’ve been using in the Forge, meant to represent the blend of old-school number theory and modern high-performance code.</p>
<h3>What's Next?</h3>
<p>I don't have a massive catalog yet—I'm a one-man operation balancing a set of trailers and a family—but more "provisions" are coming. Whether it's gear for developers or something for the road, it has to meet the studio standard: <strong>Forged for Efficiency</strong>.</p>
<p>I'm heading to bed now. Check out the new shop tab and let me know what you think.</p>
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px; border: 1px solid rgba(255,215,0,0.3); margin-top: 20px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube-nocookie.com/embed/zmvUjgaUBN0?rel=0&modestbranding=1&playsinline=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>`
  },
  {
    "id": "log-factor-ultimate",
    "date": "Feb 03, 2026",
    "title": "The Siege of the Composite",
    "summary": "Brute force is dead. How we used Quadratic Reciprocity, Web Workers, and Algebraic forms to hunt factors in the browser.",
    "image": "/assets/factor000entry.webp",
    "content": `
<p>There is a moment in every developer's life when "Brute Force" stops working. You stare at a number like <code>10<sup>50</sup> + 19</code>, and you realize that a <code>for</code> loop checking every integer is going to take longer than the heat death of the universe.</p>
<p>This week, I rebuilt the <strong>Factor Hunter</strong> engine from scratch. It is no longer just a game; it is a multi-threaded cryptographic siege weapon. Here is how we broke the speed limit of the browser.</p>
<h3 style="margin-top:20px;">1. The "Shotgun" vs. The "Sniper"</h3>
<p>The old engine used Trial Division. It checked 3, 5, 7, 9... hoping to get lucky. That is like trying to find a needle in a haystack by burning down the haystack one straw at a time.</p>
<p>The new <strong>Ultimate Engine</strong> uses <strong>Quadratic Reciprocity</strong>. Before we even check a prime <code>p</code>, we calculate the <em>Legendre Symbol</em>. If the math says a factor <em>cannot</em> exist in that modular space, we don't even look at it. We skip millions of dead ends instantly.</p>
<h3 style="margin-top:20px;">2. Algebraic Pre-Cognition</h3>
<p>Why guess? If the target is <code>x<sup>3</sup> - 1</code>, we <em>know</em> algebraically that <code>x-1</code> is a factor. The new engine runs a "Pre-computation Check" that looks for these algebraic forms (like difference of squares or sums of cubes) and factors them instantly before the heavy machinery even starts.</p>
<h3 style="margin-top:20px;">3. The Iron Fleet (Web Workers)</h3>
<p>JavaScript is single-threaded. If you run a heavy math loop, the UI freezes. The <strong>Factor Finder</strong> now spawns a "Fleet" of Web Workers—one for every core in your CPU. It slices the number line into chunks (e.g., 200,000 integers) and assigns a chunk to each worker.</p>
<div style="background:rgba(0,0,0,0.2); padding:15px; border-left:3px solid #10b981; margin:20px 0; font-family:monospace;">
    > SPANNED FLEET: 12 WORKERS<br>
    > STRATEGY: WHEEL-30 SIEVE<br>
    > FILTER: QUADRATIC RECIPROCITY ENABLED<br>
    > STATUS: HUNTING...
</div>
<p>The result? We can now scan ranges in the trillions per second without the browser dropping a single frame. The beast has been tamed.</p>
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px; border: 1px solid rgba(255,215,0,0.3); margin-top: 20px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube-nocookie.com/embed/ndDlGj6Y-N4?rel=0&modestbranding=1&playsinline=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>`
  },
  {
    "id": "log-4-64",
    "date": "Feb 3, 2026",
    "title": "Log ID 4.64: The Cartography of Integers",
    "summary": "Deploying the Lattice Explorer. Moving from brute force hunting to geometric mapping. Visualizing the 'Diamond' regions and modulus grids.",
    "image": "/assets/lattice.webp",
    "content": `
<p><strong>We stop guessing. We start mapping.</strong></p>
<p>For months, the Stride Hunter has been our weapon—a fleet of threads fired into the dark to hit a target. But a sniper needs a map. Today, I’m deploying the <strong>Lattice Explorer</strong>.</p>
<p><strong>The Visual Shift</strong></p>
<p>When you're driving a truck, you don't look at the road as a list of GPS coordinates. You see lines, curves, and intersections. You feel the geometry of the route. I realized I was treating math like a spreadsheet when I should have been treating it like a landscape.</p>
<p>The Lattice Explorer renders the "Modulus Grid"—the actual texture of the number line. It plots the "Core" hyperbolas (xy = N) and the "Diamond" regions where factors hide. It turns abstract algebra into a terrain we can navigate with touch physics.</p>
<p><strong>The Blueprint</strong></p>
<p>This isn't just a visualizer; it's a diagnostic tool. By overlaying the parabolic paths on top of the modulus grid, we can see *why* a number resists factorization. We can see the "traffic jams" in the modular arithmetic.</p>
<hr style="border: 0; border-top: 1px dashed #3f3f46; margin: 30px 0;">
<p style="font-style: italic; text-align: center;">"The map is not the territory... but it helps you drive the truck."</p>`
  },
  {
    "id": "log-4-63",
    "date": "Feb 3, 2026",
    "title": "Log ID 4.63: The Peterbilt Studio",
    "summary": "Late night dispatch from the cab. A raw look at squashing a critical caching bug at 2 AM with the help of the AI Squire. The reality of the double shift.",
    "image": "/assets/thepeterbiltstudio.webp",
    "content": `
<p><strong>The second shift begins when the engine stops.</strong></p>
<p>I just wrapped up an 11-hour run down the Iron Spine. The physical work is done—the freight is moved, the logbook is signed—but the mental work doesn't punch a clock. Sitting here in the cab at 2 AM, the lighting is terrible and the exhaustion is real, but this is the reality of the "Peterbilt Studio." It’s not about having the perfect ergonomic chair; it’s about having the drive to build something that is yours.</p>
<p><strong>The Ghost in the Cache</strong></p>
<p>Earlier today, the Studio hit a wall. We deployed a routine update, but the site refused to acknowledge it—a stubborn caching error that kept the old version locked in place. It’s the digital equivalent of a trailer door that won't seal. </p>
<p>I couldn't just leave it broken. So, on my break, I opened the terminal on my phone. With the help of "The Squire" (my AI co-pilot), we tore through the Service Worker logic. My eyes were tired from the road, but the Squire spotted the syntax break. We patched the file, flushed the cache, and pushed the hotfix live from the driver's seat.</p>
<p><strong>Status: Standby</strong></p>
<p>The fix is deployed, but the real test comes tomorrow morning. Tonight is for recovery. I’m heading home to be with the family, keeping the house quiet, and letting the code settle. The work is hard, the hours are long, but the system is evolving.</p>
<hr style="border: 0; border-top: 1px dashed #3f3f46; margin: 30px 0;">
<p style="font-style: italic; text-align: center;">"Bad lighting. Good code. The journey continues."</p>
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px; border: 1px solid rgba(255,215,0,0.3); margin-top: 20px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube-nocookie.com/embed/WC4W_-oPcGA?rel=0&modestbranding=1&playsinline=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>`
  },
  {
    "id": "theironspine",
    "date": "Feb 2, 2026",
    "title": "Log ID 4.62: The Stillness of the Forge",
    "summary": "Brakes set in the North Country. After a heavy haul through the Nexus and the Foundry, the Forge is quiet. Reflected on the standstill and the architecture of the journey.",
    "image": "/assets/theironspine.webp",
    "content": `
<p><strong>The brakes are set in the North Country.</strong></p>
<p>It was a long haul today—running the Spine down to the Lower Foundry, navigating the heavy traffic of the Nexus, and finally bobtailing back under the stars. The physical transition from the rumble of the road to the silence of the Forge is always the hardest gear to shift.</p>
<p><strong>The Standby State</strong></p>
<p>I tried to capture the Forge on film tonight, but the words wouldn't come. There’s a specific kind of fatigue that hits when your hands have been steady on a wheel for ten hours, but your mind is racing at a million bits per second. The video can stay in "Standby." Sometimes the best thing you can do for the code is let it breathe while the driver recovers.</p>
<p><strong>Refining the Embers</strong></p>
<p>Instead of the video, I spent my remaining fuel stoking the fire one last time. I’ve refined the atmospheric engine—added rising embers that glow without burning out the GPU. It’s a visual reminder that even when the math feels like it's at a standstill, there’s still heat in the system. The infrastructure is ready. Now, I wait for the next signal.</p>
<hr style="border: 0; border-top: 1px dashed #3f3f46; margin: 30px 0;">
<p style="font-style: italic; text-align: center;">"Time to let the embers drift. Standby for the math."</p>
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px; border: 1px solid rgba(255,215,0,0.3); margin-top: 20px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube-nocookie.com/embed/B2aMgEKZW0M?rel=0&modestbranding=1&playsinline=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>`
  }
];
