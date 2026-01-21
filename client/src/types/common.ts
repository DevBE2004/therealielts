import { z } from "zod";
import { ForWebEnum, metaDataSchema } from "./base";
import { CategorySchema } from "./category";

export const CommonTypeEnum = z.enum([
  "COURSE",
  "DOCUMENT",
  "NEW",
  "STUDYABROAD",
  "PAGE",
]);

// Common schema
export const CommonSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  images: z.array(z.string()).default([]),
  duration: z.string(),
  routeId: z.number().optional(),
  type: CommonTypeEnum,
  totalHours: z.number().default(0),
  metaData: metaDataSchema,
  level: z.tuple([z.number(), z.number()]).default([0, 0]),
  target: z.number().optional(),
  benefit: z
    .array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  author: z.any(),
  isActive: z.boolean().default(true),
  category: z.any().optional(),
  forWeb: ForWebEnum.optional(),
  url: z.string().optional(),
  urlYoutube: z.string().optional(),
  descriptionSidebar: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Common = z.infer<typeof CommonSchema>;
