import Link from "next/link";
import { Button } from "./ui/button";
import { FileText, LifeBuoy } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full flex flex-row justify-center items-center py-32">
      <div className="grid grid-cols-1 w-full md:max-w-4xl px-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold font-serif">
            Buat CV Profesional Tanpa Ribet!
          </h1>
          <h2 className="text-xl md:text-2xl">Mudah, Cepat, dan Gratis</h2>
          {/* <TextReveal /> */}
          <p className="text-base md:text-lg">
            Waktunya upgrade CV-mu dengan desain modern
          </p>
          <div className="flex flex-row items-center gap-4 mt-2">
            <Link href="/auth/signin">
              <Button variant="default" size="lg">
                <FileText />
                Buat Sekarang
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg">
                <LifeBuoy />
                Pelajari
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-row justify-center items-start">
          <Image
            src="/hero.png"
            alt="CV"
            width={1440}
            height={720}
            className="rounded-sm w-full mt-4 overflow-hidden"
            quality={100}
            priority
          />
        </div>
      </div>
    </section>
  );
}
