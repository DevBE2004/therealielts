export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function parseTOCFromHTML(html: string, maxLevel = 4): TOCItem[] {
  if (!html) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const selector = Array.from({ length: maxLevel - 1 }, (_, i) => `h${i + 2}`).join(", ");
  const headings = doc.querySelectorAll(selector);

  const tocItems: TOCItem[] = [];

  headings.forEach((el, idx) => {
    const tag = el.tagName.toLowerCase();
    const level = Number(tag.replace("h", ""));

    // Tìm thẻ <a> có id hoặc tự gán id
    let id = "";
    const anchor = el.querySelector("a[id]");
    if (anchor) {
      id = anchor.id;
    } else if (el.id) {
      id = el.id;
    } else {
      // Nếu heading không có id -> sinh tự động
      const baseId = el.textContent?.trim().toLowerCase()
        .replace(/[\s]+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-{2,}/g, "-")
        .replace(/(^\-|\-$)/g, "") || `section-${idx}`;
      id = baseId;
      el.id = id; // Thêm id vào heading để có thể scroll
    }

    // Text nội dung của heading
    const text = el.textContent?.trim() || "";

    // Chỉ lấy heading có nội dung và đúng class "wp-block-heading" hoặc chứa <a id>
    if (text && (el.classList.contains("wp-block-heading") || anchor)) {
      tocItems.push({ id, text, level });
    }
  });

  return tocItems;
}
