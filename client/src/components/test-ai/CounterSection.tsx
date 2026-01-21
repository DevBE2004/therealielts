"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
      className="text-[#21366B] font-sans font-[700] text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
    >
      {display}+
    </span>
  );
}

export default function CounterSection() {
  return (
    <section className="relative z-20 w-full -mt-24 sm:-mt-28 md:-mt-36 ">
      <div className="max-w-6xl mx-auto w-[92%] sm:w-[85%] lg:w-[75%] bg-[#20376C] rounded-3xl sm:rounded-full py-6 sm:py-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4 sm:gap-6 md:gap-8 px-5">
          {/* Card 1 */}
          <div className="flex flex-col gap-2 p-4 sm:p-6 flex-1 items-center justify-center bg-white rounded-2xl sm:rounded-l-full shadow-md hover:shadow-lg transition-all">
            <Counter from={245} to={2068} />
            <p className="text-[#21366B] font-sans font-[500] text-sm sm:text-base lg:text-lg text-center leading-snug">
              Học Viên
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col gap-2 p-4 sm:p-6 flex-1 items-center justify-center bg-white rounded-2xl shadow-md hover:shadow-lg transition-all">
            <Counter from={50} to={1256} />
            <p className="text-[#21366B] font-sans font-[500] text-sm sm:text-base lg:text-lg text-center leading-snug">
              Học viên đạt <br /> IELTS 6.5+ trở lên
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col gap-2 p-4 sm:p-6 flex-1 items-center justify-center bg-white rounded-2xl sm:rounded-r-full shadow-md hover:shadow-lg transition-all">
            <Counter from={10} to={689} />
            <p className="text-[#21366B] font-sans font-[500] text-sm sm:text-base lg:text-lg text-center leading-snug">
              Học viên đạt <br /> IELTS 7.5+ trở lên
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
