"use client";

import CheckboxField from "@/components/psap-portal/CheckboxField";
import StatusBanner from "@/components/psap-portal/StatusBanner";
import {
  scoreInvoiceReadiness,
  type InvoiceCheckerInput,
} from "@/lib/psap-portal/invoice-checker";
import { portal } from "@/lib/psap-portal/ui";
import { useMemo, useState } from "react";

export default function InvoiceCheckerPage() {
  const [flags, setFlags] = useState({
    td288TrackingNumber: false,
    oneTimeChargesBrokenOut: false,
    monthlyMaintAmount: false,
    monthlyMaintTermDates: false,
    systemAcceptanceDate: false,
    countyCode: false,
    psapNumber: false,
    serviceNumber: false,
    vendorAbbreviation: false,
  });
  const [invoiceTotal, setInvoiceTotal] = useState("");
  const [approvedTotal, setApprovedTotal] = useState("");

  const input: InvoiceCheckerInput = useMemo(
    () => ({
      ...flags,
      invoiceTotal: invoiceTotal === "" ? null : Number(invoiceTotal),
      approvedTd288Total: approvedTotal === "" ? null : Number(approvedTotal),
    }),
    [flags, invoiceTotal, approvedTotal]
  );
  const result = useMemo(() => scoreInvoiceReadiness(input), [input]);
  const set = (k: keyof typeof flags) => (v: boolean) =>
    setFlags((f) => ({ ...f, [k]: v }));

  return (
    <div className={portal.page}>
      <h1 className={portal.h1}>Invoice readiness checker</h1>
      <p className={portal.lead}>
        Attachment 14/15 field checklist. Incomplete invoices delay payment and create Advisor
        rework. Advisors may also use the Invoice ↔ TD-288 Reconciler for batch review.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-2">
          <CheckboxField checked={flags.td288TrackingNumber} onChange={set("td288TrackingNumber")} label="TDe-288 tracking number present" />
          <CheckboxField checked={flags.oneTimeChargesBrokenOut} onChange={set("oneTimeChargesBrokenOut")} label="One-time charges broken out (equip/labor/other/tax)" />
          <CheckboxField checked={flags.monthlyMaintAmount} onChange={set("monthlyMaintAmount")} label="Monthly maintenance amount" />
          <CheckboxField checked={flags.monthlyMaintTermDates} onChange={set("monthlyMaintTermDates")} label="Maint term effective → expired dates" />
          <CheckboxField checked={flags.systemAcceptanceDate} onChange={set("systemAcceptanceDate")} label="System Acceptance Date" />
          <CheckboxField checked={flags.countyCode} onChange={set("countyCode")} label="County Code" />
          <CheckboxField checked={flags.psapNumber} onChange={set("psapNumber")} label="PSAP Number" />
          <CheckboxField checked={flags.serviceNumber} onChange={set("serviceNumber")} label="Service Number" />
          <CheckboxField checked={flags.vendorAbbreviation} onChange={set("vendorAbbreviation")} label="Vendor Abbreviation" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="block text-xs text-white/50">
              Invoice total ($)
              <input
                className={`${portal.input} mt-1`}
                inputMode="decimal"
                value={invoiceTotal}
                onChange={(e) => setInvoiceTotal(e.target.value)}
                data-testid="invoice-total"
              />
            </label>
            <label className="block text-xs text-white/50">
              Approved TD-288 total ($)
              <input
                className={`${portal.input} mt-1`}
                inputMode="decimal"
                value={approvedTotal}
                onChange={(e) => setApprovedTotal(e.target.value)}
                data-testid="td288-total"
              />
            </label>
          </div>
        </div>
        <div className="space-y-4" data-testid="invoice-result">
          <StatusBanner status={result.status} />
          {!!result.missingRequired.length && (
            <div className={portal.card}>
              <p className={portal.label}>Blocked / required</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-rose-200/90">
                {result.missingRequired.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          <div className={portal.alert}>
            Typical Branch inbox: <strong>CA911Invoicing@caloes.ca.gov</strong> — confirm current
            routing. Do not submit until required fields are complete.
          </div>
        </div>
      </div>
    </div>
  );
}
