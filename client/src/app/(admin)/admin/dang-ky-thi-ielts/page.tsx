"use client";

import InstructionSectionEditor from "@/components/admin/dang-ky-thi-ielts/InstructionSectionEditor";
import IntroSectionEditor from "@/components/admin/dang-ky-thi-ielts/IntroSectionEditor";
import WhyChooseSectionEditor from "@/components/admin/dang-ky-thi-ielts/WhyChooseSectionEditor";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import { clientHttp } from "@/lib/clientHttp";
import { urlToFile } from "@/utils/urlToFile";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";
import z from "zod";

export default function AdminRegisterIeltsPage() {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const showSessionExpired = useSessionExpiredDialog();

  // --- Fetch dữ liệu ban đầu ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await clientHttp(z.any(), {
          path: "/introduce/6",
          method: "GET",
        });
        setFormData(res?.data || {});
      } catch (err) {
        console.error("Lỗi tải dữ liệu trang giới thiệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Hàm cập nhật từng section
  const handleSectionChange = (sectionKey: string, newData: any) => {
    setFormData((prev: any) => ({ ...prev, [sectionKey]: newData }));
  };

  const appendImagesToForm = async (
    formData: FormData,
    key: string,
    images: (File | string)[]
  ) => {
    for (const img of images) {
      const file = typeof img === "string" ? await urlToFile(img) : img;
      formData.append(key, file);
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    setSaving(true);

    try {
      const fd = new FormData();

      // --- Append text section ---
      // fd.append("section1", JSON.stringify(formData.section1 || {}));
      fd.append("section2", JSON.stringify(formData.section2 || {}));
      fd.append("section3", JSON.stringify(formData.section3 || {}));
      fd.append("section4", JSON.stringify(formData.section4 || {}));
      // fd.append("section5", JSON.stringify(formData.section5 || {}));

      // --- Append ảnh
      // await appendImagesToForm(fd, "images1", formData?.images1 || []);
      await appendImagesToForm(fd, "images2", formData?.images2 || []);
      await appendImagesToForm(fd, "images3", formData?.images3 || []);
      // await appendImagesToForm(fd, "images4", formData?.images4 || []);
      // await appendImagesToForm(fd, "images5", formData?.images5 || []);

      //       console.log("=== FormData đang gửi ===");
      // for (const [k, v] of fd.entries()) {
      //   if (v instanceof File) {
      //     console.log(k, v.name, v.type, v.size);
      //   } else {
      //     console.log(k, v);
      //   }
      // }

      await clientHttp(z.any(), {
        path: "/introduce/update/6",
        method: "PUT",
        body: fd,
      });

      toast.success("Đã lưu thay đổi thành công!");
    } catch (error: any) {
      console.error("Lỗi khi lưu:", error);
      if (
        slugify(error.message?.mes || error.message.message, {
          lower: true,
          locale: "vi",
        }) === "ban-chua-dang-nhap."
      ) {
        await showSessionExpired();
      } else {
        toast.warning(error.message?.mes || error.message.message);
      }
    } finally {
      setSaving(false);
    }
  };

  // --- Loading state ---
  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Đang tải dữ liệu trang...
      </div>
    );
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        🧩 Cập nhật nội dung - Đăng ký thi IELTS tại IDP
      </h1>

      <IntroSectionEditor
        data={formData?.section2}
        images={formData?.images2}
        onChange={(newData) => handleSectionChange("section2", newData)}
        onImagesChange={(imgs) => handleSectionChange("images2", imgs)}
      />

      <WhyChooseSectionEditor
        data={formData?.section3}
        images={formData?.images3}
        onChange={(newData) => handleSectionChange("section3", newData)}
        onImagesChange={(imgs) => handleSectionChange("images3", imgs)}
      />

      <InstructionSectionEditor
        data={formData?.section4}
        images={formData?.images4}
        onChange={(newData) => handleSectionChange("section4", newData)}
        onImagesChange={(imgs) => handleSectionChange("images4", imgs)}
      />

      <div className="flex justify-end pt-8 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Đang lưu..." : "💾 Lưu tất cả thay đổi"}
        </button>
      </div>
    </div>
  );
}
