"use client";

import { motion } from "framer-motion";
import { ChevronsDownIcon } from "lucide-react";
import Link from "next/link";

type ButtonProps = {
  content: string,
  url: string,
};

export default function ButtonBase({content, url}: ButtonProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Animated Arrow */}
      <motion.div
        initial={{ y: -5, opacity: 0.5 }}
        animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        className=""
      >
        <ChevronsDownIcon size={28} className="text-red-600" />
      </motion.div>

      {/* Button */}
      <Link
        href={url}
        className="bg-gradient-to-r from-sky-900 to-orange-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"  
      >
        {content}
      </Link>
    </div>
  );
}
