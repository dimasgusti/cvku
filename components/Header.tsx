import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { DollarSign, HelpCircle, Home, LogIn, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
    const {data: session} = useSession();
  return (
    <nav className="w-full h-[5rem] px-4 sticky top-0 z-50 bg-white shadow-lg">
      <ul className="flex flex-row justify-between items-center h-full">
        <div>
          <Link href="/">
            <Image
              src="/Logo.svg"
              alt="Logo CVKU"
              width={50}
              height={50}
              priority
            />
          </Link>
        </div>
        <div className="flex flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home />
              <span className="hidden md:block">Beranda</span>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm">
              <DollarSign />
              <span className="hidden md:block">Harga</span>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm">
              <HelpCircle />
              <span className="hidden md:block">FAQ</span>
            </Button>
          </Link>
        </div>
        <div>
          {session ? (
            <>
              <div className="flex flex-row gap-2 items-center">
                <Link href="/profile">
                  <Button size="sm">
                    <User />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  size="sm"
                >
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
