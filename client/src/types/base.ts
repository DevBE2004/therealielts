// ========================================
// BASE TYPES (Zod)
// ========================================

import { z } from "zod";

export const ForWebEnum = z.enum(["LINGOSPEAK", "THEREALIELTS", "PTEBOOSTER"]);

// ==========================
// Pagination Params
// ==========================
export const PaginationParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
});
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

// ==========================
// Base Response
// ==========================
export const BaseResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: schema.optional(),
    total: z.number().optional(),
  });

export type BaseResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  total?: number;
};

// ==========================
// API Response
// ==========================
/**
 * ApiResponse đặc thù cho backend của bạn,
 * có nhiều field chứa mảng entity khác nhau (users, courses, routes, ...)
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    mes: z.string(),
    data: schema.optional(),
    total: z.number().optional(),
    users: z.array(schema).optional(),
    user: schema.optional(),
    courses: z.array(schema).optional(),
    routes: z.array(schema).optional(),
    teachers: z.array(schema).optional(),
    teacher: schema.optional(),
    news: z.array(schema).optional(),
    documents: z.array(schema).optional(),
    examRegistrations: z.array(schema).optional(),
    studyAbroads: z.array(schema).optional(),
    partners: z.array(schema).optional(),
    honors: z.array(schema).optional(),
  });

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  total?: number;
  users?: T;
  courses?: T;
  routes?: T;
  teachers?: T;
  news?: T;
  documents?: T;
  examRegistrations?: T;
  studyAbroads?: T;
  partners?: T;
  honors?: T;
};

// ==========================
// Image Schema
// ==========================

const allowedImageTypes = ["image/png", "image/webp"];

export const ImageSchema = z
  .instanceof(File, { message: "Vui lòng chọn ảnh" })
  .refine((file) => allowedImageTypes.includes(file.type), {
    message: "Chỉ chấp nhận PNG hoặc WEBP",
  })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Dung lượng tối đa 5MB",
  });

export type BaseImage = z.infer<typeof ImageSchema>;

// MetaData Schema
export const metaDataSchema = z.object({
  metaTitle: z
    .string()
    .min(30, "Meta title phải có ít nhất 30 ký tự")
    .max(60, "Meta title không được vượt quá 60 ký tự"),

  metaDescription: z
    .string()
    .min(50, "Meta description phải có ít nhất 50 ký tự")
    .max(160, "Meta description không được vượt quá 160 ký tự"),
  metaKeywords: z
    .string()
    .trim()
    .max(255, "Meta keywords không được vượt quá 255 ký tự")
    .optional()
    .or(z.literal("")),
  section: z.array(z.object()).optional(),
});

// Slug
export const slugSchema = z
  .string()
  .min(3, "Slug phải có ít nhất 3 ký tự")
  .max(60, "Slug không được vượt quá 60 ký tự")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang",
  });
