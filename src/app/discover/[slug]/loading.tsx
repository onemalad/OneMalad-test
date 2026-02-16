export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="h-4 w-40 bg-white/20 rounded mb-6 animate-pulse" />
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white/10 rounded-2xl animate-pulse" />
            <div>
              <div className="h-4 w-20 bg-white/20 rounded mb-2 animate-pulse" />
              <div className="h-8 w-56 bg-white/20 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="h-5 w-3/4 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-10">
          <div className="space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-4/6 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <div className="card p-5 animate-pulse">
              <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div>
                  <div className="h-4 w-20 bg-gray-200 rounded mb-1" />
                  <div className="h-3 w-28 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
            <div className="card p-5 animate-pulse">
              <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
