import {
  ChevronRight,
  Circle,
  LayoutDashboard,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function Features() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[30rem] py-16 text-white bg-primary">
      <div className="flex flex-wrap flex-col justify-center items-center gap-4 px-4 w-full md:max-w-4xl">
        <h2 className="text-xl md:text-2xl">
          Temukan Fitur yang tidak ada ditempat lain.
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-center items-center gap-4 md:gap-8 lg:gap-16 py-4">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>
                <Zap />
              </CardTitle>
              <CardTitle className="font-normal">Cepat dan Efisien</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Proses pembuatan dirancang mudah dan nyaman, memungkinkan Anda
                fokus pada konten tanpa khawatir teknis.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary">
                Coba Sekarang
                <ChevronRight />
              </Button>
            </CardFooter>
          </Card>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>
                <Circle />
              </CardTitle>
              <CardTitle className="font-normal">Mudah Digunakan</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Desain intuitif untuk memudahkan siapa saja, bahkan tanpa
                pengalaman teknis sekalipun.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary">
                Coba Sekarang
                <ChevronRight />
              </Button>
            </CardFooter>
          </Card>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>
                <LayoutDashboard />
              </CardTitle>
              <CardTitle className="font-normal">Tampil Profesional</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Pilih dari berbagai template modern yang tidak hanya menarik
                perekrut tetapi juga calon klien Anda.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary">
                Coba Sekarang
                <ChevronRight />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
