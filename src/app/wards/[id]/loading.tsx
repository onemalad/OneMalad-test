export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-4 w-24 bg-white/20 rounded mb-4 animate-pulse" />
          <div className="h-8 w-56 bg-white/20 rounded-lg mb-3 animate-pulse" />
          <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          <div>
            <div className="h-[350px] bg-gray-200 rounded-2xl mb-8 animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-5 animate-pulse">
                  <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6 h-fit animate-pulse">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="h-5 w-32 bg-gray-200 rounded mx-auto mb-2" />
            <div className="h-4 w-24 bg-gray-100 rounded mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
