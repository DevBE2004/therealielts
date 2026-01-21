"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ApiResponseSchema,
  Banner,
  BannerCreateRequest,
  BannerCreateRequestSchema,
  BannerSchema,
} from "@/types";
import { useRouter, useParams } from "next/navigation";
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
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import { toast } from "react-toastify";

export default function UpdateBannerPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showSessionExpired = useSessionExpiredDialog();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BannerCreateRequest>({
    resolver: zodResolver(BannerCreateRequestSchema),
  });

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await clientHttp(ApiResponseSchema(BannerSchema), {
          path: `/banner/${slug}`,
          method: "GET",
        });
        if (res.data) {
          setBanner(res.data);
          reset({
            title: res.data.title,
            slug: res.data.slug ?? slugify(res.data.title),
            url: res.data.url,
            category: res.data.category,
            isActive: res.data.isActive ?? true,
            forWeb: res.data.forWeb,
          });
          if (res.data.image) setPreview(res.data.image);
        } else {
          setBanner(null);
        }
      } catch (err) {
        console.error("Lỗi khi load banner:", err);
      }
    };
    fetchBanner();
  }, [slug, reset]);

  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

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
      } else if (banner?.image) {
        const oldFile = await urlToFile(banner.image, "old-banner.jpg");
        formData.append("image", oldFile);
      }

      await clientHttp(ApiResponseSchema(BannerSchema), {
        path: `/banner/update/${banner?.id}`,
        method: "PUT",
        body: formData,
      });

      router.push("/admin/banner");
    } catch (err: any) {
      console.log("Error: ", err);
      if (
        slugify(err.message.mes, { lower: true, locale: "vi" }) ===
        "ban-chua-dang-nhap."
      ) {
        await showSessionExpired();
      } else {
        toast.warning("Tiêu đề đã tồn tại!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("image", file, { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Cập nhật Banner</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
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
          >
            <option value="">Chọn</option>
            <option value="Trang chủ">Trang chủ</option>
            <option value="Xây dựng lộ trình">Xây dựng lộ trình</option>
            <option value="thư viện">Thư viện</option>
          </select>
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
          <input type="file" accept="image/*" onChange={handleFileChange} />
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
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 rounded-lg shadow font-medium transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            "Cập nhật Banner"
          )}
        </button>
      </form>
    </div>
  );
}
