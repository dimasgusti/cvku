"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import "./globals.css";
// import { Toaster } from "sonner";
// import { Manrope } from "next/font/google";
// import Navbar from "@/components/Navbar";

// const manrope = Manrope({
//   weight: "400",
//   subsets: ["latin"],
//   display: "swap",
// });

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode; 
  session: Session | null; 
}) { 
  return (
    <html lang="en">
      {/* <body className={manrope.className}> */}
      <body>
        <SessionProvider session={session}>
          <main className="text-sm antialiased flex flex-col min-h-screen w-full bg-white">
            {/* <Navbar /> */}
            {children}
            {/* <Toaster /> */}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}