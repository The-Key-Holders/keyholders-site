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