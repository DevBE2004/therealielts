export default function CourseRoadmapSkeleton() {
  return (
    <section className="w-full py-10 bg-gradient-to-b from-[#e2e9f7] to-white">
      <div className="max-w-7xl mx-auto px-4 text-center animate-pulse">
        {/* Title */}
        <div className="h-8 w-64 mx-auto bg-slate-300 rounded mb-10" />

        {/* Course Cards */}
        <div className="w-full flex flex-wrap items-center justify-center gap-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-full p-6 w-52 h-[300px] flex flex-col items-center justify-center border border-sky-200 shadow-sm"
            >
              {/* Icon */}
              <div className="w-24 h-24 rounded-full bg-slate-200 mb-4" />

              {/* Title */}
              <div className="h-5 w-32 bg-slate-300 rounded mb-2" />

              {/* Level */}
              <div className="h-4 w-28 bg-slate-200 rounded mb-3" />

              {/* Description */}
              <div className="w-full px-3.5 space-y-2">
                <div className="h-3 bg-slate-200 rounded" />
                <div className="h-3 bg-slate-200 rounded" />
                <div className="h-3 w-2/3 bg-slate-200 rounded mx-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10">
          <div className="h-12 w-72 mx-auto rounded-full bg-slate-300" />
        </div>
      </div>
    </section>
  );
}
