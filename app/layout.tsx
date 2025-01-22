"use client";

import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Manrope } from "next/font/google";
import { defaultMeta, generateMetaTags } from "./metadata";
import { Toaster } from "sonner";

const manrope = Manrope({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const meta = generateMetaTags(defaultMeta);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="robots" content={meta.robots} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:url" content={meta.canonical} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{meta.title}</title>
      </head>
      <body className={manrope.className}>
        <SessionProvider>
          <main className="text-sm antialiased flex flex-col min-h-screen w-full bg-white">
            {/* <div className="bg-yellow-400 text-black py-2 text-center">
              🚧 This website is currently under development. Stay tuned! 🚧
            </div> */}
            {children}
            <Toaster />
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
