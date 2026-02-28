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
