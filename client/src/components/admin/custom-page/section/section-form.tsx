import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectPage, updatePage } from "@/store/page-slice";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SectionType } from "../type";
import PopupCustomSection from "./custom-section";
import SectionItem from "./section-item";
import { SortableList } from "./sort-table-list";

const SectionForm = () => {
  // const sensors = useSensors(useSensor(PointerSensor));
  const { data: page } = useAppSelector(selectPage);
  const section = page?.section || [];
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [itemSelect, setItemSelect] = useState<SectionType>({});

  const handleUpdateSection = (arr: SectionType[]) => {
    dispatch(updatePage({ ...page, section: arr }));
  };
  // const handleDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;
  //   if (!over || active.id === over.id) return;
  //   const oldIndex = parseInt(active.id.toString().split("-").pop() || "0", 10);
  //   const newIndex = parseInt(over.id.toString().split("-").pop() || "0", 10);
  //   const newChildren: SectionType[] = arrayMove(
  //     section,
  //     oldIndex,
  //     newIndex
  //   ).map((item, idx) => ({
  //     ...item,
  //     orderIndex: idx + 1,
  //   }));
  //   handleUpdateSection(newChildren);
  // };

  function addByPath(value: { data: SectionType; type: "UPDATE" | "CREATE" }) {
    console.log("checklog===> ", value);
    setItemSelect({});
    const current = [...section];

    // ===================== UPDATE =====================
    if (value.type === "UPDATE") {
      const idx = current.findIndex(
        (item) => item.orderIndex === value.data.orderIndex
      );

      if (idx !== -1) {
        current[idx] = { ...current[idx], ...value.data };
        handleUpdateSection(current);
        return;
      }
    }

    // ===================== CREATE =====================
    console.log("current==>", current);

    handleUpdateSection([
      ...current,
      {
        ...value.data,
        orderIndex: current.length + 1,
      },
    ]);
  }

  const handleDelete = (idx: number) => {
    const sectionFilter = section?.filter((_, index: number) => idx !== index);
    handleUpdateSection(sectionFilter);
  };

  const handleEdit = (data: SectionType) => {
    setOpen(true);
    setItemSelect(data);
  };
  console.log("?section", section);

  return (
    <div className="flex flex-col gap-4">
      <SortableList
        items={section}
        onUpdate={handleUpdateSection}
        renderItem={(item) => (
          <SectionItem
            key={item?.orderIndex}
            indexArr={item?.orderIndex || ""}
            data={item}
            actionDelete={handleDelete}
            actionEdit={handleEdit}
          />
        )}
      />
      <Button
        variant="ghost"
        className={`flex flex-row w-full rounded-md cursor-pointer justify-center items-center p-2 border-[2px] border-[#0063C5] border-solid`}
        onClick={() => setOpen(true)}
      >
        <Plus className="text-blue-500" />
        <Text
          type="base"
          className=" text-center text-blue-500"
          weight="regular"
        >
          Thêm item
        </Text>
      </Button>
      <PopupCustomSection
        open={open}
        onCancel={() => setOpen(false)}
        data={itemSelect}
        onSave={addByPath}
      />
    </div>
  );
};

export default SectionForm;
