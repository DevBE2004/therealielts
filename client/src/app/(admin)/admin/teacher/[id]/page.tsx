"use client";

import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import { clientHttp } from "@/lib/clientHttp";
import {
  ApiResponseSchema,
  Teacher,
  TeacherSchema,
  TeacherUpdateRequest,
  TeacherUpdateRequestSchema,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export default function UpdateTeacherPage() {
  const router = useRouter();
  const { id } = useParams();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showSessionExpired = useSessionExpiredDialog();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TeacherUpdateRequest>({
    resolver: zodResolver(TeacherUpdateRequestSchema),
  });

  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await clientHttp(ApiResponseSchema(TeacherSchema), {
          path: `/teacher/${id}`,
          method: "GET",
        });
        if (res.teacher) {
          setTeacher(res.teacher);
          reset({
            name: res.teacher.name ?? "",
            email: res.teacher.email ?? "",
            mobile: res.teacher.mobile ?? "",
            bio: res.teacher.bio ?? "",
            education: res.teacher.education ?? "",
            ieltsScore: res.teacher.ieltsScore ?? 0,
            yearsOfExperience: res.teacher.yearsOfExperience ?? 0,
            teachingStyle: res.teacher.teachingStyle ?? "",
            forWeb: res.teacher.forWeb,
          });
          setPreview(res.teacher.avatar ?? "");
        }
      } catch (err) {
        console.error("Lỗi khi load giáo viên:", err);
      }
    };
    fetchTeacher();
  }, [id, reset]);

  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const onSubmit = async (data: TeacherUpdateRequest) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name || "");
      formData.append("email", data.email || "");
      formData.append("mobile", data.mobile || "");
      formData.append("bio", data.bio || "");
      formData.append("education", data.education || "");
      formData.append("ieltsScore", String(data.ieltsScore || 0));
      formData.append("yearsOfExperience", String(data.yearsOfExperience || 0));
      formData.append("teachingStyle", data.teachingStyle || "");
      formData.append("forWeb", data.forWeb || "");

      if (data.avatar) {
        formData.append("avatar", data.avatar);
      } else if (teacher?.avatar) {
        const oldFile = await urlToFile(teacher.avatar, "old-avatar.jpg");
        formData.append("avatar", oldFile);
      }

      await clientHttp(ApiResponseSchema(TeacherSchema), {
        path: `/teacher/update/${teacher?.id}`,
        method: "PUT",
        body: formData,
      });

      toast.success("Cập nhật giáo viên thành công!");
      router.push("/admin/teacher");
    } catch (err: any) {
      console.log("Error: ", err);
      if (
        slugify(err.message.mes, { lower: true, locale: "vi" }) ===
        "ban-chua-dang-nhap."
      ) {
        await showSessionExpired();
      } else {
        toast.warning("Email hoặc số điện thoại đã tồn tại!");
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
      <h1 className="text-2xl font-semibold mb-6">Cập nhật Giáo viên</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow p-6 space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Họ và tên</label>
          <input
            type="text"
            {...register("name")}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
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
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
          )}
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm font-medium mb-2">Học vấn</label>
          <input
            type="text"
            {...register("education")}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
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
            step="0.5"
            min="0"
            max="9"
            {...register("ieltsScore", { valueAsNumber: true })}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
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
            min="0"
            {...register("yearsOfExperience", { valueAsNumber: true })}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
          />
          {errors.yearsOfExperience && (
            <p className="text-red-500 text-sm mt-1">
              {errors.yearsOfExperience.message}
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-2">Tiểu sử</label>
          <textarea
            rows={4}
            {...register("bio")}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
          )}
        </div>

        {/* Teaching Style */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Phong cách giảng dạy
          </label>
          <textarea
            rows={4}
            {...register("teachingStyle")}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
          />
          {errors.teachingStyle && (
            <p className="text-red-500 text-sm mt-1">
              {errors.teachingStyle.message}
            </p>
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
          <label className="block text-sm font-medium mb-2">Ảnh đại diện</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            "Cập nhật thông tin giáo viên"
          )}
        </button>
      </form>
    </div>
  );
}
