"use client";

import TextReveal from "@/components/TextReveal";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { generateMetaTags } from "./metadata";
import Head from "next/head";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";

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
      <section className="min-h-[30rem] w-full flex flex-row justify-center items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full md:max-w-4xl px-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold font-serif">
              Buat, Bagikan, Kembangkan
            </h1>
            <h2 className="text-xl md:text-2xl">Platform Terbaik Membuat CV</h2>
            <TextReveal />
            <Link href="/auth/signin">
              <Button>
                <ArrowRight />
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Features />
      <Pricing />
    </>
  );
}
