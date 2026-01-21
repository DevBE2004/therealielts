import { DiaLogCustom } from "@/components/ui/dialog-custom/dialog-custom";
import { clientHttp } from "@/lib/clientHttp";
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
const PopupDeletePage = ({
  open,
  onCancel,
  data,
  onReset,
}: PopupCustomHeaderProps) => {
  // const methods = useForm({ resolver: yupResolver(formSchema) });

  const handleSave = async () => {
    try {
      if (data?.id) {
        const res = await clientHttp(z.any(), {
          method: "DELETE",
          path: `/common/delete/${data?.id}`,
        });
        console.log("res==>", res);
        onReset();
        onCancel();
      }
    } catch (err: any) {
      toast.warning(err.message?.mes || "Chỉ Admin mới có quyền xóa!");
      console.error(err);
    }
  };
  return (
    <DiaLogCustom
      open={open}
      title={"Xóa page"}
      description={`Bạn có thực sự muốn xóa item ${data?.title}! Xóa xong sẽ không khôi phục lại được!`}
      onCancel={onCancel}
      onSave={handleSave}
      isDeleteBtn={true}
      textSave="Xóa"
    />
  );
};

export default PopupDeletePage;
