import { useState, useEffect } from "react";

export function useBreakpoint() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize(); // chạy ngay để lấy width hiện tại

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (width === null) return null;

  if (width < 560) return "xsMobile";
  if (width < 850) return "mobile";
  if (width < 1050) return "tablet";
  return "desktop";
}
