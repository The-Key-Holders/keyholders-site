import type { Metadata } from "next";
import PositionsHelper from "../components/PositionsHelper";

export const metadata: Metadata = {
  title: "Positions helper · CPE Fit",
  robots: { index: false, follow: false },
};

export default function CpeFitPositionsPage() {
  return <PositionsHelper />;
}
