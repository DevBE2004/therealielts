"use client";

import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "react-toastify";
import { CheckCircle2, Loader2 } from "lucide-react";

// Cấu hình Cloudinary
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;

const items = [
  {
    id: 1,
    color: "from-cyan-400 to-sky-500",
  },
  {
    id: 2,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    color: "from-cyan-400 to-sky-500",
  },
];

interface featureBox {
  linkImage: string;
  content: string;
}

const blockKey: Record<number, "block1" | "block2" | "block3"> = {
  1: "block1",
  2: "block2",
  3: "block3",
};

interface IRoadmapUIData {
  section1: {
    title: string;
    subtitle1: string;
    subtitle2: string;
    linkImage: string;
    contentImage: string;
  };
  section2: {
    block1: featureBox;
    block2: featureBox;
    block3: featureBox;
  };
  section3: {
    title: string;
  };
  section4: {
    title: string;
    content: string;
    linkImage: string;
  }[];
}

export default function AdminLearningRoadmaps() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
  } = useForm<IRoadmapUIData>();

  const [loading, setLoading] = useState<boolean>(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [roadmapUIData, setRoadmapUIData] = useState<IRoadmapUIData | null>(
    null
  );
  const allowedImageTypes = ["image/png", "image/webp"];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await clientHttp(ApiResponseSchema(z.any()), {
        path: "/introduce/7",
        method: "GET",
      });

      if (res?.success && res?.data) {
        setRoadmapUIData(res.data);
        reset(res.data);
      }
    } catch (error: any) {
      console.error("Fetch Roadmap UI Data Failed: ", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: IRoadmapUIData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("section1", JSON.stringify(data));

      const res = await clientHttp(ApiResponseSchema(z.any()), {
        path: "/introduce/update/7",
        method: "PUT",
        body: formData,
      });
      if (res.success) {
        toast.success("Cập nhật thành công !");
      }
    } catch (error: any) {
      console.error("Update failed: ", error);
      toast.warning(error.message?.mes || "Cập nhật không thành công !");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      return result.secure_url as string;
    } catch (error: any) {
      console.error("Upload Image to Cloudinary Failed: ", error);
      alert(error);
    }
  };

  const handleSeclectImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof IRoadmapUIData | string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      alert("Chỉ cho phép ảnh PNG hoặc WEBP!");
    }

    const imageUrl = await handleUploadImage(file);
    setValue(field as any, imageUrl);
  };

  return (
    <div id="main" className="flex flex-col min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-gray-900">
        Cập Nhật Nội Dung Trang Xây Dựng Lộ Trình
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section id="box_header" className="w-full bg-[#20376C] py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center">
            {/* Left Content */}
            <header className="w-full md:w-1/2 text-white mb-6 md:mb-0">
              <textarea
                // type="t"
                className="uppercase font-bold text-2xl md:text-3xl lg:text-4xl leading-snug mb-3"
                {...register("section1.title")}
                placeholder={`Xây dựng lộ trình học`}
              />
              <input
                className="text-base lg:text-lg font-normal"
                type="text"
                {...register("section1.subtitle1")}
                placeholder="Là bước đầu tiên trong quá trình chinh phục điểm cao IELTS."
              />
            </header>

            {/* Right Content */}
            <div className="w-full md:w-1/2 flex flex-col gap-5">
              <textarea
                className="text-white text-base lg:text-lg font-medium"
                {...register("section1.subtitle2")}
                placeholder={`Xây dựng lộ trình <span className="italic">"cá nhân hóa"</span> là
              xây dựng lộ trình học phù hợp với từng học viên.`}
              />

              {/* CTA Buttons */}
              <div className="flex flex-col-reverse md:flex-col gap-5">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
                  <a
                    href="#xay-dung-lo-trinh-ca-nhan-hoa"
                    className="bg-gradient-to-r from-orange-100 to-orange-200 text-blue-900 font-medium px-5 py-2.5 rounded-lg shadow-md text-center"
                  >
                    Xây lộ trình IELTS cho tôi
                  </a>
                  <a
                    href="#dang-ky-tu-van"
                    className="bg-gradient-to-r from-sky-200 to-sky-100 text-blue-900 font-medium px-5 py-2.5 rounded-lg shadow-md text-center"
                  >
                    Đăng ký nhận tư vấn
                  </a>
                </div>

                {/* Achievement */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                  <a href="/vinh-danh-hoc-vien" className="flex-shrink-0">
                    {/* <img
                    src="/images/unnamed-file.png"
                    alt="Logo thành tích học viên"
                    className="h-11 w-auto object-contain"
                    loading="lazy"
                  /> */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleSeclectImage(e, "section1.linkImage")
                      }
                    />
                  </a>
                  <div className="text-white">
                    <p className="text-2xl font-bold">1200+</p>
                    <p className="text-base font-semibold -mt-1">
                      Học viên đạt IELTS 7.0+
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="w-full bg-white py-10">
            <div className="max-w-[1250px] mx-auto px-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 lg:items-center gap-6">
                {items.map((feature) => {
                  const key = blockKey[feature.id];

                  const isSecond = feature.id === 2;
                  let extraClasses = "";
                  if (feature.id === 1) {
                    extraClasses =
                      "col-start-1 row-start-1 lg:col-start-1 lg:row-start-auto";
                  } else if (feature.id === 3) {
                    extraClasses =
                      "col-start-2 row-start-1 lg:col-start-3 lg:row-start-auto";
                  } else if (feature.id === 2) {
                    extraClasses =
                      "col-span-2 row-start-2 lg:col-span-1 lg:col-start-2 lg:row-start-auto";
                  }

                  const height = isSecond
                    ? "h-36 md:h-56 lg:h-[272px]"
                    : "h-[120px] md:h-40 lg:h-48";

                  const gradient = isSecond
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-gradient-to-r from-cyan-300 to-sky-500 text-sky-900";

                  const widthAdjust = isSecond
                    ? "w-full sm:w-[70%] lg:w-full mx-auto"
                    : "";

                  const textClass = isSecond
                    ? "mt-3 font-semibold text-lg sm:text-xl md:text-2xl"
                    : "mt-3 font-semibold text-base sm:text-lg md:text-xl";

                  const alt =
                    feature.id === 1
                      ? "StudyPlan-Chi-Tiet"
                      : feature.id === 2
                      ? "Phuong-phap-LCLT"
                      : "Giao-vien-tinh-tuyen";

                  return (
                    <div key={feature.id} className={extraClasses}>
                      <div
                        className={`${height} ${gradient} ${widthAdjust} rounded-2xl shadow-md flex flex-col items-center justify-center text-center p-4 md:p-6 hover:scale-105 transition-transform duration-300`}
                      >
                        {/* <img
                        src={feature.icon}
                        alt={alt}
                        className="size-[70px] hidden md:block"
                      /> */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleSeclectImage(e, `section2.${key}.linkImage`)
                          }
                        />
                        <textarea
                          rows={2}
                          {...register(`section2.${key}.content`)}
                          className={textClass}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="xay-dung-lo-trinh-ca-nhan-hoa" className="w-full">
          <div className="w-full">
            <h2 className="text-center font-bold text-5xl text-sky-950">
              Xây Lộ Trình Học IELTS Cá Nhân Hóa
            </h2>
            <p className="p-5 bg-blue-200">
              Logic & Giao diện xây dựng lộ trình
            </p>
          </div>
        </section>

        <section
          id="why-choose-TRI"
          className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50"
        >
          <div className="w-full">
            <h2 className="text-center font-bold text-4xl text-sky-950 uppercase mt-4">
              Vì sao bạn nên lựa chọn the real ielts?
            </h2>
            {/* <div className="w-full py-10 -mt-2.5" aria-label="Ưu điểm nổi bật">
            <div className="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <motion.article
                  key={feature.id}
                  whileHover={{ scale: 1.03 }}
                  className="rounded-2xl shadow-md bg-white hover:bg-indigo-50/70 transition-all duration-300 flex flex-col p-8"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <span className="text-indigo-600">{feature.icon}</span>
                    <h2 className="text-xl font-bold text-gray-800 leading-snug">
                      {feature.title}
                    </h2>
                  </div>

                  
                  <ul className="list-disc list-inside text-gray-700 text-base space-y-2 flex-1 leading-relaxed">
                    {feature.description.map((desc, idx) => (
                      <li key={idx}>{desc}</li>
                    ))}
                  </ul>
                  <div className="flex justify-center mt-8">
                    {feature.image}
                  </div>
                </motion.article>
              ))}
            </div>
          </div> */}
          </div>
        </section>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white shadow hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Cập nhật
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
