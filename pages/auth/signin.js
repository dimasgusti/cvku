'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Button } from '../../components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardFooter,
    CardTitle,
} from "../../components/ui/card";
import "../../app/globals.css";
import { FaGithub, FaGoogle, FaEnvelope } from "react-icons/fa6";

export default function SignIn() {
    const router = useRouter();
    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (router.query.error) {
            setError("An error occurred. Please try signing in again.");
        }
    }, [router.query.error]);

    const handleSignIn = async (provider) => {
        if (provider === 'email' && email) {
            const result = await signIn(provider, {
                email,
                callbackUrl: '/dashboard'
            });

            if (result?.error) {
                setError(result.error);
            }
        } else {
            const result = await signIn(provider, { callbackUrl: '/dashboard' });

            if (result?.error) {
                setError(result.error);
            }
        }
    };

    return (
        <>
            <div className="w-full h-screen flex flex-col justify-center items-center">
                <Card className="w-[360px]">
                    <CardHeader className="w-full flex flex-col justify-center items-center">
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription className="text-center">
                            Welcome back! Please sign in to access your portfolio.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="w-full flex flex-row justify-center">
                        <Button onClick={() => handleSignIn('github')}>
                            <FaGithub /> Login with Github
                        </Button>
                    </CardContent>

                    <CardContent className="w-full flex flex-row justify-center">
                        <Button onClick={() => handleSignIn('google')}>
                            <FaGoogle /> Login with Google
                        </Button>
                    </CardContent>

                    <CardContent className="w-full flex flex-col gap-2 justify-center">
                        <input 
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 rounded"
                        />
                        <Button onClick={() => handleSignIn('email')}>
                            <FaEnvelope /> Login with Google
                        </Button>
                    </CardContent>

                    {error && (
                        <CardFooter className="w-full flex justify-center items-center mt-4 text-red-600 text-xs text-center">
                            <p>{error}</p>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </>
    );
}