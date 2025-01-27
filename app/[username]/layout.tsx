import Link from "next/link";
import React from "react";

export default function UsernameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex flex-col justify-center items-center py-2">
        <h2 className="text-base md:text-lg">
          Created with{" "}
          <Link href="/" className="underline">
            CVKU
          </Link>
        </h2>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="flex flex-col justify-center items-center py-2">
        <h2 className="text-base md:text-lg">
          Created with{" "}
          <Link href="/" className="underline">
            CVKU
          </Link>
        </h2>
      </footer>
    </div>
  );
}
