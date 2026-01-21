"use client";
import { clientHttp } from "@/lib/clientHttp";
import Link from "next/link";
import { FC, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setLogout } from "@/store/userSlice";
import { useAppSelector } from "@/store";
import {
  ChevronDown,
  ChevronUp,
  Home,
  LogOut,
  Settings,
  UserCheck2,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLogin, current, loading } = useAppSelector((state) => state.user);

  const [openPosts, setOpenPosts] = useState(false);
  const [openIntroduce, setOpenIntroduce] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isLogin || !current) {
      router.replace("/login");
      return;
    }

    if (!["ADMIN", "EDITOR"].includes(current.role)) {
      router.replace("/");
    }
  }, [loading, isLogin, current, router]);

  if (loading) {
    return (
      <p className="w-full h-[500px] flex items-center justify-center text-3xl font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-600">
        Đang kiểm tra quyền truy cập...
      </p>
    );
  }

  if (!isLogin || !current) return null;
  if (!["ADMIN", "EDITOR"].includes(current.role)) return null;

  // useEffect(() => {
  //   // console.log("ADMIN CURRENT => ", current);
  //   if (!current) {
  //     router.replace("/");
  //   } else if (current?.role !== "ADMIN" && current?.role !== "EDITOR") {
  //     router.replace("/");
  //   }
  // }, [isLogin, current, router]);

  const Sidebar = [
    { id: 0, path: "", title: "Tổng quan" },
    { id: 1, path: "banner", title: "Banner" },
    { id: 2, path: "comment", title: "Bình Luận" },
    { id: 3, path: "course", title: "Khóa Học" },
    { id: 5, path: "exam-registration", title: "Đăng ký thi IELTS" },
    { id: 6, path: "honor", title: "Học Viên" },
    { id: 7, path: "partner", title: "Đối Tác" },
    { id: 8, path: "route", title: "Lộ Trình Học" },
    { id: 9, path: "teacher", title: "Giáo Viên" },
    { id: 10, path: "consultation", title: "Tư vấn" },
    { id: 11, path: "user", title: "Người Dùng" },
    { id: 12, path: "ladipage", title: "Tùy Chỉnh LadiPage" },
    { id: 13, path: "custom-home-page", title: "Giao Diện Trang Chủ" },
    { id: 14, path: "custom-page", title: "Cấu Hình Page" },
    { id: 15, path: "header-config", title: "Cấu Hình Header" },
    { id: 16, path: "footer-config", title: "Cấu Hình Footer" },
  ];

  const PostGroup = [
    { id: 20, path: "document", title: "Tài Liệu Thư Viện" },
    { id: 21, path: "category", title: "Phân loại" },
    { id: 22, path: "new", title: "Tin Tức & Sự Kiện" },
    { id: 23, path: "study-abroad", title: "Du học" },
  ];

  const IntroduceGroup = [
    { id: 30, path: "ve-the-real-ielts", title: "Trang về The Real Ielts" },
    { id: 31, path: "phuong-phap-lclt", title: "Trang phương Pháp LCLT" },
    // { id: 32, path: "xay-dung-lo-trinh", title: "Trang xây dựng lộ trình" },
    { id: 33, path: "test-ai", title: "Trang test Online" },
    { id: 34, path: "dang-ky-thi-ielts", title: "Trang đăng ký thi Ielts" },
    { id: 35, path: "cau-hoi-thuong-gap", title: "Câu Hỏi & GoogleForm" },
  ];

  const config = [{ id: 20, path: "setting", title: "Cấu hình" }];

  const handleSignOut = async () => {
    try {
      const res = await clientHttp(z.any(), {
        path: "/user/sign-out",
        method: "GET",
      });
      if (res?.success) {
        dispatch(setLogout());
        router.push("/");
      }
    } catch {
      dispatch(setLogout());
      router.push("/");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 text-gray-900 font-inter">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-sky-700 flex items-center gap-2 tracking-tight">
              🎓 The Real IELTS Dashboard
            </h1>

            <div className="flex items-center space-x-4">
              <span className="text-sm bg-gradient-to-r from-blue-50 to-cyan-50 border border-cyan-200 text-cyan-700 flex items-center gap-2 py-1.5 px-3 rounded-xl font-medium shadow-sm">
                <UserCheck2 className="w-4 h-4 text-cyan-700" />
                {current?.name || "Admin"}
              </span>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-sky-400 text-white rounded-lg shadow-md hover:shadow-lg hover:from-sky-500 hover:to-blue-500 transition-all text-sm font-medium"
              >
                <Home className="w-4 h-4" />
                Trang chủ
              </a>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-all text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 pb-24 bg-white/90 backdrop-blur-md shadow-md border-r border-gray-200 fixed h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <nav className="p-4 space-y-2">
              {Sidebar.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/${item.path}`}
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-sky-50 hover:text-blue-600 transition-all duration-200 font-medium text-sm"
                >
                  {item.title}
                </Link>
              ))}

              {/* Group: Post */}
              <div>
                <button
                  onClick={() => setOpenPosts(!openPosts)}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-md text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-semibold text-sm"
                >
                  Bài viết & Phân loại
                  {openPosts ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openPosts && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-gray-200 pl-2">
                    {PostGroup.map((item) => (
                      <Link
                        key={item.id}
                        href={`/admin/${item.path}`}
                        className="block px-3 py-1.5 font-[500] rounded-md text-gray-700 hover:bg-sky-100 hover:text-sky-700 transition-colors text-sm"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Group: Introduce */}
              <div>
                <button
                  onClick={() => setOpenIntroduce(!openIntroduce)}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-md text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-semibold text-sm"
                >
                  Nội dung giới thiệu
                  {openIntroduce ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openIntroduce && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-gray-200 pl-2">
                    {IntroduceGroup.map((item) => (
                      <Link
                        key={item.id}
                        href={`/admin/${item.path}`}
                        className="block px-3 py-1.5 font-[500] rounded-md text-gray-700 hover:bg-sky-100 hover:text-sky-700 transition-colors text-sm"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {config.map((item) => (
                  <Link
                    key={item.id}
                    href={`/admin/${item.path}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-sky-50 hover:text-blue-600 transition-all duration-200 font-medium text-[15px]"
                  >
                    <Settings className="size-4 text-slate-900" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 ml-64 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl">
              {children}
            </div>
          </main>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AdminLayout;
