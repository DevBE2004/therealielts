"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowLeft, Rocket, Goal } from "lucide-react";
import { Course } from "@/types";

// ---------- Utility ----------
const uniqueSorted = <T,>(arr: T[], comparator?: (a: T, b: T) => number) => {
  return Array.from(new Set(arr)).sort(comparator);
};

type Props = {
  courses?: Course[];
  className?: string;
};

export default function PersonalRoadmapOld({ courses, className = "" }: Props) {
  const [activeTarget, setActiveTarget] = useState<number | "All">("All");
  const [activeLevel, setActiveLevel] = useState<number | "All">("All");

  const normalizeLevel = (level: (string | number)[]): [number, number] => {
    const [min, max] = level;
    return [Number(min), Number(max)];
  };

  const LEVEL_MAP: Record<string, number> = {
    Beginner: 0,
  };

  const targets = useMemo(() => {
    let t: number[] = [];

    if (Array.isArray(courses)) {
      t = uniqueSorted(
        courses.map((c) => c.target ?? 0),
        (a, b) => a - b
      );
    }

    return ["All", ...t];
  }, [courses]);

  // Lấy tất cả level min duy nhất
  const levels = useMemo(() => {
    if (!courses) return ["All", "Beginner"];
    const mins = courses.map((c) => normalizeLevel(c.level)[0]);
    const unique = Array.from(new Set(mins)).filter((l) => l > 0);
    unique.sort((a, b) => a - b);
    return ["All", "Beginner", ...unique];
  }, [courses]);

  // Lọc course theo target + level
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((c) => {
      const [minLevel] = normalizeLevel(c.level);

      let targetOk: boolean;

      if (activeTarget === "All") {
        targetOk = true;
      } else {
        targetOk = c.target !== undefined && c.target <= activeTarget;
      }

      // Level
      let levelOk = true;
      let userLevelNumber: number;

      if (activeLevel === "All") {
        levelOk = true;
      } else if (typeof activeLevel === "number") {
        userLevelNumber = activeLevel;
        levelOk = minLevel >= userLevelNumber;
      } else {
        // activeLevel là string, ví dụ "Beginner"
        userLevelNumber = LEVEL_MAP[activeLevel] ?? 0;
        levelOk = minLevel >= userLevelNumber;
      }

      return targetOk && levelOk;
    });
  }, [courses, activeLevel, activeTarget]);

  const getUserLevelNumber = (level: number | "All" | string): number => {
    if (level === "All") return -1; // hoặc 0 tùy logic filter
    if (typeof level === "number") return level;
    return LEVEL_MAP[level] ?? 0;
  };
  // Hero course
  const heroCourse = useMemo(() => {
    if (!filteredCourses || filteredCourses.length === 0 || !courses)
      return undefined;

    const userLevelNumber = getUserLevelNumber(activeLevel);

    const match =
      userLevelNumber >= 0
        ? filteredCourses.find(
            (c) => normalizeLevel(c.level)[0] === userLevelNumber
          )
        : undefined;

    return match ?? filteredCourses[0] ?? courses[0];
  }, [courses, filteredCourses, activeLevel]);

  // --------------------------------------
  // JSX component (giữ nguyên của bạn)
  // --------------------------------------
  return (
    <section
      className={`w-full bg-gradient-to-b from-white to-blue-50 py-12 ${className}`}
      aria-labelledby="courses-hero-title"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Level filter */}
        <nav
          className="flex flex-wrap justify-center gap-3 mb-6"
          aria-label="Chọn level"
        >
          {levels.map((lvl) => {
            const active = activeLevel === lvl;
            return (
              <button
                key={String(lvl)}
                onClick={() =>
                  setActiveLevel(
                    lvl === "All"
                      ? "All"
                      : lvl === "Beginner"
                      ? 0
                      : (lvl as number)
                  )
                }
                className={`px-5 py-3 rounded-2xl font-medium shadow-sm transition ${
                  active
                    ? "bg-blue-800 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-100"
                }`}
              >
                {active && <Rocket className="w-4 h-4 inline mr-1" />}
                {lvl === "All"
                  ? "Tất cả Level"
                  : lvl === "Beginner"
                  ? "Người mới bắt đầu"
                  : `${(lvl as number).toFixed(1)} IELTS`}
              </button>
            );
          })}
        </nav>

        {/* Target filter */}
        <div className="flex justify-center gap-3 mb-12 overflow-x-auto no-scrollbar px-2">
          {targets.map((t) => {
            const active = activeTarget === t;
            return (
              <button
                key={String(t)}
                onClick={() =>
                  setActiveTarget(t === "All" ? "All" : (t as number))
                }
                className={`px-5 py-3 rounded-2xl font-medium shadow-sm transition ${
                  active
                    ? "bg-blue-800 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-100"
                }`}
              >
                {active && <Rocket className="w-4 h-4 inline mr-1" />}
                {t === "All"
                  ? "Tất cả mục tiêu"
                  : `Aim ${Number(t).toFixed(1)} IELTS`}
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT: danh sách course */}
          <div>
            <div role="list" className="space-y-6">
              {filteredCourses.map((c) => (
                <article
                  key={c.id}
                  role="listitem"
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-blue-700 mb-3 uppercase">
                        Khóa Học: {c.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {c.description}
                      </p>

                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex items-center gap-3">
                          <Clock className="text-blue-600" />
                          <span>
                            {c.duration} ({c.totalHours} giờ)
                          </span>
                        </li>
                      </ul>

                      <div className="flex gap-4 mt-6">
                        <Link
                          href={`/${c.slug}`}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-full shadow-md hover:scale-105 transition-transform"
                        >
                          Xem chi tiết
                          <ArrowLeft className="ml-3" />
                        </Link>
                        <a
                          href="#dang-ky-tu-van"
                          className="px-6 py-3 border border-blue-500 text-blue-600 font-medium rounded-full hover:bg-blue-50 transition"
                        >
                          Tư vấn chương trình
                        </a>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="flex-shrink-0 text-right">
                      <div className="bg-white/70 backdrop-blur rounded-lg px-3 py-2 shadow-sm">
                        <div className="text-xs text-gray-500">Level</div>
                        <div className="font-semibold text-sm text-blue-800">
                          {normalizeLevel(c.level)[0]} -{" "}
                          {normalizeLevel(c.level)[1]}
                        </div>

                        <div className="text-xs text-gray-500 mt-2">Target</div>
                        <div className="font-bold text-lg text-teal-500">
                          {c.target}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {filteredCourses.length === 0 && (
                <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-600">
                  Không tìm thấy khóa học phù hợp với lựa chọn của bạn.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Hero */}
          {heroCourse && (
            <aside aria-labelledby="hero-course-title" className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={heroCourse.images[0] ?? "/placeholder.jpg"}
                  alt={heroCourse.title}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                <div className="absolute left-6 bottom-6 right-6">
                  <div className="bg-white/95 rounded-2xl p-6 shadow-md backdrop-blur">
                    <p className="text-sm uppercase tracking-wide flex gap-1.5 text-blue-600 font-semibold mb-2">
                      <Goal className="text-red-700 size-5" /> Khóa học phù hợp
                    </p>

                    <h4
                      id="hero-course-title"
                      className="text-xl font-bold text-blue-800"
                    >
                      {heroCourse.title}
                    </h4>

                    <p className="text-sm text-gray-700 mt-2">
                      Mục tiêu:{" "}
                      <span className="font-semibold text-teal-600">
                        IELTS {heroCourse.target}
                      </span>{" "}
                      · Trình độ:{" "}
                      <span className="font-medium text-gray-900">
                        {normalizeLevel(heroCourse.level)[0]} -{" "}
                        {normalizeLevel(heroCourse.level)[1]} IELTS
                      </span>
                    </p>

                    <div className="flex gap-3 mt-5">
                      <Link
                        href={`/${heroCourse.slug}`}
                        className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full font-medium shadow hover:shadow-lg transition"
                      >
                        Đăng ký ngay
                      </Link>
                      <a
                        href="#dang-ky-tu-van"
                        className="px-4 py-2 border border-blue-300 rounded-full text-blue-700 hover:bg-blue-50 transition"
                      >
                        Tư vấn
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
