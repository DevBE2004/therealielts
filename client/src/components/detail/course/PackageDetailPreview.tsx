"use client";

import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronsDownIcon,
  Dot,
  House,
  LibraryBig,
  PencilLine,
  Rocket,
  Target,
  User,
} from "lucide-react";
import ConsultationForm from "@/components/common/ConsultationForm";
import Link from "next/link";
import { Course } from "@/types";
import YouTubeLite from "@/components/YoutubeLite";
import CoursePackageSection from "@/components/common/CoursePackageSection";
import { motion } from "framer-motion";
import WhyChooseTRI from "@/components/common/WhyChooseTRI";

type PageProps = {
  data: Course;
  courses: Course[];
};

export const dynamic = "force-dynamic";

export default function PackageDetailPreview({ data, courses }: PageProps) {
  const icons = [
    CheckCircle,
    Target,
    BookOpen,
    Rocket,
    User,
    PencilLine,
    LibraryBig,
  ];

  const formatLevel = (value?: number) => {
    if (!value) return "";
    const num = Number(value);
    return Number.isInteger(num) ? num.toFixed(1) : value;
  };

  const levelFrom = formatLevel(data?.level?.[0]);
  const levelTo = formatLevel(data?.level?.[1]);

  return (
    <main>
      <section className="relative">
        <div className="w-full h-[400px] xl:h-[500px]">
          <Image
            src="/images/Lo-trinh-hoc-ielts-0-7.5-ielsts-s1-min.jpg"
            alt="banner-package-page"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 text-white w-full grid gap-3.5">
          <div className="text-[50px] container mx-auto px-4">
            <h2 className="font-sans font-[700] text-white">
              <span className="uppercase">{data.title}</span> từ {levelFrom} lên{" "}
              {levelTo} IELTS
            </h2>
          </div>
          <div className="container mx-auto px-4 flex gap-6 text-[1rem]">
            <Link
              className="flex items-center gap-1 cursor-pointer duration-300 transform hover:scale-105"
              href="/"
            >
              <House size={20} /> Trang chủ
            </Link>
            <Link
              className="flex items-center gap-1 cursor-pointer duration-300 transform hover:scale-105"
              href={`/lo-trinh-hoc/${data?.route.slug}`}
            >
              {" "}
              <ArrowRight size={20} /> {data?.route?.title || "Lộ trình tối ưu"}
            </Link>
            <Link
              className="flex items-center gap-1 cursor-pointer duration-300 transform hover:scale-105"
              href={`/${data.slug}`}
            >
              {" "}
              <ArrowRight size={20} /> {data.title || "Khoá học"}
            </Link>
          </div>
        </div>
      </section>

      {/* <section className="relative w-full">
        <div className="bg-blue-900 w-full h-[600px] rounded-b-[120px] md:rounded-b-[200px] relative overflow-hidden"></div>

       
        <div className="absolute top-0 right-0 left-0 w-full h-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center">
          
          <div className="text-white md:w-1/2 mt-20 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Thông tin về
              <span className="text-cyan-400"> {data?.title}</span> của The Real
              IELTS
            </h1>
            <p className="text-base md:text-lg mb-6 line-clamp-4 lg:line-clamp-5">
              {data?.description}
            </p>
            <a
              href="#dang-ky-lo-trinh"
              className="bg-pink-600 px-6 py-3 rounded-lg text-white font-semibold hover:bg-pink-700 transition"
            >
              Đăng ký ngay
            </a>
          </div>
          
          <div className="md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-8 border-white shadow-lg">
              <Image
                src="/images/image-lo-trinh.png"
                alt="Giảng viên"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section> */}

      <section className=" w-full py-12">
        <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1450px] items-center mx-auto px-4 justify-center">
          {/* Left: YouTube embed */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
            <YouTubeLite idYoutube="4htUoKXBorU" />
          </div>

          {/* Right: Goals */}
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl xl:text-4xl font-sans font-[600] text-[#20376c]">
                <span className="uppercase">{data.title}</span> từ{" "}
                {formatLevel(data.level?.[0])} lên{" "}
                {formatLevel(data.level?.[1])} IELTS
              </h2>
              <p className="text-[16px] font-sans font-[400] text-[#20376c]">
                {data.description}
              </p>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(data.benefit) &&
                data.benefit.map((goal, index) => {
                  const Icon = icons[index % icons.length];
                  return (
                    <li key={index} className="group h-full">
                      <div
                        className="rounded-xl p-[1.5px] h-full"
                        style={{
                          background:
                            "conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)",
                        }}
                      >
                        <div
                          tabIndex={0}
                          role="button"
                          className="bg-white rounded-lg p-4 transition-transform duration-200 ease-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-200 h-full flex flex-col justify-between"
                        >
                          <div className="flex flex-col items-start justify-start gap-4">
                            <div className="flex gap-3 w-full items-center justify-start bg-blue-50 rounded-full py-2 px-4">
                              <Icon className="w-6 h-6 text-blue-700 flex-shrink-0" />

                              <h3 className="text-[18px] font-sans font-[500] text-[#20376C]">
                                {goal.title || ""}
                              </h3>
                            </div>
                            <div>
                              <p className="text-[15px] font-sans font-[400] text-gray-800 mt-1">
                                {goal.description || ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>

            <Link
              href="/xay-dung-lo-trinh"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition font-medium"
            >
              Xây Dựng Lộ Trình Cho Riêng Bạn
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full flex flex-col items-center justify-center">
        <CoursePackageSection
          courses={courses}
          title={data.title}
          levelFrom={Number(levelFrom)}
          levelTo={Number(levelTo)}
        />
        <div className="w-full flex items-center justify-center -mt-32 z-10">
          <div className="relative w-5/6 h-[350px]">
            <Image
              src="/images/Background.png"
              alt="Background"
              fill
              className="object-cover object-center rounded-[15px]"
            />

            <div className="absolute left-5 bottom-0 sm:left-24 w-72 h-[420px] sm:w-80 sm:h-[450px]">
              <Image
                src="/images/Co-gai.png"
                alt="sub background"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="absolute top-1/8 right-1/8">
              <div className="relative w-52 h-44">
                <Image
                  src="/images/Hoc-phi-niem-yet.png"
                  alt="hoc phí niêm yết"
                  fill
                  className="object-cover object-center hidden md:block"
                />
              </div>
              <div className="flex flex-col items-center">
                {/* Animated Arrow */}
                <motion.div
                  initial={{ y: -5, opacity: 0.5 }}
                  animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className=""
                >
                  <ChevronsDownIcon size={28} className="text-white" />
                </motion.div>

                {/* Button */}
                <a
                  href="#dang-ky-lo-trinh"
                  className="border-amber-100 border bg-gradient-to-r from-sky-900 to-orange-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  Đăng ký tư vấn ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="why-choose-TRI"
        className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-12"
      >
        <div className="w-full">
          <h2 className="text-center font-bold text-4xl text-sky-950 uppercase mt-4">
            Vì sao bạn nên lựa chọn the real ielts?
          </h2>
          <WhyChooseTRI />
        </div>
      </section>
      <section id="dang-ky-lo-trinh" className="w-full">
        <ConsultationForm />
      </section>
    </main>
  );
}
