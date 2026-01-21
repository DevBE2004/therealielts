"use client";

import { clientHttp } from "@/lib/clientHttp";
import { useAppSelector } from "@/store";
import { setLogout } from "@/store/userSlice";
import { ApiResponseSchema, Course } from "@/types";
import { Category } from "@/types/category";
import { Ladipage, LadipageSchema } from "@/types/ladipage";
import { Roadmap } from "@/types/roadmap";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import CourseIelts from "./item-header/course-ielts";
import ItemHeader from "./item-header/item-header";
import { HeaderService } from "@/services/header-config.service";
import { HeaderConfigType } from "../admin/header-config/types";
import { toast } from "react-toastify";
import z from "zod";
import Image from "next/image";

type Props = {
  urlWeb: string;
};
export default function RenderHeader({ urlWeb }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  // const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { current, isLogin } = useAppSelector((state) => state.user);
  const [courses, setCourse] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [roadmaps, setRoadmap] = useState<Roadmap[]>([]);
  const [dataHeader, setDataHeader] = useState<HeaderConfigType[]>([]);

  const checkLogin = current && isLogin;
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current?.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${urlWeb}/api/layout-data`, {
        cache: "no-store",
      });
      const data = await res.json();

      setCourse(Array.isArray(data.courses) ? data.courses : []);
      setCategories(Array.isArray(data.categories) ? data.categories : []);
      setRoadmap(Array.isArray(data.roadmaps) ? data.roadmaps : []);
    } catch (error) {
      console.error("Lỗi khi fetch ladipage/layout-data:", error);
    }
  }, []);

  const fetchHeaderList = async () => {
    const res = await HeaderService.getList();
    console.log("headers===>", res);
    if (res?.success) {
      setDataHeader(res?.data || []);
    } else {
      setDataHeader([]);
    }
  };

  const fetchDataImage = async () => {
    try {
      const res = await clientHttp(ApiResponseSchema(z.any()), {
        path: `/introduce/7`,
        method: "GET",
      });

      if (res?.data?.section1) {
        const section1 =
          typeof res.data.section1 === "string"
            ? JSON.parse(res.data.section1)
            : res.data.section1;
        setPreview(section1.logo || null);
      }
    } catch (err: any) {
      console.error("err: ", err);
      toast.error(err.message?.mes || "Không thể tải logo lên!");
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
    fetchHeaderList();
    fetchDataImage();
  }, [fetchData]);

  const handleLogOut = () => {
    dispatch(setLogout());
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-[#20376C] text-white sticky top-0 z-50 shadow-md">
      <nav className="max-w-[1250px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="relative flex items-center shrink-0 w-[160px] md:w-[180px] h-[100px]"
        >
          {preview ? (
            <Image
              src={preview}
              alt="The Real IELTS"
              fill
              className=" object-contain"
            />
          ) : (
            <Image
              src="https://therealielts.vn/wp-content/uploads/2023/07/Logo-TRI-W2--300x136.webp"
              alt="The Real IELTS"
              fill
              className=" object-contain"
            />
          )}
        </Link>

        {/* Desktop nav */}
        {/* Upper Row */}
        <div className="hidden lg:flex flex-row flex-1 flex-wrap  justify-center gap-6 text-sm md:text-base font-sans font-[500]">
          {/* Giới thiệu dropdown */}
          {dataHeader
            ?.slice() // copy để tránh mutate
            .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
            .map((data) => {
              if (data?.slug === "ielts")
                return (
                  <CourseIelts
                    key={data.title}
                    data={data}
                    roadmaps={roadmaps}
                    courses={courses}
                  />
                );
              return (
                <ItemHeader key={data.title} data={data} isMobile={false} />
              );
            })}
        </div>

        {/* User menu + Inbox */}
        <div className="hidden lg:flex flex-col w-fit items-center gap-3 ml-2">
          {checkLogin ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 cursor-pointer rounded-lg  transition-colors"
              >
                <img
                  src={current?.avatar}
                  alt={current?.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
                <span className="text-sm font-medium max-w-[120px] truncate">
                  {current?.name}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                    <img
                      src={current?.avatar}
                      alt={current?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-base">
                        {current?.name}
                      </h4>
                      <p className="text-sm text-gray-600">{current?.email}</p>
                    </div>
                  </div>
                  {(current?.role === "ADMIN" ||
                    current?.role === "EDITOR") && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      Quản trị viên
                    </Link>
                  )}
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={handleLogOut}
                      className="w-full cursor-pointer py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="border-3 border-white bg-gradient-to-r cursor-pointer text-center w-full 
from-blue-500 to-cyan-500 text-white px-5 py-2 rounded-full font-semibold text-sm 
hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              Đăng nhập
            </Link>
          )}

          <div
            onClick={() =>
              window.open("https://zalo.me/302896296492583331", "_blank")
            }
            className="border-3 border-white bg-gradient-to-r cursor-pointer text-center w-full from-purple-500 to-pink-500 text-white px-5 py-2 rounded-full font-semibold text-sm hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Inbox TRI
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden bg-blue-900 border-t border-blue-700 transition-max-h duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-[2000px]" : "max-h-0"
        }`}
      >
        <div className="px-4 py-4 space-y-3 max-w-[1200px] mx-auto">
          {checkLogin && (
            <div className="flex items-center gap-3 pb-3 border-b border-blue-700">
              <img
                src={current?.avatar}
                alt={current?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold">{current?.name}</h4>
                <p className="text-sm text-blue-200">{current?.email}</p>
              </div>
            </div>
          )}
          {dataHeader
            ?.slice() // copy để tránh mutate
            .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
            .map((data) => {
              if (data?.slug === "ielts")
                return (
                  <Link
                    key={data.slug}
                    href={data.slug || "#"}
                    className={"block py-2 text-white hover:text-blue-200"}
                  >
                    {data.title}
                  </Link>
                );
              return (
                <ItemHeader key={data.title} data={data} isMobile={true} />
              );
            })}

          {/* Login / Logout / Inbox */}
          {checkLogin &&
            (current?.role === "ADMIN" || current?.role === "EDITOR") && (
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-white hover:text-blue-200"
              >
                Quản trị viên
              </Link>
            )}

          <div className={"grid grid-cols-2 gap-4"}>
            {checkLogin ? (
              <button
                onClick={handleLogOut}
                className="border-3 border-white bg-gradient-to-r cursor-pointer text-center w-full 
from-blue-500 to-cyan-500 text-white px-5 py-2 rounded-full font-semibold text-sm 
hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                Đăng xuất
              </button>
            ) : (
              <Link
                href="/login"
                className="border-3 border-white bg-gradient-to-r cursor-pointer text-center w-full 
from-blue-500 to-cyan-500 text-white px-5 py-2 rounded-full font-semibold text-sm 
hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                Đăng nhập
              </Link>
            )}
            <div
              onClick={() =>
                window.open("https://zalo.me/302896296492583331", "_blank")
              }
              className="border-3 border-white bg-gradient-to-r cursor-pointer text-center w-full from-purple-500 to-pink-500 text-white px-5 py-2 rounded-full font-semibold text-sm hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Inbox TRI
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
