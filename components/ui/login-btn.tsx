import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./button";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { Loader } from "lucide-react";

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
        <Button variant="outline" onClick={() => signOut()} size="sm">
          <FaSignOutAlt />
          Keluar
        </Button>
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
