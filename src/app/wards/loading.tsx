export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="h-8 w-40 bg-white/20 rounded-lg mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-64 bg-white/10 rounded mx-auto animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="h-32 bg-gray-200" />
              <div className="p-5">
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-1/2 bg-gray-100 rounded mb-3" />
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-gray-200 rounded-full" />
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
