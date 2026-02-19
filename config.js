// config.js - The Master Switch
<<<<<<< HEAD
const FORGE_VERSION = "4.7.2"; 
=======
const FORGE_VERSION = "4.7.2";
>>>>>>> b468f96a5a6bac7453f7dfc2d16bd379d5e65550
const CACHE_NAME = `forge-cache-v${FORGE_VERSION}`;

function getVersionedAsset(path) {
    return `${path}?v=${FORGE_VERSION}`;
}
