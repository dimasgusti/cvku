"use client";

import PricingCard from "@/components/PricingCard";
import { signIn } from "next-auth/react";

export default function Pricing() {
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 space-y-4 py-4">
        <h2 className="text-xl md:text-2xl font-semibold">Pilih Paket yang Sesuai dengan Kebutuhanmu</h2>
        <p className="text-black/70">
          Paket harga kami dirancang untuk memberikan fleksibilitas dan fitur yang kamu butuhkan
          untuk membuat dan membagikan CV yang sempurna. Bandingkan fitur dan pilih opsi terbaik
          untuk karirmu.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 place-items-center items-start gap-4">
          <PricingCard
            title="Gratis"
            description="Mulai dengan fitur dasar untuk membuat dan membagikan CV-mu."
            price="Rp 0"
            pricePeriod="/bulan"
            features={["CV Online", "Template Dasar"]}
            onActionClick={() => signIn()}
            actionLabel="Daftar Sekarang"
          />
          <PricingCard 
            title="Pro"
            description="Upgrade ke Pro untuk lebih banyak fitur eksklusif."
            price="Rp 19.999"
            pricePeriod="/bulan"
            features={["Template Premium", "URL Eksklusif"]}
            onActionClick={() => signIn()}
            actionLabel="Daftar Sekarang"
          />
        </div>
      </div>
    </div>
  );
}