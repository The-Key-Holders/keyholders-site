(function () {
  function confetti(durationMs = 1600) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.createElement("div");
    root.className = "confetti-root";
    root.setAttribute("aria-hidden", "true");
    const colors = ["#FF6B6B", "#FFD966", "#D4AF37", "#fff", "#ff9f9f"];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = Math.random() * 0.4 + "s";
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      root.appendChild(p);
    }
    document.body.appendChild(root);
    setTimeout(() => root.remove(), durationMs);
  }

  function toast(msg, kind = "info") {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.dataset.kind = kind;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function renderChrome(activeId) {
    const p = window.PartyProfile.get();
    const cfg = window.PARTY_CONFIG || {};
    const bar = document.getElementById("profile-chip");
    if (bar) {
      if (p) {
        bar.innerHTML = `<span class="chip-dot"></span> Playing as <strong>${escapeHtml(
          PartyProfile.display(p)
        )}</strong> · <a href="join.html">Switch</a>`;
      } else {
        bar.innerHTML = `<a class="btn btn-small" href="join.html">Join the Hub</a> <span class="muted">· phones only needed · no password</span>`;
      }
    }
    const nav = document.getElementById("bottom-nav");
    if (nav && cfg.modules) {
      const main = ["home", "trivia", "comingle", "photowall", "leaderboard"];
      nav.innerHTML = main
        .map((id) => {
          const m = cfg.modules.find((x) => x.id === id);
          if (!m) return "";
          const on = activeId === id ? "active" : "";
          return `<a class="nav-item ${on}" href="${m.path}"><span>${m.emoji}</span><small>${m.title}</small></a>`;
        })
        .join("");
    }
    const prize = document.getElementById("prize-banner");
    if (prize) {
      if (cfg.prize && cfg.prize.enabled !== false && cfg.prize.title) {
        prize.hidden = false;
        prize.innerHTML = `🏆 <strong>Prize:</strong> ${escapeHtml(cfg.prize.title)} · ${escapeHtml(
          cfg.prize.announceAt || ""
        )} · <a href="leaderboard.html">Standings</a>`;
      } else {
        prize.hidden = true;
        prize.innerHTML = "";
      }
    }
    ensureHelpFab(activeId);
  }

  function ensureHelpFab(activeId) {
    if (activeId === "screen") return;
    let fab = document.querySelector(".help-fab");
    if (!fab) {
      fab = document.createElement("a");
      fab.className = "help-fab";
      fab.href = "help.html";
      fab.setAttribute("aria-label", "Help");
      fab.title = "Help";
      fab.textContent = "?";
      document.body.appendChild(fab);
    }
    if (activeId === "help") fab.classList.add("help-fab-active");
    else fab.classList.remove("help-fab-active");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function hydrateConfigFromApi() {
    try {
      const remote = await PartyAPI.config();
      if (remote.photosUrl) PARTY_CONFIG.photosUrl = remote.photosUrl;
      if (remote.prize) {
        PARTY_CONFIG.prize = { ...PARTY_CONFIG.prize, ...remote.prize };
        // ensure disabled wins over stale static config
        if (typeof remote.prize.enabled === "boolean") {
          PARTY_CONFIG.prize.enabled = remote.prize.enabled;
        }
        delete PARTY_CONFIG.prize.hostOnlyRealPrize;
      }
      if (remote.thanks) PARTY_CONFIG.thanks = remote.thanks;
      if (remote.schedule) PARTY_CONFIG.schedule = remote.schedule;
      if (remote.ringHunt) PARTY_CONFIG.ringHunt = remote.ringHunt;
      if (remote.guestbook) PARTY_CONFIG.guestbook = remote.guestbook;
      if (remote.comingle) PARTY_CONFIG.comingle = remote.comingle;
      PARTY_CONFIG._remote = remote;
      return remote;
    } catch {
      return null;
    }
  }

  window.PartyUI = { confetti, toast, renderChrome, escapeHtml, hydrateConfigFromApi };
})();
