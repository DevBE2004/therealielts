import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

type SortableReturn = ReturnType<typeof useSortable>;

interface SortableTabItemProps {
  id: string | number;
  children: (props: {
    listeners: SortableReturn["listeners"];
  }) => React.ReactNode;
}

export default function SortableTabItem({
  id,
  children,
}: SortableTabItemProps) {
  const sortable = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  return (
    <div ref={sortable.setNodeRef} style={style} {...sortable.attributes}>
      {children({ listeners: sortable.listeners })}
    </div>
  );
}
