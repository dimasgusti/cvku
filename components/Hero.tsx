import { Button } from "./ui/button";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <>
      <motion.section
        className="h-screen w-full flex flex-col lg:flex-row justify-center items-start lg:items-center p-4"
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full lg:w-1/2 flex flex-col gap-2 relative">
          <h1 className="text-3xl md:text-4xl font-semibold font-serif">
            Bingung Bikin CV?
          </h1>
          <h2 className="text-xl md:text-2xl">
            Template menarik, desain profesional, semua ada di CVKU.
          </h2>
          <motion.div
            initial={{ y: 0 }}
            whileHover={{ y: -5 }}
            className="w-fit mt-1"
          >
            <Button
              variant="default"
              className="w-fit font-semibold hover:shadow-xl transition-all duration-100"
            >
              Coba CVKU Gratis!
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
