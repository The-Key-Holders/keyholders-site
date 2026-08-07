/* Host config — edit freely. Redeploy web after changes. */
window.PARTY_CONFIG = {
  // Empty = same-origin /api (nginx or Vercel rewrites).
  apiBase: "",
  // Live public root for QR print pack (trailing slash recommended).
  publicBaseUrl: "https://www.thekeyholders.org/celebrate/",
  photosUrl: "https://photos.app.goo.gl/tNy59HYGHJzvhX536",
  couple: "Dani & Javad",
  eventName: "Dani & Javad Guest Hub",
  maxProfiles: 150,
  prize: {
    enabled: true,
    title: "Mystery gift card",
    description:
      "Top combined score near last call wins. Handed out in person — you must still be here (shocking, we know).",
    announceAt: "4:45 PM",
    legalNote: "One win per person. Host decision final. Kindness > exploits.",
  },
  modules: [
    { id: "home", path: "index.html", title: "Home", emoji: "🏠", blurb: "Mission control" },
    { id: "photos", path: "photos.html", title: "Photos", emoji: "📸", blurb: "Shared album" },
    { id: "rings", path: "rings.html", title: "Ring Hunt", emoji: "💍", blurb: "Plastic glory" },
    { id: "guestbook", path: "guestbook.html", title: "Guest Book", emoji: "✍️", blurb: "Real ink" },
    { id: "trivia", path: "trivia.html", title: "Trivia", emoji: "🧠", blurb: "Couple facts" },
    { id: "he-said", path: "he-said.html", title: "He / She Said", emoji: "⚡", blurb: "Speed round" },
    { id: "passport", path: "passport.html", title: "Passport", emoji: "🛂", blurb: "Stamp quest" },
    { id: "poses", path: "poses.html", title: "Pose Spinner", emoji: "🌀", blurb: "Arch energy" },
    { id: "leaderboard", path: "leaderboard.html", title: "Leaderboard", emoji: "🏆", blurb: "Glory board" },
  ],
};
