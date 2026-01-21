"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomeFeatures() {
  const content = [
    { id: "1", desc: "làm bài test", detail: "ai", href: "/test-ai" },
    {
      id: "2",
      desc: "xây dựng",
      detail: "lộ trình học",
      href: "/xay-dung-lo-trinh",
    },
    {
      id: "3",
      desc: "thư viện học",
      detail: "ielts",
      href: "/thu-vien-tai-lieu-ielts-mien-phi",
    },
  ];

  return (
    <section id="home_feature" className="w-full bg-white py-10">
      <div className="w-full flex flex-col max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div
          className="
            grid grid-cols-2 md:grid-cols-3 
            gap-4 md:gap-6 lg:gap-8
          "
        >
          {content.map((feature) => {
            let extraClasses = "";

            if (feature.id === "1") {
              extraClasses = "col-start-1 row-start-1 md:col-auto md:row-auto";
            } else if (feature.id === "3") {
              extraClasses = "col-start-2 row-start-1 md:col-auto md:row-auto";
            } else if (feature.id === "2") {
              extraClasses = "col-span-2 row-start-2 md:col-auto md:row-auto";
            }

            return (
              <Link
                key={feature.id}
                href={feature.href}
                className={`
                  text-white bg-gradient-to-b from-blue-700 to-sky-500 
                  px-4 md:px-6 py-6 md:py-8 h-40 md:h-44 
                  flex flex-col justify-center items-center 
                  rounded-xl shadow-md transition-all duration-300
                  ${
                    feature.id === "2"
                      ? "bg-gradient-to-b from-purple-800 to-sky-500"
                      : ""
                  }
                  ${extraClasses} 
                `}
              >
                <h3 className="uppercase font-sans font-[600] text-lg md:text-xl lg:text-2xl">
                  {feature.desc}
                </h3>
                <h3 className="uppercase font-sans font-[700] text-xl md:text-2xl lg:text-3xl mt-2">
                  {feature.detail}
                </h3>
              </Link>
            );
          })}
        </div>
        <div className="w-full flex justify-center mt-6">
          <a
            href="#tu-van"
            className="relative inline-block px-8 py-4 text-lg md:text-xl font-sans font-[700] uppercase text-white rounded-lg shadow-md bg-gradient-to-r from-sky-700 via-purple-500 to-pink-300 overflow-hidden"
          >
            {/* Border sáng chạy quanh */}
            <motion.span
              className="absolute inset-0 rounded-lg p-[2px]"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, white 90deg, transparent 180deg)",
              }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
              <span className="block w-full h-full rounded-lg bg-gradient-to-r from-sky-700 via-purple-500 to-pink-300"></span>
            </motion.span>

            <span className="relative z-10">Tư vấn khóa học phù hợp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
