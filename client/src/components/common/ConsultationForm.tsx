"use client";

import { clientHttp } from "@/lib/clientHttp";
import { ExamRegistrationService } from "@/services/examRegistration.service";
import { ApiResponseSchema } from "@/types";
import {
  ConsultationCreateRequest,
  ConsultationSchema,
} from "@/types/consultation";
import { Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  HiCalendar,
  HiChatAlt2,
  HiMail,
  HiPhone,
  HiUser,
} from "react-icons/hi";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import z from "zod";

export default function ConsultationForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [formData, setFormData] = useState<ConsultationCreateRequest>({
    name: "",
    mobile: "",
    email: "",
    yearOfBirth: "",
    goal: "",
    difficult: "",
    atPlace: "MAIN",
    formName: "formweb",
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
        console.log(error);
        // toast.error(error.message?.mes || "Không thể tải cấu hình reCAPTCHA");
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleCaptchaChange = async (token: string | null) => {
    // console.log("CAPTCHA Token handleCaptchachange: ", token)
    if (!token) return;
    setToken(token);
    await handleSubmitAction();
  };

  useEffect(() => {
    setUrl(window.location.href);
    setFormData((prev) => ({
      ...prev,
      url: url,
    }));
  }, [url]);

  const handleInputChange = (
    field: keyof ConsultationCreateRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // console.log("TOKEN CAPTCHA: ", token)
  // console.log("CAptcha CONFIGL: ", captchaEnabled)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (captchaEnabled && !token) {
      setShowCaptcha(true);
      toast.info("Vui lòng xác minh reCAPTCHA để tiếp tục");
      return;
    }

    await handleSubmitAction();
  };

  const handleSubmitAction = async () => {
    try {
      const res = await clientHttp(ApiResponseSchema(ConsultationSchema), {
        path: "/consultation/create",
        method: "POST",
        body: formData,
      });
      if (res?.success) {
        setSuccessMessage(
          "Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ sớm nhất."
        );
        setFormData({
          name: "",
          mobile: "",
          email: "",
          yearOfBirth: "",
          goal: "",
          difficult: "",
          schedule: "",
        });
        if (recaptchaRef.current) recaptchaRef.current.reset();
        setToken(null);
        setShowCaptcha(false);
      } else {
        alert(res?.message || "Có lỗi khi gửi form");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message?.message || "Lỗi hệ thống, vui lòng thử lại");
    }
  };

  const currentYear = new Date().getFullYear();
  const birthYears = Array.from({ length: 30 }, (_, i) => currentYear - 15 - i);

  return (
    <div className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-60 transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-60 transform -translate-x-32 translate-y-32"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-50 mb-4 uppercase">
                ĐĂNG KÝ NHẬN TƯ VẤN VÀ ƯU ĐÃI
              </h2>
              <p className="text-gray-600 text-lg">
                Hãy để chúng tôi giúp bạn xây dựng lộ trình học tập phù hợp nhất
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Two Column Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData?.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập họ và tên của bạn"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <HiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={formData?.mobile}
                        onChange={(e) =>
                          handleInputChange("mobile", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Birth Year */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bạn sinh năm
                    </label>
                    <div className="relative">
                      <HiCalendar
                        aria-hidden="true"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                      />
                      <select
                        id="yearOfBirth"
                        value={formData?.yearOfBirth}
                        onChange={(e) =>
                          handleInputChange("yearOfBirth", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                        required
                      >
                        <option value="" disabled>
                          Chọn năm sinh
                        </option>
                        {birthYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <div
                        aria-hidden="true"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={formData?.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập email của bạn"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* English Goal Radio Buttons */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Mục tiêu tiếng Anh của bạn là gì?
                </label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { value: "Xét tuyển Đại học", label: "Xét tuyển Đại học" },
                    { value: "Du học", label: "Du học" },
                    { value: "Phục vụ công việc", label: "Phục vụ công việc" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="goal"
                        value={option.value}
                        checked={formData?.goal === option.value}
                        onChange={(e) =>
                          handleInputChange("goal", e.target.value)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        required
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thời gian bạn có thể nhận cuộc gọi
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData?.schedule}
                    onChange={(e) =>
                      handleInputChange("schedule", e.target.value)
                    }
                    className="w-full rounded-lg border pl-10 pr-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ví dụ: Buổi sáng sau 8H, 8-11H, sau 17H,..."
                    required
                  />
                </div>
              </div>

              {/* Difficulties Textarea */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Khó khăn hiện tại của bạn là gì?
                </label>
                <div className="relative">
                  <HiChatAlt2 className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    value={formData?.difficult}
                    onChange={(e) =>
                      handleInputChange("difficult", e.target.value)
                    }
                    rows={4}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Mô tả những khó khăn bạn đang gặp phải khi học tiếng Anh..."
                  />
                </div>
              </div>
              {successMessage && (
                <p className="mt-4 text-green-600 font-semibold text-center">
                  {successMessage}
                </p>
              )}

              {/* Hiển thị captcha nếu bật và người dùng nhấn gửi */}
              {captchaEnabled && showCaptcha && (
                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={siteKey}
                    onChange={handleCaptchaChange}
                    onExpired={() => setToken(null)}
                  />
                </div>
              )}
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Gửi thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Floating Contact Buttons */}
    </div>
  );
}
