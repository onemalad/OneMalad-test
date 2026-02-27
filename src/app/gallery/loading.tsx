export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="h-8 w-32 bg-white/20 rounded-lg mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-64 bg-white/10 rounded mx-auto animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Filter skeleton */}
        <div className="flex gap-2 flex-wrap mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-9 rounded-full bg-gray-200 animate-pulse"
              style={{ width: `${60 + i * 12}px` }}
            />
          ))}
        </div>
        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="mt-2 h-3 w-3/4 bg-gray-200 rounded" />
              <div className="mt-1 h-3 w-1/2 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
