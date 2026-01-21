"use client";

import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { parseStringObject } from "@/hooks/parseStringObject";

export default function AdminConfigPage() {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reCaptchaEnabled, setReCaptchaEnabled] = useState<"on" | "off">("off");

  // Fetch dữ liệu khi load trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await clientHttp(ApiResponseSchema(z.any()), {
          path: `/introduce/5`,
          method: "GET",
        });
        console.log("RES: ", res.data.section1);

        if (res?.data?.section1) {
          const section1 =
            typeof res.data.section1 === "string"
              ? JSON.parse(res.data.section1)
              : res.data.section1;
          setReCaptchaEnabled(
            section1.reCaptchaEnabled === "on" ? "on" : "off"
          );
        }
      } catch (err: any) {
        console.error("err: ", err);
        toast.error(err.message?.mes || "Không thể tải cấu hình reCAPTCHA");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  console.log("RECAPTCHA: ", reCaptchaEnabled);

  // Submit update cấu hình
  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("section1", JSON.stringify({ reCaptchaEnabled }));
      const res = await clientHttp(ApiResponseSchema(z.any()), {
        path: `/introduce/update/5`,
        method: "PUT",
        body: formData,
      });

      if (res?.success) {
        toast.success("Cập nhật cấu hình thành công!");
      } else {
        toast.error("Cấu hình thất bại, vui lòng thử lại!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message?.mes || "Cấu hình thất bại, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nếu đang loading dữ liệu ban đầu
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="animate-spin text-primary w-6 h-6 mr-2" />
        <span>Đang tải cấu hình reCAPTCHA...</span>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Card className="shadow-md border rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Cấu hình Google reCAPTCHA
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <div>
              <h3 className="font-medium text-base">
                Trạng thái bảo vệ biểu mẫu
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {reCaptchaEnabled === "on"
                  ? "reCAPTCHA hiện đang được bật."
                  : "reCAPTCHA hiện đang tắt."}
              </p>
            </div>

            <Switch
              checked={reCaptchaEnabled === "on"}
              onCheckedChange={(checked) =>
                setReCaptchaEnabled(checked ? "on" : "off")
              }
            />
          </div>

          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center cursor-pointer"
          >
            {isSubmitting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            {isSubmitting ? "Đang lưu..." : "Lưu cấu hình"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
