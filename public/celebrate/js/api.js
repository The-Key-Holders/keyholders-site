(function () {
  const cfg = () => window.PARTY_CONFIG || {};
  function base() {
    const b = (cfg().apiBase || "").replace(/\/$/, "");
    return b;
  }
  async function req(path, opts = {}) {
    const url = `${base()}${path}`;
    try {
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
        ...opts,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(data.error || res.statusText || "Request failed");
        err.status = res.status;
        err.data = data;
        throw err;
      }
      return data;
    } catch (e) {
      if (e.status) throw e;
      const err = new Error("API offline — running local-only mode");
      err.offline = true;
      err.cause = e;
      throw err;
    }
  }
  window.PartyAPI = {
    health: () => req("/api/health"),
    config: () => req("/api/config"),
    lookup: (first, last) =>
      req(`/api/profiles/lookup?first=${encodeURIComponent(first)}&last=${encodeURIComponent(last)}`),
    createProfile: (firstName, lastName, forceNew = false) =>
      req("/api/profiles", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, forceNew }),
      }),
    getProfile: (id) => req(`/api/profiles/${id}`),
    postScore: (body) => req("/api/scores", { method: "POST", body: JSON.stringify(body) }),
    checkin: (body) => req("/api/checkins", { method: "POST", body: JSON.stringify(body) }),
    leaderboard: () => req("/api/leaderboard"),
  };
})();
