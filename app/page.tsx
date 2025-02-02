"use client";

import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Hero from "@/components/Hero";
import Header from "@/components/Header";
import Pricing from "@/components/Pricing";
import { Faq1 } from "@/components/FAQ";
import Features2 from "@/components/Features2";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-xl md:text-2xl text-black dark:text-white">
              Dibekali dengan <br />
              <span className="text-6xl md:text-7xl mt-1 leading-none">
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
      <Features2 />
      <Pricing />
      <Faq1 />
      <Footer />
    </>
  );
}
