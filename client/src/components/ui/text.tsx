import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

// Define the variants
const textVariants = cva("", {
  variants: {
    type: {
      base: "text-base leading-4 tracking-[-0.02rem] text-[#091E42]",
      caption: "text-xs text-[#808991] leading-[1rem] tracking-[-0.0225rem]",
      title: "text-lg text-[#091E42] leading-6 tracking-[-0.02rem]",
      small: "text-sm leading-5 text-[#091E42] tracking-[-0.0175rem]",
    },
    weight: {
      regular: "font-regular",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    type: "base",
    weight: "regular",
  },
});

// Define the props
export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: React.ElementType;
  html?: string; // 👈 Thêm prop html
}

// Component
const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    { className, type, weight, as: Comp = "p", html, children, ...props },
    ref
  ) => {
    const sharedProps = {
      ref,
      className: cn(
        "whitespace-pre-line",
        textVariants({ type, weight }),
        className
      ),
      ...props,
    };

    if (html?.trim()) {
      return (
        <Comp {...sharedProps} dangerouslySetInnerHTML={{ __html: html }} />
      );
    }

    return <Comp {...sharedProps}>{children}</Comp>;
  }
);

Text.displayName = "Text";

export { Text, textVariants };
