import { Text } from "@/components/ui/text";
import { HeaderConfigType, ParamHeaderType } from "./types";
import SectionItem from "../custom-page/section/section-item";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ImagePlus,
  ListCollapse,
  Trash2,
  Upload,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, z } from "zod";
import { HeaderService } from "@/services/header-config.service";
import { Button } from "@/components/ui/button";
import PopupConfigHeader from "./components/popup-add-header";
import PopupDeleteMenu from "./components/popup-delete";
import { toast } from "react-toastify";
import MenuItem from "./components/menu-item";
import { SortableList } from "./components/sort-table-list";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";

const allowedImageTypes = ["image/png", "image/webp", "image/jpeg"];
// Cấu hình Cloudinary
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;

const formSchema = z.object({
  images: z.string().optional(),
});

//------------------------ Main Component -----------------------//
const HeaderClientPage = () => {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: "",
    },
  });

  const {
    formState: { errors },
    setValue,
    getValues,
  } = methods;

  const [preview, setPreview] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSelect, setDataSelect] = useState<HeaderConfigType>({});
  const [dataHeader, setDataHeader] = useState<HeaderConfigType[]>([]);

  useEffect(() => {
    fetchHeaderList();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await clientHttp(ApiResponseSchema(z.any()), {
        path: `/introduce/7`,
        method: "GET",
      });
      console.log("RES: ", res.data.section1);
      if (res?.data?.section1) {
        const section1 =
          typeof res.data.section1 === "string"
            ? JSON.parse(res.data.section1)
            : res.data.section1;
        setPreview(section1.logo || null);
        setValue("images", section1.logo || "");
      }
    } catch (err: any) {
      console.error("err: ", err);
      toast.error(err.message?.mes || "Không thể tải cấu hình reCAPTCHA");
    } finally {
      setLoading(false);
    }
  };
  const fetchHeaderList = async () => {
    const res = await HeaderService.getList();
    console.log("headers===>", res);
    if (res?.success) {
      setDataHeader(res?.data || []);
    } else {
      setDataHeader([]);
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!allowedImageTypes.includes(file.type)) {
      alert("Chỉ cho phép ảnh PNG, JPG, WEBP!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("Cloudinary upload result:", result);

      const imageUrl = result.secure_url;

      // Lưu vào form
      setValue("images", imageUrl);

      // Preview
      setPreview(imageUrl);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      alert("Upload ảnh thất bại!");
    }
  };
  const handleDragDrop = async (newItems: HeaderConfigType[], id?: string) => {
    // Cập nhật lại orderIndex dựa trên vị trí mới
    console.log("newItems after drag drop===>", id, newItems);

    const updatedItems = newItems.map((item, index) => ({
      ...item,
      orderIndex: index + 1,
    }));
    setDataHeader(updatedItems);
    // Gửi cập nhật lên server nếu cần
    const newOrderedItem = updatedItems.find(
      (item) => item.id?.toString() === id
    );

    // updateMenu();
    try {
      const res = await HeaderService.update(id || "", {
        children: newOrderedItem?.children || [],
        orderIndex: newOrderedItem?.orderIndex,
        slug: newOrderedItem?.slug,
        title: newOrderedItem?.title,
      } as ParamHeaderType);
      if (res?.success) {
        setOpen(false);
      } else {
        toast.error("Cập nhật vị trí thất bại!");
      }
      setLoading(false);
    } catch (error) {
      console.log("error update menu===>", error);
      setLoading(false);
    }
  };
  const removeImage = () => {
    setPreview(null);
    setValue("images", "");
  };

  const createNewHeader = () => {
    setOpen(true);
    setDataSelect({});
  };

  const updateHeader = (data: HeaderConfigType) => {
    setOpen(true);
    setDataSelect(data);
  };

  const deleteHeader = (data: HeaderConfigType) => {
    setOpenDelete(true);
    setDataSelect(data);
  };
  const handleSaveMenu = (value: {
    type: "CREATE" | "UPDATE";
    id?: string | number | undefined;
    data: HeaderConfigType;
  }) => {
    console.log("value save menu===>", value);

    setLoading(true);
    if (value.type === "CREATE") {
      createMenu(value.data as ParamHeaderType);
    } else if (value.type === "UPDATE") {
      updateMenu(value.data as ParamHeaderType, value.id as string);
    }
  };

  const createMenu = async (data: ParamHeaderType) => {
    try {
      const res = await HeaderService.create({
        ...data,
        orderIndex: dataHeader.length + 1,
      });
      if (res?.success) {
        fetchHeaderList();
        toast.success("Tạo mới menu thành công!");
        setOpen(false);
      } else {
        toast.error("Tạo mới menu thất bại!");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const updateMenu = async (data: ParamHeaderType, id: string) => {
    try {
      const res = await HeaderService.update(id, data);
      if (res?.success) {
        fetchHeaderList();
        toast.success("Cập nhật menu thành công!");
        setOpen(false);
      } else {
        toast.error("Cập nhật menu thất bại!");
      }
      setLoading(false);
    } catch (error) {
      console.log("error update menu===>", error);
      setLoading(false);
    }
  };

  const handleUpdateImage = async () => {
    try {
      setLoading(true);
      const values = getValues();
      const imageUrl = values.images || "";
      const formData = new FormData();
      formData.append("section1", JSON.stringify({ logo: imageUrl }));
      const res = await clientHttp(ApiResponseSchema(z.any()), {
        path: `/introduce/update/7`,
        method: "PUT",
        body: formData,
      });
      if (res?.success) {
        setOpen(false);
        toast.success("Cập nhật logo thành công!");
      } else {
        toast.error("Cập nhật logo thất bại!");
      }
      setLoading(false);
    } catch (error) {
      console.log("error update menu===>", error);
      setLoading(false);
    }
  };
  return (
    <div className="grid gap-6">
      <Text weight={"medium"} className="font-medium text-lg">
        Cấu hình Header Client
      </Text>

      <section className="col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
        <header className="mb-5 flex justify-between items-center gap-2 border-b pb-3">
          <div className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Tải lên logo header</h2>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 justify-center text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
            onClick={handleUpdateImage}
            disabled={!preview || loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : null}
            {"Cập nhật logo"}
          </Button>
        </header>

        <div className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-400">
            <Upload className="h-6 w-6" />
            <span className="text-sm text-gray-600">
              Kéo & thả ảnh vào đây hoặc nhấn để chọn
            </span>
            <input
              type="file"
              accept="image/png,image/webp,image/jpeg"
              onChange={handleUploadFile}
              className="hidden"
            />
          </label>

          {errors.images && (
            <p className="text-base text-red-500">
              {errors.images.message as string}
            </p>
          )}

          {/* Preview 1 ảnh */}
          {preview && (
            <div className="relative w-full max-w-xs overflow-hidden rounded-xl bg-[length:20px_20px] bg-[repeating-conic-gradient(#e5e7eb_0_25%,transparent_0_50%)] bg-[white] border border-[#D1D1D6] [background-position:0_0]">
              <img
                src={preview}
                alt="preview"
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                onClick={removeImage}
                title="Xóa ảnh"
                className="absolute cursor-pointer right-2 top-2 rounded-full bg-white/90 p-2 shadow-sm"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
        <header className="mb-5 flex items-center justify-between gap-2 border-b pb-3">
          <div className="flex items-center gap-2">
            <ListCollapse className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Menu</h2>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 justify-center text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
            onClick={createNewHeader}
          >
            {"Thêm mới menu"}
          </Button>
        </header>
        <div>
          <SortableList<HeaderConfigType>
            items={dataHeader
              ?.slice() // copy để tránh mutate
              .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))}
            onUpdate={handleDragDrop}
            renderItem={(item) => (
              <MenuItem
                key={item?.id}
                indexArr={item?.id || ""}
                data={item}
                actionDelete={() => deleteHeader(item)}
                actionEdit={() => updateHeader(item)}
              />
            )}
          />
        </div>
      </section>
      <PopupConfigHeader
        open={open}
        onCancel={() => setOpen(false)}
        loading={loading}
        onSave={handleSaveMenu}
        data={dataSelect}
      />
      <PopupDeleteMenu
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        onReset={fetchHeaderList}
        data={dataSelect}
      />
    </div>
  );
};

export default HeaderClientPage;
