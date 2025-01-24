"use client";

import { Separator } from "./ui/separator";
import Image from "next/image";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className="herobg">
      <Separator className="mt-16" />
      <div className="flex flex-row justify-center items-center p-8 text-base sm:text-sm md:text-base lg:text-lg xl:text-xl">
        <Image src="/Logo & Text.svg" width={200} height={200} alt="LINKKU" />
      </div>
      <div className="flex flex-row justify-center items-center p-8">
        <p>&copy; {year} All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
