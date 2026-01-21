import { DiaLogCustom } from "@/components/ui/dialog-custom/dialog-custom";
import { HeaderService } from "@/services/header-config.service";
import { useState } from "react";
import { toast } from "react-toastify";

interface PopupCustomHeaderProps {
  open: boolean;
  onCancel: () => void;
  data?: any;
  onReset: () => void;
}
const PopupDeleteMenu = ({
  open,
  onCancel,
  data,
  onReset,
}: PopupCustomHeaderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleSave = async () => {
    try {
      setLoading(true);
      if (data?.id) {
        const res = await HeaderService.delete(data?.id);
        console.log("res==>", res);
        onReset();
        onCancel();
        toast.success("Xóa menu thành công!");
      }
      setLoading(false);
    } catch (err: any) {
      toast.warning(err.message?.mes || "Chỉ Admin mới có quyền xóa!");
      console.error(err);
      setLoading(false);
    }
  };
  return (
    <DiaLogCustom
      open={open}
      title={"Xóa menu"}
      description={`Bạn có thực sự muốn xóa menu ${data?.title}! Xóa xong sẽ không khôi phục lại được!`}
      onCancel={onCancel}
      onSave={handleSave}
      isDeleteBtn={true}
      loading={loading}
      textSave="Xóa"
    />
  );
};

export default PopupDeleteMenu;
