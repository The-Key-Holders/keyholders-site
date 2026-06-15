import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import Header from "@/components/Header";
import SmoothScroll from "@/components/providers/SmoothScroll";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Key Holders",
    template: "%s | The Key Holders",
  },
  description:
    "The Key Holders — high-tech venture hub for digital life services, contractor integrations, labs, and shipped work.",
  metadataBase: new URL("https://www.thekeyholders.org"),
  openGraph: {
    title: "The Key Holders",
    description:
      "Unlock your digital universe — Geeks Next Door, Key Holders Trade, labs, and shipped work.",
    url: "https://www.thekeyholders.org",
    siteName: "The Key Holders",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Key Holders",
    description: "High-tech venture hub for digital life services.",
  },
  icons: {
    icon: "/branding/parent-lockup.jpg",
    apple: "/branding/parent-lockup.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="min-h-screen">
        <SmoothScroll>
          <Header />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}