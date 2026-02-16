export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-8 w-52 bg-white/20 rounded-lg mb-3 animate-pulse" />
          <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-1/2 bg-gray-100 rounded mb-3" />
              <div className="h-4 w-full bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
