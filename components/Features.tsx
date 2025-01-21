import { ArrowRight, Monitor, Share2, Sliders } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Features() {
  return (
    <section className="min-h-[30rem] w-full flex flex-col justify-start items-center gap-4 md:gap-8 xl:gap-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full place-items-start md:max-w-4xl px-4">
        <div className="flex flex-col">
          <p>Fitur</p>
          <h1 className="text-3xl md:text-4xl font-semibold font-serif">
            Temukan Fitur Terbaik
          </h1>
        </div>
        <div className="flex flex-row w-full">
          <p className="xl:text-end xl:pl-16">
            Fitur utama kami dirancang untuk memberikan pengalaman yang efisien
            dan memudahkan Anda dalam mencapai tujuan dengan berbagai fungsi
            yang terintegrasi.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full place-items-start md:max-w-4xl px-4 gap-8">
        <div className="flex flex-col justify-start items-start">
          <Share2 size={32} />
          <h2 className="mt-4 font-bold">Membagikan dengan Mudah</h2>
          <p>Gunakan URL ekslusif yang dapat diakses oleh semua orang.</p>
        </div>
        <div className="flex flex-col justify-start items-start">
          <Sliders size={32} />
          <h2 className="mt-4 font-bold">Personalisasi</h2>
          <p>Pilih tema dan tata letak yang sesuai dengan gaya Anda.</p>
        </div>
        <div className="flex flex-col justify-start items-start">
          <Monitor size={32} />
          <h2 className="mt-4 font-bold">UI yang Ramah</h2>
          <p>
            Antarmuka yang menyesuaikan tampilan dengan perangkat yang
            digunakan.
          </p>
        </div>
      </div>
      <Link href="/auth/signin">
        <Button>
            <ArrowRight />
            Daftar Sekarang
        </Button>
      </Link>
    </section>
  );
}
