"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BookOpen, FileText, MessageSquare, ClipboardList } from "lucide-react";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema, CourseSchema, UserSchema } from "@/types";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({
    courses: 0,
    documents: 0,
    // news: 0,
    // studyAbroads: 0,
    // users: 0,
    consultations: 0,
    examRegistrations: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // --- 1️⃣ Gọi song song các loại dữ liệu chính ---
      const [courses, documents, consultations, examRegistrations] =
        await Promise.all([
          clientHttp(ApiResponseSchema(CourseSchema.array()), {
            method: "GET",
            path: "/common",
            query: { type: "COURSE", limit: 1, page: 1 },
          }),
          clientHttp(ApiResponseSchema(CourseSchema.array()), {
            method: "GET",
            path: "/common",
            query: { type: "DOCUMENT", limit: 1, page: 1 },
          }),
          // clientHttp(ApiResponseSchema(CourseSchema.array()), {
          //   method: "GET",
          //   path: "/common",
          //   query: { type: "NEW", limit: 1, page: 1 },
          // }),
          // clientHttp(ApiResponseSchema(CourseSchema.array()), {
          //   method: "GET",
          //   path: "/common",
          //   query: { type: "STUDYABROAD", limit: 1, page: 1 },
          // }),
          clientHttp(ApiResponseSchema(CourseSchema.array()), {
            method: "GET",
            path: "/consultation",
            query: { limit: 1, page: 1 },
          }),
          clientHttp(ApiResponseSchema(CourseSchema.array()), {
            method: "GET",
            path: "/exam-registration",
            query: { limit: 1, page: 1 },
          }),
        ]);

      // // --- 2️⃣ Gọi role user song song ---
      // const roles = ["ADMIN", "EDITOR", "USER"] as const;
      // const userResponses = await Promise.all(
      //   roles.map(role =>
      //     clientHttp(ApiResponseSchema(UserSchema.array()), {
      //       method: "GET",
      //       path: "/user",
      //       query: { limit: 1, page: 1, role },
      //     })
      //   )
      // );

      // const byRole = roles.reduce((acc, role, i) => {
      //   acc[role] = userResponses[i]?.total || 0;
      //   return acc;
      // }, {} as Record<(typeof roles)[number], number>);

      // const totalUsers = Object.values(byRole).reduce((sum, val) => sum + val, 0);

      setTotals({
        courses: courses.total || 0,
        documents: documents.total || 0,
        // news: news.total || 0,
        // studyAbroads: studyAbroads.total || 0,
        consultations: consultations.total || 0,
        examRegistrations: examRegistrations.total || 0,
      });
    } catch (err: any) {
      console.error("❌ Lỗi fetch dashboard:", err);
      if (err?.status === 429) {
        toast.warning("Vượt quá request, vui lòng refresh lại sau 60s");
      } else {
        toast.warning(err.message?.mes);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-gray-500 text-lg">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Tổng quan hệ thống
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Khóa học"
          total={totals.courses}
          icon={<BookOpen className="w-8 h-8 text-blue-500" />}
          href="/admin/course"
        />
        <DashboardCard
          title="Tài liệu"
          total={totals.documents}
          icon={<FileText className="w-8 h-8 text-emerald-500" />}
          href="/admin/document"
        />
        {/* <DashboardCard
          title="Tin tức"
          total={totals.news}
          icon={<Newspaper className="w-8 h-8 text-amber-500" />}
          href="/admin/new"
        />
        <DashboardCard
          title="Bài viết du học"
          total={totals.studyAbroads}
          icon={<Globe2 className="w-8 h-8 text-violet-500" />}
          href="/admin/study-abroad"
        /> */}
        <DashboardCard
          title="Đơn tư vấn"
          total={totals.consultations}
          icon={<MessageSquare className="w-8 h-8 text-teal-500" />}
          href="/admin/consultation"
        />
        <DashboardCard
          title="Đăng ký thi Ielts"
          total={totals.examRegistrations}
          icon={<ClipboardList className="w-8 h-8 text-indigo-500" />}
          href="/admin/exam-registration"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  total,
  icon,
  href,
  children,
}: {
  title: string;
  total: number;
  icon: React.ReactNode;
  href: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-5 transition-all hover:shadow-md flex flex-col"
    >
      <div className="flex items-center justify-between">
        {icon}
        <p className="text-3xl font-bold text-gray-800">{total}</p>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-gray-700">{title}</h3>
      {children && <div>{children}</div>}
    </Link>
  );
}
