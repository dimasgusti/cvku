"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, HelpCircle, Home, LifeBuoy } from "lucide-react";
import { generateMetaTags } from "./metadata";
import Head from "next/head";
import Image from "next/image";
import LoginButton from "@/components/ui/login-btn";
import CVKULogo from "../public/Logo & Text.svg";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

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
      <nav className="w-full h-[5rem] px-4 sticky top-0 z-50 bg-white shadow-lg">
        <ul className="flex flex-row justify-between items-center h-full">
          <div>
            <Link href="/">
              <Image
                src={CVKULogo}
                alt="Logo CVKU"
                width={100}
                height={100}
                priority
              />
            </Link>
          </div>
          <div className="flex flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home />
                <span className="hidden md:block">Beranda</span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                <DollarSign />
                <span className="hidden md:block">Harga</span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                <HelpCircle />
                <span className="hidden md:block">FAQ</span>
              </Button>
            </Link>
          </div>
          <div>
            <LoginButton />
          </div>
        </ul>
      </nav>
      <section className="min-h-[30rem] w-full flex flex-row justify-center items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full md:max-w-4xl px-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold font-serif">
              Buat CV Profesional Tanpa Ribet!
            </h1>
            <h2 className="text-xl md:text-2xl">
              Mudah, Cepat, dan Gratis
            </h2>
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
        </div>
      </section>
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                Bagikan CV hanya dengan <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                  URL Ekslusif
                </span>
              </h1>
            </>
          }
        >
          <Image
            src={`/ss2.png`}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
      <section className="h-fit w-full flex flex-row justify-center items-center bg-primary text-primary-foreground py-4">
        <div className="flex flex-wrap justify-center items-center gap-4 px-4 w-full md:max-w-4xl">
          <h2 className="text-xl md:text-2xl font-semibold truncate">
            Platform Terbaik Membuat CV
          </h2>
        </div>
      </section>
    </>
  );
}
