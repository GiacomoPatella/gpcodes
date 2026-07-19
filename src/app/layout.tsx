import type { Metadata } from "next";
import { Figtree, Geist_Mono } from "next/font/google";
import "./globals.css";

/* Self-hosted at build time via next/font, so no runtime font CDN calls. */
const sans = Figtree({
  variable: "--font-sans-src",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gpcodes.com"),
  title: "Giacomo Patella · Senior Product Designer",
  description:
    "I'm a senior product designer in Florence, Italy. Over a decade making complicated products easier to live with: Passionfruit, hundo, PwC, Octopus Energy, Redington, IPC, Okappy.",
  alternates: {
    canonical: "/",
    types: {
      "text/markdown": "/index.md",
      "text/plain": "/llms.txt",
    },
  },
  openGraph: {
    title: "Giacomo Patella · Senior Product Designer",
    description:
      "I'm a senior product designer in Florence, Italy. Over a decade making complicated products easier to live with, lately deep in AI tooling.",
    url: "https://gpcodes.com",
    siteName: "gpcodes",
    type: "website",
  },
};

/* Applies a stored theme override and a stored accent before first paint to
   avoid flashing. The accent is a trial setting written by /palette; every
   other accent token derives from it in CSS. */
const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t);var a=localStorage.getItem("accent");if(a&&/^#[0-9a-f]{6}$/i.test(a))document.documentElement.style.setProperty("--accent",a)}catch(e){}})()`;

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
