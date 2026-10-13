"use strict";
const FLAG = "__futureforge_flow_enabled";
const MAX_HITS = 12;
function asEnabled(value) {
    return value === true;
}
chrome.storage.local.get("enabled", (data) => {
    const enabled = asEnabled(data.enabled);
    if ((localStorage.getItem(FLAG) === "true") !== enabled) {
        localStorage.setItem(FLAG, String(enabled));
        location.reload();
    }
});
chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.enabled)
        return;
    localStorage.setItem(FLAG, String(asEnabled(changes.enabled.newValue)));
});
window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== location.origin)
        return;
    const data = event.data;
    if (!data || data.source !== "futureforge-flow" || data.type !== "hit" || typeof data.url !== "string")
        return;
    const hit = {
        url: data.url.slice(0, 500),
        status: typeof data.status === "number" ? data.status : 0,
        contentType: typeof data.contentType === "string" ? data.contentType.slice(0, 120) : "",
        at: typeof data.at === "number" ? data.at : Date.now()
    };
    chrome.storage.local.get("hits", (stored) => {
        const previous = Array.isArray(stored.hits) ? stored.hits : [];
        void chrome.storage.local.set({ hits: [hit, ...previous].slice(0, MAX_HITS) });
    });
});
