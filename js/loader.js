/**
 * ANDY'S DEV STUDIO - UNIVERSAL LOADER (v1.0)
 * "Forged in Code, Tested on the Road."
 * * This script fetches the 3 manifest files and populates the front page.
 */

document.addEventListener("DOMContentLoaded", () => {
    loadForge();   // The Apps
    loadJournal(); // The Blogs
    loadCargo();   // The Merch
});

// --- 1. THE FORGE (APPS) ---
async function loadForge() {
    try {
        const response = await fetch('./forge/forge_manifest.json');
        const data = await response.json();
        
        const grid = document.getElementById('launchpad-grid');
        const statusSpan = document.getElementById('active-project');
        const sysSpan = document.getElementById('sys-status');

        // Update Telemetry based on the first "LIVE" or "BETA" app found
        const activeApp = data.find(app => app.status === 'LIVE' || app.status === 'BETA');
        if (activeApp) {
            statusSpan.innerText = `${activeApp.title} (${activeApp.version})`;
            statusSpan.style.color = 'var(--emerald-500)'; // Green for active
            sysSpan.innerText = "ONLINE";
            sysSpan.style.color = 'var(--emerald-500)';
        }

        // Build the App Cards
        data.forEach(app => {
            // Skip "Prototypes" for the front page if you want to keep it clean
            if (app.type === 'Prototypes') return; 

            const card = document.createElement('div');
            card.className = `app-card ${app.statusClass}`; // e.g., badge-alpha
            
            card.innerHTML = `
                <div class="card-header">
                    <span class="app-type">${app.type.toUpperCase()}</span>
                    <span class="app-version">${app.version}</span>
                </div>
                <img src="${app.image}" alt="${app.title}" class="app-preview">
                <div class="card-body">
                    <h3 class="app-title">${app.title}</h3>
                    <p class="app-desc">${app.description}</p>
                    <button onclick="${app.action}" class="launch-btn">${app.buttonText}</button>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Forge Manifest Offline:", error);
    }
}

// --- 2. THE CHRONICLES (BLOGS) ---
async function loadJournal() {
    try {
        const response = await fetch('./thechronicles/journal_manifest.json');
        const data = await response.json();
        const feed = document.getElementById('chronicles-feed');

        // Take the most recent 3 entries only
        const recentLogs = data.slice(0, 3);

        recentLogs.forEach(entry => {
            const article = document.createElement('article');
            article.className = 'log-entry paper-texture'; // Use your CSS class
            
            // Check if it has an image or just text
            let mediaBlock = '';
            if (entry.image) {
                mediaBlock = `<div class="entry-media"><img src="${entry.image}" loading="lazy"></div>`;
            }

            article.innerHTML = `
                ${mediaBlock}
                <div class="entry-content">
                    <span class="entry-date">${entry.date}</span>
                    <h3 class="entry-title">${entry.title}</h3>
                    <p class="entry-summary">${entry.summary}</p>
                    <a href="${entry.file}" class="read-link">READ LOG >></a>
                </div>
            `;
            feed.appendChild(article);
        });

    } catch (error) {
        console.error("Journal Manifest Offline:", error);
    }
}

// --- 3. THE CARGO BAY (MERCH) ---
async function loadCargo() {
    try {
        const response = await fetch('./market/cargo_manifest.json');
        const data = await response.json();
        const shelf = document.getElementById('cargo-grid');

        data.forEach(item => {
            const crate = document.createElement('div');
            crate.className = 'cargo-crate';
            
            crate.innerHTML = `
                <div class="crate-visual">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="crate-info">
                    <h4>${item.title}</h4>
                    <span class="price-tag">${item.price}</span>
                </div>
                <button onclick="${item.action}" class="buy-btn">${item.buttonText}</button>
            `;
            shelf.appendChild(crate);
        });

    } catch (error) {
        console.error("Cargo Manifest Offline:", error);
    }
}
