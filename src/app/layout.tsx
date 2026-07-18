import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* Self-hosted at build time via next/font — no runtime font CDN calls. */
const sans = Geist({
  variable: "--font-sans-src",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gpcodes.com"),
  title: "Giacomo Patella — Senior Product Designer",
  description:
    "Senior product designer in Florence, Italy. Over a decade turning complex systems into precise, legible products — hundo, PwC, Octopus Energy, Redington, IPC, Okappy.",
  alternates: {
    canonical: "/",
    types: {
      "text/markdown": "/index.md",
      "text/plain": "/llms.txt",
    },
  },
  openGraph: {
    title: "Giacomo Patella — Senior Product Designer",
    description:
      "Senior product designer in Florence, Italy. Designs and builds.",
    url: "https://gpcodes.com",
    siteName: "gpcodes",
    type: "website",
  },
};

/* Applies a stored theme override before first paint to avoid flashing. */
const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {children}
      </body>
    </html>
  );
}
