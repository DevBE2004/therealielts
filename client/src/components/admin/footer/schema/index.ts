import z from "zod";

export const schemaCol1 = z.object({
  logo: z.string(),
  linkLogo: z.string().optional(),
  title: z.string(),
  content: z.string(),
  label: z.string(),
  image: z.string(),
  linkImage: z.string().optional(),
});

export const schemaLabels = z.object({
  label: z.array(
    z.object({
      title: z.string(),
      link: z.string(),
      children: z.array(
        z.object({
          title: z.string(),
          link: z.string(),
        })
      ),
    })
  ),
});

export const schemaCol4 = z.object({
  openFormConsultation: z.boolean(),
  openFanpage: z.boolean(),
  label: schemaLabels.shape.label,
});
