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
import { Check } from "lucide-react";
import { signIn } from "next-auth/react";
import { FaSignInAlt } from "react-icons/fa";

export default function Pricing() {
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full wsm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 space-y-4 py-4">
        <h2 className="text-xl md:text-2xl">Pilih Paket CVKU</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>
                Fitur dasar untuk semua kebutuhan CVmu.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4 py-4">
              <h2 className="text-xl md:text-2xl font-semibold">
                Rp 0 <span className="font-thin text-sm">/bulan</span>
              </h2>
              <Button onClick={() => signIn()} size="sm" className="w-full opacity-50 animate-shine">
                <FaSignInAlt />
                Masuk
              </Button>
            </CardContent>
            <Separator />
            <CardContent className="space-y-4 py-4">
              <CardDescription>Fitur</CardDescription>
              <ul>
                <li className="flex flex-row justify-start items-center gap-2 text-sm text-black/70">
                  <Check size={16} color="black" />
                  CV Online
                </li>
                <li className="flex flex-row justify-start items-center gap-2 text-sm text-black/70">
                  <Check size={16} color="black" />
                  Template Dasar
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>
                Fitur lengkap untuk portofolio profesional.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4 py-4">
              <h2 className="text-xl md:text-2xl font-semibold">
                Rp 19.999 <span className="font-thin text-sm">/bulan</span>
              </h2>
              <Button onClick={() => signIn()} size="sm" className="w-full animate-shine">
                <FaSignInAlt />
                Masuk
              </Button>
              {/* <p className="text-xs font-thin text-black/70">
                Uji coba selama 1 bulan
              </p> */}
            </CardContent>
            <Separator />
            <CardContent className="space-y-4 py-4">
              <CardDescription>Fitur</CardDescription>
              <ul>
                <li className="flex flex-row justify-start items-center gap-2 text-sm text-black/70">
                  <Check size={16} color="black" />
                  CV Online
                </li>
                <li className="flex flex-row justify-start items-center gap-2 text-sm text-black/70">
                  <Check size={16} color="black" />
                  Template Ekslusif
                </li>
                <li className="flex flex-row justify-start items-center gap-2 text-sm text-black/70">
                  <Check size={16} color="black" />
                  SEO Otomatis
                </li>
                <li className="flex flex-row justify-start items-center gap-2 text-sm text-black/70">
                  <Check size={16} color="black" />
                  Analitik Profil CV
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
