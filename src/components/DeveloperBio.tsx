export function DeveloperBio() {
  return <article className="studio-page developer-bio">
    <figure className="developer-banner"><img src="/assets/developer/banner.webp" width="1600" height="900" alt="Illustration of Andy at his game-development workstation, with Xyrtania planning notes behind him" /></figure>
    <header className="studio-welcome drafting-grid">
      <img className="developer-avatar" src="/assets/developer/avatar.webp" width="112" height="112" alt="Andy's illustrated studio avatar" />
      <span className="studio-kicker">~/DEVELOPER · THE PERSON BEHIND THE STUDIO</span>
      <h2>Andy Davis<span className="studio-cursor" aria-hidden="true">_</span></h2>
      <p>Truck driver. Father. Independent developer.</p>
      <span className="studio-footnote">Forged in code, tested on the road.</span>
    </header>
    <section className="developer-story">
      <span className="studio-kicker">A STUDIO THAT TRAVELS</span>
      <h3>Built in the quiet hours.</h3>
      <p>By day, I’m a professional truck driver. In the hours between shifts and family life, I build software. My studio is often the cab of my truck or a bedside table after the kids are asleep. Much of the work starts on my phone, one line at a time.</p>
      <p>Andy’s Dev Studio is where those ideas find a home: useful tools, experiments with numbers, and games with worlds to explore. I like software that invites you to try something, follow your curiosity, and see what happens.</p>
    </section>
    <section className="developer-story">
      <span className="studio-kicker">ON THE WORKBENCH</span>
      <h3>Small tools. Big worlds.</h3>
      <p><a href="#infinite-drafting">Infinite Drafting</a> is my first Google Play release—a space for sketches, plans, and patterns. The Android edition is $1.99, and the web edition on itch.io is free with optional donations.</p>
      <p><a href="#xyrtania-specs">Xyrtania</a> is the studio’s flagship game project. In <a href="#forge">The Forge</a>, you can explore the tools and experiments that grow alongside it.</p>
      <p>I share development notes and videos in <a href="#chronicles">The Chronicles</a>. If something here sparks an idea, I’d love to hear about it.</p>
    </section>
    <section className="developer-story">
      <span className="studio-kicker">KEEP IN TOUCH</span>
      <h3>Find me around the studio.</h3>
      <div className="studio-actions">
        <a className="drafting-button" href="https://play.google.com/store/apps/dev?id=5926004915095018244" target="_blank" rel="noopener noreferrer">My apps on Google Play ↗</a>
        <a className="studio-button" href="https://discord.gg/nXtrdRYWfH" target="_blank" rel="noopener noreferrer">Join Discord ↗</a>
        <a className="studio-button" href="#guild-hall">Contact & studio policies</a>
      </div>
    </section>
  </article>;
}
