import { describe, expect, it, beforeEach } from "vitest";
import {
  addQuestion,
  exportSnapshot,
  getNews,
  importSnapshot,
  resetPortalStoreForTests,
  searchAdvisors,
} from "./store";

describe("psap portal store", () => {
  beforeEach(() => {
    resetPortalStoreForTests();
  });

  it("searches sample advisors by county", () => {
    const hits = searchAdvisors("Alameda");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].counties.join(" ")).toMatch(/Alameda/i);
  });

  it("returns only published news by default filter", () => {
    const pub = getNews({ publishedOnly: true });
    expect(pub.every((n) => n.published)).toBe(true);
    expect(pub.length).toBeGreaterThan(0);
  });

  it("creates question tickets", () => {
    const q = addQuestion({
      psapName: "Test PSAP",
      psapCode: "999",
      county: "Test",
      contactName: "A",
      contactEmail: "a@example.com",
      category: "Funding",
      urgency: "Routine",
      question: "How do residuals work?",
    });
    expect(q.ticketId).toMatch(/^Q-/);
    expect(q.status).toBe("new");
  });

  it("export/import roundtrip", () => {
    const snap = exportSnapshot();
    snap.news[0].title = "Imported title";
    importSnapshot(snap);
    const again = exportSnapshot();
    expect(again.news[0].title).toBe("Imported title");
  });
});
