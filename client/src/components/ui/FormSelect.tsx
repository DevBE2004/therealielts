"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface FormSelectProps {
  name: string;
  label: string;
  options: { label: string; value: string | number }[];
  className?: string;
  isIcon?: boolean;
}

export function FormSelect({
  name,
  label,
  options,
  className = "",
  isIcon = true,
}: FormSelectProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name);
  const [isFocused, setIsFocused] = useState(false);
  const hasError = errors[name];

  useEffect(() => {
    if (hasError) {
      setIsFocused(true);
    }
  }, [hasError]);

  const shouldLabelFloat = isFocused || value;

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <div
        className={`relative border rounded-lg transition-all duration-200 
        ${
          hasError
            ? "border-red-500 shadow-sm shadow-red-100"
            : isFocused
            ? "border-blue-500 shadow-sm shadow-blue-100"
            : "border-gray-300"
        }`}
      >
        <label
          className={`absolute transition-all duration-200 pointer-events-none
          ${
            shouldLabelFloat
              ? "left-3 top-2 text-xs text-blue-600 bg-white px-1 -translate-y-1/2"
              : "left-10 top-1/2 -translate-y-1/2 text-gray-500"
          }
          ${hasError ? "text-red-500" : ""}
          origin-left
          ${isIcon ? "" : "!left-3"}
        `}
        >
          {label}
        </label>

        <select
          {...register(name)}
          className={`w-full pt-4 pb-3 px-3 rounded-lg bg-transparent focus:outline-none ${className}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
