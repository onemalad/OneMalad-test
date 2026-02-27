'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiCalendar, FiMapPin, FiUsers, FiHeart } from 'react-icons/fi';
import { useStore } from '@/hooks/useStore';
import { ActivityCategory } from '@/types';

const categoryColors: Record<ActivityCategory, string> = {
  cleanliness_drive: 'bg-emerald-100 text-emerald-700',
  health_camp: 'bg-red-100 text-red-700',
  food_distribution: 'bg-orange-100 text-orange-700',
  education: 'bg-amber-100 text-amber-700',
  tree_planting: 'bg-green-100 text-green-700',
  blood_donation: 'bg-rose-100 text-rose-700',
  sports: 'bg-blue-100 text-blue-700',
  cultural: 'bg-purple-100 text-purple-700',
  infrastructure: 'bg-slate-100 text-slate-700',
  other: 'bg-gray-100 text-gray-700',
};

const categoryLabels: Record<ActivityCategory, string> = {
  cleanliness_drive: 'Cleanliness Drive',
  health_camp: 'Health Camp',
  food_distribution: 'Food Distribution',
  education: 'Education',
  tree_planting: 'Tree Planting',
  blood_donation: 'Blood Donation',
  sports: 'Sports',
  cultural: 'Cultural',
  infrastructure: 'Infrastructure',
  other: 'Other',
};

const filterTabs: { val: 'all' | ActivityCategory; label: string }[] = [
  { val: 'all', label: 'All' },
  { val: 'cleanliness_drive', label: 'Cleanliness' },
  { val: 'health_camp', label: 'Health' },
  { val: 'food_distribution', label: 'Food' },
  { val: 'education', label: 'Education' },
  { val: 'tree_planting', label: 'Trees' },
  { val: 'blood_donation', label: 'Blood Donation' },
  { val: 'sports', label: 'Sports' },
  { val: 'cultural', label: 'Cultural' },
  { val: 'other', label: 'Other' },
];

export default function OurWorkPage() {
  const { activities } = useStore();
  const [filter, setFilter] = useState<'all' | ActivityCategory>('all');

  const filtered = filter === 'all' ? activities : activities.filter((a) => a.category === filter);

  return (
    <>
      {/* Header */}
      <section className="page-header-gradient relative overflow-hidden">
        <div className="absolute top-[-40%] right-[-15%] w-[400px] h-[400px] bg-white/5 rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <span className="inline-block bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-5 border border-white/20">
            OneMalad Foundation
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Our Work</h1>
          <p className="text-base opacity-90 max-w-xl mx-auto">
            Making a real impact through community-driven activities across Malad
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Category Filter */}
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
                {f.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-400 mb-6">
            Showing {filtered.length} {filtered.length === 1 ? 'activity' : 'activities'}
            {filter !== 'all' && ` in ${filterTabs.find((f) => f.val === filter)?.label}`}
          </p>

          {/* Activity Cards */}
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((activity) => (
                <div key={activity.id} className="card p-6 card-hover">
                  {/* Image */}
                  {activity.imageUrls.length > 0 && (
                    <div className="relative w-full h-44 -mt-6 -mx-6 mb-4 overflow-hidden rounded-t-xl" style={{ width: 'calc(100% + 3rem)' }}>
                      <Image
                        src={activity.imageUrls[0]}
                        alt={activity.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Category tag */}
                  <span
                    className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold mb-3 ${
                      categoryColors[activity.category] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {categoryLabels[activity.category] || activity.category}
                  </span>

                  {/* Title & Description */}
                  <h3 className="text-base font-semibold text-gray-800 mb-2">{activity.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">{activity.description}</p>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-500">
                    <p className="flex items-center gap-2">
                      <FiCalendar className="text-blue-500 flex-shrink-0" />
                      {new Date(activity.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="flex items-center gap-2">
                      <FiMapPin className="text-blue-500 flex-shrink-0" />
                      {activity.location}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-100">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full">
                      <FiUsers className="w-3.5 h-3.5" />
                      {activity.volunteersCount} Volunteers
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full">
                      <FiHeart className="w-3.5 h-3.5" />
                      {activity.beneficiariesCount} Beneficiaries
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 card">
              <p className="text-gray-400 text-lg">No activities found for this category</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
