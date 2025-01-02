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
                callbackUrl: '/'
            });

            if (result?.error) {
                setError(result.error);
            }
        } else {
            const result = await signIn(provider, { callbackUrl: '/' });

            if (result?.error) {
                setError(result.error);
            }
        }
    };

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50">
            <Card className="w-[360px] p-6 shadow-lg rounded-lg">
                <CardHeader className="flex flex-col items-center mb-6">
                    <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
                    <CardDescription className="text-center text-gray-600">
                        Welcome back! Please sign in to access your portfolio.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Button 
                        variant="outline" 
                        onClick={() => handleSignIn('github')} 
                        className="w-full flex justify-center items-center"
                    >
                        <FaGithub className="mr-2" /> Login with GitHub
                    </Button>

                    <Button 
                        variant="outline" 
                        onClick={() => handleSignIn('google')} 
                        className="w-full flex justify-center items-center"
                    >
                        <FaGoogle className="mr-2" /> Login with Google
                    </Button>

                    <div className="flex flex-col items-center gap-2">
                        <input 
                            type="email" 
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <Button 
                            onClick={() => handleSignIn('email')} 
                            className="w-full flex justify-center items-center"
                        >
                            <FaEnvelope className="mr-2" /> Login with Email
                        </Button>
                    </div>
                </CardContent>

                {error && (
                    <CardFooter className="w-full flex justify-center items-center mt-4 text-red-600 text-xs text-center">
                        <p>{error}</p>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}