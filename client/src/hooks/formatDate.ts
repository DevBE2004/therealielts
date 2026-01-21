import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function formatDateVi(date: string | Date, pattern = "dd/MM/yyyy") {
  return format(new Date(date), pattern, { locale: vi });
}