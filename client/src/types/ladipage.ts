import z from "zod";

const typeLadipageEnum = z.enum(["ads", "normal"]);

export const LadipageSchema = z.object({
    type: typeLadipageEnum,
    url: z.string().optional(),
})

export type Ladipage = z.infer<typeof LadipageSchema>;

export const UpdateLadipageSchema = z
  .object({
    type: typeLadipageEnum.catch("normal"),
    url: z.string().optional(),
  })
  .refine(
    (data) => data.type !== "ads" || (data.url && data.url.trim() !== ""),
    {
      message: "URL là bắt buộc",
      path: ["url"],
    }
  );

export type UpdateLadipage = z.infer<typeof UpdateLadipageSchema>
