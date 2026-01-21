"use client";

import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { z } from "zod";

type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type: "text" | "email" | "tel" | "textarea" | "radio" | "date" | "year";
  required?: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
};

type Props = {
  title: string;
  description?: string;
  layout?: "sidebar" | "main";
  fields: Field[];
  submitText?: string;
  apiPath: string;
  className?: string;
  onSuccess?: (res: any) => void;
  onError?: (err: any) => void;
};

export default function ReusableForm({
  title,
  description,
  layout = "main",
  fields,
  submitText = "Gửi",
  apiPath,
  className,
  onSuccess,
  onError,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // CAPTCHA State
  const [captchaEnabled, setCaptchaEnabled] = useState(false);
  const [token, setToken] = useState<string | null>(null);
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
        console.error(error?.message || error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
    setUrl(window.location.href);
  }, []);

  const handleCaptchaChange = async (token: string | null) => {
    if (!token) return;
    setToken(token);
    setShowCaptcha(false);
    await handleSubmitAction();
    recaptchaRef.current?.reset();
    setToken(null);
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
    const formEl = formRef.current;
    if (!formEl) return;

    const formData = new FormData(formEl);

    formData.append("atPlace", "POPUP");
    formData.append("formName", "formweb-popup");
    formData.append("url", url);

    const data: Record<string, any> = {};
    formData.forEach((v, k) => (data[k] = v));

    try {
      setLoading(true);
      const res = await clientHttp(ApiResponseSchema(z.any()), {
        path: apiPath,
        method: "POST",
        body: data,
      });

      if (res.success) {
        toast.success("Gửi thành công!");
        onSuccess?.(res);
        formEl.reset();
        if (recaptchaRef.current) recaptchaRef.current.reset();
        setToken(null);
        setShowCaptcha(false);
      } else {
        alert(
          res.message ||
            "Có lỗi xảy ra vui lòng liên hệ qua fanpage để được hỗ trợ."
        );
        onError?.(res);
      }
    } catch (err: any) {
      console.error("Submit form error:", err);
      toast.warning(err.message?.message || "Lỗi hệ thống, vui lòng thử lại sau.");
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border bg-white shadow-md p-6 transition hover:shadow-lg ${
        layout === "sidebar" ? "w-full" : "max-w-2xl mx-auto"
      } ${className}`}
    >
      <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-600 mb-6">{description}</p>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        {fields.map((f) => (
          <div key={f.name} className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {f.label}
            </label>

            {/* Text, email, tel, number */}
            {["text", "email", "tel", "date"].includes(f.type) && (
              <input
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                required={f.required}
                className="rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            )}

            {/* Năm sinh (number input) */}
            {f.type === "year" && (
              <input
                type="number"
                name={f.name}
                min={f.min || 1950}
                max={f.max || new Date().getFullYear()}
                required={f.required}
                className="rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder={f.placeholder ? f.placeholder : "Ví dụ: 2000"}
              />
            )}

            {/* Textarea */}
            {f.type === "textarea" && (
              <textarea
                name={f.name}
                required={f.required}
                placeholder={f.placeholder}
                className="rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[80px]"
              />
            )}

            {/* Radio group */}
            {f.type === "radio" && f.options && (
              <div className="space-y-2">
                {f.options.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      placeholder={f.placeholder}
                      name={f.name}
                      value={opt.value}
                      required={f.required}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "linear-gradient(90deg, #7459a5 0%, #cb459a 100%)",
          }}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Đang gửi..." : submitText}
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
