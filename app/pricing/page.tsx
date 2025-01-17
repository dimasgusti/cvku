"use client";

import PricingCard from "@/components/PricingCard";
import { signIn } from "next-auth/react";

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
          <PricingCard
            title="Free"
            description="Get started with essential feature of creating and sharing your CV."
            price="Rp 0"
            pricePeriod="/bulan"
            features={["Online CV", "Basic Template"]}
            onActionClick={() => signIn()}
            actionLabel="Sign-up"
          />
          <PricingCard 
            title="Pro"
            description="Upgrade to Pro"
            price="Rp 19.999"
            pricePeriod="/bulan"
            features={["Premium Template", "Exclusive URL"]}
            onActionClick={() => signIn()}
            actionLabel="Sign-up"
          />
        </div>
      </div>
    </div>
  );
}
