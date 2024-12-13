"use client";

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { generateMetaTags, defaultMeta } from "./metadata";
import { Button } from "@/components/ui/button";
import { FaSpinner } from "react-icons/fa6";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

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
              <header className="w-full flex flex-row justify-between border-b my-1 p-4">
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

function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8"></div>;
  }

  if (session) {
    return (
      <>
        <Button variant="outline" onClick={() => signOut()} size="sm">
          <FaSignOutAlt />
          Logout
        </Button>
      </>
    );
  }

  return (
    <>
      <Button onClick={() => signIn()} size="sm">
        <FaSignInAlt />
        Login
      </Button>
    </>
  );
}
