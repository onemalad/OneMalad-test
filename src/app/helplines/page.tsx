'use client';

import { useState, useMemo } from 'react';
import { FiPhone, FiSearch, FiClock, FiShield } from 'react-icons/fi';
import { helplines, helplineCategories } from '@/data/helplines';
import { Helpline } from '@/types';

const categoryBadge: Record<Helpline['category'], string> = {
  emergency: 'bg-red-100 text-red-700',
  police: 'bg-blue-100 text-blue-700',
  hospital: 'bg-pink-100 text-pink-700',
  fire: 'bg-orange-100 text-orange-700',
  women: 'bg-purple-100 text-purple-700',
  child: 'bg-amber-100 text-amber-700',
  municipal: 'bg-emerald-100 text-emerald-700',
  utility: 'bg-slate-100 text-slate-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function HelplinesPage() {
  const [category, setCategory] = useState<'all' | Helpline['category']>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = helplines;

    if (category !== 'all') {
      result = result.filter((h) => h.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.number.includes(q) ||
          h.description?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [category, search]);

  return (
    <>
      {/* Header */}
      <section className="page-header-gradient relative overflow-hidden">
        <div className="absolute top-[-40%] right-[-15%] w-[400px] h-[400px] bg-white/5 rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <span className="inline-block bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-5 border border-white/20">
            OneMalad Foundation
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Emergency Helplines</h1>
          <p className="text-base opacity-90 max-w-xl mx-auto">
            Important phone numbers for Malad residents — police, hospitals, fire, BMC, and more. Save these numbers.
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
              placeholder="Search by name, number, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-2 flex-wrap mb-8">
            {helplineCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  category === cat.value
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-400 mb-6">
            Showing {filtered.length} {filtered.length === 1 ? 'helpline' : 'helplines'}
            {category !== 'all' && ` in ${helplineCategories.find((c) => c.value === category)?.label}`}
            {search.trim() && ` matching "${search.trim()}"`}
          </p>

          {/* Helpline Cards */}
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((helpline) => (
                <div key={helpline.id} className="card p-6 card-hover flex flex-col">
                  {/* Top row: category badge + availability */}
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${
                        categoryBadge[helpline.category]
                      }`}
                    >
                      {helpline.category === 'municipal' ? 'BMC' : helpline.category}
                    </span>
                    {helpline.available && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <FiClock className="w-3 h-3" />
                        {helpline.available}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-base font-semibold text-gray-800 mb-1 flex items-center gap-2">
                    <FiShield className="text-emerald-600 flex-shrink-0 w-4 h-4" />
                    {helpline.name}
                  </h3>

                  {/* Description */}
                  {helpline.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{helpline.description}</p>
                  )}

                  {/* Spacer to push phone + button to bottom */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    {/* Phone Number — large and tappable */}
                    <a
                      href={`tel:${helpline.number}`}
                      className="block text-xl sm:text-2xl font-bold text-emerald-600 tracking-wide mb-3 hover:text-emerald-700 transition-colors"
                    >
                      {helpline.number}
                    </a>

                    {/* Call Now Button */}
                    <a
                      href={`tel:${helpline.number}`}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 active:bg-red-700 transition-colors min-h-[48px]"
                    >
                      <FiPhone className="w-4 h-4" />
                      Call Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 card">
              <FiPhone className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No helplines found</p>
              <p className="text-gray-300 text-sm mt-1">Try a different search term or category</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
