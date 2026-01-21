export default function SkeletonSectionDocument() {
  return (
    <section className="w-full px-5 py-10 bg-[#20376C]">
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center">
        {/* Header Skeleton */}
        <div className="flex gap-1.5 w-full items-center justify-between mb-6 pr-0 sm:pr-4 lg:pr-10">
          <div className="h-6 sm:h-7 lg:h-8 w-64 bg-white/30 rounded-md animate-pulse" />
          <div className="h-4 w-24 bg-white/20 rounded-md animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between bg-white rounded-2xl p-1.5 sm:p-3 shadow-lg overflow-hidden"
            >
              {/* Image */}
              <div className="relative w-full h-32 sm:h-44 overflow-hidden rounded-[10px] bg-gray-200 animate-pulse" />

              {/* Content */}
              <div className="px-2 flex flex-col mt-3 space-y-2">
                <div className="h-4 w-full bg-gray-300 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse" />

                <div className="space-y-1.5 mt-2">
                  <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              {/* Button */}
              <div className="px-2 mt-3">
                <div className="h-4 w-28 bg-blue-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
