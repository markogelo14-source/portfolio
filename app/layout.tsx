import localFont from "next/font/local";
import type { Metadata } from "next";

import "./globals.css";

const circularStd = localFont({
  src: [
    {
      path: "./fonts/CircularStd-Book.ttf",
      weight: "400",
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
  title: "Marko Gelo | Product designer @ Sofascore",
  description:
    "Editorial portfolio for Marko Gelo, a product designer building thoughtful digital experiences.",
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
