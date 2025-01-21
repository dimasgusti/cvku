"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  CreditCard,
  Home,
  Layers,
  LogIn,
  Settings,
  User,
} from "lucide-react";
import LoginButton from "./ui/login-btn";
import CVKULogo from "../public/Logo & Text.svg";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path
      ? "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
      : "";

  const pagesWithAuthenticatedMenu = [
    "/profile",
    "/profile/template",
    "/profile/award",
    "/profile/certification",
    "/profile/project",
    "/profile/work-experience",
    "/profile/billing",
    "/profile/settings",
  ];

  const isAuthenticatedMenu = pagesWithAuthenticatedMenu.includes(
    pathname ?? ""
  );

  const authenticated = (
    <ul className="flex gap-2 flex-wrap md:flex-nowrap justify-center">
      <Link href="/profile">
        <Button variant="ghost" className={isActive("/profile")}>
          <User />
          <p className="hidden md:inline-block">Profile</p>
        </Button>
      </Link>
      <Link href="/profile/template">
        <Button variant="ghost" className={isActive("/profile/template")}>
          <Layers />
          <p className="hidden md:inline-block">Template</p>
        </Button>
      </Link>
      <Link href="/profile/billing">
        <Button variant="ghost" className={isActive("/profile/billing")}>
          <CreditCard />
          <p className="hidden md:inline-block">Billing</p>
        </Button>
      </Link>
      <Link href="/profile/settings">
        <Button variant="ghost" className={isActive("/profile/settings")}>
          <Settings />
          <p className="hidden md:inline-block">Settings</p>
        </Button>
      </Link>
    </ul>
  );

  const unauthenticated = (
    <ul className="flex gap-2 flex-wrap md:flex-nowrap justify-center">
      <Link href="/">
        <Button variant="ghost" className={isActive("/")}>
          <Home />
          <p className="hidden md:inline-block">Home</p>
        </Button>
      </Link>
    </ul>
  );

  return (
    <header className="w-full flex flex-row justify-between p-4 border-b sticky bg-white z-10 top-0">
      <div>
        <Link href="/">
          <Image src={CVKULogo} height={50} alt={CVKULogo} />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {isAuthenticatedMenu ? authenticated : unauthenticated}
      </div>
      <ul className="flex items-center gap-2">
        {isAuthenticatedMenu ? (
          <LoginButton />
        ) : (
          <Link href="/profile">
            <Button>
              <LogIn />
              Try Now
            </Button>
          </Link>
        )}
      </ul>
    </header>
  );
};

export default Navbar;
