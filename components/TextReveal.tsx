"use client";

import React from "react";
import { motion } from "framer-motion";

const TextReveal = () => {
  const shareItems = [
    "Pendidikan",
    "Keahlian",
    "Prestasi",
    "Bahasa",
    "Karya",
    "Pekerjaan",
    "Dan banyak lagi!",
  ];
  return (
    <div className="overflow-hidden w-72 lg:w-full my-2">
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
          <p className="text-base text-black/70">
            {text}
          </p>
        </motion.div>
      ))}
      <div className="flex flex-row lg:justify-center items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4 flex-row lg:flex-col items-center"
        ></motion.div>
      </div>
    </div>
  );
};

export default TextReveal;
