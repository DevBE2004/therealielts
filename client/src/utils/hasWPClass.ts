import { WORDPRESS_CLASSES } from "./wpClasses";

export function hasWPClass(content: string): boolean {
  return WORDPRESS_CLASSES.some((cls) => content.includes(cls));
}
