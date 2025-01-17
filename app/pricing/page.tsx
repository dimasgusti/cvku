"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Wrench } from "lucide-react";
import { signIn } from "next-auth/react";
import { FaSignInAlt } from "react-icons/fa";

export default function Pricing() {
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 space-y-4 py-4">
        <h2 className="text-xl md:text-2xl">Choose That Fits Your Needs</h2>
        <p className="text-black/70">
          Our pricing plans are designed to provide the flexibility and features
          you need to create and share the perfect CV. Compare features and
          choose the best option for your career.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>
                Get started with creating and sharing your CV.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4 py-4">
              <h2 className="text-xl md:text-2xl font-semibold">
                Rp 0 <span className="font-thin text-sm">/bulan</span>
              </h2>
              <Button onClick={() => signIn()} size="sm" className="w-full">
                <FaSignInAlt />
                Sign-up
              </Button>
            </CardContent>
            <Separator />
            <CardContent className="space-y-4 py-4">
              <CardDescription>Feature</CardDescription>
              <ul>
                <li className="flex flex-row justify-start items-center gap-2 text-sm text-black/70">
                  <Check size={16} color="black" />
                  Online CV
                </li>
                <li className="flex flex-row justify-start items-center gap-2 text-sm text-black/70">
                  <Check size={16} color="black" />
                  Basic Template
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>
                Upgrade to the Pro plan and get access to exclusive feature.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4 py-4">
              <h2 className="text-xl md:text-2xl font-semibold">
                Rp 19.999 <span className="font-thin text-sm">/bulan</span>
              </h2>
              <Button onClick={() => signIn()} size="sm" className="w-full">
                <FaSignInAlt />
                Sign-up
              </Button>
              {/* <p className="text-xs font-thin text-black/70">
                Uji coba selama 1 bulan
              </p> */}
            </CardContent>
            <Separator />
            <CardContent className="space-y-4 py-4">
              <CardDescription>Feature</CardDescription>
              <ul>
                <li className="flex flex-row justify-start items-center gap-2 text-sm text-black/70">
                  <Check size={16} color="black" />
                  Online CV
                </li>
                <li className="flex flex-row justify-start items-center gap-2 text-sm text-black/70">
                  <Check size={16} color="black" />
                  Premium Template
                </li>
                <li className="flex flex-row justify-start items-center gap-2 text-sm text-black/70">
                  <Check size={16} color="black" />
                  Priority Support
                </li>
                <li className="flex flex-row justify-start items-center gap-2 text-sm text-black/70">
                  <Wrench size={16} color="black" />
                  More Feature Will Coming Out Soon!
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
