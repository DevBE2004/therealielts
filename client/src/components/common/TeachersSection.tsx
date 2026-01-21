"use client";

import { useState, useEffect } from "react";
import { Course, CourseSchema, Teacher, TeacherSchema } from "@/types";
import { HiStar } from "react-icons/hi";
import Image from "next/image";
import { z } from "zod";

type PageProps = {
  teachers: Teacher[],
  course?: Course,
  loading?: boolean,
}

export default function TeachersSection({
  teachers = [],
  course,
  loading = false,
}: PageProps) {
  const [autoPlayIndex, setAutoPlayIndex] = useState(0);
  const teachersArray = teachers || [];

  // Auto slide
  useEffect(() => {
    if (teachersArray.length <= 1) return;
    const interval = setInterval(() => {
      setAutoPlayIndex(
        (prev) => (prev + 1) % Math.min(5, teachersArray.length)
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [teachersArray.length]);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl font-medium text-gray-600">Đang tải...</p>
        </div>
      </section>
    );
  }

  if (!teachersArray.length) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl font-medium text-gray-600">
            Chưa có dữ liệu giáo viên
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            GIẢNG DẠY BỞI <br />
            <span className="text-orange-600">100% GIÁO VIÊN 8.0+ IELTS</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
            Khi tham gia khoá học{" "}
            <span className="uppercase font-bold">
              {course !== undefined ? course.title : "Tại The Real IELTS"}
            </span>
            , bạn sẽ được giảng dạy trực tiếp bởi 100% các thầy cô là
            headteacher - sở hữu 8.0+ IELTS Overall, dày dạn kinh nghiệm và tận
            tâm.
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 justify-items-center">
          {teachersArray.slice(0, 4).map((teacher, index) => {
            const score = parseFloat(
              teacher.ieltsScore !== undefined
                ? teacher.ieltsScore.toFixed(1)
                : "npm"
            );
            return (
              <div
                key={teacher.id || index}
                className={`relative cursor-pointer transition-all duration-500 ${
                  index === autoPlayIndex
                    ? "scale-105 z-10"
                    : "opacity-90 hover:opacity-100"
                }`}
                onClick={() => setAutoPlayIndex(index)}
                aria-label={`Giáo viên ${teacher.name}`}
              >
                <div
                  className="rounded-2xl p-[1.5px] transition-shadow"
                  style={{
                    background:
                      "conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)",
                  }}
                >
                  <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col w-64 sm:w-72">
                    {/* Image */}
                    <div className="relative w-full h-72">
                      <Image
                        src={
                          teacher.avatar ||
                          "https://via.placeholder.com/600x750/4F46E5/FFFFFF?text=GV"
                        }
                        alt={`Giáo viên ${teacher.name} tại The Real IELTS`}
                        fill
                        className="object-cover rounded-t-2xl"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    </div>
                    {/* Info */}
                    <div className="p-5 flex flex-col items-center justify-center gap-3">
                      <div className="bg-primary-600 text-blue-900 text-base font-semibold px-4 py-1 rounded-lg shadow">
                        {score} IELTS
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 text-center">
                        {teacher.name}
                      </h3>
                    </div>
                  </article>
                </div>
              </div>
            );
          })}
        </div>

        {/* Outstanding Teacher */}
        {teachersArray.length > 0 &&
          (() => {
            const outstandingTeacher = teachersArray.reduce(
              (highest, current) => {
                const cur = current.ieltsScore ?? 0; // Nếu undefined thì lấy 0
                const max = highest.ieltsScore ?? 0;
                return cur > max ? current : highest;
              }
            );
            return (
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 md:p-12 max-w-6xl mx-auto border border-b-blue-600 border-t-blue-400 border-x-blue-400">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  {/* Photo */}
                  <div className="lg:col-span-1 flex justify-center">
                    <Image
                      src={
                        outstandingTeacher.avatar ||
                        "https://via.placeholder.com/256x256/4F46E5/FFFFFF?text=GV"
                      }
                      alt={`Giảng viên xuất sắc ${outstandingTeacher.name}`}
                      width={256}
                      height={256}
                      className="w-64 h-64 object-cover rounded-2xl shadow-lg"
                    />
                  </div>

                  {/* Info */}
                  <div className="lg:col-span-2">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {outstandingTeacher.name}
                    </h3>
                    <p className="text-lg text-primary-700 mb-4">
                      Giảng viên tại The Real IELTS
                    </p>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <HiStar key={i} className="w-6 h-6 text-yellow-400" />
                      ))}
                    </div>

                    {/* Qualifications */}
                    <ul className="space-y-2 text-gray-700 text-base leading-relaxed list-disc list-inside">
                      {[
                        "Thạc sỹ - Giảng viên khoa Quản trị kinh doanh Học Viện Tài Chính",
                        "Thạc sỹ Quản trị Kinh doanh tại Phần Lan",
                        "Tham gia nghiên cứu khoa học đề tài cấp Tỉnh, cấp Bộ",
                        "Bảo trợ chuyên môn CLB Khởi nghiệp Học Viện Tài Chính",
                        "Đã giúp nhiều học viên từ mất gốc đạt 7.0 - 8.0",
                      ].map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Quote */}
                <div className="bg-blue-50 rounded-2xl p-8 mt-10 relative">
                  <span className="absolute -top-6 -left-4 text-6xl text-blue-300">
                    &ldquo;
                  </span>
                  <span className="absolute -bottom-6 -right-4 text-6xl text-blue-300">
                    &rdquo;
                  </span>
                  <p className="relative z-10 text-lg text-gray-700 leading-relaxed">
                    Với xu hướng hội nhập toàn cầu, tiếng Anh là một kỹ năng
                    ngôn ngữ thiết yếu. Với kinh nghiệm học, thi và giảng dạy,
                    tôi luôn tâm niệm giúp được càng nhiều học viên càng tốt, để
                    các bạn đạt mục tiêu chinh phục tiếng Anh sớm nhất.
                  </p>
                </div>

                {/* CTA */}
                <div className="text-center mt-10">
                  <a
                    href="#dang-ky-tu-van"
                    className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition transform hover:scale-105 shadow-lg"
                  >
                    Đăng ký nhận lộ trình học IELTS
                  </a>
                </div>
              </div>
            );
          })()}
      </div>
    </section>
  );
}
