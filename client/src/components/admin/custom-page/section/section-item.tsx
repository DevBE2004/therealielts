import { Text } from "@/components/ui/text";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, PencilLine, X } from "lucide-react";
import { SectionType } from "../type";

interface SectionItemProps {
  data: SectionType;
  indexArr: string | number;
  actionDelete: (index: number) => void;
  actionEdit: (data: SectionType) => void;
}
const SectionItem = ({
  data,
  indexArr,
  actionDelete,
  actionEdit,
}: SectionItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${indexArr}`,
    // animateLayoutChanges: (args) => defaultAnimateLayoutChanges(args),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    opacity: isDragging ? 0.6 : 1,
  };
  console.log("data item==>", data);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex w-full items-center justify-between rounded-lg transition-colors select-none`}
    >
      <div className="flex items-center gap-2" {...attributes} {...listeners}>
        <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
        <Text weight={"medium"} className="text-[1rem]">
          {data?.name}
        </Text>
      </div>
      <div className="flex gap-3 z-10">
        <button
          className={`bg-slate-300 p-1.5 rounded-full cursor-pointer`}
          onClick={() => actionEdit(data)}
        >
          <PencilLine className={`size-5 text-blue-500`} />
        </button>
        <button
          className={`bg-slate-300 p-1.5 rounded-full cursor-pointer`}
          onClick={() => actionDelete(Number(indexArr))}
        >
          <X className={`size-5 text-red-500`} />
        </button>
      </div>
    </div>
  );
};

export default SectionItem;
