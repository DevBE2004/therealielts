"use client";
import slugify from "slugify";
import { Banner } from "@/types";
import Image from "next/image";
import dynamic from "next/dynamic";

export default function HomeBanner({
  location = "trang-chu",
  dataBanner,
}: {
  location: "trang-chu" | "thu-vien";
  dataBanner: Banner[];
}) {
  const banners: Banner[] = Array.isArray(dataBanner)
    ? dataBanner.filter(
        (b) =>
          b.isActive && slugify(b.category || "", { lower: true }) === location
      )
    : [];

  if (!banners.length) return null;

  const [hero, ...rest] = banners;

  const heroImage = "/images/hero-image-banner2.webp";

  const HomeBannerSwiper = dynamic(() => import("./home-banner-swiper"), {
    ssr: false,
  });

  return (
    <section
      id="home-banner"
      className="relative w-full aspect-[21/9] max-h-[65vh] xl:max-h-[600px]"
    >
      <Image
        src={heroImage}
        alt={"Hero layer"}
        fill
        priority
        fetchPriority="high"
        sizes=" (max-width: 640px) 100vw,
      (max-width: 1024px) 100vw,
      (max-width: 1536px) 90vw,
      1600px"
        className="object-cover z-10"
      />

      <HomeBannerSwiper banners={banners} />
    </section>
  );
}
