'use client';

import { useState } from 'react';
import { FiClock, FiMapPin, FiUsers, FiCalendar } from 'react-icons/fi';
import { useStore } from '@/hooks/useStore';
import { EventCategory } from '@/types';

const categoryBadge: Record<string, string> = {
  social: 'bg-green-100 text-green-700',
  cultural: 'bg-purple-100 text-purple-700',
  sports: 'bg-blue-100 text-blue-700',
  education: 'bg-amber-100 text-amber-700',
  health: 'bg-red-100 text-red-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function EventsPage() {
  const { events } = useStore();
  const [filter, setFilter] = useState<'all' | EventCategory>('all');

  const filtered = filter === 'all' ? events : events.filter((e) => e.category === filter);

  const upcoming = filtered.filter((e) => new Date(e.date) >= new Date());
  const past = filtered.filter((e) => new Date(e.date) < new Date());

  return (
    <>
      {/* Header */}
      <section className="page-header-gradient relative overflow-hidden">
        <div className="absolute top-[-40%] right-[-15%] w-[400px] h-[400px] bg-white/5 rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <span className="inline-block bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-5 border border-white/20">
            OneMalad Foundation
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Events & Activities</h1>
          <p className="text-base opacity-90 max-w-xl mx-auto">
            Social, cultural, and sports events bringing the Malad community together
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Filter */}
          <div className="flex gap-2 flex-wrap mb-8">
            {[
              { val: 'all' as const, label: 'All Events' },
              { val: 'social' as const, label: 'Social' },
              { val: 'cultural' as const, label: 'Cultural' },
              { val: 'sports' as const, label: 'Sports' },
              { val: 'education' as const, label: 'Education' },
              { val: 'health' as const, label: 'Health' },
              { val: 'cleanliness' as const, label: 'Cleanliness' },
              { val: 'environment' as const, label: 'Environment' },
            ].map((f) => (
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

          {/* Upcoming Events */}
          {upcoming.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FiCalendar className="text-blue-500" /> Upcoming Events
                <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                  {upcoming.length}
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((event) => (
                  <div key={event.id} className="card p-6 card-hover">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${categoryBadge[event.category] || 'bg-gray-100 text-gray-700'}`}>
                        {event.category}
                      </span>
                      <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md">
                        {Math.ceil((new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{event.description}</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <p className="flex items-center gap-2">
                        <FiClock className="text-blue-500 flex-shrink-0" />
                        {new Date(event.date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="flex items-center gap-2">
                        <FiClock className="text-blue-500 flex-shrink-0" />
                        {event.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <FiMapPin className="text-blue-500 flex-shrink-0" />
                        {event.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <FiUsers className="text-blue-500 flex-shrink-0" />
                        {event.attendees} attending
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                      Organized by {event.organizer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {past.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                Past Events
                <span className="text-xs font-medium bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                  {past.length}
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {past.map((event) => (
                  <div key={event.id} className="card p-6 opacity-70">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold capitalize mb-3 ${categoryBadge[event.category] || 'bg-gray-100 text-gray-700'}`}>
                      {event.category}
                    </span>
                    <h3 className="text-base font-semibold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{event.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(event.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      &middot; {event.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16 card">
              <p className="text-gray-400 text-lg">No events found for this category</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
