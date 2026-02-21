/* app.js - v4.7.9 Master Studio Logic (Journal Fixes) */

// ==========================================
// 0. GLOBAL VARIABLES
// ==========================================
let journalEntries = [];
let forgeItems = [];
let marketItems = [];
let audioCtx = null;
let isPlaying = false;
// Audio Nodes
let droneOsc1, droneOsc2, droneGain, musicInterval;
let windNode, windGain, windFilter, windLFO;

// ==========================================
// 1. SERVICE WORKER & UPDATE UI
// ==========================================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
        if (reg.waiting) triggerUpdateUI();

        reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    triggerUpdateUI();
                }
            });
        });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            window.location.reload();
            refreshing = true;
        }
    });
}

function triggerUpdateUI() {
    const overlay = document.getElementById('updateOverlay');
    const versionSpan = document.getElementById('ui-version-display');

    if (overlay) {
        if (versionSpan && typeof FORGE_VERSION !== 'undefined') {
            versionSpan.innerText = FORGE_VERSION;
            document.getElementById('updateStatus').innerText = `Syncing Forge v${FORGE_VERSION}...`;
        }
        overlay.style.display = 'flex';
    }
}

// ==========================================
// 2. NAVIGATION & PAGE LOADING
// ==========================================

const globalFooterHTML = `
    <div class="studio-footer">
        <div class="footer-logo">ANDY'S DEV STUDIO</div>
        <div class="footer-motto">"Forged in code, tested on the road."</div>
        <div>&copy; 2026 Andy Davis. All Rights Reserved.</div>
    </div>
`;

async function switchPage(section) {
    playPageSound();
    closeApp();
    let content = '';
    window.currentFilter = 'All';

    try {
        if (section === 'forge') {
            content = await fetchForge();
        } else if (section === 'market') {
            content = await fetchMarket();
        } else if (section === 'cargo') {
            content = await fetchCargo();
        } else if (section === 'chronicles') {
            content = await fetchChronicles();
        } else if (section === 'ravens') {
            const res = await fetch('pages/rookery.html');
            if (!res.ok) throw new Error('Page missing');
            content = await res.text();
        } else {
            const res = await fetch(`pages/${section}.html`);
            if (!res.ok) throw new Error('Page missing');
            content = await res.text();
        }
    } catch (err) {
        console.warn("Page Load Error:", err);
        content = `<div class="item-card"><h3>⚠️ Uplink Offline</h3><p>The archives for '${section}' could not be retrieved. (File Missing)</p></div>`;
    }

    // 1. Inject the content
    const container = document.getElementById('page-content');
    if (container) {
        container.innerHTML = content + globalFooterHTML;
    }

    // 2. Update the active bookmark visually
    document.querySelectorAll('.bookmark').forEach(b => b.classList.remove('active'));
    const active = document.querySelector(`.bm-${section}`);
    if (active) active.classList.add('active');

    // 3. Kickstart scripts for specific pages (like The Rookery)
    if (section === 'ravens') {
        const gridContainer = document.getElementById('streak-grid');
        if (gridContainer) {
            gridContainer.innerHTML = generateGrid();
        }
        // Use a safe check before calling the beacon
        if (typeof initRookeryBeacon === 'function') {
            initRookeryBeacon();
        }
    }
}

async function openProjectPage(url, event) {
    if (event) event.stopPropagation();
    playPageSound();

    if (!url) {
        alert("No documentation available for this item yet.");
        return;
    }

    closeApp();

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Missing project page");
        const html = await res.text();

        document.body.classList.add('reading-mode');
        document.getElementById('library-view').style.display = 'none';
        document.getElementById('book-view').className = 'open';
        document.getElementById('bookmarks').style.display = 'flex';

        document.getElementById('page-content').innerHTML = html + globalFooterHTML;

        document.querySelectorAll('.bookmark').forEach(b => b.classList.remove('active'));
        const forgeBm = document.querySelector('.bm-forge');
        if (forgeBm) forgeBm.classList.add('active');

        window.scrollTo(0, 0);
    } catch (e) {
        console.error(e);
        alert("The archives for this project are currently sealed.");
    }
}

// ==========================================
// 3. AUDIO ENGINE
// ==========================================

const FANTASY_SCALE = [
    293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25,
    587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50
];

function initAudio() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    const rate = audioCtx.sampleRate;
    const length = rate * 1.5;
    const impulse = audioCtx.createBuffer(2, length, rate);
    for (let channel = 0; channel < 2; channel++) {
        const data = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - (i / length));
        }
    }
    window.reverbNode = audioCtx.createConvolver();
    window.reverbNode.buffer = impulse;
    window.reverbNode.connect(audioCtx.destination);

    window.musicBus = audioCtx.createGain();
    window.musicBus.gain.value = 0.5;
    window.musicBus.connect(window.reverbNode);
    window.musicBus.connect(audioCtx.destination);
}

function startDrone() {
    if (!audioCtx) initAudio();

    const bufferSize = audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
    }

    windNode = audioCtx.createBufferSource();
    windNode.buffer = buffer;
    windNode.loop = true;

    windFilter = audioCtx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 400;

    windGain = audioCtx.createGain();
    windGain.gain.value = 0.15;

    windLFO = audioCtx.createOscillator();
    windLFO.type = 'sine';
    windLFO.frequency.value = 0.1;

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 300;

    windLFO.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);

    windNode.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(window.musicBus);

    windLFO.start();
    windNode.start();

    playArpeggio();
    musicInterval = setInterval(() => {
        playArpeggio();
        if (Math.random() > 0.5) setTimeout(playFairySparkle, 1000);
    }, 4000);
}

function playArpeggio() {
    const baseIndex = Math.floor(Math.random() * (FANTASY_SCALE.length - 6));
    const pattern = [0, 2, 4, 7];
    pattern.forEach((offset, i) => {
        setTimeout(() => {
            playTone(FANTASY_SCALE[baseIndex + offset], 'triangle', 0.2, 1.5);
        }, i * 150);
    });
}

function playFairySparkle() {
    const note = FANTASY_SCALE[FANTASY_SCALE.length - 1 - Math.floor(Math.random() * 4)];
    playTone(note, 'sine', 0.05, 0.8);
    setTimeout(() => { playTone(note, 'sine', 0.02, 0.8); }, 200);
}

function playTone(freq, type, vol, duration) {
    if (!freq || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(window.musicBus);
    osc.start();
    osc.stop(now + duration + 0.5);
}

function stopDrone() {
    if (windNode) {
        try {
            windNode.stop();
            if (windLFO) windLFO.stop();
            if (audioCtx.state === 'running') audioCtx.suspend();
        } catch (e) { }
        clearInterval(musicInterval);
    }
}

function playPageSound() {
    if (!isPlaying) return;
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const bufferSize = audioCtx.sampleRate * 0.2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.7;
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
    gain.gain.linearRampToValueAtTime(0, now + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
}

function playBellowsSound() {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // 1. Create a 2.5-second burst of white noise (longer, heavier whoosh)
    const duration = 2.5;
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    // 2. Shape the sound (Longer, deeper sweep)
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    const now = audioCtx.currentTime;

    // Start with a deeper rumble, push to a heavy whoosh, then slowly exhale
    filter.frequency.setValueAtTime(50, now);
    filter.frequency.exponentialRampToValueAtTime(1000, now + 0.4); // Slower, heavier push
    filter.frequency.exponentialRampToValueAtTime(50, now + duration); // Long, drawn-out fade

    // 3. Control the volume envelope (Sustained release)
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.6, now + 0.3);  // Swell up slightly slower
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration); // Bleed out over 2.5 seconds

    // Wire it up and fire
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start(now);
    noise.stop(now + duration);
}



function toggleSound() {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    isPlaying = !isPlaying;
    const btn = document.getElementById('soundBtn');
    const icon = document.getElementById('soundIcon');

    if (isPlaying) {
        btn.classList.add('active');
        icon.src = "./assets/soundon.webp";
        startDrone();
    } else {
        btn.classList.remove('active');
        icon.src = "./assets/soundoff.webp";
        stopDrone();
    }
}

// ==========================================
// 4. DATA FETCHING (Masonry Enabled)
// ==========================================

function generateCardBack(item) {
    const longHTML = item.longDescription || item.moreInfo || item.description;
    const featuresHTML = Array.isArray(item.features) && item.features.length
        ? `<div class="card-section"><div class="card-section-title">Features</div><ul class="card-bullets">${item.features.map(f => `<li>${f}</li>`).join('')}</ul></div>` : '';
    const techHTML = Array.isArray(item.tech) && item.tech.length
        ? `<div class="card-section"><div class="card-section-title">Specs</div><div class="chip-row">${item.tech.map(t => `<span class="chip">${t}</span>`).join('')}</div></div>` : '';

    return `
        <div class="project-btn" onclick="openProjectPage('${item.projectPage || ''}', event)" title="View Docs">↗</div>
        <div class="flip-btn" onclick="flipCard(this, event)">↺</div>
        <h3 class="forge-title" style="border-bottom:1px solid var(--ink); padding-bottom:10px;">${item.title}</h3>
        <div style="overflow-y: auto; flex: 1; padding-right: 5px; margin-top: 10px;">
            <p class="forge-desc" style="-webkit-line-clamp: unset; font-size: 0.95rem;">${longHTML}</p>
            ${featuresHTML}
            ${techHTML}
        </div>
        <p style="font-size: 0.8rem; font-style: italic; color: #666; margin-top: 10px; flex-shrink: 0;">Tap ↺ to flip back</p>
    `;
}

async function fetchForge() {
    try {
        const response = await fetch(getVersionedAsset('./forge/forge_manifest.json'));
        if (!response.ok) throw new Error('Forge manifest missing');
        forgeItems = await response.json();

        let html = `
        <h1 class="page-title">The Forge</h1>
        <div class="forge-controls">
            <input type="text" id="forgeSearch" class="forge-search" placeholder="Search blueprints..." onkeyup="filterForge()">
            <div class="forge-filters" id="forgeFilters">
                <button class="filter-pill active" onclick="setFilter('All', this)">All</button>
                <button class="filter-pill" onclick="setFilter('Games', this)">Games</button>
                <button class="filter-pill" onclick="setFilter('Tools', this)">Tools</button>
                <button class="filter-pill" onclick="setFilter('Prototypes', this)">Prototypes</button>
                <button class="filter-pill" onclick="setFilter('Math', this)">Math</button>
            </div>
        </div>
        <div id="forgeList" class="gallery-grid masonry-mode">`;

        forgeItems.forEach(item => {
            let headerHTML = item.image
                ? `<img src="${getVersionedAsset(item.image)}" class="forge-header-img" alt="${item.title}">`
                : `<div class="forge-img-container"><div class="forge-img-emoji">${item.icon}</div></div>`;

            html += `
            <div class="item-card forge-item flip-container" data-type="${item.type}">
                <div class="flipper">
                    <div class="front">
                        <div class="project-btn" onclick="openProjectPage('${item.projectPage || ''}', event)" title="Open Project">↗</div>
                        <div class="flip-btn" onclick="flipCard(this, event)">↺</div>
                        ${headerHTML}
                        <div class="card-inner">
                            <h3 class="forge-title">${item.title}</h3>
                            <p class="forge-desc">${item.description}</p>
                            <div class="meta-row">
                                <span class="badge badge-ver">${item.version}</span>
                                <span class="badge ${item.statusClass}">${item.status}</span>
                            </div>
                            <button onclick="${item.action}" class="forge-btn">${item.buttonText}</button>
                        </div>
                    </div>
                    <div class="back">${generateCardBack(item)}</div>
                </div>
            </div>`;
        });
        html += `</div>`;
        return html;
    } catch (error) { return `<h1 class="page-title">The Forge</h1><p>The fires are cold.</p>`; }
}

async function fetchMarket() {
    try {
        const response = await fetch(getVersionedAsset('./market/market_manifest.json'));
        if (!response.ok) throw new Error('Market manifest missing');
        marketItems = await response.json();

        let html = `
        <h1 class="page-title">The Ledger</h1>
        <div class="item-card" style="margin-bottom: 30px; border-left: 4px solid var(--gold); transform:none;">
            <p style="font-style: italic; line-height: 1.6; margin:0; font-size: 1.1rem;">
                We utilize the <strong>itch.io</strong> marketplace for all secure transactions. This ensures maximized support for independent development, with no proprietary launchers or corporate overhead.
            </p>
        </div>
        <div id="marketList" class="gallery-grid masonry-mode">`;

        marketItems.forEach(item => {
            let headerHTML = item.image
                ? `<img src="${getVersionedAsset(item.image)}" class="forge-header-img" alt="${item.title}">`
                : `<div class="forge-img-container"><div class="forge-img-emoji">${item.icon}</div></div>`;

            html += `
            <div class="item-card forge-item flip-container">
                <div class="flipper">
                    <div class="front">
                        <div class="project-btn" onclick="openProjectPage('${item.projectPage || ''}', event)" title="Asset Info">↗</div>
                        <div class="flip-btn" onclick="flipCard(this, event)">↺</div>
                        ${headerHTML}
                        <div class="card-inner">
                            <div class="market-header-row">
                                <h3 class="forge-title">${item.title}</h3>
                                <span class="price-tag">${item.price}</span>
                            </div>
                            <p class="forge-desc">${item.description}</p>
                            <button onclick="${item.action}" class="forge-btn">${item.buttonText}</button>
                        </div>
                    </div>
                    <div class="back">
                        ${generateCardBack(item)}
                        <div style="margin-top:10px; width:100%; flex-shrink:0;">
                            <button onclick="${item.action}" class="forge-btn" style="background:var(--gold); color:#000; border:1px solid #000; font-weight:bold;">
                                ${item.buttonText} VIA ITCH.IO
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        html += `</div>`;
        return html;
    } catch (error) { return `<h1 class="page-title">The Ledger</h1><p>The ledger is closed. (Data Error)</p>`; }
}

async function fetchCargo() {
    try {
        const response = await fetch(getVersionedAsset('./market/cargo_manifest.json'));
        if (!response.ok) throw new Error('Cargo manifest missing');
        const cargoItems = await response.json();

        let html = `<h1 class="page-title">The Cargo Bay</h1>
                    <div class="item-card" style="margin-bottom: 30px; border-left: 4px solid #d97706; transform:none;">
                        <p style="line-height: 1.6; margin:0; font-size: 1.05rem;">
                            <strong>Physical provisions for the road and the desk.</strong><br><br>
                            In the spirit of full transparency: I'm a solo developer, not a warehouse. To keep this operation lean, I use a professional print-on-demand network. When you acquire gear here, you'll be routed to my creator storefront to check out. They custom-print the item and ship it straight to you. It ensures high quality without the overhead, and every order directly supports the studio. Thanks for riding with the fleet.
                        </p>
                    </div>
                    <div id="cargoList" class="gallery-grid masonry-mode">`;

        cargoItems.forEach(item => {
            let headerHTML = item.image
                ? `<img src="${getVersionedAsset(item.image)}" class="forge-header-img" alt="${item.title}">`
                : `<div class="forge-img-container"><div class="forge-img-emoji">📦</div></div>`;

            html += `
            <div class="item-card forge-item flip-container">
                <div class="flipper">
                    <div class="front">
                        <div class="project-btn" onclick="openProjectPage('${item.projectPage || ''}', event)" title="View Details">↗</div>
                        <div class="flip-btn" onclick="flipCard(this, event)">↺</div>
                        
                        ${headerHTML}
                        <div class="card-inner">
                            <div class="market-header-row">
                                <h3 class="forge-title">${item.title}</h3>
                                <span class="price-tag">${item.price || ''}</span>
                            </div>
                            <p class="forge-desc">${item.description}</p>
                            <button onclick="${item.action}" class="forge-btn">${item.buttonText}</button>
                        </div>
                    </div>
                    <div class="back">
                        ${generateCardBack(item)}
                    </div>
                </div>
            </div>`;
        });
        html += `</div>`;
        return html;
    } catch (error) {
        return `<h1 class="page-title">The Cargo Bay</h1><p>The bay is currently empty. Check back after the next delivery.</p>`;
    }
}


async function fetchChronicles() {
    try {
        const response = await fetch(getVersionedAsset('./thechronicles/journal_manifest.json'));
        if (!response.ok) throw new Error('Manifest not found');
        journalEntries = await response.json();

        let html = `<h1 class="page-title">The Chronicles</h1>`;
        // MASONRY MODE APPLIED
        html += `<div id="chronicleList" class="gallery-grid masonry-mode">`;

        journalEntries.forEach(entry => {
            const imageHTML = entry.image
                ? `<img src="${getVersionedAsset(entry.image)}" class="forge-header-img" alt="${entry.title}">`
                : '';

            html += `
            <div class="item-card">
                ${imageHTML}
                <div class="card-inner">
                    <div class="log-date" style="color:#8b0000; font-weight:bold; margin-bottom:5px;">${entry.date}</div>
                    <div class="log-title" style="margin:0 0 10px 0;">${entry.title}</div>
                    <div class="log-body" style="font-size:0.95rem;">${entry.summary}</div>
                    <a class="read-more-link" onclick="openJournalEntry('${entry.id}')">READ MORE...</a>
                </div>
            </div>`;
        });
        html += `</div>`;
        return html;
    } catch (error) { return `<h1 class="page-title">The Chronicles</h1><p>The archives are currently sealed.</p>`; }
}

// ==========================================
// AUTO-LOAD RECENT CHRONICLES ON HOME PAGE
// ==========================================
async function initHomeChronicles() {
    try {
        // Safe check in case getVersionedAsset isn't loaded yet
        const manifestUrl = typeof getVersionedAsset === 'function'
            ? getVersionedAsset('./thechronicles/journal_manifest.json')
            : './thechronicles/journal_manifest.json';

        const response = await fetch(manifestUrl);
        if (!response.ok) return;

        journalEntries = await response.json();

        const listContainer = document.getElementById('recent-chronicles-list');
        if (listContainer) {
            const topThree = journalEntries.slice(0, 3);
            let html = '';

            topThree.forEach(entry => {
                const dateStr = (entry.date || '').toUpperCase();
                html += `
                <div class="chronicle-scrap" onclick="openJournalEntry('${entry.id}')">
                    <span class="scrap-date">${dateStr}</span>
                    <h4 class="scrap-title">${entry.title}</h4>
                    <p class="scrap-desc">${entry.summary}</p>
                </div>`;
            });

            listContainer.innerHTML = html;
        }
    } catch (e) {
        console.warn("Could not load recent chronicles for home page", e);
    }
}

// Ensure it runs as soon as the page is ready
document.addEventListener('DOMContentLoaded', initHomeChronicles);

// ==========================================
// BULLETPROOF JOURNAL OPENER
// ==========================================
async function openJournalEntry(id) {
    // Failsafe: Fetch manifest if it wasn't loaded
    if (journalEntries.length === 0) {
        try {
            const manifestUrl = typeof getVersionedAsset === 'function' ? getVersionedAsset('./thechronicles/journal_manifest.json') : './thechronicles/journal_manifest.json';
            const response = await fetch(manifestUrl);
            if (response.ok) journalEntries = await response.json();
        } catch (e) {
            console.warn("Manifest fetch failed", e);
        }
    }

    const entry = journalEntries.find(e => e.id === id);
    if (!entry) {
        alert("This scroll is currently sealed or missing.");
        return;
    }

    try {
        const response = await fetch(entry.file);
        if (!response.ok) throw new Error('Entry not found');
        const text = await response.text();

        const imgPath = typeof getVersionedAsset === 'function' && entry.image ? getVersionedAsset(entry.image) : entry.image;
        const imageHTML = entry.image ? `<img src="${imgPath}" class="journal-featured-img" alt="${entry.title}">` : '';

        // FIX: Wrapped ${text} in <div class="entry-content"> to constrain images and hide double titles
        const fullPostHTML = `
            ${imageHTML}
            <div class="log-date" style="text-align:center; margin-top:10px;">${entry.date}</div>
            <h2 class="log-title" style="text-align:center; border:none; font-size: 2rem; margin-bottom:10px;">${entry.title}</h2>
            <hr style="border: 0; border-top: 1px dashed var(--ink); margin-bottom: 30px;">
            <div class="entry-content">${text}</div>
        `;

        document.getElementById('journalContent').innerHTML = fullPostHTML;
        document.getElementById('journalReader').classList.add('active');

        if (typeof playPageSound === 'function') playPageSound();
    } catch (error) {
        console.error("Journal Read Error:", error);
        alert("This scroll seems to be missing.");
    }
}

function closeJournal() {
    document.getElementById('journalReader').classList.remove('active');
    playPageSound();
}

// ==========================================
// 5. UI INTERACTIONS
// ==========================================

async function openBook(section) {
    playPageSound();
    document.body.classList.add('reading-mode');
    document.getElementById('library-view').style.display = 'none';
    document.getElementById('book-view').className = 'open';
    document.getElementById('bookmarks').style.display = 'flex';
    window.scrollTo(0, 0);
    await switchPage(section);
}

function closeBook() {
    closeApp();
    playPageSound();
    document.body.classList.remove('reading-mode');
    document.getElementById('library-view').style.display = 'flex';
    document.getElementById('book-view').className = '';
    document.getElementById('bookmarks').style.display = 'none';
}

function toggleInfo() {
    const modal = document.getElementById('infoModal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

function goHome() { closeBook(); toggleInfo(); }

function launchApp(url) {
    const frame = document.getElementById('appFrame');
    frame.src = url;
    document.getElementById('appLayer').classList.add('active');
    frame.onload = function () {
        try {
            const innerDoc = frame.contentWindow.document;
            const backBtn = innerDoc.querySelector('.back-btn');
            if (backBtn) backBtn.onclick = function (e) { e.preventDefault(); closeApp(); };
        } catch (e) { }
    };
}

function closeApp() {
    document.getElementById('appLayer').classList.remove('active');
    document.getElementById('appFrame').src = "";
}

function filterForge() {
    const search = document.getElementById('forgeSearch').value.toLowerCase();
    const items = document.querySelectorAll('.forge-item');
    items.forEach(item => {
        const type = item.dataset.type;
        const text = item.innerText.toLowerCase();
        const matchesSearch = text.includes(search);
        const matchesFilter = !window.currentFilter || window.currentFilter === 'All' || type === window.currentFilter;
        item.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
    });
}

function setFilter(filterType, btnElement) {
    window.currentFilter = filterType;
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
    filterForge();
}

function flipCard(btn, event) {
    event.stopPropagation();
    const card = btn.closest('.flip-container');
    card.classList.toggle('flipped');
    playPageSound();
}

function toggleFullscreen() {
    const doc = window.document;
    const docEl = doc.documentElement;

    // Checks for standard, Mozilla, Webkit (Apple/Safari), and Microsoft prefixes
    const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    // Check if a screen is currently active using all prefixes
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        if (requestFullScreen) {
            // Trigger fullscreen with a catch for strict mobile security policies
            requestFullScreen.call(docEl).catch(err => console.log("Fullscreen blocked by browser:", err));
        } else {
            // Failsafe for iOS Safari which strictly blocks manual fullscreen
            alert("Fullscreen is restricted by this browser. On iOS, please use 'Add to Home Screen' for fullscreen mode.");
        }
    } else {
        if (cancelFullScreen) {
            cancelFullScreen.call(doc);
        }
    }
}


setInterval(() => {
    const clockElement = document.getElementById('clock');
    if (clockElement) clockElement.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}, 1000);

// ==========================================
// 6. DRAGGABLE BOOKMARKS (Natural Drag Fix)
// ==========================================

const bmContainer = document.getElementById('bookmarks');
let isDragging = false;
let startY = 0;
let initialTop = 0;

if (bmContainer) {
    bmContainer.addEventListener('pointerdown', (e) => {
        isDragging = false;
        startY = e.clientY;
        const rect = bmContainer.getBoundingClientRect();
        initialTop = rect.top;
    });

    bmContainer.addEventListener('pointermove', (e) => {
        if (e.buttons !== 1) return;

        const currentY = e.clientY;
        const deltaY = currentY - startY;

        if (Math.abs(deltaY) > 5) {
            isDragging = true;
            e.preventDefault();
            bmContainer.setPointerCapture(e.pointerId);

            bmContainer.style.transition = 'none';
            bmContainer.style.transform = 'none';
            bmContainer.style.bottom = 'auto';

            bmContainer.style.top = (initialTop + deltaY) + 'px';
        }
    });

    bmContainer.addEventListener('pointerup', (e) => {
        bmContainer.releasePointerCapture(e.pointerId);
    });
}

// ==========================================
// 6.5 DESKTOP SLIDER ARROWS
// ==========================================
function scrollSlider(id, direction) {
    const slider = document.getElementById(id);
    if (!slider) return;
    const scrollAmount = 200 * direction;
    slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// ==========================================
// 7. UTILITIES & CONTACT
// ==========================================

function sendRaven() {
    const name = document.getElementById('ravenName')?.value;
    const email = document.getElementById('ravenEmail')?.value;
    const msg = document.getElementById('ravenMsg')?.value;

    if (!msg) { alert("The scroll is blank! Please write a message."); return; }

    const subject = `Raven from ${name || 'A Traveler'}`;
    const body = `Name: ${name || 'N/A'}%0D%0AEmail: ${email || 'N/A'}%0D%0A%0D%0A${msg}`;
    window.location.href = `mailto:andys.dev.studio@gmail.com?subject=${subject}&body=${body}`;
}

function generateGrid() {
    let html = '';
    const saved = JSON.parse(localStorage.getItem('andy_tester_days') || '[]');
    for (let i = 1; i <= 14; i++) {
        const isActive = saved.includes(i);
        const activeClass = isActive ? 'active' : '';
        // Added the Raven!
        const content = isActive ? '🐦‍⬛' : i;

        // Stripped out the inline backgrounds so the dark mode CSS works perfectly
        html += `
        <div onclick="toggleDay(${i})" 
             class="streak-cell ${activeClass}"
             style="aspect-ratio:1; display:flex; align-items:center; justify-content:center; cursor:pointer; font-family:'Share Tech Mono'; font-size:1.2rem; transition: all 0.2s;">
            ${content}
        </div>`;
    }
    return html;
}

function toggleDay(num) {
    let saved = JSON.parse(localStorage.getItem('andy_tester_days') || '[]');
    if (saved.includes(num)) saved = saved.filter(n => n !== num);
    else saved.push(num);
    localStorage.setItem('andy_tester_days', JSON.stringify(saved));
    playPageSound();
    document.getElementById('streak-grid').innerHTML = generateGrid();
}

async function sendBugReport() {
    const dest = document.getElementById('bugDest')?.value;
    const project = document.getElementById('bugProject')?.value;
    const type = document.getElementById('bugType')?.value;
    const msg = document.getElementById('bugMsg')?.value;

    if (!project || !msg) {
        alert("The scroll is incomplete! Please select an alloy and describe the fracture.");
        return;
    }

    const btn = document.querySelector('.highlight-btn');
    const originalText = btn.innerText;
    btn.innerText = "🚀 TRANSMITTING...";
    btn.disabled = true;

    // --- ROUTE 1: EMAIL (DEFAULT) ---
    if (dest === 'email') {
        const subject = encodeURIComponent(`Bug Report: ${project} - ${type}`);
        const body = encodeURIComponent(`Target: ${project}\nType: ${type}\n\nDetails:\n${msg}`);

        // IMPORTANT: Put your actual email address here
        window.location.href = `mailto:YOUR_EMAIL_HERE@gmail.com?subject=${subject}&body=${body}`;

        setTimeout(() => {
            document.getElementById('bugMsg').value = '';
            btn.innerText = "✓ DISPATCHED";
            setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 2000);
        }, 500);
    }

    // --- ROUTE 2: DISCORD WEBHOOK ---
    else {
        // IMPORTANT: Put your Discord Webhook URL here
        const webhookUrl = "YOUR_DISCORD_WEBHOOK_URL_HERE";
        const payload = {
            username: "Rookery Dispatch",
            content: `🚨 **New Forge Report**\n**Target:** ${project}\n**Type:** ${type}\n**Details:**\n> ${msg.replace(/\n/g, '\n> ')}`
        };

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                document.getElementById('bugMsg').value = '';
                btn.innerText = "✓ DISPATCHED";
                setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 3000);
            } else {
                alert("The dispatch failed. Check your webhook URL.");
                btn.innerText = originalText; btn.disabled = false;
            }
        } catch (error) {
            alert("Network error. The signal was lost on the highway.");
            btn.innerText = originalText; btn.disabled = false;
        }
    }
}

// ==========================================
// 8. BACKGROUND CACHE HEATER (SILENT MODE)
// ==========================================
async function heatTheCache() {
    const manifests = [
        './thechronicles/journal_manifest.json',
        './forge/forge_manifest.json',
        './market/market_manifest.json'
    ];

    try {
        for (const url of manifests) {
            try {
                const res = await fetch(getVersionedAsset(url));
                if (res.ok) {
                    const items = await res.json();
                    for (const item of items) {
                        if (item.image) fetch(item.image, { mode: 'no-cors' });
                    }
                }
            } catch (e) {
                // Ignore missing files in background heater
            }
        }
    } catch (e) {
        // Silent fail
    }
}

window.addEventListener('load', () => {
    setTimeout(heatTheCache, 3000);
});

// ==========================================
// QA ARSENAL: TESTER UTILITIES
// ==========================================

// 1. Silent Error Catcher
// This secretly listens for any JavaScript errors on the page and saves them.
window.ravenErrors = [];
window.addEventListener('error', function (e) {
    const time = new Date().toLocaleTimeString();
    window.ravenErrors.push(`[${time}] ${e.message} at ${e.filename}:${e.lineno}`);
});

// 2. The Log Snagger
function snagErrorLog() {
    // Grab the tester's exact screen size and browser info
    const specs = `Platform: ${navigator.platform}\nScreen: ${window.innerWidth}x${window.innerHeight}\nBrowser: ${navigator.userAgent}`;

    // Format any errors we caught
    const errors = window.ravenErrors.length > 0 ? window.ravenErrors.join('\n') : 'No background JS errors caught.';

    // Build the final clipboard payload
    const payload = `--- SYSTEM SPECS ---\n${specs}\n\n--- CAUGHT ERRORS ---\n${errors}`;

    // Copy it to the user's clipboard
    navigator.clipboard.writeText(payload).then(() => {
        alert('System specs and error logs copied! Paste this directly into the Bellows bug report.');
    }).catch(err => {
        alert('Clipboard access denied by your browser. Cannot snag log.');
    });
}

// 3. The Viewport Resizer
function toggleViewport() {
    // Grabs the iframe where your apps launch
    const frame = document.getElementById('appFrame');
    if (!frame) return;

    // Toggles the mobile-testing class
    frame.classList.toggle('mobile-viewport-mode');

    // Give the user feedback
    if (frame.classList.contains('mobile-viewport-mode')) {
        alert("Mobile Viewport active. Launch an Alloy to see it constrained to a phone screen.");
    } else {
        alert("Viewport reset to full screen.");
    }
}

// ==========================================
// BEACON UPDATER
// ==========================================
async function initRookeryBeacon() {
    const liveBeacon = document.getElementById('live-beacon-text');
    if (!liveBeacon) return;

    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQiZS1A-cFrtBaI2Zahe7C-8zTekXgcuhbDEcyF37mYIZpHmIUoqd8D9WtSPbU-iU6NeBe001jkBXuZ/pub?output=tsv';
    const bypassCacheUrl = `${sheetUrl}&_=${new Date().getTime()}`;

    try {
        const response = await fetch(bypassCacheUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.text();

        const rows = data.split('\n');
        const firstCell = rows[0].split('\t')[0].replace(/"/g, '').trim();

        if (firstCell) {
            liveBeacon.innerHTML = `<strong>🟢 BEACON ACTIVE:</strong> ${firstCell}`;
        }
    } catch (err) {
        console.error('Beacon Fetch Error:', err);
        liveBeacon.innerHTML = '<strong>🔴 BEACON OFFLINE</strong>';
    }
}

// ==========================================
// 9. DYNAMIC DIRECTORY NAVIGATION
// ==========================================

function toggleCategory(id) {
    if (typeof playPageSound === 'function') playPageSound();
    const subMenu = document.getElementById(id);
    const allSubs = document.querySelectorAll('.drawer-sub-menu');

    // Close other categories when one opens to keep the drawer tidy
    allSubs.forEach(sub => {
        if (sub.id !== id) sub.classList.remove('open');
    });

    subMenu.classList.toggle('open');
}

async function populateDirectory() {
    const categories = [
        { id: 'forge-menu', url: './forge/forge_manifest.json', type: 'project' },
        { id: 'ledger-menu', url: './market/market_manifest.json', type: 'project' },
        { id: 'cargo-menu', url: './market/cargo_manifest.json', type: 'cargo' },
        { id: 'chronicles-menu', url: './thechronicles/journal_manifest.json', type: 'journal' }
    ];

    for (const cat of categories) {
        try {
            // Safe fallback just in case config.js loads late
            const fetchUrl = typeof getVersionedAsset === 'function' ? getVersionedAsset(cat.url) : cat.url;
            const res = await fetch(fetchUrl);
            if (!res.ok) continue;

            const items = await res.json();
            const menu = document.getElementById(cat.id);

            if (menu) {
                // Limit to 8 items to keep the sidebar from becoming a mile long
                menu.innerHTML = items.slice(0, 8).map(item => {
                    if (cat.type === 'project') {
                        return `<a href="#" onclick="openProjectPage('${item.projectPage}', event); toggleHamburger()">+ ${item.title}</a>`;
                    } else if (cat.type === 'journal') {
                        return `<a href="#" onclick="openJournalEntry('${item.id}'); toggleHamburger()">+ ${item.title}</a>`;
                    } else if (cat.type === 'cargo') {
                        // If the item has a dedicated page, route directly to it
                        if (item.projectPage) {
                            return `<a href="#" onclick="openProjectPage('${item.projectPage}', event); toggleHamburger()">+ ${item.title}</a>`;
                        }
                        // Otherwise, fallback to opening the main Cargo Bay
                        else {
                            return `<a href="#" onclick="openBook('cargo'); toggleHamburger()">+ ${item.title}</a>`;
                        }
                    }

                    return '';
                }).join('');
            }
        } catch (e) {
            console.warn(`Directory sync failed for ${cat.id}`, e);
        }
    }
}

// Fire the engines on load
document.addEventListener('DOMContentLoaded', populateDirectory);
