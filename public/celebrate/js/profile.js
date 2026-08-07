(function () {
  const KEY = "dj_party_profile_v1";
  const LOCAL = "dj_party_local_v1";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch {
      return null;
    }
  }
  function save(p) {
    localStorage.setItem(KEY, JSON.stringify(p));
    return p;
  }
  function clear() {
    localStorage.removeItem(KEY);
  }
  function localState() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL) || "{}");
    } catch {
      return {};
    }
  }
  function saveLocal(s) {
    localStorage.setItem(LOCAL, JSON.stringify(s));
  }

  window.PartyProfile = {
    get: load,
    set: save,
    clear,
    requireOrRedirect() {
      const p = load();
      if (!p || !p.id) {
        const next = encodeURIComponent(location.pathname.split("/").pop() || "index.html");
        location.href = `join.html?next=${next}`;
        return null;
      }
      return p;
    },
    display(p) {
      if (!p) return "Guest";
      return p.displayName || `${p.firstName} ${(p.lastName || "")[0] || ""}.`;
    },
    /** Offline fallback progress */
    local: {
      get: localState,
      patch(partial) {
        const s = { ...localState(), ...partial };
        saveLocal(s);
        return s;
      },
    },
  };
})();
