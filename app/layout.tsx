"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import "./globals.css";
import { generateMetaTags, defaultMeta } from "./metadata";
import { Toaster } from "sonner";
import { Manrope } from "next/font/google";
import Navbar from "@/components/Navbar";

const manrope = Manrope({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
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
        <SessionProvider session={session}>
          <main className="text-sm antialiased flex flex-col min-h-screen w-full bg-white">
            <Navbar />
            {children}
            <Toaster />
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}