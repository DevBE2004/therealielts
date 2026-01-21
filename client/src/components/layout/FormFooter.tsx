"use client";

import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import { ConsultationCreateRequest } from "@/types/consultation";
import { FormEvent, useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { z } from "zod";

export default function FormFooter() {
  const [url, setUrl] = useState("");

  const [formData, setFormData] = useState<any>({
    name: "",
    mobile: "",
    email: "",
    atPlace: "FOOTER",
    formName: "formweb-footer",
    url: "",
  });

  // CAPTCHA State
  const [captchaEnabled, setCaptchaEnabled] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = process.env.NEXT_PUBLIC_SITE_KEY_RECAPTCHA || "";

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await clientHttp(ApiResponseSchema(z.any()), {
          path: "/introduce/5",
          method: "GET",
        });

        const config = res?.data?.section1;
        await setCaptchaEnabled(config?.reCaptchaEnabled === "on");
      } catch (error: any) {
        console.error(error.message || error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleCaptchaChange = async (token: string | null) => {
    if (!token) return;
    setToken(token);
    setShowCaptcha(false);
    await handleSubmitAction();
    recaptchaRef.current?.reset();
    setToken(null);
  };

  useEffect(() => {
    setUrl(window.location.href);
    setFormData((prev: any) => ({
      ...prev,
      url: url,
    }));
  }, [url]);

  const handleInputChange = (field: keyof any, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (captchaEnabled && !token) {
      setShowCaptcha(true);
      toast.info("Vui lòng xác minh reCAPTCHA để tiếp tục");
      return;
    }

    await handleSubmitAction();
  };

  const handleSubmitAction = async () => {
    try {
      const res = await clientHttp(ApiResponseSchema(z.any()), {
        path: "/consultation/create",
        method: "POST",
        body: formData,
      });

      if (res.success) {
        toast.success("Chúng tôi sẽ sớm liên hệ lại với bạn!");
        setFormData({
          name: "",
          email: "",
          mobile: "",
        });
        if (recaptchaRef.current) recaptchaRef.current.reset();
        setToken(null);
        setShowCaptcha(false);
      } else {
        toast.error("Gửi thất bại!");
      }
    } catch (error: any) {
      console.error(error);
      toast.warning(error.message?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div>
      <h3 className="font-bold text-base mb-3 border-b border-gray-200 pb-3">
        ĐĂNG KÝ TƯ VẤN LỘ TRÌNH
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={formData?.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Họ và tên"
          required
          className="w-full px-3 py-2 rounded-md text-white border border-white bg-transparent placeholder:text-blue-200"
        />
        <input
          type="tel"
          value={formData?.mobile}
          onChange={(e) => handleInputChange("mobile", e.target.value)}
          placeholder="Số điện thoại"
          required
          className="w-full px-3 py-2 rounded-md text-white border border-white bg-transparent placeholder:text-blue-200"
        />
        <input
          type="email"
          value={formData?.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Email"
          required
          className="w-full px-3 py-2 rounded-md text-white border border-white bg-transparent placeholder:text-blue-200"
        />
        <button
          type="submit"
          className="w-full bg-orange-700 text-white py-2 rounded-md
             hover:bg-orange-800 transition-colors"
        >
          Gửi thông tin
        </button>
      </form>

      {captchaEnabled && showCaptcha && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h3 className="text-center text-gray-700 font-medium mb-3">
              Xác minh bảo mật
            </h3>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={siteKey}
              onChange={handleCaptchaChange}
              onExpired={() => setToken(null)}
            />
            <button
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 mx-auto block"
              onClick={() => setShowCaptcha(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
