export function injectHeadingIds(html: string) {
  if (!html) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  let counter = 0;
  doc.querySelectorAll("h2.wp-block-heading, h3.wp-block-heading, h4.wp-block-heading").forEach((heading) => {
    if (!heading.id) {
      counter++;
      const text = heading.textContent?.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "") || `heading-${counter}`;
      heading.id = text;
    }
  });

  return doc.body.innerHTML;
}
