// .../lib/seo.ts
import type { Metadata } from "next";

export interface SEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  keywords?: string;
  type?: "website" | "article";
  publishedTime?: Date;
  modifiedTime?: Date;
  authorName?: string;
}

export function generatePageMetadata({
  title,
  description,
  url,
  image = "/images/Logo-TRI-W2-.png",
  keywords = "",
  type = "article",
  publishedTime,
  modifiedTime,
  authorName = "The Real Ielts ANT",
}: SEOProps): Metadata {
  return {
    title: {
      default: title,
      template: `%s | The Real Ielts ANT`,
    },
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "The Real Ielts ANT",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "vi_VN",
      type,
      publishedTime: publishedTime
        ? new Date(publishedTime).toISOString()
        : "N/A",
      modifiedTime: modifiedTime
        ? new Date(modifiedTime).toISOString()
        : "N/A",
      authors: authorName ? [authorName] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@the_real_ielts_ant",
    },
    other: {
      // JSON-LD structured data
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": type === "article" ? "Article" : "WebPage",
        headline: title,
        description,
        image: [image],
        url,
        datePublished: publishedTime
        ? new Date(publishedTime).toLocaleString("vi-VN")
        : "N/A",
        dateModified: modifiedTime
        ? new Date(modifiedTime).toLocaleString("vi-VN")
        : "N/A",
        author: {
          "@type": "Person",
          name: authorName,
        },
      }),
    },
  };
}
