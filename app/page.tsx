"use client";

import Head from "next/head";
import { generateMetaTags } from "./metadata";
import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[30rem] w-full flex justify-center items-center font-serif"
      >
        <div className="flex flex-col mx-4">
          <h1 className="text-3xl md:text-4xl">CV Profesional Gapake Ribet!</h1>
          <h2 className="text-xl md:text-2xl">
            Tampil Memukau, Tingkatkan Peluang
          </h2>
          <Link href="/auth/signin" className="w-fit mt-1">
            <Button>
              <ArrowRight />
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </motion.div>
      <Separator />
      <section className="min-h-[15rem] w-full flex justify-center items-center font-serif">
        <div className="flex flex-col justify-center items-start gap-4 mx-4">
          <h2 className="text-xl md:text-2xl">
            Dapatkan Diskon 50% untuk Pengguna Baru dengan Memasukkan Code{" "}
            <span className="bg-red-500 text-white px-3">&quot;COBADULU&quot;</span>
          </h2>
          <Link href="/auth/signin" className="w-fit mt-1">
            <Button>
              <ArrowRight />
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </section>
      <Separator />
    </>
  );
}
