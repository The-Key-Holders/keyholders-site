/** Shared boot for every guest page */
(async function () {
  const page = document.body.dataset.page || "home";
  await PartyUI.hydrateConfigFromApi();
  PartyUI.renderChrome(page);
})();
