/* app.js - v4.61 Cleaned & Stable */

let journalEntries = [];
let forgeItems = [];
let marketItems = [];
let audioCtx = null;
let isPlaying = false;
let droneOsc1, droneOsc2, droneGain, musicInterval;

// ==========================================
// 1. NAVIGATION & PAGE LOADING
// ==========================================

async function switchPage(section) {
    closeApp(); 
    let content = '';
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
            const res = await fetch(`pages/${section}.html`);
            if(!res.ok) throw new Error('Page missing');
            content = await res.text();
        }
    } catch (err) {
        console.error(err);
        content = `<div class="item-card"><h3>Error 404</h3><p>The archives are incomplete.</p></div>`;
    }
    
    document.getElementById('page-content').innerHTML = content;
    
    document.querySelectorAll('.bookmark').forEach(b => b.classList.remove('active'));
    const active = document.querySelector(`.bm-${section}`);
    if(active) active.classList.add('active');

    if (section === 'ravens') document.getElementById('streak-grid').innerHTML = generateGrid();
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

    document.getElementById('page-content').innerHTML = html;

    document.querySelectorAll('.bookmark').forEach(b => b.classList.remove('active'));
    const forgeBm = document.querySelector('.bm-forge'); 
    // Default to highlighting forge, or keep current if logic allows
    if (forgeBm) forgeBm.classList.add('active');

    window.scrollTo(0, 0);
  } catch (e) {
    console.error(e);
    alert("The archives for this project are currently sealed.");
  }
}

// ==========================================
// 2. CARD TEMPLATES (Shared Engine)
// ==========================================

function generateCardBack(item) {
    const longHTML = item.longDescription || item.moreInfo || item.description;

    const featuresHTML = Array.isArray(item.features) && item.features.length
      ? `<div class="card-section">
            <div class="card-section-title">Features</div>
            <ul class="card-bullets">${item.features.map(f => `<li>${f}</li>`).join('')}</ul>
         </div>`
      : '';

    const techHTML = Array.isArray(item.tech) && item.tech.length
      ? `<div class="card-section">
            <div class="card-section-title">Specs</div>
            <div class="chip-row">${item.tech.map(t => `<span class="chip">${t}</span>`).join('')}</div>
         </div>`
      : '';

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
                <button class="filter-pill" onclick="setFilter('Math', this)">Math</button>
            </div>
        </div>
        <div id="forgeList" class="gallery-grid">`;

        forgeItems.forEach(item => {
            let headerHTML = item.image 
                ? `<img src="${item.image}" class="forge-header-img" alt="${item.title}">`
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
        const response = await fetch('./market/market_manifest.json');
        if (!response.ok) throw new Error('Market manifest missing');
        marketItems = await response.json();

        let html = `
        <h1 class="page-title">The Ledger</h1>
        <div class="item-card" style="margin-bottom: 30px; border-left: 4px solid var(--gold); transform:none;">
            <p style="font-style: italic; line-height: 1.6; margin:0; font-size: 1.1rem;">
                We utilize the <strongitch.io</strong> marketplace for all secure transactions. This ensures maximized support for independent development, with no proprietary launchers or corporate overhead.
            </p>
        </div>
        <div id="marketList" class="gallery-grid">`;

        marketItems.forEach(item => {
            let headerHTML = item.image 
                ? `<img src="${item.image}" class="forge-header-img" alt="${item.title}">`
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
    } catch (error) { 
        console.error(error);
        return `<h1 class="page-title">The Ledger</h1><p>The ledger is closed. (Data Error)</p>`; 
    }
}

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
    } catch (error) { return `<h1 class="page-title">The Chronicles</h1><p>The archives are currently sealed.</p>`; }
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
    } catch (error) { alert("This scroll seems to be missing."); }
}

function closeJournal() {
    document.getElementById('journalReader').classList.remove('active');
    playPageSound(); 
}

// ==========================================
// 3. AUDIO ENGINE
// ==========================================

const MEDIEVAL_SCALE = [293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 698.46];

function initAudio() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    
    // Simple Reverb
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
    
    window.musicBus = audioCtx.createGain();
    window.musicBus.gain.value = 0.4; 
    window.musicBus.connect(window.reverbNode);
    window.musicBus.connect(audioCtx.destination);
}

function startDrone() {
    if (!audioCtx) initAudio();
    
    droneOsc1 = audioCtx.createOscillator();
    droneOsc1.type = 'sawtooth';
    droneOsc1.frequency.value = 73.42; // Low D2
    
    droneOsc2 = audioCtx.createOscillator();
    droneOsc2.type = 'sawtooth';
    droneOsc2.frequency.value = 110.00; // Low A2

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    droneGain = audioCtx.createGain();
    droneGain.gain.value = 0.15;

    droneOsc1.connect(filter);
    droneOsc2.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(window.musicBus);

    droneOsc1.start();
    droneOsc2.start();

    playRandomNote();
    musicInterval = setInterval(playRandomNote, 1500); 
}

function playRandomNote() {
    if (Math.random() > 0.8) return; 

    const osc = audioCtx.createOscillator();
    osc.type = 'triangle'; 
    const freq = MEDIEVAL_SCALE[Math.floor(Math.random() * MEDIEVAL_SCALE.length)];
    osc.frequency.value = freq;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.1); 
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8); 

    osc.connect(gain);
    gain.connect(window.musicBus); 
    osc.start();
    osc.stop(audioCtx.currentTime + 1);
}

function stopDrone() {
    if (droneOsc1) {
        try { droneOsc1.stop(); droneOsc2.stop(); } catch(e){}
        clearInterval(musicInterval);
    }
}

function playPageSound() {
    if (!isPlaying || !audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 0.5; 
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200; 

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.05); 
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2); 

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
// 4. UI INTERACTIONS
// ==========================================

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

function flipCard(btn, event) {
    event.stopPropagation();
    const card = btn.closest('.flip-container');
    card.classList.toggle('flipped');
    playPageSound(); 
}

function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(console.log);
    else if (document.exitFullscreen) document.exitFullscreen();
}

setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}, 1000);

// ==========================================
// 5. DRAGGABLE BOOKMARKS
// ==========================================

// app.js - Section 5: DRAGGABLE BOOKMARKS (Smart Drag)

const bmContainer = document.getElementById('bookmarks');
let isPressing = false;
let isDragging = false;
let startY = 0;
let initialTop = 0;

if (bmContainer) {
    // 1. PRESS START (Don't capture yet!)
    bmContainer.addEventListener('pointerdown', (e) => {
        isPressing = true;
        isDragging = false; // Reset
        
        const rect = bmContainer.getBoundingClientRect();
        startY = e.clientY;
        initialTop = rect.top;
        
        // We do NOT capture the pointer here. 
        // We wait to see if the user moves the mouse first.
    });

    // 2. MOVE (Check Threshold)
    window.addEventListener('pointermove', (e) => {
        if (!isPressing) return;

        const currentY = e.clientY;
        const deltaY = currentY - startY;

        // LOGIC: Only start dragging if moved more than 5 pixels
        if (!isDragging && Math.abs(deltaY) > 5) {
            isDragging = true;
            
            // NOW we capture the pointer to track the drag smoothly
            bmContainer.setPointerCapture(e.pointerId);
            
            // Unlock the CSS positioning
            bmContainer.style.transition = 'none'; 
            bmContainer.style.bottom = 'auto';
            bmContainer.style.transform = 'none';
        }

        // If we have confirmed it is a drag, move the bar
        if (isDragging) {
            e.preventDefault(); // Stop scrolling
            bmContainer.style.top = (initialTop + deltaY) + 'px';
        }
    }, {passive: false});

    // 3. RELEASE
    window.addEventListener('pointerup', (e) => {
        isPressing = false;
        if (isDragging) {
            isDragging = false;
            bmContainer.releasePointerCapture(e.pointerId);
        }
        // If isDragging never became true, the browser treats this 
        // as a standard "click" and fires the onclick function on the bookmark.
    });
}



// ==========================================
// 6. UTILITIES
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
    for(let i=1; i<=14; i++) {
        const isActive = saved.includes(i);
        const style = isActive 
            ? 'background:var(--ink); color:var(--parchment); border-color:var(--ink);' 
            : 'background:rgba(0,0,0,0.05); color:var(--ink); border-color:#ccc;';
        const content = isActive ? '✓' : i;

        html += `
        <div onclick="toggleDay(${i})" 
             style="${style} aspect-ratio:1; display:flex; align-items:center; justify-content:center; cursor:pointer; border:1px solid; border-radius:4px; font-family:'Share Tech Mono'; font-size:1.2rem; transition: all 0.2s;">
            ${content}
        </div>`;
    }
    return html;
}

function toggleDay(num) {
    let saved = JSON.parse(localStorage.getItem('andy_tester_days') || '[]');
    if(saved.includes(num)) saved = saved.filter(n => n !== num);
    else saved.push(num);
    localStorage.setItem('andy_tester_days', JSON.stringify(saved));
    playPageSound();
    document.getElementById('streak-grid').innerHTML = generateGrid();
}

function sendBugReport() {
    const project = document.getElementById('bugProject')?.value;
    const type = document.getElementById('bugType')?.value;
    const msg = document.getElementById('bugMsg')?.value;

    if (!project || !msg) { alert("Please select a project and describe the issue."); return; }
    const subject = `[${type}] ${project} Report`;
    const body = `Project: ${project}%0D%0Aissue Type: ${type}%0D%0A%0D%0ADetails:%0D%0A${msg}`;
    window.location.href = `mailto:andys.dev.studio@gmail.com?subject=${subject}&body=${body}`;
}

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
