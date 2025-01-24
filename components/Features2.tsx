import { ChevronRight, LayoutDashboard, MousePointer, Zap } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";

export default function Features2() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[30rem] py-16 text-white bg-primary">
      <div className="flex flex-wrap flex-col justify-center items-center gap-4 px-4 w-full md:max-w-4xl">
        <h2 className="text-xl md:text-2xl">Mengapa Memilih CVKU?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon={<Zap size={32} />}
            title="Proses Cepat dan Otomatis"
            description="Buat CV Profesional dalam hitungan menit tanpa kerumitan."
          />
          <FeatureCard
            icon={<MousePointer size={32} />}
            title="Mudah Digunakan"
            description="Antarmuka yang intuitif, dirancang untuk siapa saja bahkan tanpa latar belakang sekalipun."
          />
          <FeatureCard
            icon={<LayoutDashboard size={32} />}
            title="Desain Modern dan Menarik"
            description="Pilih dari berbagai template elegan yang dirancang untuk menarik perhatian perekrut dan calon klien Anda."
          />
        </div>
        <h2 className="text-xl md:text-2xl">
          CVKU adalah solusi tepat untuk menonjolkan potensi Anda dengan mudah, cepat dan profesional. <br />
          Mulai sekarang, tingkatkan peluang Anda dengan CV yang tak terlupakan!
        </h2>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <Card className="max-w-md flex flex-col justify-between">
      <CardHeader>
        {icon}
        <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
      <CardFooter>
        <Link href="/">
          <Button>
            Coba Sekarang
            <ChevronRight />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
