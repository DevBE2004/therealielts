import { Button } from "./../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../dialog";
import { LoaderCircle, LucideClockFading, X } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DiaLogCustomProps {
  open: boolean;
  title: string;
  width?: string;
  description?: string;
  content?: ReactNode;
  textSave?: string;
  onCancel: () => void;
  onSave?: () => void;
  isFooter?: boolean;
  loading?: boolean;
  isHeader?: boolean;
  isScreen?: boolean;
  isClose?: boolean;
  isDeleteBtn?: boolean;
  disabledSave?: boolean;
  footerContent?: ReactNode;
  classContainer?: string;
}
export const DiaLogCustom = ({
  open,
  title,
  description,
  content,
  onCancel,
  loading,
  onSave,
  width = "max-w-[777px]",
  textSave = "Save",
  isFooter = true,
  isHeader = true,
  isScreen = false,
  isClose = false,
  isDeleteBtn = false,
  footerContent,
  disabledSave,
  classContainer = "max-h-[calc(100vh-240px)] overflow-auto",
}: DiaLogCustomProps) => {
  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className={cn(`${width}`, isScreen && "p-0 border-none")}>
        <DialogTitle hidden></DialogTitle>
        {isClose && (
          <div className="absolute z-10 size-[44px] rounded-full flex justify-center items-center border border-[#00538E] cursor-pointer right-4 top-3  opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X
              color="#00538E"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onCancel();
              }}
              className="size-6"
            />
          </div>
        )}
        {isHeader && (
          <DialogHeader>
            <DialogTitle className="font-bold text-[18px]">{title}</DialogTitle>
            <DialogDescription className="font-medium text-[#505F79] text-[16px]">
              {description}
            </DialogDescription>
          </DialogHeader>
        )}
        <div className={classContainer}>{content}</div>
        {isFooter && (
          <DialogFooter>
            {footerContent ? (
              footerContent
            ) : (
              <Button
                className={
                  isDeleteBtn
                    ? "bg-gradient-to-r from-red-500 to-red-400 text-white rounded-lg shadow-md hover:shadow-lg hover:from-red-400 hover:to-red-500 transition-all text-sm font-medium"
                    : "bg-gradient-to-r from-blue-500 to-sky-400 text-white rounded-lg shadow-md hover:shadow-lg hover:from-sky-500 hover:to-blue-500 transition-all text-sm font-medium"
                }
                onClick={onSave}
                disabled={disabledSave || loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : null}
                {textSave}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
