import Image from "next/image";
import Link from "next/link";
import { Banner } from "@/types";

export default function HeroLayer({ banner }: { banner: string }) {
  return (
    <Link href={"#"} target="_blank" className="absolute inset-0 block">
      {banner && (
        <Image
          src={banner}
          alt={"Hero layer"}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
      )}

      {/* overlay nhẹ – không ảnh hưởng LCP */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
    </Link>
  );
}
