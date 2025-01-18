"use client";

import TextReveal from "@/components/TextReveal";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Pricing from "./pricing/page";

export default function HomePage() {

  return (
    <>
      <section className="min-h-[30rem] w-full flex flex-row justify-center items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full md:max-w-4xl px-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold font-serif">
              Buat, Bagikan, Kembangkan
            </h1>
            <h2 className="text-xl md:text-2xl">Platform Terbaik Membuat CV</h2>
            <TextReveal />
            <Link href="/auth/signin">
              <Button className="animate-pulse hover:animate-none">
                <ArrowRight />
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Pricing />
    </>
  );
}
