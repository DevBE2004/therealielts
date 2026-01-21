import { z } from "zod";

export const atPlaceEnum = z.enum(["POPUP", "FOOTER", "MAIN"]);
export const formNameEnum = z.enum(["formweb-footer", "formweb-popup", "formweb"]);

export const ConsultationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Số điện thoại phải đúng 10 chữ số"), // giả sử chuẩn VN 10 số
  yearOfBirth: z
    .string()
    .regex(/^\d{4}$/, "Năm sinh phải gồm 4 chữ số"),
  goal: z.string().min(1, "Mục tiêu là bắt buộc"),
  difficult: z.string().min(1, "Khó khăn là bắt buộc"),
  schedule: z.string().optional(),
  atPlace: atPlaceEnum.optional(),
  formName: formNameEnum.optional(),
  url: z.string().optional(),
});

export type ConsultationCreateRequest = z.infer<typeof ConsultationSchema>;
