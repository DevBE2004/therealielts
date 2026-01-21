export function parseStringObject<T = any>(
  obj: string | T | undefined
): T | undefined {
  if (!obj) return undefined;

  if (typeof obj === "string") {
    try {
      return JSON.parse(obj) as T;
    } catch {
      console.warn("Failed to parse JSON string:", obj);
      return undefined;
    }
  }
  
  return obj;
}