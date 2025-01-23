"use client";

import Image from "next/image";
import Link from "next/link";
import CVKULogo from "../public/Logo & Text.svg";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { LogIn, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
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
        <div>
          {session ? (
            <>
              <div className="flex flex-row gap-2 items-center">
                <Link href="/profile">
                  <Button size="sm">
                    <User />
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => signOut({callbackUrl: '/'})} size="sm">
                  <LogOut />
                </Button>
              </div>
            </>
          ) : (
            <Link href="/auth/signin">
              <Button size="sm">
                <LogIn />
              </Button>
            </Link>
          )}
        </div>
      </ul>
    </nav>
  );
}
