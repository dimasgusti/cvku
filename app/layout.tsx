"use client";

import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth"; 
import metadata from "./metadata";
import Navbar from "@/components/ui/navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: Session | null;
}>) {
  return (
    <html lang="en">
      <head>
        <title>{String(metadata?.title ?? "Default Title")}</title>
        <meta
          name="description"
          content={String(metadata?.description ?? "Default description")}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SessionProvider session={session}>
          <nav>
            <Navbar />
          </nav>
          <main className="flex flex-grow">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}