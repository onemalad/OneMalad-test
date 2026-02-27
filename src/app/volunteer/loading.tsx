export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="h-8 w-48 bg-white/20 rounded-lg mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-64 bg-white/10 rounded mx-auto animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          {/* Form skeleton */}
          <div className="card p-8 animate-pulse">
            <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
            <div className="space-y-5">
              <div className="h-10 w-full bg-gray-200 rounded-xl" />
              <div className="h-10 w-full bg-gray-200 rounded-xl" />
              <div className="h-10 w-full bg-gray-200 rounded-xl" />
              <div className="h-10 w-full bg-gray-200 rounded-xl" />
              <div className="h-20 w-full bg-gray-100 rounded-xl" />
              <div className="h-20 w-full bg-gray-100 rounded-xl" />
              <div className="h-12 w-full bg-gray-200 rounded-xl" />
            </div>
          </div>
          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <div className="card p-6 animate-pulse">
              <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="card p-6 animate-pulse">
              <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
