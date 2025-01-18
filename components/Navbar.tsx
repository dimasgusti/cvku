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

  const pagesWithAuthenticatedMenu = ["/profile", "/profile/analytics", "/profile/award", "/profile/certification", "/profile/project", "/profile/work-experience", "/profile/billing", "/profile/settings"];

  const isAuthenticatedMenu = pagesWithAuthenticatedMenu.includes(pathname ?? "");

  const authenticated = (
    <div className="flex gap-2">
      <Link href="/profile">
        <Button variant="ghost" className={isActive("/profile")}>
          <User />
          Profile
        </Button>
      </Link>
      <Link href="/profile/analytics">
        <Button variant="ghost" className={isActive("/profile/analytics")}>
          <BarChart />
          Analytics
        </Button>
      </Link>
      <Link href="/profile/billing">
        <Button variant="ghost" className={isActive("/profile/billing")}>
          <CreditCard />
          Billing
        </Button>
      </Link>
      <Link href="/profile/settings">
        <Button variant="ghost" className={isActive("/profile/settings")}>
          <Settings />
          Settings
        </Button>
      </Link>
    </div>
  );

  const unauthenticated = (
    <div className="flex gap-2">
      <Link href="/">
        <Button variant="ghost" className={isActive("/")}>
          <Home />
          Home
        </Button>
      </Link>
      <Link href="/explore">
        <Button variant="ghost" className={isActive("/explore")}>
          <Compass />
          Explore
        </Button>
      </Link>
      <Link href="/pricing">
        <Button variant="ghost" className={isActive("/pricing")}>
          <DollarSign />
          Pricing
        </Button>
      </Link>
      <Link href="/help">
        <Button variant="ghost" className={isActive("/help")}>
          <LifeBuoy />
          Help
        </Button>
      </Link>
    </div>
  );

  return (
    <header className="w-full flex flex-row justify-between p-4 border-b sticky bg-white z-10 top-0">
      <div>{isAuthenticatedMenu ? authenticated : unauthenticated}</div>
      <ul className="flex flex-row justify-center items-center gap-2">
        {isAuthenticatedMenu ? <LoginButton /> : <Link href='/profile'><Button><User />Profile</Button></Link>}
      </ul>
    </header>
  );
};

export default Navbar;