export type PageCommonType = {
  id?: number | string;
  slug?: string;
  title?: string;
  section?: SectionType[];
};

export type ContentType =
  | "BANNER"
  | "IMAGE"
  | "CONTENT_LEFT"
  | "TAB"
  | "CONTENT_RIGHT"
  | undefined;

export type TabConfig = {
  title?: string;
  subTitle?: string;
  description?: string;
  orderIndex?: number;
  listSection?: SectionType[];
};

export type SectionType = {
  orderIndex?: number;
  name?: string;
  pageId?: number;
  images?: string[];
  type?: ContentType;
  link?: string;
  text?: string;
  tab?: TabConfig[];
};
