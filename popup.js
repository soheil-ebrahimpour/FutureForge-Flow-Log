const statusEl = document.getElementById("status");
const toggleBtn = document.getElementById("toggle");
const hintEl = document.getElementById("hint");
const hitsEl = document.getElementById("hits");
const clearBtn = document.getElementById("clear");

function pathLabel(url) {
  try {
    const parsed = new URL(url, "https://flow.google.com");
    return parsed.pathname + parsed.search;
  } catch {
    return url;
  }
}

function timeLabel(at) {
  return new Date(at).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
}

function render(enabled, hits, onFlow) {
  statusEl.replaceChildren();
  const dot = document.createElement("span");
  dot.className = enabled ? "dot on" : "dot";
  const label = document.createElement("span");
  label.textContent = enabled ? "روشن" : "خاموش";
  statusEl.append(dot, label);

  toggleBtn.textContent = enabled ? "خاموش کردن" : "روشن کردن";
  toggleBtn.classList.toggle("is-on", enabled);

  if (!onFlow) hintEl.textContent = "این تب Google Flow نیست. برای ثبت، flow.google.com را باز کن.";
  else if (enabled) hintEl.textContent = "درخواست‌هایی که آدرسشان به پیکربندی می‌خورد، بعد از بارگذاری صفحه این‌جا می‌آیند.";
  else hintEl.textContent = "روشن کن تا درخواست‌های پیکربندی همین صفحه ثبت شوند.";

  clearBtn.disabled = hits.length === 0;
  hitsEl.replaceChildren();
  if (hits.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "هنوز درخواستی دیده نشده. Flow را باز کن، ابزار را روشن کن و صفحه را یک‌بار تازه کن.";
    hitsEl.append(empty);
    return;
  }

  const list = document.createElement("ul");
  for (const hit of hits) {
    const item = document.createElement("li");
    const path = document.createElement("div");
    path.className = "path";
    path.textContent = pathLabel(hit.url);
    path.title = hit.url;
    const meta = document.createElement("div");
    meta.className = "meta";
    const status = document.createElement("span");
    status.textContent = hit.status ? String(hit.status) : "—";
    const time = document.createElement("span");
    time.textContent = timeLabel(hit.at);
    meta.append(status, time);
    item.append(path, meta);
    list.append(item);
  }
  hitsEl.append(list);
}

function openExternalLinks() {
  for (const link of document.querySelectorAll(".links a")) {
    link.addEventListener("click", (event) => {
      if (!globalThis.chrome?.tabs?.create) return;
      event.preventDefault();
      void chrome.tabs.create({ url: link.href });
    });
  }
}

async function syncOpenTabs(enabled) {
  const tabs = await chrome.tabs.query({ url: "https://flow.google.com/*" });
  for (const tab of tabs) {
    if (tab.id == null) continue;
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (value) => localStorage.setItem("__futureforge_flow_enabled", String(value)),
        args: [enabled]
      });
      await chrome.tabs.reload(tab.id);
    } catch (error) {
      console.debug("[FutureForge Ai By Passer] tab sync failed", error);
    }
  }
}

async function readView() {
  const stored = await chrome.storage.local.get(["enabled", "hits"]);
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return {
    enabled: stored.enabled === true,
    hits: Array.isArray(stored.hits) ? stored.hits : [],
    onFlow: Boolean(tab?.url?.startsWith("https://flow.google.com/"))
  };
}

async function paint() {
  const view = await readView();
  render(view.enabled, view.hits, view.onFlow);
}

openExternalLinks();

if (!globalThis.chrome?.storage?.local) {
  let enabled = false;
  let hits = [];
  const draw = () => render(enabled, hits, true);
  toggleBtn.addEventListener("click", () => {
    enabled = !enabled;
    draw();
  });
  clearBtn.addEventListener("click", () => {
    hits = [];
    draw();
  });
  draw();
} else {
  toggleBtn.addEventListener("click", async () => {
    const { enabled } = await readView();
    const next = !enabled;
    await chrome.storage.local.set({ enabled: next });
    await syncOpenTabs(next);
    await paint();
  });
  clearBtn.addEventListener("click", async () => {
    await chrome.storage.local.set({ hits: [] });
    await paint();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && (changes.hits || changes.enabled)) void paint();
  });
  void paint();
}
