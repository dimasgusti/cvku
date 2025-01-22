"use client";

import Image from "next/image";
import Link from "next/link";
import CVKULogo from "../public/Logo & Text.svg";
import LoginButton from "./ui/login-btn";

export default function Navbar() {
  return (
    <nav className="w-full h-[5rem] border-b px-4 sticky top-0 z-50 bg-white shadow-lg">
      <ul className="flex flex-row justify-between items-center h-full">
        <Link href="/">
          <Image
            src={CVKULogo}
            alt="Logo CVKU"
            width={100}
            height={100}
            priority
          />
        </Link>
        <LoginButton />
      </ul>
    </nav>
  );
}
