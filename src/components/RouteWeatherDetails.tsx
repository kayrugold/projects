import { ArrowLeft, ArrowUpRight, CloudSun, Map, Route } from 'lucide-react';
import { ContextDiscussion } from './Community';

const demoUrl = 'https://route-weather.andy-596.workers.dev/';

export function RouteWeatherDetails({ onGoHome }: { onGoHome: () => void }) {
  return <article className="studio-page route-weather-project">
    <section className="route-weather-demo" aria-labelledby="route-weather-title">
      <header>
        <div>
          <h1 id="route-weather-title">Route Atlas: GPS &amp; Weather</h1>
          <p>Live browser demo</p>
        </div>
        <a className="studio-button" href={demoUrl} target="_blank" rel="noopener noreferrer">
          Open in a new tab <ArrowUpRight size={15} />
        </a>
      </header>
      <iframe src={demoUrl} title="Route Atlas: GPS & Weather live browser demo"
        allow="geolocation https://route-weather.andy-596.workers.dev" />
      <p className="studio-footnote">Open Plan, enter a start and destination, and calculate a route. Select a forecast point along the route, or try Radar and Layers. If location or voice access is unavailable in the preview, open it in a new tab.</p>
    </section>

    <section className="studio-welcome drafting-grid route-weather-intro" aria-labelledby="route-weather-intro">
      <div>
        <h2 id="route-weather-intro">See the weather you’ll drive into.</h2>
        <p>A forecast at either end can miss what’s happening along the way. Route Atlas: GPS &amp; Weather puts forecasts on your route at the times you expect to reach them, so you can see where conditions might change.</p>
        <div className="studio-tags"><span>Google Play release planned</span><span>$9.99 US · one-time purchase</span></div>
      </div>
      <img src="/assets/route-weather.svg" alt="Route Atlas: GPS & Weather app icon" width="192" height="192" />
    </section>

    <section className="route-weather-features" aria-label="Route Atlas: GPS & Weather features">
      <div className="studio-panel">
        <CloudSun aria-hidden="true" />
        <h3>Forecasts along your route</h3>
        <p>Check precipitation, wind, visibility and temperature against your estimated arrival times.</p>
      </div>
      <div className="studio-panel">
        <Map aria-hidden="true" />
        <h3>Radar and road conditions</h3>
        <p>See radar and available state road reports. Enable live traffic when you need it.</p>
      </div>
      <div className="studio-panel">
        <Route aria-hidden="true" />
        <h3>GPS and spoken turns</h3>
        <p>Follow your position on the map and switch spoken directions on or off during a planned trip.</p>
      </div>
    </section>

    <section className="studio-panel route-weather-video" aria-labelledby="route-weather-preview-video">
      <div className="route-weather-video-head">
        <div>
          <span className="studio-kicker">30-SECOND PREVIEW</span>
          <h3 id="route-weather-preview-video">See Route Atlas in action</h3>
        </div>
        <a className="studio-button" href="https://www.youtube.com/watch?v=JA3ckbB4Flg" target="_blank" rel="noopener noreferrer">
          Watch on YouTube <ArrowUpRight size={15} />
        </a>
      </div>
      <iframe
        src="https://www.youtube-nocookie.com/embed/JA3ckbB4Flg?rel=0"
        title="Route Atlas: GPS & Weather — Official App Preview"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </section>

    <section className="studio-panel">
      <h3>Before you head out</h3>
      <p>Use an address, town or map pin. For a particular business, look up its street address and enter it in Plan.</p>
      <p>Live traffic depends on coverage and available requests. You can still plan routes and check forecasts when traffic is unavailable. Standard routes do not check truck restrictions, and spoken directions do not automatically reroute you.</p>
    </section>

    <footer className="studio-actions">
      <button className="studio-button" onClick={onGoHome}><ArrowLeft size={15} /> The Field Desk</button>
      <a className="studio-button" href="#route-weather-demo-and-feedback">The Chronicles</a>
      <a className="studio-button" href="mailto:andys.dev.studio@gmail.com?subject=Route%20Atlas%20feedback">Send feedback</a>
      <a className="studio-button" href={demoUrl + 'route-weather-privacy.html'} target="_blank" rel="noopener noreferrer">Privacy policy</a>
      <a className="studio-button" href="https://github.com/kayrugold/route-weather/archive/refs/tags/v0.21.zip">Download GPLv3 source</a>
    </footer>
    <ContextDiscussion scope="Route Weather" title="Route Atlas: GPS & Weather" />
  </article>;
}
