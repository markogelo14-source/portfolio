import localFont from "next/font/local";
import type { Metadata } from "next";

import "./globals.css";
import { siteData } from "./site-data";

const circularStd = localFont({
  src: [
    {
      path: "./fonts/CircularStd-Book.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/CircularStd-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

const romieTrial = localFont({
  src: [
    {
      path: "./fonts/RomieTrial-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteData.name} | ${siteData.role}`,
  description: siteData.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${circularStd.variable} ${romieTrial.variable}`}>{children}</body>
    </html>
  );
}
