import { POSITIONS, VENDORS } from "@/lib/cpe-fit/estimate";
import type { Metadata } from "next";
import EstimateApp from "../components/EstimateApp";

export const metadata: Metadata = {
  title: "Estimate · CPE Fit",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function CpeFitEstimatePage({
  searchParams,
}: {
  searchParams?: { positions?: string };
}) {
  const raw = Number(searchParams?.positions);
  const initialPositions = Number.isInteger(raw) && raw >= 2 && raw <= 20 ? raw : undefined;
  return (
    <EstimateApp vendors={VENDORS} positionChoices={POSITIONS} initialPositions={initialPositions} />
  );
}
