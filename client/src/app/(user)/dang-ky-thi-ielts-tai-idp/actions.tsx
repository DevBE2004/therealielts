import { ExamRegistrationSchema } from '@/types';
import { ExamRegistrationService } from '@/services/examRegistration.service';

export type IeltsRegisterState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function ieltsRegisterAction(
  prevState: IeltsRegisterState,
  formData: FormData
): Promise<IeltsRegisterState> {
  // Chuẩn hóa dữ liệu từ form
  const raw: any = {
    name: formData.get("name"),
    mobile: formData.get("mobile"),
    email: formData.get("email"),
    organization: formData.get("organization"),
    module: formData.get("module"),
    form: formData.get("form"),
    examDate: formData.get("examDate"),
    mailingAddress: formData.get("mailingAddress"),
    promotionalProduct: formData.get("promotionalProduct") || undefined,
    passport: formData.get("passport"),
    registrationObject: formData.get("registrationObject"),
    bill: formData.get("bill") as File | null,
    isConfirmed: formData.get("isConfirmed") === "true",
  };

  // Validate bằng Zod
  const parsed = ExamRegistrationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Dữ liệu không hợp lệ.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Rebuild FormData để call backend
  const fd = new FormData();
  for (const [k, v] of Object.entries(parsed.data)) {
    if (v === null || v === undefined) continue;
    if (v instanceof File) {
      fd.append(k, v); // file giữ nguyên
    } else if (typeof v === "boolean") {
      fd.append(k, String(v)); // boolean → "true"/"false"
    } else {
      fd.append(k, v as string);
    }
  }

  try {
    const res = await ExamRegistrationService.create(fd);
    return { ok: !!res?.success, message: res?.message ?? "Đăng ký thành công!" };
  } catch (e: any) {
    return { ok: false, message: e?.message ?? "Lỗi server." };
  }
}
