"use client";

import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import { clientHttp } from "@/lib/clientHttp";
import {
  ApiResponseSchema,
  TeacherCreateRequest,
  TeacherCreateRequestSchema,
  TeacherSchema,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import { z } from "zod";

export default function CreateTeacherPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TeacherCreateRequest>({
    resolver: zodResolver(TeacherCreateRequestSchema),
    defaultValues: {
      ieltsScore: 0,
      yearsOfExperience: 0,
      forWeb: "THEREALIELTS",
    },
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showSessionExpired = useSessionExpiredDialog();

  const onSubmit = async (data: TeacherCreateRequest) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile ?? "");
      if (data.avatar) {
        if (data.avatar instanceof File) {
          formData.append("avatar", data.avatar);
        } else {
          formData.append("avatar", data.avatar);
        }
      }
      if (data.bio) formData.append("bio", data.bio);
      if (data.education) formData.append("education", data.education);
      formData.append("ieltsScore", String(data.ieltsScore));
      formData.append("yearsOfExperience", String(data.yearsOfExperience));
      formData.append("forWeb", data.forWeb);
      if (data.teachingStyle)
        formData.append("teachingStyle", data.teachingStyle);

      // for (const [k, v] of formData.entries()) {
      //   console.log(k, v);
      // }

      const res = await clientHttp(ApiResponseSchema(z.any()), {
        path: "/teacher/create",
        method: "POST",
        body: formData,
      });
      if (res.success) {
        reset();
        setPreview(null);
        toast.success("Tạo giáo viên thành công!");
        router.push("/admin/teacher");
      } else {
        toast.warning(res.message);
      }
    } catch (err: any) {
      console.log("Error: ", err);
      if (
        slugify(err.message.mes, { lower: true, locale: "vi" }) ===
        "ban-chua-dang-nhap."
      ) {
        await showSessionExpired();
      } else {
        toast.warning(err.message.mes);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("avatar", file, { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Tạo Giáo viên Mới</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow p-6 space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Tên</label>
          <input
            type="text"
            {...register("name")}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Nhập tên giáo viên"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Nhập email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Số điện thoại
          </label>
          <input
            type="text"
            {...register("mobile")}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Nhập số điện thoại"
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
          )}
        </div>

        {/* ForWeb */}
        <div>
          <label className="block text-base font-medium mb-2 flex items-center gap-2 text-gray-700">
            <Globe className="w-4 h-4 text-blue-500" /> Website hiển thị
          </label>
          <select
            {...register("forWeb")}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="LINGOSPEAK">LINGO SPEAK</option>
            <option value="THEREALIELTS">THE REAL IELTS</option>
            <option value="PTEBOOSTER">PTE BOOSTER</option>
          </select>
          {errors.forWeb && (
            <p className="text-red-500 text-sm mt-1">{errors.forWeb.message}</p>
          )}
        </div>

        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium mb-2">Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {errors.avatar && (
            <p className="text-red-500 text-sm mt-1">
              {errors.avatar.message as string}
            </p>
          )}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-3 rounded-lg shadow h-32 object-cover"
            />
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-2">Tiểu sử</label>
          <textarea
            {...register("bio")}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Nhập tiểu sử"
            rows={4}
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
          )}
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm font-medium mb-2">Học vấn</label>
          <input
            type="text"
            {...register("education")}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Nhập học vấn"
          />
          {errors.education && (
            <p className="text-red-500 text-sm mt-1">
              {errors.education.message}
            </p>
          )}
        </div>

        {/* IELTS Score */}
        <div>
          <label className="block text-sm font-medium mb-2">Điểm IELTS</label>
          <input
            type="number"
            {...register("ieltsScore", { valueAsNumber: true })}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Nhập điểm IELTS"
            step="0.01"
          />
          {errors.ieltsScore && (
            <p className="text-red-500 text-sm mt-1">
              {errors.ieltsScore.message}
            </p>
          )}
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Số năm kinh nghiệm
          </label>
          <input
            type="number"
            {...register("yearsOfExperience", { valueAsNumber: true })}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Nhập số năm kinh nghiệm"
          />
          {errors.yearsOfExperience && (
            <p className="text-red-500 text-sm mt-1">
              {errors.yearsOfExperience.message}
            </p>
          )}
        </div>

        {/* Teaching Style */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Phong cách giảng dạy
          </label>
          <textarea
            {...register("teachingStyle")}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Nhập phong cách giảng dạy"
            rows={4}
          />
          {errors.teachingStyle && (
            <p className="text-red-500 text-sm mt-1">
              {errors.teachingStyle.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang thêm...
            </>
          ) : (
            "Thêm giáo viên"
          )}
        </button>
      </form>
    </div>
  );
}
