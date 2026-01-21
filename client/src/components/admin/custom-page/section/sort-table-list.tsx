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
  onUpdate: (newItems: T[]) => void;
}

export const SortableList = <T extends { orderIndex?: number }>({
  items,
  renderItem,
  onUpdate,
}: SortableListProps<T>) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    console.log("active, over", active, over);

    const oldIndex = items.findIndex(
      (i) => i.orderIndex?.toString() === active.id
    );
    const newIndex = items.findIndex(
      (i) => i.orderIndex?.toString() === over.id
    );

    const newItems: T[] = arrayMove(items, oldIndex, newIndex);
    // .map(
    //   (item, idx) => ({
    //     ...item,
    //     // orderIndex: idx + 1,
    //   })
    // );

    onUpdate(newItems);
    return newItems;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => `${item?.orderIndex}`)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <div
            className="py-1.5"
            key={`${item?.orderIndex}`}
            id={`${item?.orderIndex}`}
          >
            {renderItem(item)}
          </div>
        ))}
      </SortableContext>
    </DndContext>
  );
};
