export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="h-8 w-48 bg-white/20 rounded-lg mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-72 bg-white/10 rounded mx-auto animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded" />
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
