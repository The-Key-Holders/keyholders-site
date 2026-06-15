import BrandLogo from "@/components/BrandLogo";
import Link from "next/link";

interface FooterProps {
  variant?: "parent" | "trade";
}

export default function Footer({ variant = "parent" }: FooterProps) {
  const year = new Date().getFullYear();

  if (variant === "trade") {
    return (
      <footer className="border-t border-gray-700 bg-charcoal text-gray-300">
        <div className="container-narrow section-padding px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <BrandLogo variant="trade" onDark />
              <p className="text-sm text-gray-400">a Key Holders company</p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/" className="transition hover:text-white">
                The Key Holders
              </Link>
              <Link href="/trade#services" className="transition hover:text-white">
                Services
              </Link>
              <a
                href="mailto:javadkhoshnevisan@gmail.com"
                className="transition hover:text-white"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
            &copy; {year} Key Holders Trade. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/10 bg-vault-950">
      <div className="container-narrow section-padding px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          <BrandLogo variant="parent" />
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/55">
            <Link href="/" className="transition hover:text-cyanGlow">
              Hub
            </Link>
            <Link href="/trade" className="transition hover:text-gold">
              Trade
            </Link>
            <a
              href="https://www.thegeeksnextdoor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-cyanGlow"
            >
              Geeks Next Door
            </a>
            <a
              href="mailto:javadkhoshnevisan@gmail.com"
              className="transition hover:text-cyanGlow"
            >
              Connect
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          &copy; {year} The Key Holders. All rights reserved.
        </div>
      </div>
    </footer>
  );
}