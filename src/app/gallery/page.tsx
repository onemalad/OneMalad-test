'use client';

import { useState } from 'react';
import { FiCamera, FiExternalLink } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { ActivityCategory, GalleryImage } from '@/types';

/* ---------- category config ---------- */

const categoryConfig: Record<
  ActivityCategory,
  { label: string; emoji: string; gradient: string }
> = {
  cleanliness_drive: { label: 'Cleanliness', emoji: '\uD83E\uDDF9', gradient: 'from-emerald-400 to-teal-500' },
  health_camp:       { label: 'Health',      emoji: '\uD83C\uDFE5', gradient: 'from-rose-400 to-pink-500' },
  food_distribution: { label: 'Food',        emoji: '\uD83C\uDF5B', gradient: 'from-amber-400 to-orange-500' },
  education:         { label: 'Education',   emoji: '\uD83D\uDCDA', gradient: 'from-violet-400 to-purple-500' },
  tree_planting:     { label: 'Trees',       emoji: '\uD83C\uDF33', gradient: 'from-green-400 to-emerald-600' },
  blood_donation:    { label: 'Blood',       emoji: '\uD83E\uDE78', gradient: 'from-red-400 to-rose-600' },
  sports:            { label: 'Sports',      emoji: '\u26BD',       gradient: 'from-sky-400 to-blue-500' },
  cultural:          { label: 'Cultural',    emoji: '\uD83C\uDFAD', gradient: 'from-fuchsia-400 to-pink-600' },
  infrastructure:    { label: 'Infra',       emoji: '\uD83D\uDEE0\uFE0F', gradient: 'from-slate-400 to-gray-600' },
  other:             { label: 'Other',       emoji: '\u2728',       gradient: 'from-blue-400 to-indigo-500' },
};

/* ---------- filter tabs ---------- */

type FilterValue = 'all' | ActivityCategory;

const filterTabs: { val: FilterValue; label: string }[] = [
  { val: 'all',               label: 'All' },
  { val: 'cleanliness_drive', label: 'Cleanliness' },
  { val: 'health_camp',       label: 'Health' },
  { val: 'food_distribution', label: 'Food' },
  { val: 'education',         label: 'Education' },
  { val: 'tree_planting',     label: 'Trees' },
  { val: 'blood_donation',    label: 'Blood' },
  { val: 'sports',            label: 'Sports' },
  { val: 'cultural',          label: 'Cultural' },
  { val: 'infrastructure',    label: 'Infra' },
];

/* ---------- sample data ---------- */

const sampleGallery: GalleryImage[] = [
  {
    id: 'g1', url: '', caption: 'Beach cleanup at Marve',
    category: 'cleanliness_drive', date: '2025-11-10', createdAt: '2025-11-10',
  },
  {
    id: 'g2', url: '', caption: 'Health camp screening at Malwani',
    category: 'health_camp', date: '2025-10-22', createdAt: '2025-10-22',
  },
  {
    id: 'g3', url: '', caption: 'Food packets distributed in Ward 36',
    category: 'food_distribution', date: '2025-09-15', createdAt: '2025-09-15',
  },
  {
    id: 'g4', url: '', caption: 'Tuition class for underprivileged kids',
    category: 'education', date: '2025-12-05', createdAt: '2025-12-05',
  },
  {
    id: 'g5', url: '', caption: '100 saplings planted in Mindspace',
    category: 'tree_planting', date: '2025-07-14', createdAt: '2025-07-14',
  },
  {
    id: 'g6', url: '', caption: 'Blood donation drive at Malad station',
    category: 'blood_donation', date: '2025-08-20', createdAt: '2025-08-20',
  },
  {
    id: 'g7', url: '', caption: 'Cricket tournament at Kharodi grounds',
    category: 'sports', date: '2025-06-01', createdAt: '2025-06-01',
  },
  {
    id: 'g8', url: '', caption: 'Ganesh Chaturthi celebration',
    category: 'cultural', date: '2025-09-02', createdAt: '2025-09-02',
  },
  {
    id: 'g9', url: '', caption: 'Footpath repair near Malad West',
    category: 'infrastructure', date: '2025-10-11', createdAt: '2025-10-11',
  },
  {
    id: 'g10', url: '', caption: 'Nullah cleaning near Rathodi',
    category: 'cleanliness_drive', date: '2025-11-25', createdAt: '2025-11-25',
  },
  {
    id: 'g11', url: '', caption: 'Eye checkup camp for senior citizens',
    category: 'health_camp', date: '2025-12-12', createdAt: '2025-12-12',
  },
  {
    id: 'g12', url: '', caption: 'Republic Day celebration at Kharodi',
    category: 'cultural', date: '2026-01-26', createdAt: '2026-01-26',
  },
];

/* ---------- component ---------- */

export default function GalleryPage() {
  const [filter, setFilter] = useState<FilterValue>('all');

  const filtered =
    filter === 'all'
      ? sampleGallery
      : sampleGallery.filter((img) => img.category === filter);

  return (
    <>
      {/* Header */}
      <section className="page-header-gradient relative overflow-hidden">
        <div className="absolute top-[-40%] right-[-15%] w-[400px] h-[400px] bg-white/5 rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <span className="inline-block bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-5 border border-white/20">
            <FiCamera className="inline -mt-0.5 mr-1.5" />
            OneMalad Foundation
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Gallery</h1>
          <p className="text-base opacity-90 max-w-xl mx-auto">
            Moments from our foundation activities and community events
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap mb-8">
            {filterTabs.map((f) => (
              <button
                key={f.val}
                onClick={() => setFilter(f.val)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  filter === f.val
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-blue-200'
                }`}
              >
                {f.val !== 'all' && (
                  <span className="mr-1.5">
                    {categoryConfig[f.val as ActivityCategory].emoji}
                  </span>
                )}
                {f.label}
              </button>
            ))}
          </div>

          {/* Gallery grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((img) => {
                const cat = img.category || 'other';
                const config = categoryConfig[cat];
                return (
                  <div
                    key={img.id}
                    className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-sm hover:shadow-lg"
                  >
                    {/* Placeholder gradient background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`}
                    />

                    {/* Emoji in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl sm:text-6xl opacity-60 group-hover:opacity-80 transition-opacity drop-shadow-lg">
                        {config.emoji}
                      </span>
                    </div>

                    {/* Hover overlay with caption & date */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex flex-col justify-end p-3">
                      <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        {img.caption && (
                          <p className="text-white text-sm font-medium leading-snug mb-1">
                            {img.caption}
                          </p>
                        )}
                        <p className="text-white/70 text-xs">
                          {new Date(img.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Category badge */}
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-0.5 rounded-md text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 card">
              <p className="text-gray-400 text-lg">No photos found for this category</p>
            </div>
          )}

          {/* Instagram CTA */}
          <div className="mt-14 text-center card p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-[-50%] left-[-20%] w-[300px] h-[300px] bg-gradient-to-br from-pink-100 to-purple-100 rounded-full opacity-40" />
            <div className="relative z-10">
              <HiOutlineSparkles className="text-3xl text-pink-500 mx-auto mb-3" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                Want to see more?
              </h3>
              <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
                Follow us on Instagram for daily updates, behind-the-scenes moments, and live coverage of our activities.
              </p>
              <a
                href="https://instagram.com/onemalad"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                Follow @onemalad
                <FiExternalLink className="text-sm" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
