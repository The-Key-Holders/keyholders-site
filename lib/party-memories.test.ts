import { describe, expect, it } from "vitest";
import {
  SEED_MEMORIES,
  emptyMemories,
  ensureSeedMemories,
} from "./party-store";

describe("hidden memory durable seed", () => {
  it("ships 9 enabled memories with https imageUrl", () => {
    const enabled = SEED_MEMORIES.filter((m) => m.enabled);
    expect(enabled.length).toBe(9);
    for (const m of enabled) {
      expect(m.imageUrl).toMatch(
        /^https:\/\/www\.thekeyholders\.org\/celebrate\/assets\/memories\/memory-\d{2}\.jpg$/
      );
      expect(m.caption.length).toBeGreaterThan(10);
      expect(m.imageDataUrl).toBe("");
    }
  });

  it("rehydrates wiped/empty host memories from seed", () => {
    const wiped = emptyMemories();
    const restored = ensureSeedMemories(wiped);
    expect(restored.filter((m) => m.enabled && m.imageUrl).length).toBe(9);
    expect(restored[0].title).toBe("Fingers Crossed Night");
  });

  it("keeps host memories when already populated with images", () => {
    const custom = emptyMemories();
    custom[0] = {
      slot: 1,
      title: "Custom host memory",
      caption: "Host override caption that is long enough",
      imageDataUrl: "",
      imageUrl: "https://www.thekeyholders.org/celebrate/assets/memories/memory-01.jpg",
      enabled: true,
    };
    const out = ensureSeedMemories(custom);
    expect(out[0].title).toBe("Custom host memory");
    expect(out.filter((m) => m.enabled).length).toBe(1);
  });
});
