import { DiaLogCustom } from "@/components/ui/dialog-custom/dialog-custom";

import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import { toast } from "react-toastify";
import z from "zod";

interface PopupCustomHeaderProps {
  open: boolean;
  onCancel: () => void;
  data?: any;
  onReset: () => void;
}
// const formSchema = yup.object({
//   note: yup.string().required("Vui lòng nhập lý do xóa!"),
// });
const PopupActivatePage = ({
  open,
  onCancel,
  data,
  onReset,
}: PopupCustomHeaderProps) => {
  // const methods = useForm({ resolver: yupResolver(formSchema) });

  const handleSave = async () => {
    try {
      if (data?.id) {
        const param = new FormData();
        param.append("title", data?.title);
        param.append("slug", data?.slug);
        param.append("metaData", JSON.stringify(data?.metaData));
        param.append("isActive", data?.isActive ? "false" : "true");
        param.append("type", "PAGE");

        const res = await clientHttp(ApiResponseSchema(z.any()), {
          path: `/common/update/${data?.id}`,
          method: "PUT",
          body: param,
        });
        if (res?.success) {
          toast.success(`Cập nhật trạng thái page thành công!`);
          onReset();
          onCancel();
        } else {
          toast.warning("Cập nhật trạng thái page thất bại!");
        }
      }
    } catch (err: any) {
      toast.warning(err.message?.mes || "Chỉ Admin mới có quyền update!");
      console.error(err);
    }
  };
  console.log("data popup activate==>", data);

  return (
    <DiaLogCustom
      open={open}
      title={"Update trạng thái page"}
      description={
        data?.isActive
          ? `Bạn có thực sự muốn inactivate item ${data?.title}! Inactivate xong page sẽ không hiển thị trên web!`
          : `Bạn có thực sự muốn activate item ${data?.title}! Activate xong page sẽ có thể hiển thị trên web!`
      }
      onCancel={onCancel}
      onSave={handleSave}
      isDeleteBtn={data?.isActive}
      textSave={data?.isActive ? "Inactivate" : "Activate"}
    />
  );
};

export default PopupActivatePage;
