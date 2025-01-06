"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const TextReveal = () => {
  const shareItems = [
    "Kontak",
    "Pendidikan",
    "Pekerjaan",
    "Skills",
    "Sertifikasi",
    "Portofolio",
    "Referensi",
  ];
  return (
    <div className="overflow-hidden w-72 lg:w-full my-2 lg:text-center">
      {shareItems.map((text, index) => (
        <motion.div
          key={index}
          initial={{ x: "100vw" }}
          animate={{
            x: 0,
          }}
          transition={{
            delay: index * 0.2,
            duration: 1,
            stiffness: 120,
          }}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
          className="mr-[1rem] text-black/70"
        >
          <p className="text-base md:text-lg">
            {text}
          </p>
        </motion.div>
      ))}
      <div className="flex flex-row lg:justify-center items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="my-4 flex gap-4 flex-row lg:flex-col items-center"
        >
          <Link href="/explore" className="w-fit">
            <Button>
              <ArrowRight />
              Coba Sekarang
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default TextReveal;
