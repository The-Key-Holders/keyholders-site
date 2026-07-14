/**
 * Unit tests for Invoice–TD-288 web engine (TDD / regression).
 * Run: npx vitest run lib/invoice-recon
 */
import { describe, expect, it } from "vitest";
import { runInvoiceReconcile } from "./engine";

const SAMPLE = `PSAP	Tracking	Amount	Notes
9820 Stockton CHP	19280	3933.00	NOT LISTED
1915 LA CSU	24669	8712.00	YR8
3009 Huntington Beach PD	29501-OP	104229.00	CPE INSTALL
3103 Placer County SO	25908	1200.50	MA North`;

const FAKE_FILES = ["TK_24669_CPE_commitment.xls", "25908_ATT_MA_TD288.xlsx"];

describe("runInvoiceReconcile", () => {
  it("throws when batch has no data lines", () => {
    expect(() =>
      runInvoiceReconcile({
        batchText: "PSAP\tTracking\tAmount\tNotes\n",
        receivedDate: "2026-07-10",
        td288Filenames: FAKE_FILES,
      })
    ).toThrow(/No batch lines/i);
  });

  it("matches desktop golden traffic lights for sample batch", () => {
    const summary = runInvoiceReconcile({
      batchText: SAMPLE,
      receivedDate: "2026-07-10",
      today: "2026-07-11",
      td288Filenames: FAKE_FILES,
    });

    expect(summary.counts.GREEN).toBe(1);
    expect(summary.counts.YELLOW).toBe(1);
    expect(summary.counts.RED).toBe(2);
    expect(summary.lines).toHaveLength(4);

    const byTrack = Object.fromEntries(summary.lines.map((r) => [r.line.tracking, r]));

    expect(byTrack["19280"].traffic).toBe("RED");
    expect(byTrack["19280"].flags).toContain("NOT_LISTED");
    expect(byTrack["19280"].flags).toContain("TD288_NOT_FOUND");

    expect(byTrack["24669"].traffic).toBe("YELLOW");
    expect(byTrack["24669"].flags).toContain("YR_EXTENDED");
    expect(byTrack["24669"].td288_hit).toBe(true);

    expect(byTrack["29501"].traffic).toBe("RED");
    expect(byTrack["29501"].recommendation).toBe("DISPUTE");
    expect(byTrack["29501"].flags).toContain("CPE_INSTALL");

    expect(byTrack["25908"].traffic).toBe("GREEN");
    expect(byTrack["25908"].recommendation).toBe("APPROVE");
  });

  it("indexes trackings from uploaded filenames", () => {
    const summary = runInvoiceReconcile({
      batchText: SAMPLE,
      receivedDate: "2026-07-10",
      today: "2026-07-11",
      td288Filenames: FAKE_FILES,
    });
    expect(summary.meta.index_size).toBeGreaterThanOrEqual(2);
  });

  it("accepts desktop td288_index.json shape", () => {
    const summary = runInvoiceReconcile({
      batchText: "PSAP\tTracking\tAmount\tNotes\n3103 Placer\t25908\t100\tMA\n",
      receivedDate: "2026-07-10",
      today: "2026-07-11",
      td288IndexJson: {
        entries: {
          "25908": {
            tracking: "25908",
            paths: ["D:/fake/25908.xlsx"],
            filenames: ["25908.xlsx"],
          },
        },
      },
    });
    expect(summary.lines[0].td288_hit).toBe(true);
    expect(summary.lines[0].traffic).toBe("GREEN");
  });

  it("flags SLA critical past 45 days", () => {
    const summary = runInvoiceReconcile({
      batchText: "PSAP\tTracking\tAmount\tNotes\n3103 Placer\t25908\t100\tMA\n",
      receivedDate: "2026-01-01",
      today: "2026-03-15",
      td288Filenames: FAKE_FILES,
    });
    expect(summary.lines[0].flags).toContain("SLA_CRITICAL");
    expect(summary.lines[0].traffic).toBe("RED");
  });
});
