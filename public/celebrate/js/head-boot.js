/** Inject mobile / PWA meta once per page (call after DOM ready not required). */
(function () {
  const head = document.head;
  function ensure(sel, create) {
    if (document.querySelector(sel)) return;
    head.appendChild(create());
  }
  ensure('meta[name="theme-color"]', () => {
    const m = document.createElement("meta");
    m.name = "theme-color";
    m.content = "#ff6b6b";
    return m;
  });
  ensure('meta[name="apple-mobile-web-app-capable"]', () => {
    const m = document.createElement("meta");
    m.name = "apple-mobile-web-app-capable";
    m.content = "yes";
    return m;
  });
  ensure('meta[name="mobile-web-app-capable"]', () => {
    const m = document.createElement("meta");
    m.name = "mobile-web-app-capable";
    m.content = "yes";
    return m;
  });
  ensure('meta[name="apple-mobile-web-app-status-bar-style"]', () => {
    const m = document.createElement("meta");
    m.name = "apple-mobile-web-app-status-bar-style";
    m.content = "default";
    return m;
  });
  ensure('link[rel="manifest"]', () => {
    const l = document.createElement("link");
    l.rel = "manifest";
    l.href = "manifest.webmanifest";
    return l;
  });
  ensure('link[rel="icon"]', () => {
    const l = document.createElement("link");
    l.rel = "icon";
    l.href = "assets/icon.svg";
    l.type = "image/svg+xml";
    return l;
  });
  ensure('link[rel="apple-touch-icon"]', () => {
    const l = document.createElement("link");
    l.rel = "apple-touch-icon";
    l.href = "assets/icon.svg";
    return l;
  });
  // Prevent iOS double-tap zoom delay on controls
  document.documentElement.style.touchAction = "manipulation";
})();
