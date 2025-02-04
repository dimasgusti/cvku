"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import "../../app/globals.css";
import { Button } from "@/components/ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  // const { data: session } = useSession();

  useEffect(() => {
    if (router.query.error) {
      setError("An error occurred. Please try signing in again.");
    }
  }, [router.query.error]);

  const handleSignIn = async (provider: string) => {
    const result = await signIn(provider, { callbackUrl: "/profile" });
    if (result?.error) {
      setError(result.error);
    }
  };

  // if(session){
  //   router.push("/profile")
  // }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-4 py-10 md:py-0">
        <Link href="/">
          <img
            src="/Logo & Text.svg"
            alt="Logo"
            width={100}
            height={100}
            className="mb-6"
          />
        </Link>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Welcome Back!</h2>
          <p className="mt-2 text-gray-600">
            Log in with one of the following providers to access your CVKU
            account.
          </p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={() => handleSignIn("github")}
          >
            <FaGithub />
            Continue with GitHub
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={() => handleSignIn("google")}
          >
            <FaGoogle />
            Continue with Google
          </Button>
        </div>
        {error && (
          <p className="mt-4 text-xs text-red-600 text-center">{error}</p>
        )}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          By logging in, you agree to our{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/terms-and-conditions" className="underline">
            Terms & Conditions
          </a>
          .
        </footer>
      </div>
      <div className="flex-1 hidden md:block">
        <img
          src="/mountain.jpg"
          alt="Mountain"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
