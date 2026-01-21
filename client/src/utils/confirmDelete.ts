// utils/confirmDelete.ts
import Swal from "sweetalert2";

export const confirmDelete = async (title = "Bạn có chắc muốn xóa?", text = "Thao tác này không thể hoàn tác!", confirmButtonText = "Xóa ngay",) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e3342f",
    cancelButtonColor: "#6c757d",
    confirmButtonText,
    cancelButtonText: "Hủy",
    reverseButtons: true,
    focusCancel: true,
  });
  return result.isConfirmed;
};
