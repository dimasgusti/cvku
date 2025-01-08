"use client";

import Head from "next/head";
import { generateMetaTags } from "./metadata";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TextReveal from "@/components/TextReveal";

export default function HomePage() {
  const meta = generateMetaTags({
    title: "CVKU.id - Create Your Professional Portfolio",
    description:
      "Create, manage, and share your professional portfolio with CVKU.id. Showcase your skills, work experience, and achievements.",
    keywords: "portfolio, CV, professional, showcase",
    canonical: "https://www.cvku.id",
    image: "https://www.cvku.id/images/og-home-image.png",
  });

  return (
    <>
      <Head>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="robots" content={meta.robots} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:url" content={meta.canonical} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{meta.title}</title>
      </Head>
      <section className="min-h-[30rem] bg-[#3098f3] text-white w-full flex justify-center items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full md:max-w-4xl px-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              Buat CV atau Portofolio.
            </h1>
            <h2 className="text-xl md:text-2xl">
              Tunjukkan{" "}
              <span className="text-[#ffcc00] font-semibold">Kemampuanmu!</span>
            </h2>
            <TextReveal />
            <Link href="/auth/signin">
              <Button variant="secondary">
                <ArrowRight />
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* <section className="min-h-[30rem] bg-white text-black w-full flex justify-center items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full md:max-w-4xl px-4 py-8">
          <div className="w-full col-span-4 pb-8">
            <div className="flex flex-row justify-between">
              <h2 className="text-xl md:text-2xl">
                4 Langkah Mudah untuk Mulai CV-mu!
              </h2>
              <Link href="/auth/signin">
                <Button variant="secondary">
                  <ArrowRight />
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-[#7A71EA] text-white w-full h-52 col-span-4 md:col-span-1 lg:col-span-1 p-2">
            <div className="flex flex-col justify-center h-full items-center gap-2">
              <UserPlus size={72} />
              <h2 className="text-xl md:text-2xl">Daftar</h2>
            </div>
          </div>
          <div className="bg-[#F05454] text-white w-full h-52 col-span-4 md:col-span-1 lg:col-span-3 p-2">
            <div className="flex flex-col justify-center h-full items-center gap-2">
              <PenTool size={72} />
              <h2 className="text-xl md:text-2xl">Isi Profil</h2>
            </div>
          </div>
          <div className="bg-[#FFD368] text-white w-full h-52 col-span-4 md:col-span-3 lg:col-span-3 p-2">
            <div className="flex flex-col justify-center h-full items-center gap-2">
              <Layout size={72} />
              <h2 className="text-xl md:text-2xl">Pilih Template</h2>
            </div>
          </div>
          <div className="bg-[#4CAF50] text-white w-full h-52 col-span-4 md:col-span-2 lg:col-span-1 p-2">
            <div className="flex flex-col justify-center h-full items-center gap-2">
              <Share2 size={72} />
              <h2 className="text-xl md:text-2xl">Bagikan / Unduh</h2>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}
