"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Payment() {

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full wsm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 space-y-4 py-4">
        <Link href="/profile">
          <Button variant="outline">
            <ArrowLeft />
          </Button>
        </Link>
        <h2 className="text-xl md:text-2xl">Payment Information</h2>
      </div>
    </div>
  );
}
