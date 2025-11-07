let blocklist = { domains: [], regex_patterns: [] };
let blockCount = 0;

// 🔧 Fungsi untuk memuat blocklist
function loadBlocklist() {
  fetch("https://raw.githubusercontent.com/YourUsername/blocklist/main/blocklist.json")
    .then(res => res.json())
    .then(data => {
      blocklist = data;
      chrome.storage.local.set({ blocklist: data });
      console.log("[WebBlocker] Blocklist diperbarui dari sumber online");
    })
    .catch(() => {
      // fallback ke lokal
      fetch(chrome.runtime.getURL("blocklist.json"))
        .then(res => res.json())
        .then(local => {
          blocklist = local;
          chrome.storage.local.set({ blocklist: local });
          console.log("[WebBlocker] Menggunakan blocklist lokal");
        });
    });
}

// 🕐 Jalankan saat ekstensi di-load
loadBlocklist();
// Update tiap 12 jam
setInterval(loadBlocklist, 12 * 60 * 60 * 1000);

// 🔒 Blokir permintaan ke situs terlarang
chrome.webRequest.onBeforeRequest.addListener(
  details => {
    return new Promise(resolve => {
      chrome.storage.local.get(["enabled", "blocklist"], data => {
        const enabled = data.enabled ?? true;
        const bl = data.blocklist || blocklist;
        const url = details.url.toLowerCase();

        if (!enabled) return resolve({ cancel: false });

        // Cek domain langsung
        if (bl.domains.some(domain => url.includes(domain))) {
          blockDetected(url);
          return resolve({ cancel: true });
        }

        // Cek regex pattern
        for (let pattern of bl.regex_patterns) {
          const regex = new RegExp(pattern, "i");
          if (regex.test(url)) {
            blockDetected(url);
            return resolve({ cancel: true });
          }
        }
        return resolve({ cancel: false });
      });
    });
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// 🚫 Notifikasi & hitung statistik
function blockDetected(url) {
  blockCount++;
  chrome.storage.local.set({ blockCount });
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: "⚠️ Akses Diblokir",
    message: `Situs ${new URL(url).hostname} termasuk kategori terlarang.`,
    priority: 2
  });
  console.log(`[WebBlocker] Blokir: ${url}`);
}

