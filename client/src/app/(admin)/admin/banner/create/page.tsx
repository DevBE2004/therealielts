"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ApiResponseSchema,
  BannerCreateRequest,
  BannerCreateRequestSchema,
} from "@/types";
import { useRouter } from "next/navigation";
import { clientHttp } from "@/lib/clientHttp";
import slugify from "slugify";
import {
  Tag,
  Link2,
  UploadCloud,
  CheckSquare,
  Loader2,
  Globe,
} from "lucide-react";
import { toast } from "react-toastify";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";

export default function CreateBannerPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BannerCreateRequest>({
    resolver: zodResolver(BannerCreateRequestSchema),
    defaultValues: {
      isActive: true,
      slug: "",
      forWeb: "THEREALIELTS",
    },
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showSessionExpired = useSessionExpiredDialog();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("image", file, { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  };

  const title = watch("title");
  useEffect(() => {
    if (title) {
      setValue("slug", slugify(title), { shouldValidate: true });
    }
  }, [title, setValue]);

  const onSubmit = async (data: BannerCreateRequest) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", slugify(data.title));
      formData.append("url", data.url);
      formData.append("category", data.category);
      formData.append("forWeb", data.forWeb);
      formData.append("isActive", String(data.isActive));

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await clientHttp(
        ApiResponseSchema(BannerCreateRequestSchema),
        {
          path: "/banner/create",
          method: "POST",
          body: formData,
        }
      );
      if (res.success) {
        reset();
        setPreview(null);
        router.push("/admin/banner");
      } else {
        toast.error(res.message);
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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Tạo Banner Mới</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-lg p-6 space-y-10"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
            <Tag className="w-4 h-4 text-blue-500" /> Tiêu đề
          </label>
          <input
            type="text"
            {...register("title")}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Nhập tiêu đề"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-base font-medium mb-2">
            Banner xuất hiện tại
          </label>
          <select
            {...register("category")}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="" disabled>
              Chọn
            </option>
            <option value="Trang chủ">Trang chủ</option>
            <option value="Xây dựng lộ trình">Xây dựng lộ trình</option>
            <option value="thư viện">Thư viện</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
            <Link2 className="w-4 h-4 text-blue-500" /> URL
          </label>
          <input
            type="url"
            {...register("url")}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="https://example.com"
          />
          {errors.url && (
            <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
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

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
            <UploadCloud className="w-4 h-4 text-blue-500" /> Hình ảnh
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {errors.image && (
            <p className="text-red-500 text-base mt-1">
              {errors.image.message as string}
            </p>
          )}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-3 rounded-lg shadow h-40 w-full object-cover"
            />
          )}
        </div>

        {/* isActive */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("isActive")}
            defaultChecked
            className="h-4 w-4 rounded border-gray-300"
          />
          <label className="text-sm flex items-center gap-1 text-gray-700">
            <CheckSquare className="w-4 h-4 text-green-500" /> Kích hoạt
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 rounded-lg shadow font-medium transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang tạo...
            </>
          ) : (
            "Tạo Banner"
          )}
        </button>
      </form>
    </div>
  );
}
