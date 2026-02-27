export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="h-6 w-28 bg-white/20 rounded-full mx-auto mb-5 animate-pulse" />
          <div className="h-8 w-48 bg-white/20 rounded-lg mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-64 bg-white/10 rounded mx-auto animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Filter skeleton */}
        <div className="flex gap-2 flex-wrap mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-9 w-24 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
        {/* Cards skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded-md mb-3" />
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-full bg-gray-100 rounded mb-1" />
              <div className="h-4 w-5/6 bg-gray-100 rounded mb-1" />
              <div className="h-4 w-2/3 bg-gray-100 rounded mb-4" />
              <div className="space-y-2 pt-3 border-t border-gray-100">
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
                <div className="h-3 w-2/5 bg-gray-100 rounded" />
                <div className="flex gap-3 mt-2">
                  <div className="h-6 w-24 bg-gray-100 rounded-full" />
                  <div className="h-6 w-28 bg-gray-100 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
