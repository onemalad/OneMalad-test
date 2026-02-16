export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-8 w-48 bg-white/20 rounded-lg mb-3 animate-pulse" />
          <div className="h-4 w-36 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-5 text-center animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2" />
              <div className="h-6 w-10 bg-gray-200 rounded mx-auto mb-1" />
              <div className="h-3 w-16 bg-gray-100 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
