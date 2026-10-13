/**
 * Isolated-world bridge: mirrors the on/off flag into localStorage and
 * stores diagnostic hits for the popup. Does not read or alter responses.
 */
type Hit = {
  url: string;
  status: number;
  contentType: string;
  at: number;
};

const FLAG = "__futureforge_flow_enabled";
const MAX_HITS = 12;

function asEnabled(value: unknown): boolean {
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
  if (area !== "local" || !changes.enabled) return;
  localStorage.setItem(FLAG, String(asEnabled(changes.enabled.newValue)));
});

window.addEventListener("message", (event: MessageEvent) => {
  if (event.source !== window || event.origin !== location.origin) return;
  const data = event.data as Partial<Hit> & { source?: string; type?: string } | null;
  if (!data || data.source !== "futureforge-flow" || data.type !== "hit" || typeof data.url !== "string") return;

  const hit: Hit = {
    url: data.url.slice(0, 500),
    status: typeof data.status === "number" ? data.status : 0,
    contentType: typeof data.contentType === "string" ? data.contentType.slice(0, 120) : "",
    at: typeof data.at === "number" ? data.at : Date.now()
  };

  chrome.storage.local.get("hits", (stored) => {
    const previous = Array.isArray(stored.hits) ? stored.hits as Hit[] : [];
    void chrome.storage.local.set({ hits: [hit, ...previous].slice(0, MAX_HITS) });
  });
});
