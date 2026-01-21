export type HeaderConfigType = {
  id?: string;
  title?: string;
  slug?: string;
  orderIndex?: number;
  children?: HeaderConfigType[];
};

export type ParamHeaderType = {
  title: string;
  slug: string;
  orderIndex: number;
  children?: HeaderConfigType[];
};
