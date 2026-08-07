import Footer from "@/components/Footer";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dani & Javad Guest Hub",
  description:
    "Mobile-first engagement party guest experience: games, photo wall, jukebox, live board. Public, no password.",
  robots: { index: true, follow: true },
};

export default function GuestHubProjectPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-sm font-medium uppercase tracking-widest text-cyanGlow/80">Lab · Live</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-white">
          Dani &amp; Javad Guest Hub
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-white/70">
          A free, phone-first party companion for engagement guests: join with your name (no
          password), play trivia and co-mingle quests, upload to a live photo wall, request songs,
          check in at QR stations, and watch a projection-friendly live board. Built as a small,
          shippable web app — not a wedding megasite.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/celebrate/"
            className="rounded-full bg-cyanGlow px-5 py-2.5 text-sm font-semibold text-navy shadow-lg shadow-cyanGlow/20 transition hover:brightness-110"
          >
            Open Guest Hub →
          </Link>
          <Link
            href="/celebrate/help.html"
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/40"
          >
            Guest help guide
          </Link>
          <Link
            href="/celebrate/screen.html"
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/40"
          >
            Live board / projector
          </Link>
        </div>

        <div className="mt-10 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-relaxed text-white/65">
          <p>
            <strong className="text-white/85">Guests:</strong> open the hub on a phone, join with
            first + last name, use tiles or bottom nav. Points freeze at 4:30 PM party day.
          </p>
          <p>
            <strong className="text-white/85">Hosts:</strong> run the Docker stack (or your
            production origin), print QRs, open the screen page on venue TVs.
          </p>
          <p>
            <strong className="text-white/85">Note:</strong> The public path is{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyanGlow">/celebrate</code> on
            this site for a stable URL you control. Party branding stays Dani &amp; Javad; Key
            Holders is just the host platform.
          </p>
        </div>

        <p className="mt-8 text-sm text-white/45">
          <Link href="/projects" className="text-cyanGlow hover:underline">
            ← All projects
          </Link>
        </p>
      </div>
      <Footer variant="parent" />
    </>
  );
}
