"use client";

import { Button } from "@/components/ui/button";
import { useControls } from "react-zoom-pan-pinch";

interface Props {
  percent: number;
  setPercent: (p: number) => void;
}

export const ZoomControls = ({ percent, setPercent }: Props) => {
  const { setTransform } = useControls();

  const scale = percent / 100;

  const handleZoom = (direction: "in" | "out") => {
    const delta = direction === "out" ? 0.1 : -0.1;
    const newScale = Math.max(0.5, Math.min(4, scale + delta));
    setTransform(0, 0, newScale); // bạn có thể dùng positionX/Y nếu muốn giữ vị trí
    setPercent(Math.round(newScale * 100));
  };

  return (
    <div className="absolute left-4 bottom-4 flex p-2 text-[#2C2C2C] rounded-lg bg-white shadow-inner">
      <Button
        onClick={() => handleZoom("in")}
        className="w-10 h-10 bg-transparent  text-[#2C2C2C] hover:bg-transparent"
      >
        -
      </Button>
      <div className="p-2 text-base font-normal leading-6">{`${percent}%`}</div>
      <Button
        onClick={() => handleZoom("out")}
        className="w-10 h-10 bg-transparent text-[#2C2C2C] hover:bg-transparent"
      >
        +
      </Button>
    </div>
  );
};
