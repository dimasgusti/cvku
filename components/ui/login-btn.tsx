import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./button";
import { FaSpinner } from "react-icons/fa6";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <>
        <Button size="sm">
          <FaSpinner className="animate-spin" />
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
          Logout
        </Button>
      </>
    );
  }

  return (
    <>
      <Button onClick={() => signIn()} size="sm">
        <FaSignInAlt />
        Login
      </Button>
    </>
  );
}
