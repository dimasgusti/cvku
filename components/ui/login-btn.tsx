import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./button";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { Loader, User } from "lucide-react";
import Link from "next/link";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <>
        <Button size="sm" variant="ghost">
          <Loader className="animate-spin" />
          Loading...
        </Button>
      </>
    );
  }

  if (session) {
    return (
      <>
        <div className="flex flex-row items-center gap-2">
          <Link href='/profile'>
            <Button size='sm'>
              <User />
            </Button>
          </Link>
          <Button variant="outline" onClick={() => signOut({callbackUrl: '/'})} size="sm">
            <FaSignOutAlt />
            Keluar
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Button onClick={() => signIn()} size="sm">
        <FaSignInAlt />
        Coba Sekarang
      </Button>
    </>
  );
}
