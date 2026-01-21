"use client";

import { Honor } from "@/types";
import Image from "next/image";

type Props = {
  data: Honor[];
};

export default function HeroSection({ data }: Props) {
  const backgroundImage = "/wp-content/uploads/2024/04/bg-demo-1024x689.png";

  return (
    <section className="bg-[#292A2D] flex flex-col items-center justify-center w-full py-12">
      {/* Tiêu đề */}
      <h1 className="text-center text-sky-300 font-sans font-[700] text-lg md:text-xl lg:text-2xl uppercase mb-8">
        Vinh Danh Học Viên
      </h1>

      {/* ============ UI >= sm (DESKTOP) ============ */}
      <div className="hidden sm:flex relative w-[95%] md:w-[90%] max-w-[1100px] bg-[#E4ECF5] rounded-3xl flex-col items-center p-6 md:p-8">
        {/* Khung chứa ảnh nền + lưới ảnh */}
        <div className="relative w-full aspect-[1024/689] flex items-center justify-center">
          <div className="relative w-full h-[95%] overflow-hidden">
            <Image
              src={backgroundImage}
              alt="background"
              fill
              className="object-contain object-center transition-transform"
              priority
            />

            {/* Grid ảnh đè lên nền */}
            {data && data.length > 0 && (
              <div
                className="
                  absolute inset-0
                  grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
                  gap-2
                  px-[4%] py-[3%]
                  justify-items-center
                  items-center
                "
              >
                {data.slice(0, 11).map((h) => (
                  <div
                    key={h.id}
                    className="relative w-full max-w-[250px] h-full max-h-[220px] rounded-lg overflow-hidden shadow-md border border-white/60 hover:scale-[1.03] transition-transform duration-300"
                  >
                    {h.photo && (
                      <Image
                        src={h.photo}
                        alt={h.name}
                        fill
                        className="object-cover object-center"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hàng biểu tượng tròn nhỏ phía dưới */}
        {data && data.length > 0 && (
          <div className="relative z-10 flex flex-wrap justify-center gap-4 mt-10 px-6">
            {data.slice(0, 11).map((h, idx) => (
              <div
                key={`thumb-${h.id}-${idx}`}
                className="
          group relative w-16 h-16 md:w-20 md:h-20 rounded-full 
          border-[3px] border-transparent 
          bg-gradient-to-tr from-[#4FC3F7] via-[#D1228A] to-[#6B3D97] 
          p-[2px] shadow-[0_0_12px_rgba(0,0,0,0.25)]
          hover:shadow-[0_0_20px_rgba(209,34,138,0.6)]
          transition-all duration-300 hover:scale-110
          cursor-pointer
        "
              >
                {/* Ảnh học viên */}
                <div
                  className="
            relative w-full h-full rounded-full overflow-hidden
            bg-white group-hover:bg-gradient-to-tr group-hover:from-[#fff] group-hover:to-[#f3e6ff]
            transition-all duration-300
          "
                >
                  {h.photo && (
                    <Image
                      src={h.photo}
                      alt={h.name}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </div>

                {/* Viền phát sáng nhẹ khi hover */}
                <div
                  className="
            absolute inset-0 rounded-full 
            opacity-0 group-hover:opacity-100 
            blur-md transition-opacity duration-300
          "
                ></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============ UI < sm (MOBILE) ============ */}
      <div className="flex sm:hidden relative w-[92%] bg-[#E4ECF5] rounded-2xl overflow-hidden p-4">
        {/* Nền bg-demo */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="background mobile"
            fill
            className="object-contain object-center opacity-60"
            priority
          />
        </div>

        {/* Lưới ảnh dạng cột */}
        <div className="relative flex flex-col items-center justify-center w-full gap-4">
          {data &&
            data.slice(0, 8).map((h) => (
              <div
                key={h.id}
                className="relative w-[85%] h-[200px] rounded-xl overflow-hidden shadow-md border border-white/60"
              >
                {h.photo && (
                  <Image
                    src={h.photo}
                    alt={h.name}
                    fill
                    className="object-cover object-center transition-transform"
                  />
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Nút đăng ký */}
      <div className="mt-8">
        <a
          href="#tu-van-lo-trinh"
          className="uppercase text-base sm:text-lg md:text-xl font-sans font-[700] px-2 py-2.5 sm:px-6 sm:py-4 bg-gradient-to-r from-[#D1228A] to-[#6B3D97] text-white border-2 border-white rounded-2xl hover:scale-105 transition duration-300"
        >
          Đăng ký tư vấn nhận lộ trình
        </a>
      </div>
    </section>
  );
}
