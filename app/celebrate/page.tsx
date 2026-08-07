import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dani & Javad Guest Hub",
  description:
    "Engagement party guest experience hub — games, ring hunt guide, photos. No password.",
  robots: { index: false, follow: false },
};

/** Public entry: no advisor password. Serves static hub under /celebrate/. */
export default function CelebratePage() {
  redirect("/celebrate/index.html");
}
