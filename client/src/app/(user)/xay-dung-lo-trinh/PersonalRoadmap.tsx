"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Rocket } from "lucide-react";
import type { Course } from "@/types";
import { splitSections } from "@/hooks/splitSections";

type Props = {
  courses?: Course[];
  className?: string;
};

const normalizeLevel = (
  level: (string | number)[] = [0, 0]
): [number, number] => {
  const [a = 0, b = 0] = level;
  return [Number(a), Number(b)];
};

export default function PersonalRoadmapNew({
  courses = [],
  className = "",
}: Props) {
  // selected course in row 1 (current level)
  const [currentCourseId, setCurrentCourseId] = useState<number | null>(
    courses[0]?.id ?? null
  );

  // selected target (row 2) is a numeric target value (e.g. 6.5)
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);

  // All unique courses grouped by id (defensive)
  const validCourses = useMemo(() => courses ?? [], [courses]);

  // Row1: all courses (per requirement: show level[0] and level[1], title)
  const row1Courses = useMemo(() => validCourses, [validCourses]);

  // current selected course object
  const currentCourse = useMemo(() => {
    return validCourses.find((c) => c.id === currentCourseId) ?? null;
  }, [validCourses, currentCourseId]);

  // Row2 targets: all targets from courses that have target >= currentCourse.target
  const row2Targets = useMemo(() => {
    if (!currentCourse) return [] as number[];
    const base = currentCourse.target ?? 0;
    const set = new Set<number>();
    validCourses.forEach((c) => {
      if ((c.target ?? 0) >= base) set.add(Number(c.target ?? 0));
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [validCourses, currentCourse]);

  // When currentCourse changes, auto-select first available target
  React.useEffect(() => {
    if (row2Targets.length > 0) setSelectedTarget(row2Targets[0]);
    else setSelectedTarget(null);
  }, [currentCourseId, row2Targets.length]);

  // Determine the course to render in the content area based on selectedTarget
  const detailCourse = useMemo(() => {
    if (!selectedTarget) return null;

    // Filter courses that match the selected target.
    const candidates = validCourses.filter(
      (c) => Number(c.target ?? 0) === Number(selectedTarget)
    );

    if (candidates.length === 0) return null;

    // Prefer a candidate whose min level is >= currentCourse min level (progression)
    const curMin = currentCourse ? normalizeLevel(currentCourse.level)[0] : -1;

    // Exact progression match: min level greater or equal to current course
    const progressive = candidates
      .map((c) => ({ c, min: normalizeLevel(c.level)[0] }))
      .filter((x) => x.min >= curMin)
      .sort((a, b) => a.min - b.min);

    if (progressive.length > 0) return progressive[0].c;

    // Fallback: return candidate with closest min level
    const fallback = candidates
      .map((c) => ({ c, min: normalizeLevel(c.level)[0] }))
      .sort((a, b) => Math.abs(a.min - curMin) - Math.abs(b.min - curMin));

    return fallback[0].c;
  }, [selectedTarget, validCourses, currentCourse]);

  return (
    <section
      className={`w-full py-12 bg-gradient-to-b from-white to-sky-50 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <header className="mb-8 text-center">
          <p className="text-base font-sans font-[400] text-slate-600 mt-2">
            Chọn trình độ hiện tại, rồi chọn mục tiêu bạn muốn chinh phục — mình
            sẽ gợi ý lộ trình phù hợp.
          </p>
        </header>

        {/* Row 1: "Hãy chọn trình độ hiện tại của bạn" */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-slate-700 mb-3">
            Hãy chọn trình độ hiện tại của bạn
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {row1Courses.map((c) => {
              const [min, max] = normalizeLevel(c.level);
              const active = c.id === currentCourseId;
              return (
                <button
                  key={c.id}
                  onClick={() => setCurrentCourseId(c.id)}
                  className={`group bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 text-left transition transform hover:-translate-y-1 ${
                    active ? "ring-2 ring-sky-400" : ""
                  }`}
                >
                  <div className="w-20 h-14 relative flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={c.images?.[0] ?? "/placeholder.jpg"}
                      alt={c.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sky-700 text-lg">
                        {c.title}
                      </h4>
                      {active && (
                        <span className="flex items-center gap-1 text-sm text-white bg-sky-600 rounded-full px-2 py-0.5">
                          <Check className="w-4 h-4" /> Đang chọn
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-slate-500 mt-1">
                      Trình độ: <strong>{min}</strong> — <strong>{max}</strong>{" "}
                      IELTS
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: "Chọn tiếp mục tiêu bạn muốn chinh phục" */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3">
            Chọn tiếp mục tiêu bạn muốn chinh phục
          </h3>

          <div className="flex flex-wrap gap-3">
            {row2Targets.length === 0 && (
              <div className="text-sm text-slate-500">
                Không có mục tiêu phù hợp.
              </div>
            )}

            {row2Targets.map((t) => {
              const active = t === selectedTarget;
              return (
                <button
                  key={`target-${t}`}
                  onClick={() => setSelectedTarget(t)}
                  className={`px-4 py-2 rounded-full font-medium shadow-sm transition ${
                    active
                      ? "bg-sky-700 text-white"
                      : "bg-white text-slate-700 hover:bg-sky-50"
                  }`}
                >
                  <span className="inline-block mr-2 animate-pulse">Anim</span>
                  {`${Number(t).toFixed(1)} IELTS`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail area: show the course matching selectedTarget */}
        <div className="bg-white rounded-2xl shadow p-6">
          {!detailCourse ? (
            <div className="text-center text-slate-500">
              Chưa có khóa học được chọn. Vui lòng chọn trình độ và mục tiêu
              phía trên.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-1 rounded-lg overflow-hidden bg-gray-50">
                <div className="relative w-full h-44">
                  <Image
                    src={detailCourse.images?.[0] ?? "/placeholder.jpg"}
                    alt={detailCourse.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="text-2xl font-sans font-[700] text-sky-800">
                  {detailCourse.title}
                </h4>
                {detailCourse.description !== undefined ? (
                  <ul className="mt-3 space-y-2">
                    {splitSections(detailCourse.description).map((d, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <Check className="w-5 h-5 text-sky-600 mt-0.5 shrink-0 bg-sky-100 p-0.5 rounded-full" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600 mt-2">
                    Chưa có mô tả chi tiết
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-3 items-center">
                  <div className="text-sm text-slate-500">Mục tiêu:</div>
                  <div className="font-semibold text-sky-700">
                    IELTS {detailCourse.target?.toFixed(1)}
                  </div>

                  <div className="text-sm text-slate-500 ml-4">Trình độ:</div>
                  <div className="font-medium text-slate-700">
                    {normalizeLevel(detailCourse.level)[0]} -{" "}
                    {normalizeLevel(detailCourse.level)[1].toFixed(1)} IELTS
                  </div>

                  <div className="ml-auto flex gap-2">
                    <Link
                      href={`/${detailCourse.slug}`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-500 text-white rounded-full font-medium shadow"
                    >
                      Xem chi tiết
                    </Link>

                    <a
                      href="#dang-ky-tu-van"
                      className="inline-flex items-center px-4 py-2 border border-sky-300 rounded-full text-sky-700"
                    >
                      Tư vấn
                    </a>
                  </div>
                </div>

                {/* extra info: duration / hours if provided */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                  <div>
                    <div className="text-xs text-slate-400">Thời lượng</div>
                    <div className="font-medium">
                      {detailCourse.duration ?? "—"} (
                      {detailCourse.totalHours ?? "—"} giờ)
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400">Đăng ký</div>
                    <div className="font-medium">2.086+ học viên</div>
                  </div>
                </div>

                {/* brief curriculum or bullets if available */}
                {/* {detailCourse.highlights && (
                  <ul className="mt-6 space-y-2 text-sm text-slate-700">
                    {detailCourse.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 text-sky-600">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )} */}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
