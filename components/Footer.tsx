'use client'

import Link from "next/link";
import { FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { Separator } from "./ui/separator";
import Image from "next/image";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className="herobg">
      <Separator className="mt-16" />
      <div className="flex flex-row justify-center items-center p-8 border-t text-black/70 text-base sm:text-sm md:text-base lg:text-lg xl:text-xl">
        <ul className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-start gap-4">
            <Image
              src="/logo/LINKKU_LOGO_2.png"
              width={50}
              height={50}
              alt="LINKKU"
            />
            <p className="text-4xl">LINKKU</p>
          </div>
          <ul className="flex flex-wrap gap-4 text-sm md:text-base">
            <Link href="/about" className="hover:text-black">
              About
            </Link>
            <Link href="/features" className="hover:text-black">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-black">
              Pricing
            </Link>
            <Link href="/help" className="hover:text-black">
              Help and Support
            </Link>
          </ul>
          <ul className="flex flex-row gap-4">
            <Link href="/" className="hover:text-black">
              <FaInstagram size={30} />
            </Link>
            <Link href="/" className="hover:text-black">
              <FaXTwitter size={30} />
            </Link>
            <Link href="/" className="hover:text-black">
              <FaYoutube size={30} />
            </Link>
          </ul>
        </ul>
      </div>
      <div className="flex flex-row justify-center items-center p-8 text-black/70">
        <p>&copy; {year} All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;