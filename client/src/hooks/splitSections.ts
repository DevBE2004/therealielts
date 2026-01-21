/**
 * Phân tách chuỗi mô tả thành từng đoạn.
 * - Cắt theo dòng (\n)
 * - Trim bỏ khoảng trắng thừa
 * - Bỏ các dòng rỗng
 */
export function splitSections(text?: string): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/) // tách theo xuống dòng
    .map((s) => s.trim()) // bỏ khoảng trắng đầu/cuối
    .filter(Boolean); // bỏ dòng rỗng
}
