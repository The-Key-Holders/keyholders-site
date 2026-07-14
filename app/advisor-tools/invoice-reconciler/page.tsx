import InvoiceReconcilerApp from "@/components/InvoiceReconcilerApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice ↔ TD-288 Reconciler",
  description:
    "Match Victoria invoice batch lines to TD-288 tracking numbers with 5/30/45 SLA traffic lights — Cal OES Funding Advisor tool.",
};

export default function InvoiceReconcilerPage() {
  return <InvoiceReconcilerApp />;
}
