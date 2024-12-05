import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./button";
import Link from "next/link";

export default function LoginButton() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return null;
    }

    if (session) {
        return (
            <>
                <ul className="flex flex-row gap-2">
                    <Link href='/dashboard'>
                        <Button size="sm">
                            Dashboard
                        </Button>
                    </Link>
                    <li>
                        <Button onClick={() => signOut()} size="sm">
                            Sign out
                        </Button>
                    </li>
                </ul>
            </>
        );
    }

    return (
        <>
            <Button onClick={() => signIn()} size="sm">
                Sign in
            </Button>
        </>
    );
}