"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  isIcon?: boolean;
}

export function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  className = "",
  isIcon = true,
}: FormInputProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const value = watch(name);
  const [isFocused, setIsFocused] = useState(false);
  const hasError = errors[name];

  // Tự động focus khi có lỗi
  useEffect(() => {
    if (hasError) {
      setIsFocused(true);
    }
  }, [hasError]);

  // Xác định khi nào hiển thị label ở vị trí trên cùng
  const shouldLabelFloat = isFocused || value;

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <div
        className={`relative border rounded-lg transition-all duration-200 ${
          hasError
            ? "border-red-500 shadow-sm shadow-red-100"
            : isFocused
            ? "border-blue-500 shadow-sm shadow-blue-100"
            : "border-gray-300"
        }`}
      >
        <label
          className={`absolute transition-all duration-200 pointer-events-none ${
            shouldLabelFloat
              ? "left-3 top-2 text-xs text-blue-600 bg-white px-1 -translate-y-1/2"
              : "left-10 top-1/2 transform -translate-y-1/2 text-gray-500"
          } ${hasError ? "text-red-500" : ""} origin-left ${
            isIcon ? "" : "!left-3"
          }`}
          style={{
            transformOrigin: "left center",
            transition: "transform 0.2s, top 0.2s, font-size 0.2s, left 0.2s",
          }}
        >
          {label}
        </label>
        <input
          {...register(name)}
          type={type}
          placeholder={isFocused ? placeholder : ""}
          className={`w-full pt-4 pb-3 px-3 rounded-lg focus:outline-none bg-transparent ${className}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {hasError && (
        <p className="text-red-500 text-sm flex items-center mt-1">
          <AlertCircle className="h-4 w-4 mr-1" />
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );
}
