// app/layout.tsx

"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import LoginButton from "@/components/ui/login-btn";
import { generateMetaTags, defaultMeta } from "./metadata"; // Import your SEO functions

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
  const meta = generateMetaTags(defaultMeta); // You can customize the meta tags if needed

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
        <meta property="oshoug:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:url" content={meta.canonical} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{meta.title}</title>
      </head>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <SessionProvider session={session}>
            <main
              className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen w-full`}
            >
              <header className="w-full flex flex-row justify-between border-b my-2 py-3 px-3">
                <SidebarTrigger />
                <LoginButton />
              </header>
              {children}
            </main>
          </SessionProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
