'use client';

import { useState, useMemo } from 'react';
import { FiSearch, FiPhone, FiClock, FiMapPin, FiStar } from 'react-icons/fi';
import { sampleBusinesses, businessCategories } from '@/data/directory';
import { wardsData } from '@/data/wards';
import { Business, BusinessCategory } from '@/types';

const categoryBadge: Record<BusinessCategory, string> = {
  restaurant: 'bg-orange-100 text-orange-700',
  grocery: 'bg-green-100 text-green-700',
  medical: 'bg-red-100 text-red-700',
  education: 'bg-amber-100 text-amber-700',
  salon: 'bg-pink-100 text-pink-700',
  electronics: 'bg-blue-100 text-blue-700',
  clothing: 'bg-purple-100 text-purple-700',
  hardware: 'bg-slate-100 text-slate-700',
  services: 'bg-teal-100 text-teal-700',
  other: 'bg-gray-100 text-gray-700',
};

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <FiStar key={`f-${i}`} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
      ))}
      {hasHalf && (
        <span className="relative w-3.5 h-3.5">
          <FiStar className="absolute inset-0 w-3.5 h-3.5 text-amber-500" />
          <span className="absolute inset-0 overflow-hidden w-[50%]">
            <FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </span>
        </span>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <FiStar key={`e-${i}`} className="w-3.5 h-3.5 text-amber-500" />
      ))}
      <span className="ml-1 text-xs text-gray-500 font-medium">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function DirectoryPage() {
  const [categoryFilter, setCategoryFilter] = useState<'all' | BusinessCategory>('all');
  const [wardFilter, setWardFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let results: Business[] = sampleBusinesses;

    if (categoryFilter !== 'all') {
      results = results.filter((b) => b.category === categoryFilter);
    }

    if (wardFilter !== 'all') {
      results = results.filter((b) => b.wardNumber === wardFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      results = results.filter((b) => b.name.toLowerCase().includes(q));
    }

    return results;
  }, [categoryFilter, wardFilter, searchQuery]);

  const categoryLabel = (cat: BusinessCategory): string => {
    return businessCategories.find((c) => c.value === cat)?.label ?? cat;
  };

  return (
    <>
      {/* Header */}
      <section className="page-header-gradient relative overflow-hidden">
        <div className="absolute top-[-40%] right-[-15%] w-[400px] h-[400px] bg-white/5 rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <span className="inline-block bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-5 border border-white/20">
            OneMalad Foundation
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Local Business Directory</h1>
          <p className="text-base opacity-90 max-w-xl mx-auto">
            Discover and support local businesses, shops, and services in Malad West
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search businesses by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-2 flex-wrap mb-4">
            {businessCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  categoryFilter === cat.value
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-200'
                }`}
              >
                {cat.emoji ? `${cat.emoji} ` : ''}{cat.label}
              </button>
            ))}
          </div>

          {/* Ward Filter Dropdown */}
          <div className="flex items-center gap-3 mb-8">
            <label htmlFor="ward-filter" className="text-sm font-medium text-gray-600">
              Filter by Ward:
            </label>
            <select
              id="ward-filter"
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            >
              <option value="all">All Wards</option>
              {wardsData.map((ward) => (
                <option key={ward.number} value={ward.number}>
                  Ward {ward.number} — {ward.landmarks.join(', ')}
                </option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-400 mb-6">
            Showing {filtered.length} {filtered.length === 1 ? 'business' : 'businesses'}
            {categoryFilter !== 'all' && ` in ${businessCategories.find((c) => c.value === categoryFilter)?.label}`}
            {wardFilter !== 'all' && ` · Ward ${wardFilter}`}
          </p>

          {/* Business Cards Grid */}
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((biz) => (
                <div key={biz.id} className="card p-6 card-hover">
                  {/* Category badge & Rating */}
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${
                        categoryBadge[biz.category] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {categoryLabel(biz.category)}
                    </span>
                    {biz.rating != null && <StarRating rating={biz.rating} />}
                  </div>

                  {/* Name & Description */}
                  <h3 className="text-base font-semibold text-gray-800 mb-2">{biz.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{biz.description}</p>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-500">
                    <p className="flex items-center gap-2">
                      <FiMapPin className="text-emerald-600 flex-shrink-0" />
                      {biz.address}
                    </p>
                    {biz.phone && (
                      <p className="flex items-center gap-2">
                        <FiPhone className="text-emerald-600 flex-shrink-0" />
                        <a
                          href={`tel:+91${biz.phone}`}
                          className="text-emerald-600 hover:underline font-medium"
                        >
                          +91 {biz.phone}
                        </a>
                      </p>
                    )}
                    {biz.timing && (
                      <p className="flex items-center gap-2">
                        <FiClock className="text-emerald-600 flex-shrink-0" />
                        {biz.timing}
                      </p>
                    )}
                  </div>

                  {/* Ward tag */}
                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    Ward {biz.wardNumber} &middot; Malad West
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 card">
              <p className="text-gray-400 text-lg">No businesses found matching your filters</p>
              <p className="text-gray-300 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
