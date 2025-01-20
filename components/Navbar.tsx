"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  BarChart,
  Compass,
  CreditCard,
  DollarSign,
  Home,
  LifeBuoy,
  Settings,
  User,
} from "lucide-react";
import LoginButton from "./ui/login-btn";

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path
      ? "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
      : "";

  const pagesWithAuthenticatedMenu = [
    "/profile",
    "/profile/analytics",
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
      <Link href="/profile/analytics">
        <Button variant="ghost" className={isActive("/profile/analytics")}>
          <BarChart />
          <p className="hidden md:inline-block">Analytics</p>
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
      {/* <Link href="/explore">
        <Button variant="ghost" className={isActive("/explore")}>
          <Compass />
          <p className="hidden md:inline-block">Explore</p>
        </Button>
      </Link> */}
      <Link href="/pricing">
        <Button variant="ghost" className={isActive("/pricing")}>
          <DollarSign />
          <p className="hidden md:inline-block">Pricing</p>
        </Button>
      </Link>
      {/* <Link href="/help">
        <Button variant="ghost" className={isActive("/help")}>
          <LifeBuoy />
          <p className="hidden md:inline-block">Help</p>
        </Button>
      </Link> */}
    </ul>
  );

  return (
    <header className="w-full flex flex-row justify-between p-4 border-b sticky bg-white z-10 top-0">
      <div className="flex items-center gap-2">
        {isAuthenticatedMenu ? authenticated : unauthenticated}
      </div>
      <ul className="flex items-center gap-2">
        {isAuthenticatedMenu ? (
          <LoginButton />
        ) : (
          <Link href="/profile">
            <Button>
              <User />
            </Button>
          </Link>
        )}
      </ul>
    </header>
  );
};

export default Navbar;
