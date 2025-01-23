"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  FileText,
  HelpCircle,
  Home,
  LifeBuoy,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import Image from "next/image";
import CVKULogo from "../public/Logo & Text.svg";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Separator } from "@/components/ui/separator";
import { signOut, useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();
  return (
    <>
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
            {session ? (
              <>
                <div className="flex flex-row gap-2 items-center">
                  <Link href="/profile">
                    <Button size="sm">
                      <User />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    size="sm"
                  >
                    <LogOut />
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button size="sm">
                  <LogIn />
                </Button>
              </Link>
            )}
          </div>
        </ul>
      </nav>
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
              src="/ss3.png"
              alt="CV"
              width={250}
              height={250}
              className="rounded-sm w-full mt-4"
            />
          </div>
        </div>
      </section>
      <Separator />
      <div className="flex flex-col overflow-hidden">
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="text-4xl font-semibold text-black dark:text-white">
                  Dibekali dengan <br />
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
      <section className="min-h-[30rem] w-full flex flex-col justify-center items-center">
        <div className="flex flex-wrap justify-center items-center gap-4 px-4 w-full md:max-w-4xl"></div>
      </section>
    </>
  );
}
