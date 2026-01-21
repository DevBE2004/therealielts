"use client";

import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import { useState } from "react";
import { toast } from "react-toastify";
import z from "zod";

export default function FormRegister() {
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    difficult: "",
  });

  const handleInputChange = (field: keyof any, value: string) => {
    setFormData((prev: any) => ({
      ...(prev || {}),
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await clientHttp(ApiResponseSchema(z.any()), {
        path: "/consultation/create",
        method: "POST",
        body: formData,
      });
      if (res?.success) {
        setFormData({
          name: "",
          email: "",
          mobile: "",
          goal: "",
          difficult: "",
        });
      } else {
        toast.error(res?.message || "Có lỗi khi gửi form");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message?.mes || "Lỗi hệ thống, vui lòng thử lại");
    }
  };

  const currentYear = new Date().getFullYear();
  const birthYears = Array.from({ length: 30 }, (_, i) => currentYear - 15 - i);

  return (
    <section className="w-full bg-[#23376D] py-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-6 items-center justify-center"
      >
        <div className="gap-4 flex flex-wrap w-full items-center justify-center px-2 md:px-4">
          <div>
            <input
              type="text"
              value={formData?.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border placeholder:text-gray-200 text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Họ và tên"
              required
            />
          </div>

          <div>
            <input
              type="email"
              value={formData?.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border placeholder:text-gray-200 text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Nhập email"
              required
            />
          </div>

          <div>
            <input
              type="tel"
              value={formData?.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border placeholder:text-gray-200 text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Số điện thoại"
              required
            />
          </div>

          <div>
            <input
              type="text"
              value={formData?.goal}
              onChange={(e) => handleInputChange("goal", e.target.value)}
              placeholder="Mục tiêu của bạn"
              className="w-full pl-10 pr-4 py-3 border placeholder:text-gray-200 text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <input
              type="text"
              value={formData?.difficult}
              onChange={(e) => handleInputChange("difficult", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border placeholder:text-gray-200 text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Tình trạng hiện tại"
            />
          </div>
        </div>
        <div className="w-auto">
          <button
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-sans font-[700] py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            LỘ TRÌNH HỌC IELTS
          </button>
        </div>
      </form>
    </section>
  );
}
