import React from "react";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DefaultSeo } from "next-seo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "BrainHR IT Solutions",
  description:
    "BrainHR IT Solutions provides premium staffing solutions for prestigious software companies in India and the US. Connect with top-tier talent today.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${inter.variable} ${playfair.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-sans">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import "./globals.css";
