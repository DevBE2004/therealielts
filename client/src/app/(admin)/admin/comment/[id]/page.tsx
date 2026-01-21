"use client";

import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import {
  CommentSchema,
  UpdateComment,
  updateCommentSchema,
} from "@/types/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MessageSquare, Upload, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";

export default function CreateFeedbackPage() {
  const router = useRouter();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateComment>({
    resolver: zodResolver(updateCommentSchema),
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showSessionExpired = useSessionExpiredDialog();

  const urlToFile = async (
    url: string,
    filename: string,
    mimeType = "image/png"
  ): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType });
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await clientHttp(ApiResponseSchema(CommentSchema), {
          path: `/comment/${id}`,
          method: "GET",
        });
        if (res.data) {
          reset({
            name: res.data.name,
            content: res.data.content,
            job: res.data.job,
          });
          if (typeof res.data.avatar === "string") {
            setPreview(res.data.avatar);
            const file = await urlToFile(res.data.avatar, "image.png");
            setValue("avatar", file, { shouldValidate: true });
          }
        }
      } catch (err) {
        console.error("Khoong load được data", err);
      }
    };
    fetchFeedback();
  }, [id, reset, setValue]);

  const onSubmit = async (data: UpdateComment) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("content", data.content);
      formData.append("job", data.job);

      if (data.avatar instanceof File) {
        formData.append("avatar", data.avatar);
      }

      const res = await clientHttp(ApiResponseSchema(updateCommentSchema), {
        path: `/comment/update/${id}`,
        method: "PUT",
        body: formData,
      });
      if (res.success) {
        toast.success("Cập nhật feedback thành công!");
        reset();
        setPreview(null);
        router.push("/admin/comment");
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

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">
        Cập nhật Feedback
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-6 space-y-6"
      >
        {/* Avatar Upload */}
        <div className="flex flex-col items-center">
          <label
            htmlFor="avatar"
            className="w-32 h-32 flex items-center justify-center rounded-full border-2 border-dashed border-slate-300 cursor-pointer hover:border-slate-500 transition"
          >
            {preview ? (
              <img
                src={preview}
                alt="avatar preview"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-slate-500">
                <Upload className="w-8 h-8 mb-1" />
                <span className="text-sm">Chọn Avatar</span>
              </div>
            )}
          </label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            {...register("avatar", {
              onChange: (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setValue("avatar", file);
                  setPreview(URL.createObjectURL(file));
                }
              },
            })}
          />
          {errors.avatar && (
            <p className="text-sm text-red-500 mt-2">
              {errors.avatar.message as string}
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1 text-slate-700 font-medium flex items-center gap-2">
            <User className="w-4 h-4" /> Họ và tên
          </label>
          <input
            type="text"
            placeholder="Nhập tên người gửi"
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">
              {errors.name.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-slate-700 font-medium flex items-center gap-2">
            <User className="w-4 h-4" /> Nghề nghiệp
          </label>
          <input
            type="text"
            placeholder="Nghề nghiệp hiện tại"
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            {...register("job")}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">
              {errors.job?.message as string}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block mb-1 text-slate-700 font-medium flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Nội dung Feedback
          </label>
          <textarea
            placeholder="Nhập nội dung..."
            rows={4}
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            {...register("content")}
          />
          {errors.content && (
            <p className="text-sm text-red-500 mt-1">
              {errors.content.message as string}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2 rounded-xl hover:bg-slate-700 transition disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
}
