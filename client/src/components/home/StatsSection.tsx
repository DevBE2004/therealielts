"use client";

import { animate, useInView, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function Counter({
  from,
  to,
  duration = 2,
}: {
  from: number;
  to: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(from);
  const [display, setDisplay] = useState(from.toLocaleString());

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration,
        onUpdate: (latest) => {
          const next = Math.floor(latest).toLocaleString();
          setDisplay(next);
        },
      });
      return () => controls.stop();
    }
  }, [inView, from, to, duration]);

  return (
    <span
      ref={ref}
      className="text-[#B32686] font-sans font-[700] text-2xl md:text-4xl xl:text-6xl"
    >
      {display}+
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="w-full py-8 bg-violet-100">
      <div className="flex flex-col gap-5 items-center justify-center mb-5">
        <h2 className="text-2xl lg:text-3xl font-sans font-[700] text-[#21366B]">
          NHỮNG CON SỐ ẤN TƯỢNG
        </h2>
        <div className="relative overflow-hidden">
          <Image
            src="/icons/shape-23-01.png"
            alt="shape-plus"
            width={70}
            height={50}
            className="object-contain object-center"
          />
        </div>
      </div>

      <div className="w-full items-center justify-center flex gap-6 md:gap-8 lg:gap-10 py-3 px-4 mx-auto lg:px-8 xl:px-16">
        <div className="flex flex-col gap-2 p-3 w-full items-center justify-center">
          <Counter from={245} to={2068} />
          <p className="text-[#21366B] font-sans font-[500] text-[16px] lg:text-[20px] text-center">
            Học Viên
          </p>
        </div>

        <div className="flex flex-col gap-2 p-3 w-full items-center justify-center border-x-2 border-gray-500">
          <Counter from={50} to={1256} />
          <p className="text-[#21366B] font-sans font-[500] text-[16px] lg:text-[20px] text-center">
            Học viên đạt IELTS 6.5+ trở lên
          </p>
        </div>

        <div className="flex flex-col gap-2 p-3 w-full items-center justify-center">
          <Counter from={10} to={689} />
          <p className="text-[#21366B] font-sans font-[500] text-[16px] lg:text-[20px] text-center">
            Học viên đạt IELTS 7.5+ trở lên
          </p>
        </div>
      </div>
    </section>
  );
}
