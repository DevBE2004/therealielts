"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import { Loader2, Save, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  LadipageSchema,
  UpdateLadipage,
  UpdateLadipageSchema,
} from "@/types/ladipage";
import { toast } from "react-toastify";

export default function AdminLadipage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateLadipage & { content?: string }>({
    resolver: zodResolver(UpdateLadipageSchema),
    defaultValues: {
      type: "normal",
      url: "",
      content: "",
    },
  });

  const type = watch("type");

  // 🟦 Fetch data hiện có
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await clientHttp(ApiResponseSchema(LadipageSchema), {
          path: `/ladi-page/1`,
          method: "GET",
        });
        if (res?.data) {
          setValue("type", res.data.type);
          setValue("url", res.data.url || "");
        }
      } catch (err) {
        console.error("err: ", err);
        toast.error("Không thể tải dữ liệu Ladipage!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setValue]);

  // 🟧 Xử lý chọn file HTML
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawHtml = event.target?.result as string;
      // const cleanHtml = DOMPurify.sanitize(rawHtml, {
      //   ADD_TAGS: ["style", "link", "meta"],
      //   ADD_ATTR: ["rel", "href", "type", "media", "charset"],
      // });
      // làm sạch HTML
      setHtmlContent(rawHtml);
      setValue("content", rawHtml, {
        shouldDirty: true,
        shouldValidate: true,
      });
    };
    reader.readAsText(file);
  };

  // 🟩 Submit cập nhật
  const onSubmit = async (data: UpdateLadipage & { content?: string }) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("type", data.type);
      if (data.type === "ads") {
        formData.append("url", data.url || "");
      } else if (data.type === "normal" && htmlContent) {
        formData.append("content", htmlContent);
      }

      // const bodyToSend =
      //   data.type === "ads"
      //     ? { type: data.type, url: data.url }
      //     : { type: data.type, content: htmlContent };

      // console.log("DATA SUBMIT", bodyToSend);

      const res = await clientHttp(ApiResponseSchema(LadipageSchema), {
        path: `/ladi-page/update/1`,
        method: "PUT",
        body: formData,
      });

      console.log("RES UPDATE: ", res);

      toast.success("Cập nhật Ladipage thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="animate-spin text-primary w-6 h-6 mr-2" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <Card className="shadow-lg border border-gray-200 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Cập nhật Ladipage
          </CardTitle>
          <CardDescription>
            Chỉnh sửa cấu hình trang đích quảng cáo hoặc trang thông thường.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {/* Type */}
            <div>
              <Label className="font-medium mb-1 block">Loại Ladipage</Label>
              <Select
                value={type}
                onValueChange={(val) =>
                  setValue("type", val as "ads" | "normal", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="ads">Ads</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Nếu type = ads ⇒ nhập URL */}
            {type === "ads" && (
              <div>
                <Label className="font-medium mb-1 block">URL Ladipage</Label>
                <Input
                  placeholder="Nhập URL của trang quảng cáo..."
                  {...register("url")}
                />
                {errors.url && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.url.message}
                  </p>
                )}
              </div>
            )}

            {/* Nếu type = normal ⇒ chọn file HTML */}
            {type === "normal" && (
              <div>
                <Label className="font-medium mb-1 block">
                  File HTML (Ladipage nội dung)
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept=".html"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {fileName && (
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <FileText className="w-4 h-4" /> {fileName}
                    </span>
                  )}
                </div>
                {htmlContent && (
                  <p className="text-green-600 text-sm mt-1">
                    ✅ Đã đọc nội dung file ({htmlContent.length} ký tự)
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" /> Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Lưu thay đổi
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
