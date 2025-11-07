document.addEventListener("DOMContentLoaded", async () => {
  const { stats } = await browser.storage.local.get("stats");
  if (stats) {
    document.getElementById("blockedCount").textContent = stats.blockedCount || 0;
    document.getElementById("lastUpdate").textContent = stats.lastUpdate || "-";
  }
});
