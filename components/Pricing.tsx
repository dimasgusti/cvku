import { Check, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center min-h-[30rem] py-16">
      <div className="flex flex-wrap flex-col justify-center items-center gap-4 px-4 w-full md:max-w-4xl">
        <h2 className="text-xl md:text-2xl">Harga</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-4 md:gap-8 lg:gap-16 py-4">
          <PricingCard
            title="Starter"
            description="Semua kebutuhan CV Anda"
            price={0}
            pricePeriod="/selamanya"
            features={[
              "Buat CV Online dengan mudah",
              "Bagikan URL unik CV Anda",
              "Pilih dari 2 template dasar",
              "Cocok untuk fresh graduate dan freelancer baru",
            ]}
            onActionClick={() => router.push('/auth/signin')}
            actionLabel="Coba Sekarang"
          />
          <PricingCard
            title="Pro"
            description="Tingkatkan kelas CV Anda"
            price={54.999}
            pricePeriod="/tahun"
            features={[
              "Semua fitur Starter",
              "Eksport CV ke PDF",
              "Akses ke 10+ template premium yang dirancang profesional.",
              "Dapatkan prioritas dukungan pelanggan",
            ]}
            onActionClick={() => router.push('/auth/signin')}
            actionLabel="Coba Sekarang"
          />
        </div>
      </div>
    </div>
  );
}

interface PricingCardProps {
  title: string;
  description: string;
  price: number;
  pricePeriod: string;
  features: string[];
  onActionClick: () => void;
  actionLabel: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  pricePeriod,
  features,
  onActionClick,
  actionLabel,
}) => {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 py-4 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-semibold">
          Rp {price}
          <span className="font-thin text-sm">{pricePeriod}</span>
        </h2>
        <Button onClick={onActionClick} size="sm" className="w-full">
          {actionLabel}
          <ChevronRight />
        </Button>
      </CardContent>
      <Separator />
      <CardContent className="space-y-4 py-4">
        <CardDescription>Features</CardDescription>
        <ul>
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex flex-row justify-start items-center gap-2 text-sm text-black/70"
            >
              <Check size={16} color="black" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
