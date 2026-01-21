"use client";
import { cn } from "@/lib/utils";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { ReactNode, useState } from "react";

interface RightContentProps {
  children: ReactNode;
  type?: "NEWS" | "DESIGN";
}
const PanelContainer = ({ children, type = "DESIGN" }: RightContentProps) => {
  const [collapsed, setCollapsed] = useState(true);

  const handleCollapsed = (collapse: boolean) => {
    setCollapsed(!collapse);
  };

  return (
    <div
      className={cn(
        "px-4 relative transition-all duration-500 ease-in-out h-[calc(100vh-250px)]",
        collapsed ? "w-96 " : "w-28"
      )}
    >
      {false && (
        <div
          hidden
          onClick={() => handleCollapsed(collapsed)}
          className={cn(
            "bg-white hover:bg-slate-50 flex justify-center cursor-pointer rounded-md py-4"
          )}
        >
          {collapsed ? <ChevronsRight /> : <ChevronsLeft />}
        </div>
      )}
      <div
        hidden={!collapsed}
        className={cn(
          "h-full overflow-y-auto",
          type === "DESIGN" ? "mt-8" : "mt-14"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default PanelContainer;
