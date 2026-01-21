"use client";

import { New } from "@/types";
import Image from "next/image";
import ReusableForm from "./ReusableForm";
import { BadgeDollarSign, House } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import slugify from "slugify";
import GroupNew from "./card/group-new";

type PageProps = {
  data?: New[];
};

export default function EventAndSale({ data }: PageProps) {
  const router = useRouter();
  // Nhóm news theo category
  const groupedNews = useMemo(() => {
    const groups: Record<string, { title: string; items: New[] }> = {};
    data?.forEach((item) => {
      const category =
        (item.category?.name as unknown as string).trim() || "Khác";
      const slug = slugify(category, { lower: true });
      if (!groups[slug]) groups[slug] = { title: category, items: [] };
      if (groups[slug].items.length < 3) groups[slug].items.push(item);
    });
    return Object.values(groups);
  }, [data]);

  return (
    <section className=" bg-gray-50">
      <div className="relative">
        <img
          src="/images/banner-tin-tuc.png"
          alt="banner-honor-page"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute top-1/2 -translate-y-1/2 text-white w-full grid gap-2">
          <div className="text-[50px] font-semibold container mx-auto px-4">
            Sự kiện & Khuyến mại
          </div>
          <div className="container mx-auto px-4 flex gap-6 text-[1rem]">
            <span
              className="flex items-center gap-1 cursor-pointer duration-300 transform hover:scale-105"
              onClick={() => router.push("/")}
            >
              <House size={20} /> Trang chủ
            </span>
            <span
              className="flex items-center gap-1 cursor-pointer duration-300 transform hover:scale-105"
              onClick={() => router.push("/su-kien-va-khuyen-mai")}
            >
              {" "}
              <BadgeDollarSign size={20} /> Sự kiện & khuyến mại
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 container mx-auto px-4 mt-12 lg:justify-center lg:items-start">
        <div className="col-span-7">
          {groupedNews?.map((item, index) => {
            return <GroupNew key={index} group={item} />;
          })}
        </div>

        <div
          style={{
            boxShadow:
              "0 0 10px 0 rgba(107.92343749999999, 107.92343749999999, 107.92343749999999, .5)",
          }}
          className="p-3 rounded-[10px] bg-white h-fit col-span-1 lg:col-span-3 mb-12 lg:mb-0"
        >
          <img
            src="/images/Banner-phu_1-honorpage.jpg"
            alt="banner-honor-page"
            className="w-full object-contain object-center"
          />
          <div className="text-[#333399] text-[20px] text-center font-bold whitespace-pre-line mb-3">
            {"ĐĂNG KÝ TƯ VẤN \nLỘ TRÌNH HỌC IELTS"}
          </div>
          <div className="text-[#333] text-[16px] text-center font-medium whitespace-pre-line">
            {
              "Bạn hãy để lại thông tin, The Real IELTS\n sẽ liên hệ cho bạn ngay nha!"
            }
          </div>
          <ReusableForm
            title=""
            description=""
            layout="main"
            className="border-none shadow-none px-0 hover:shadow-none"
            fields={[
              {
                name: "name",
                label: "",
                placeholder: "Nhập họ và tên",
                type: "text",
                required: true,
              },
              {
                name: "yearOfBirth",
                placeholder: "Nhập năm sinh",
                label: "",
                type: "year",
                required: true,
              },
              {
                name: "mobile",
                label: "",
                placeholder: "Nhập số điện thoại",
                type: "tel",
                required: true,
              },
              {
                name: "email",
                label: "",
                placeholder: "Nhập email",
                type: "email",
                required: true,
              },

              {
                name: "goal",
                label: "Mục tiêu học",
                type: "radio",
                options: [
                  { value: "Xét tuyển đại học", label: "Xét tuyển ĐH" },
                  { value: "Phục vụ công việc", label: "Phục vụ công việc" },
                ],
                required: true,
              },
              {
                name: "difficult",
                label: "",
                placeholder: "Thời gian bạn có thể nhận cuộc gọi",
                type: "text",
                required: true,
              },
            ]}
            submitText="Hoàn tất đăng ký"
            apiPath="/consultation/create"
          />
        </div>
      </div>
    </section>
  );
}
