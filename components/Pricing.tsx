import { redirect } from "next/navigation";
import PricingCard from "./PricingCard";

export default function Pricing() {
  return (
    <section className="min-h-[30rem] w-full flex flex-col justify-start items-center gap-4 md:gap-8 xl:gap-16">
      <div className="flex flex-col">
        <p>Harga</p>
        <h1 className="text-3xl md:text-4xl font-semibold font-serif">
          Sesuaikan dengan Kebutuhan
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PricingCard
          title="Free"
          description="Pilihan terbaik"
          price="0"
          pricePeriod="/bulan"
          features={["Template Online Standar", "URL Ekslusif", "Dukungan Pengguna Dasar"]}
          onActionClick={() => redirect("/auth/signin")}
          actionLabel="Coba Sekarang"
        />
        <PricingCard
          title="Free"
          description="Pilihan terbaik"
          price="0"
          pricePeriod="/bulan"
          features={[
            "Template Online Premium",
            "Download as PDF",
            "5+ Template CV",
            "Custom Branding",
            "Prioritas Dukungan",
          ]}
          onActionClick={() => redirect("/auth/signin")}
          actionLabel="Beli Sekarang"
        />
      </div>
    </section>
  );
}
