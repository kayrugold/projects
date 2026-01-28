/* app.js - v4.0 Manifest Driven */

let journalEntries = [];
let forgeItems = [];
let marketItems = [];

// --- NAVIGATION & FETCHING ---
async function switchPage(section) {
	closeApp();
    let content = '';
    
    // We clear the search filter when switching pages
    window.currentFilter = 'All';

    try {
        if (section === 'forge') {
            content = await fetchForge();
        } else if (section === 'market') {
            content = await fetchMarket();
        } else if (section === 'chronicles') {
            content = await fetchChronicles();
        } else if (section === 'ravens') {
            const res = await fetch('pages/rookery.html');
            if(!res.ok) throw new Error('Page missing');
            content = await res.text();
        } else {
            // Guild and others
            const res = await fetch(`pages/${section}.html`);
            if(!res.ok) throw new Error('Page missing');
            content = await res.text();
        }
    } catch (err) {
        console.error(err);
        content = `<div class="item-card"><h3>Error 404</h3><p>This scroll is missing from the archives.</p></div>`;
    }
    
    document.getElementById('page-content').innerHTML = content;
    
    // UI Updates
    document.querySelectorAll('.bookmark').forEach(b => b.classList.remove('active'));
    const active = document.querySelector(`.bm-${section}`);
    if(active) active.classList.add('active');

    // Re-init Logic for specific pages
    if (section === 'ravens') document.getElementById('streak-grid').innerHTML = generateGrid();
}

// --- FORGE ENGINE ---
async function fetchForge() {
    try {
        const response = await fetch('./forge/forge_manifest.json');
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
            </div>
        </div>
        <div id="forgeList" class="gallery-grid">`;

        // ... inside fetchForge() ...

        forgeItems.forEach(item => {
            // 1. Build the Header (Image or Icon)
            let headerHTML = '';
            if (item.image) {
                headerHTML = `<img src="${item.image}" class="forge-header-img" alt="${item.title}">`;
            } else {
                headerHTML = `
                <div class="forge-img-container">
                    <div class="forge-img-emoji">${item.icon}</div>
                </div>`;
            }

            // 2. Build the NEW Flip Structure
            // Notice: onclick="flipCard(this)" on the arrow button
            html += `
            <div class="item-card flip-container" data-type="${item.type}">
                <div class="flipper">
                    
                    <div class="front">
                        <div class="flip-btn" onclick="flipCard(this, event)">↺</div>
                        ${headerHTML}
                        <div class="card-inner">
                            <h3 class="forge-title">${item.title}</h3>
                            <p class="forge-desc" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.description}</p>
                            <div class="meta-row">
                                <span class="badge badge-ver">${item.version}</span>
                                <span class="badge ${item.statusClass}">${item.status}</span>
                            </div>
                            <button onclick="${item.action}" class="forge-btn">${item.buttonText}</button>
                        </div>
                    </div>

                    <div class="back">
                        <div class="flip-btn" onclick="flipCard(this, event)">↺</div>
                        <h3 class="forge-title" style="border-bottom:1px solid var(--ink); padding-bottom:10px;">${item.title}</h3>
                        <p class="forge-desc" style="font-size: 1rem; margin-top: 15px;">
                            ${item.description}
                        </p>
                        <p style="font-size: 0.9rem; font-style: italic; color: #666; margin-top: auto;">
                            Tap the arrow to return to the main view.
                        </p>
                    </div>

                </div>
            </div>`;
        });
// ... rest of function ...

        html += `</div>`;
        return html;
    } catch (error) {
        return `<h1 class="page-title">The Forge</h1><p>The fires are cold. (Manifest load error)</p>`;
    }
}



// --- MARKET ENGINE (The Ledger) ---
async function fetchMarket() {
    try {
        const response = await fetch('./market/market_manifest.json');
        if (!response.ok) throw new Error('Market manifest missing');
        marketItems = await response.json();

        // 1. The Fixed Header (Itch.io Message)
        let html = `
        <h1 class="page-title">The Ledger</h1>
        <div class="item-card" style="margin-bottom: 30px; border-left: 4px solid var(--gold);">
            <p style="font-style: italic; line-height: 1.6; margin:0; font-size: 1.1rem;">
                We utilize the <strong>itch.io</strong> marketplace for all secure transactions. 
                This ensures maximized support for independent development, with no proprietary launchers or corporate overhead.
            </p>
        </div>
        <div id="marketList" class="gallery-grid">`;

        // 2. The Dynamic Cards (Now with 3D Flip Logic)
        marketItems.forEach(item => {
            // A. Build Header (Image or Icon)
            let headerHTML = '';
            if (item.image) {
                headerHTML = `<img src="${item.image}" class="forge-header-img" alt="${item.title}">`;
            } else {
                headerHTML = `
                <div class="forge-img-container">
                    <div class="forge-img-emoji">${item.icon}</div>
                </div>`;
            }

            // B. Build the Flip Structure
            html += `
            <div class="item-card forge-item flip-container">
                <div class="flipper">
                    
                    <div class="front">
                        <div class="flip-btn" onclick="flipCard(this, event)">↺</div>
                        ${headerHTML}
                        <div class="card-inner">
                            <div class="market-header-row">
                                <h3 class="forge-title">${item.title}</h3>
                                <span class="price-tag">${item.price}</span>
                            </div>
                            <p class="forge-desc" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${item.description}
                            </p>
                            <button onclick="${item.action}" class="forge-btn">${item.buttonText}</button>
                        </div>
                    </div>

                    <div class="back">
                        <div class="flip-btn" onclick="flipCard(this, event)">↺</div>
                        <h3 class="forge-title" style="border-bottom:1px solid var(--ink); padding-bottom:10px;">${item.title}</h3>
                        
                        <p class="forge-desc" style="font-size: 1rem; margin-top: 15px;">
                            ${item.description}
                        </p>
                        
                        <div style="margin-top:auto; width:100%">
                            <p style="font-size: 0.9rem; font-style: italic; color: #666; margin-bottom: 10px;">
                                secure transaction via itch.io
                            </p>
                            <button onclick="${item.action}" class="forge-btn" style="background:var(--gold); color:#000; border:1px solid #000; font-weight:bold;">
                                ${item.buttonText}
                            </button>
                        </div>
                    </div>

                </div>
            </div>`;
        });

        html += `</div>`;
        return html;
    } catch (error) {
        return `<h1 class="page-title">The Ledger</h1><p>The ledger is closed.</p>`;
    }
}



// --- CHRONICLES ENGINE ---
async function fetchChronicles() {
    try {
        const response = await fetch('./thechronicles/journal_manifest.json');
        if (!response.ok) throw new Error('Manifest not found');
        journalEntries = await response.json(); 
        
        let html = `<h1 class="page-title">The Chronicles</h1>`;
        
        journalEntries.forEach(entry => {
            const imageHTML = entry.image 
                ? `<img src="${entry.image}" class="journal-featured-img" alt="${entry.title}" loading="lazy">` 
                : '';

            html += `
            <div class="item-card">
                ${imageHTML}
                <div class="log-date">${entry.date}</div>
                <div class="log-title">${entry.title}</div>
                <div class="log-body">${entry.summary}</div>
                <a class="read-more-link" onclick="openJournalEntry('${entry.id}')">Read more...</a>
            </div>`;
        });
        
        return html;
    } catch (error) {
        return `<h1 class="page-title">The Chronicles</h1><p>The archives are currently sealed.</p>`;
    }
}

async function openJournalEntry(id) {
    const entry = journalEntries.find(e => e.id === id);
    if (!entry) return;

    try {
        const response = await fetch(entry.file);
        if (!response.ok) throw new Error('Entry not found');
        const text = await response.text();
        
        const imageHTML = entry.image 
            ? `<img src="${entry.image}" class="journal-featured-img" alt="${entry.title}">` 
            : '';

        const fullPostHTML = `
            ${imageHTML}
            <div class="log-date" style="text-align:center; margin-top:10px;">${entry.date}</div>
            <h2 class="log-title" style="text-align:center; border:none; font-size: 2rem; margin-bottom:10px;">${entry.title}</h2>
            <hr style="border: 0; border-top: 1px dashed var(--ink); margin-bottom: 30px;">
            ${text}
        `;
        
        document.getElementById('journalContent').innerHTML = fullPostHTML;
        document.getElementById('journalReader').classList.add('active');
        playPageSound(); 
    } catch (error) {
        alert("This scroll seems to be missing.");
    }
}

function closeJournal() {
    document.getElementById('journalReader').classList.remove('active');
    playPageSound(); 
}

// --- AUDIO ENGINE (Procedural Medieval) ---
let audioCtx = null;
let isPlaying = false;
let droneOsc1, droneOsc2, droneGain;
let musicInterval;

// A Medieval "D Dorian" scale (D, E, F, G, A, B, C)
// These frequencies sound like folk music, not random sci-fi beeps.
const MEDIEVAL_SCALE = [
    293.66, // D4
    329.63, // E4
    349.23, // F4
    392.00, // G4
    440.00, // A4
    493.88, // B4
    523.25, // C5
    587.33, // D5 (High)
    698.46  // F5 (High Flute)
];

function initAudio() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    
    // Create a reverb effect (Convolver) to make it sound like a large hall
    // This gives it that "Cathedral" or "Tavern" atmosphere
    const rate = audioCtx.sampleRate;
    const length = rate * 2.0; 
    const impulse = audioCtx.createBuffer(2, length, rate);
    for (let channel = 0; channel < 2; channel++) {
        const data = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
        }
    }
    window.reverbNode = audioCtx.createConvolver();
    window.reverbNode.buffer = impulse;
    window.reverbNode.connect(audioCtx.destination);
    
    // Master Bus
    window.musicBus = audioCtx.createGain();
    window.musicBus.gain.value = 0.4; 
    window.musicBus.connect(window.reverbNode);
    window.musicBus.connect(audioCtx.destination);
}

function startDrone() {
    if (!audioCtx) initAudio();
    
    // The "Drone" (Background String Sound)
    // We use Sawtooth waves for a "Cello/Violin" texture
    droneOsc1 = audioCtx.createOscillator();
    droneOsc1.type = 'sawtooth';
    droneOsc1.frequency.value = 73.42; // Low D2 (Cello)
    
    droneOsc2 = audioCtx.createOscillator();
    droneOsc2.type = 'sawtooth';
    droneOsc2.frequency.value = 110.00; // Low A2 (Harmony)

    // Filter the drone so it's warm, not buzzy
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400; // Cut off the harsh buzzing

    droneGain = audioCtx.createGain();
    droneGain.gain.value = 0.15; // Keep it quiet

    droneOsc1.connect(filter);
    droneOsc2.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(window.musicBus);

    droneOsc1.start();
    droneOsc2.start();

    playRandomNote();
    // Faster pace: New note every 1.5 seconds (was 4s)
    musicInterval = setInterval(playRandomNote, 1500); 
}

function playRandomNote() {
    if (Math.random() > 0.8) return; // Sometimes pause for breath

    const osc = audioCtx.createOscillator();
    
    // TRIANGLE wave sounds like a FLUTE or RECORDER
    osc.type = 'triangle'; 
    
    // Pick a note from our Medieval Scale
    const freq = MEDIEVAL_SCALE[Math.floor(Math.random() * MEDIEVAL_SCALE.length)];
    osc.frequency.value = freq;

    const gain = audioCtx.createGain();
    
    // ENVELOPE (The Shape of the Sound)
    // Flutes have a soft attack (breath)
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.1); // Fade in (Breath)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8); // Fade out

    osc.connect(gain);
    gain.connect(window.musicBus); 
    
    osc.start();
    osc.stop(audioCtx.currentTime + 1);
}

function stopDrone() {
    if (droneOsc1) {
        try {
            droneOsc1.stop();
            droneOsc2.stop();
        } catch(e){}
        clearInterval(musicInterval);
    }
}

// --- THE NEW "PAGE FLIP" SOUND ---
function playPageSound() {
    if (!isPlaying || !audioCtx) return;

    // Create White Noise
    const bufferSize = audioCtx.sampleRate * 0.5; // Short buffer
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; 
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    // FILTER (The "Swish" Maker)
    // We cut the highs and lows to sound like paper
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200; // Removes the "Gunshot" crackle

    const gain = audioCtx.createGain();
    
    // ENVELOPE (The "Swish" Movement)
    // Instead of instant loud (BANG), we fade in quickly (SWISH)
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.05); // Attack (Swish up)
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2); // Decay (Swish down)

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noise.start();
}

function toggleSound() {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    isPlaying = !isPlaying;
    const btn = document.getElementById('soundBtn');
    
    // Visual Toggle (Optional if you have icons)
    const icon = document.getElementById('soundIcon');
    
    if (isPlaying) {
        btn.classList.add('active');
        icon.src = "./assets/soundon.png";
        startDrone();
    } else {
        btn.classList.remove('active');
        icon.src = "./assets/soundoff.png";
        stopDrone();
    }
}

// --- UI HELPERS ---
async function openBook(section) {
    playPageSound();
    document.body.classList.add('reading-mode'); 
    document.getElementById('library-view').style.display = 'none';
    document.getElementById('book-view').className = 'open';
    document.getElementById('bookmarks').style.display = 'flex';
    window.scrollTo(0,0); 
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
    frame.onload = function() {
        try {
            const innerDoc = frame.contentWindow.document;
            const backBtn = innerDoc.querySelector('.back-btn');
            if(backBtn) backBtn.onclick = function(e) { e.preventDefault(); closeApp(); };
        } catch(e) {}
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

function generateGrid() {
    let html = '';
    const saved = JSON.parse(localStorage.getItem('andy_tester_days') || '[]');
    for(let i=1; i<=14; i++) {
        const active = saved.includes(i) ? 'background:var(--ink); color:var(--parchment);' : '';
        html += `<div onclick="toggleDay(${i})" style="aspect-ratio:1; display:flex; align-items:center; justify-content:center; cursor:pointer; border:1px solid var(--ink); ${active}">${i}</div>`;
    }
    return html;
}

function toggleDay(num) {
    let saved = JSON.parse(localStorage.getItem('andy_tester_days') || '[]');
    if(saved.includes(num)) saved = saved.filter(n => n !== num);
    else saved.push(num);
    localStorage.setItem('andy_tester_days', JSON.stringify(saved));
    document.getElementById('streak-grid').innerHTML = generateGrid();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(console.log);
    else if (document.exitFullscreen) document.exitFullscreen();
}

setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}, 1000);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');

// --- SMOOTH DRAGGABLE BOOKMARKS ---
const bmContainer = document.getElementById('bookmarks'); // DEFINED HERE TO FIX ERROR
let isDragging = false;
let dragOffset = 0;

if (bmContainer) {
    bmContainer.addEventListener('touchstart', (e) => {
        // FIX: If in Landscape Mode, DISABLE drag so the browser can scroll instead
        if (window.matchMedia("(orientation: landscape) and (max-height: 500px)").matches) {
            return; // Stop here. Let the browser handle the scroll.
        }

        isDragging = true;
        
        // Standard Drag Logic for Portrait Mode
        const rect = bmContainer.getBoundingClientRect();
        dragOffset = e.touches[0].clientY - rect.top;
        
        // Lock position to pixels to prevent jumping
        bmContainer.style.top = rect.top + 'px';
        bmContainer.style.transform = 'none'; 
        bmContainer.style.bottom = 'auto'; 
    }, {passive: false});

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Stop screen scroll

        let newTop = e.touches[0].clientY - dragOffset;
        const maxTop = window.innerHeight - bmContainer.offsetHeight;

        if (newTop < 10) newTop = 10;
        if (newTop > maxTop) newTop = maxTop;

        bmContainer.style.top = newTop + 'px';
    }, {passive: false});

    document.addEventListener('touchend', () => {
        isDragging = false;
    });
}
// --- GUILD FUNCTIONS ---
function sendRaven() {
    // 1. Get the values from the form inputs
    // We use optional chaining (?.) just in case the element isn't there yet
    const name = document.getElementById('ravenName')?.value;
    const email = document.getElementById('ravenEmail')?.value;
    const msg = document.getElementById('ravenMsg')?.value;
    
    // 2. Simple check to ensure they wrote a message
    if (!msg) { 
        alert("The scroll is blank! Please write a message."); 
        return; 
    }

    // 3. Construct the email
    const subject = `Raven from ${name || 'A Traveler'}`;
    const body = `Name: ${name || 'N/A'}%0D%0AEmail: ${email || 'N/A'}%0D%0A%0D%0A${msg}`;
    
    // 4. Open the user's email client
    window.location.href = `mailto:andys.dev.studio@gmail.com?subject=${subject}&body=${body}`;
}

// --- ROOKERY FUNCTIONS ---

// 1. Generate the 14-Day Grid
function generateGrid() {
    let html = '';
    // Load saved days from local storage
    const saved = JSON.parse(localStorage.getItem('andy_tester_days') || '[]');
    
    for(let i=1; i<=14; i++) {
        // If day is saved, make it dark (active). If not, transparent.
        const isActive = saved.includes(i);
        const style = isActive 
            ? 'background:var(--ink); color:var(--parchment); border-color:var(--ink);' 
            : 'background:rgba(0,0,0,0.05); color:var(--ink); border-color:#ccc;';
        
        // The checkmark or the number
        const content = isActive ? '✓' : i;

        html += `
        <div onclick="toggleDay(${i})" 
             style="${style} aspect-ratio:1; display:flex; align-items:center; justify-content:center; cursor:pointer; border:1px solid; border-radius:4px; font-family:'Share Tech Mono'; font-size:1.2rem; transition: all 0.2s;">
            ${content}
        </div>`;
    }
    return html;
}

// 2. Toggle a Day on/off
function toggleDay(num) {
    let saved = JSON.parse(localStorage.getItem('andy_tester_days') || '[]');
    
    if(saved.includes(num)) {
        // Remove it if already there (toggle off)
        saved = saved.filter(n => n !== num);
    } else {
        // Add it
        saved.push(num);
    }
    
    localStorage.setItem('andy_tester_days', JSON.stringify(saved));
    playPageSound(); // Satisfying click sound
    
    // Re-render the grid instantly
    document.getElementById('streak-grid').innerHTML = generateGrid();
}

// 3. Send Specific Bug Report
function sendBugReport() {
    const project = document.getElementById('bugProject')?.value;
    const type = document.getElementById('bugType')?.value;
    const msg = document.getElementById('bugMsg')?.value;

    if (!project || !msg) {
        alert("Please select a project and describe the issue.");
        return;
    }

    const subject = `[${type}] ${project} Report`;
    const body = `Project: ${project}%0D%0Aissue Type: ${type}%0D%0A%0D%0ADetails:%0D%0A${msg}`;

    window.location.href = `mailto:andys.dev.studio@gmail.com?subject=${subject}&body=${body}`;
}

// --- CARD FLIP LOGIC ---
function flipCard(btn, event) {
    // Stop the click from bubbling up (prevents triggering other card clicks)
    event.stopPropagation();
    
    // Find the closest "flip-container" parent and toggle the class
    const card = btn.closest('.flip-container');
    card.classList.toggle('flipped');
    
    // Optional: Play a sound effect!
    playPageSound(); 
}


