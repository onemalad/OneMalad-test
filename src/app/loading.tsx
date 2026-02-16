export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="h-8 w-64 bg-white/20 rounded-lg mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-white/10 rounded mx-auto animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
              <div className="h-5 w-full bg-gray-200 rounded mb-2" />
              <div className="h-4 w-3/4 bg-gray-100 rounded mb-4" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
