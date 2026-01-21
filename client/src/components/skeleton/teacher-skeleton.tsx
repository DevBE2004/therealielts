export default function TeacherSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-96 rounded-2xl bg-gray-200 animate-pulse">
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        </div>
      ))}
    </div>
  );
}
