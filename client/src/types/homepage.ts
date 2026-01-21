import { z } from "zod";

export const SlotEnum = z.enum([
  "after-box_header",
  "after-introduce",
  "after-course-roadmap",
  "after-teacher-slide",
  "after-teaching-method",
  "after-learning-approach",
  "after-honor-slide",
  "after-stats-section",
  "after-media-about-tri",
  "after-feedback",
  "after-new-view",
  "after-consultation-form",
]);

export type TSlotEnum = z.infer<typeof SlotEnum>;

export const SectionSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  images: z.array(z.string()).min(1),
  link: z.string().url().optional(),
  alt: z.string().optional(),
  openInNewTab: z.boolean().optional(),
});

export type Section = z.infer<typeof SectionSchema>;

export const BlockSchema = z.object({
  id: z.string(),
  slot: SlotEnum,
  items: z.array(SectionSchema),
});
export type Block = z.infer<typeof BlockSchema>;

export const HomePageConfigSchema = z.object({
  blocks: z.array(BlockSchema),
});

export type HomePageConfig = z.infer<typeof HomePageConfigSchema>;

// Section Static

export const BlockIntroduceSchema = z.object({
  image: z.string().min(1, "linkImage is required"),
  title: z.string().min(1),
  content: z.string().min(1),
  textButton: z.string().min(1),
  linkButton: z.string().min(1),
});

export const BlockLearningMethodSchema = z.object({
  image: z.string().min(1),
  title: z.string().min(1),
  mainTitle: z.string().min(1),
  subTitle: z.string().min(1),
  content: z.string().min(1),
});

export const LearningApproachSchema = z.object({
  image: z.string().min(1),
  title: z.string().min(1),
  content: z.string(),
  subTitle: z.string().min(1),
  textButton: z.string().min(1),
  linkButton: z.string().min(1),
});

export const BlockLearningApproachSchema = z.object({
  slide: z.array(LearningApproachSchema).min(1),
});

export const SectionStaticSchema = z.object({
  section2: z.object({
    BlockIntroduce: BlockIntroduceSchema,
    BlockLearningMethod: BlockLearningMethodSchema,
    BlockLearningApproach: BlockLearningApproachSchema,
  }),
});

export type BlockIntroduce = z.infer<typeof BlockIntroduceSchema>;
export type BlockLearningMethod = z.infer<typeof BlockLearningMethodSchema>;
export type LearningApproach = z.infer<typeof LearningApproachSchema>;
export type BlockLearningApproach = z.infer<typeof BlockLearningApproachSchema>;
export type SectionStatic = z.infer<typeof SectionStaticSchema>;
