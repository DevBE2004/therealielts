"use client";
import { ReactNode, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleCustomProps {
  title: ReactNode | string;
  colorTitle?: string;
  description: ReactNode | string;
  defaultOpen?: boolean;
  iconDown?: ReactNode;
  iconUp?: ReactNode;
  isActive?: boolean;
  classTrigger?: string;
}

const CollapsibleBase = ({
  title,
  description,
  defaultOpen,
  iconDown,
  iconUp,
  isActive,
  colorTitle,
  classTrigger,
}: CollapsibleCustomProps) => {
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const handleChange = () => {
    setIsDropdown(!isDropdown);
  };
  return (
    <div className="border-b border-[#DEE5EF] w-full">
      <Collapsible
        defaultOpen={defaultOpen}
        open={isDropdown}
        onOpenChange={handleChange}
        className="w-full"
      >
        <CollapsibleTrigger className="w-full cursor-pointer">
          <div
            className={cn(
              "flex gap-2 items-center justify-between py-4 text-start",
              isActive && "p-3",
              classTrigger,
              isActive &&
                isDropdown &&
                "text-[#00538E] border border-blue-200 rounded-[0.5rem] mb-3"
            )}
          >
            <div
              className={cn(
                "text-[1.125rem] font-medium text-[#505F79] flex-1",
                isActive && isDropdown ? "text[#00538E]" : colorTitle
              )}
            >
              {title}
            </div>
            <div>
              {isDropdown ? iconUp : iconDown}
              {!iconUp && !iconDown && (
                <ChevronDown
                  color={isActive && isDropdown ? "#00538E" : "#888888"}
                  className={cn("transform transition-transform duration-300", {
                    "rotate-180": isDropdown,
                    "rotate-0": !isDropdown,
                  })}
                />
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="transition-all data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[0.875rem] font-regular text-[#596481]">
          {description}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
export default CollapsibleBase;
