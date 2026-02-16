export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="h-8 w-40 bg-white/20 rounded-lg mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-72 bg-white/10 rounded mx-auto animate-pulse" />
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card p-8 animate-pulse">
          <div className="h-12 w-full bg-gray-200 rounded-xl mb-6" />
          <div className="h-px bg-gray-200 mb-6" />
          <div className="space-y-4">
            <div className="h-10 w-full bg-gray-200 rounded-xl" />
            <div className="h-10 w-full bg-gray-200 rounded-xl" />
            <div className="h-12 w-full bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
