import { TinyEditor } from "@/components/editor";
import CollapsibleBase from "@/components/ui/collapsible/collapsible-custom";
import { DiaLogCustom } from "@/components/ui/dialog-custom/dialog-custom";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  ImagePlus,
  ListPlus,
  PencilLine,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { ContentType, SectionType, TabConfig } from "../type";
import PopupCustomTab from "./popup-custom-tab";
import SectionItem from "./section-item";
import { SortableList } from "./sort-table-list";
import SortableTabItem from "./SortableTabItem";

// Cấu hình Cloudinary
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;

interface PopupCustomHeaderProps {
  open: boolean;
  onSave: (value: { data: SectionType; type: "UPDATE" | "CREATE" }) => void;
  onCancel: () => void;
  data?: SectionType;
  isTab?: boolean;
}
const allowedImageTypes = ["image/png", "image/webp"];

const formSchema = z.object({
  title: z.string(),
  type: z.string(),
  link: z.string().optional(),
  editor: z.string().optional(),
  images: z.array(z.string()),
  tab: z.array(z.any()).optional(),
});
const PopupCustomSection = ({
  open,
  onCancel,
  onSave,
  data,
  isTab = true,
}: PopupCustomHeaderProps) => {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      link: "",
      editor: "",
      images: [],
      tab: [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
  } = methods;
  const title = watch("title");
  const type = watch("type");

  const isSaveDisabled = !title || !type;

  const [images, setImages] = useState<File[]>([]);
  const [openTabPopup, setOpenTabPopup] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<TabConfig>({});
  const [previews, setPreviews] = useState<string[]>([]);
  const [openSectionPopup, setOpenSectionPopup] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionType>({});
  const [currentTabIndex, setCurrentTabIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data && open) {
      methods.setValue("type", data?.type || "");
      methods.setValue("title", data?.name || "");
      methods.setValue("editor", data?.text || "");
      methods.setValue("link", data?.link || "");
      methods.setValue("tab", data?.tab || []);
      methods.setValue("images", data?.images || []);
      setPreviews(data?.images || []);
    }
  }, [data]);

  const handleSave = () => {
    const values = methods.getValues();
    const tabFomatted = values?.tab?.map((tab, idx) => ({
      ...tab,
      orderIndex: idx + 1,
    }));
    onSave({
      type: data?.orderIndex ? "UPDATE" : "CREATE",
      data: {
        name: values?.title,
        text: values?.editor,
        link: values?.link,
        tab: tabFomatted,
        type: values.type as ContentType,
        images: values?.images,
        orderIndex: data?.orderIndex,
      },
    });
    onCancel();
    reset();
  };

  // ----- Image handlers -----

  const removeImage = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    setImages(next);

    const urls = next.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    setValue("images", urls);
  };
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArr = Array.from(files);

    for (const file of fileArr) {
      // Validate type
      if (!allowedImageTypes.includes(file.type)) {
        alert("Chỉ cho phép ảnh PNG hoặc WEBP!");
        continue;
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

        // ✅ link cloudinary trả về
        const imageUrl = result.secure_url;

        // Update form field images
        const current = methods.getValues("images") || [];
        const nextImages = [...current, imageUrl].slice(0, 5);

        methods.setValue("images", nextImages);

        // Update preview
        setPreviews((prev) => [...prev, imageUrl].slice(0, 5));
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        alert("Upload ảnh thất bại!");
      }
    }
  };

  useEffect(() => {
    if (!open) {
      reset();
      setImages([]);
      setPreviews([]);
    }
  }, [open]);

  // ================= TAB LOGIC ===================

  // Thêm tab
  const addTab = (tab: TabConfig) => {
    const current = methods.getValues("tab") || [];
    methods.setValue("tab", [
      ...current,
      { ...tab, orderIndex: current?.length + 1 },
    ]);
  };

  // Cập nhật tab
  const updateTab = (tab: TabConfig) => {
    const current = methods.getValues("tab") || [];

    if (typeof tab.orderIndex === "number") {
      const index = current.findIndex(
        (item: TabConfig) => item.orderIndex === tab.orderIndex
      );

      if (index === -1) return;

      current[index] = {
        ...current[index],
        title: tab?.title,
        subTitle: tab?.subTitle,
        description: tab?.description,
      };

      methods.setValue("tab", [...current]);
    }
  };

  // Xoá tab
  const removeTab = (idx: number) => {
    const current = methods.getValues("tab") || [];
    methods.setValue(
      "tab",
      current.filter((_, i) => i !== idx)
    );
  };

  // ================= DRAG TAB ===================
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEndTab = ({ active, over }: any) => {
    if (!over) return;
    const current = methods.getValues("tab") || [];

    const oldIndex = current.findIndex(
      (i) => i.orderIndex?.toString() === active.id
    );
    const newIndex = current.findIndex(
      (i) => i.orderIndex?.toString() === over.id
    );

    const sorted = arrayMove(current, oldIndex, newIndex);

    methods.setValue("tab", sorted);
  };

  // Xoá section trong listSection
  const handleDelete = (sectionId: string, tabId?: string) => {
    const currentTabs = methods.getValues("tab") || [];

    // ===== Xoá section trong tab =====
    if (tabId) {
      const tabIndex = currentTabs.findIndex((t) => t.id === tabId);
      if (tabIndex === -1) return;

      const tab = currentTabs[tabIndex];
      if (!tab.listSection) return;

      // Lọc bỏ section theo id
      const updatedList = tab.listSection.filter(
        (section: SectionType) => section.orderIndex?.toString() !== sectionId
      );

      currentTabs[tabIndex] = {
        ...tab,
        listSection: updatedList,
      };

      methods.setValue("tab", [...currentTabs]);
      return;
    }
  };

  // Chỉnh sửa section trong listSection
  const handleEdit = (sectionData: SectionType, tabIndex?: number) => {
    console.log("Editing section:", sectionData, "Tab index:", tabIndex);

    setSelectedSection({
      ...sectionData,
      // đảm bảo có orderIndex để biết đang sửa cái nào
      orderIndex: sectionData.orderIndex,
    });

    if (typeof tabIndex === "number") {
      setCurrentTabIndex(tabIndex);
    } else {
      setCurrentTabIndex(null);
    }

    setOpenSectionPopup(true);
  };

  console.log("check log tab", watch("tab"));

  return (
    <DiaLogCustom
      open={open}
      title="Cấu hình section"
      width="max-w-[90%]"
      onCancel={onCancel}
      onSave={methods.handleSubmit(handleSave)}
      textSave={data?.orderIndex ? "Update" : "Thêm"}
      disabledSave={isSaveDisabled}
      content={
        <div className="grid gap-3 grid-cols-2">
          <FormProvider {...methods}>
            <FormInput
              placeholder="Nhập tên section"
              label="Tên section"
              name="title"
            />
            <FormSelect
              name="type"
              className="cursor-pointer"
              label="Chọn loại section"
              options={[
                { label: "Banner", value: "BANNER" },
                { label: "Content ảnh trái", value: "CONTENT_LEFT" },
                { label: "Content ảnh phải", value: "CONTENT_RIGHT" },
                { label: "Ảnh", value: "IMAGE" },
                ...(isTab ? [{ label: "Tab", value: "TAB" }] : []),
              ]}
            />
            {watch("type") === "TAB" ? (
              <section className="col-span-2 rounded-xl border bg-white p-4 mt-4">
                <header className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-lg">Danh sách Tab</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTab({});
                      setOpenTabPopup(true);
                    }}
                    className="flex cursor-pointer px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm"
                  >
                    <Plus className="size-5" />
                    Thêm tab
                  </button>
                </header>
                <DndContext sensors={sensors} onDragEnd={handleDragEndTab}>
                  <SortableContext
                    items={(watch("tab") || []).map(
                      (tab) => `${tab?.orderIndex}`
                    )}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-2">
                      {(watch("tab") || []).map(
                        (item: TabConfig, index: number) => (
                          <CollapsibleBase
                            key={index}
                            title={
                              <SortableTabItem
                                key={`${item?.orderIndex}`}
                                id={`${item?.orderIndex}`}
                              >
                                {({ listeners }) => (
                                  <div className="flex flex-1 justify-between items-center rounded-md p-3">
                                    {/* Drag Handle */}
                                    <div
                                      className="cursor-grab pr-2"
                                      {...listeners}
                                    >
                                      ☰
                                    </div>

                                    {/* Nội dung tab */}
                                    <div className="flex-1">
                                      <p className="font-medium">
                                        {item?.title || "Không tên"}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {item?.subTitle}
                                      </p>
                                    </div>

                                    <div className="flex gap-3">
                                      <button
                                        className="bg-blue-500 p-1.5 rounded-full cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCurrentTabIndex(index); // Lưu index của tab hiện tại
                                          setSelectedSection({}); // Thêm mới section => để trống
                                          setOpenSectionPopup(true); // Mở popup
                                        }}
                                      >
                                        <ListPlus className="size-5 text-blue-200" />
                                      </button>
                                      <button
                                        className={`bg-slate-300 p-1.5 rounded-full cursor-pointer`}
                                        onClick={(e) => {
                                          console.log("có vào đây à");
                                          e.stopPropagation();
                                          setSelectedTab({
                                            ...item,
                                          });
                                          setOpenTabPopup(true);
                                        }}
                                      >
                                        <PencilLine
                                          className={`size-5 text-blue-500`}
                                        />
                                      </button>
                                      <button
                                        className={`bg-slate-300 p-1.5 rounded-full cursor-pointer`}
                                        onClick={() => removeTab(index)}
                                      >
                                        <X className={`size-5 text-red-500`} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </SortableTabItem>
                            }
                            description={
                              <div className="flex flex-col gap-4 bg-gray-50 p-3">
                                <SortableList
                                  items={item.listSection || []}
                                  onUpdate={(newSections) => {
                                    const currentTabs =
                                      methods.getValues("tab") || [];
                                    currentTabs[index].listSection =
                                      newSections.map((s, idx) => ({
                                        ...s,
                                        orderIndex: idx + 1,
                                      }));
                                    console.log(
                                      "newSections",
                                      currentTabs,
                                      "===>",
                                      newSections
                                    );

                                    methods.setValue("tab", [...currentTabs]);
                                  }}
                                  renderItem={(sectionItem) => (
                                    <SectionItem
                                      key={`${sectionItem?.orderIndex}`}
                                      indexArr={`${sectionItem?.orderIndex}`}
                                      data={sectionItem}
                                      actionDelete={() =>
                                        handleDelete(
                                          `${sectionItem?.orderIndex}`,
                                          `${item?.orderIndex}`
                                        )
                                      }
                                      actionEdit={() =>
                                        handleEdit(sectionItem, index)
                                      }
                                    />
                                  )}
                                />
                              </div>
                            }
                          />
                        )
                      )}
                    </div>
                  </SortableContext>
                </DndContext>

                {openSectionPopup && currentTabIndex !== null && (
                  <PopupCustomSection
                    open={openSectionPopup}
                    data={selectedSection}
                    isTab={false}
                    onCancel={() => {
                      setOpenSectionPopup(false);
                      setSelectedSection({});
                      setCurrentTabIndex(null);
                    }}
                    onSave={({ data: newSection, type }) => {
                      const currentTabs = methods.getValues("tab") || [];
                      const tab = currentTabs[currentTabIndex];

                      if (!tab.listSection) tab.listSection = [];
                      console.log("check newSection", newSection);

                      if (type === "CREATE") {
                        tab.listSection.push({
                          ...newSection,
                          orderIndex: tab.listSection.length + 1,
                        });
                      } else if (type === "UPDATE") {
                        const idx = (newSection.orderIndex ?? 1) - 1;

                        if (idx >= 0 && idx < tab.listSection.length) {
                          tab.listSection[idx] = {
                            ...tab.listSection[idx],
                            ...newSection,
                          };
                        }
                      }

                      // Cập nhật lại tab
                      currentTabs[currentTabIndex] = tab;
                      methods.setValue("tab", [...currentTabs]);

                      // Đóng popup
                      setOpenSectionPopup(false);
                      setSelectedSection({});
                      setCurrentTabIndex(null);
                    }}
                  />
                )}
              </section>
            ) : (
              <>
                <FormInput
                  placeholder="Nhập tên link"
                  label="Link ảnh"
                  name="link"
                />
                <div className="col-span-2">
                  <TinyEditor
                    initialValue={methods.getValues("editor")}
                    onContentChange={(content: string) =>
                      methods.setValue("editor", content)
                    }
                  />
                </div>
                <section className="col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
                  <header className="mb-5 flex items-center gap-2 border-b pb-3">
                    <ImagePlus className="h-5 w-5 text-gray-700" />
                    <h2 className="text-lg font-semibold">Tải lên hình ảnh</h2>
                  </header>

                  <div className="space-y-4">
                    {/* Drop zone style input */}
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-400">
                      <Upload className="h-6 w-6" />
                      <span className="text-sm text-gray-600">
                        Kéo & thả ảnh vào đây hoặc nhấn để chọn
                      </span>
                      <input
                        type="file"
                        multiple
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

                    {/* Previews */}
                    {previews !== undefined && previews.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {previews.map((url, idx) => (
                          <div
                            key={idx}
                            className="group relative overflow-hidden rounded-xl border bg-gray-50"
                          >
                            <div className="aspect-[4/3] w-full">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={url}
                                alt={`preview-${idx}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              title="Xóa ảnh"
                              className="absolute cursor-pointer right-2 top-2 rounded-full bg-white/90 p-2 opacity-0 shadow-sm transition group-hover:opacity-100"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 hidden items-center justify-between bg-gradient-to-t from-black/50 to-transparent px-3 py-2 text-xs text-white group-hover:flex">
                              <span>Ảnh {idx + 1}</span>
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
            <PopupCustomTab
              open={openTabPopup}
              data={selectedTab}
              onCancel={() => setOpenTabPopup(false)}
              onSave={({ type, data }) => {
                console.log("checkk", type, data);

                if (type === "CREATE") {
                  addTab(data);
                } else {
                  updateTab(data);
                }
              }}
            />
          </FormProvider>
        </div>
      }
    />
  );
};

export default PopupCustomSection;
