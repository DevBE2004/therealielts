"use client";

import { ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

interface SortableListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  onUpdate: (newItems: T[], id?: string) => void;
}

export const SortableList = <T extends { id?: string; orderIndex?: number }>({
  items,
  renderItem,
  onUpdate,
}: SortableListProps<T>) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(
      (i) => i?.id && i?.id.toString() === active.id
    );
    const newIndex = items.findIndex(
      (i) => i?.id && i?.id.toString() === over.id
    );

    const newItems = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      orderIndex: idx + 1, // cập nhật orderIndex mới
    }));

    onUpdate(newItems, `${active.id}`);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => (item?.id ? item.id.toString() : ""))}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <div key={item.id} id={item?.id?.toString()} className="py-1.5">
            {renderItem(item)}
          </div>
        ))}
      </SortableContext>
    </DndContext>
  );
};
