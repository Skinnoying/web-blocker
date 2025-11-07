chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "blocked_site") {
    const banner = document.createElement("div");
    banner.textContent = "⚠️ Situs ini diblokir oleh Web Blocker Extension.";
    Object.assign(banner.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      backgroundColor: "red",
      color: "white",
      textAlign: "center",
      fontSize: "18px",
      padding: "10px",
      zIndex: "999999"
    });
    document.body.prepend(banner);
  }
});
