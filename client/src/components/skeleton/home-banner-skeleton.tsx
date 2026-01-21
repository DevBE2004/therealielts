export function HomeBannerSkeleton() {
  return (
    <div
      className="
        relative w-full overflow-hidden
        aspect-[16/7] sm:aspect-[16/6] md:aspect-[16/5] lg:aspect-[16/4]
        xl:aspect-auto xl:h-[500px] 2xl:h-[650px]
        bg-gray-200
      "
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );
}
