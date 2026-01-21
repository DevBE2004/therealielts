export const requestIdle = (cb: () => void, timeout = 300) => {
  if (typeof window === "undefined") return 0;

  if ("requestIdleCallback" in window) {
    return (window as any).requestIdleCallback(cb, { timeout });
  }

  return setTimeout(cb, timeout);
};

export const cancelIdle = (id: any) => {
  if ("cancelIdleCallback" in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};
