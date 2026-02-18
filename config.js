// config.js - The Master Switch
const FORGE_VERSION = "4.7.1";
const CACHE_NAME = `forge-cache-v${FORGE_VERSION}`;

function getVersionedAsset(path) {
    return `${path}?v=${FORGE_VERSION}`;
}
