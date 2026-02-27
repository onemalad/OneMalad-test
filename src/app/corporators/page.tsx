'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HiOutlineSearch } from 'react-icons/hi';
import { FiMapPin, FiUsers } from 'react-icons/fi';
import { corporatorsData, getWardByNumber } from '@/data/wards';

export default function CorporatorsPage() {
  const [search, setSearch] = useState('');

  const filtered = corporatorsData.filter((c) => {
    const ward = getWardByNumber(c.wardNumber);
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.party.toLowerCase().includes(search.toLowerCase()) ||
      c.wardNumber.toString().includes(search) ||
      (ward && ward.name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <>
      {/* Header */}
      <section className="page-header-gradient relative overflow-hidden">
        <div className="absolute top-[-40%] right-[-15%] w-[400px] h-[400px] bg-white/5 rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Election Banner */}
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between flex-wrap gap-3 mb-8 border border-white/20">
            <h3 className="font-semibold text-sm">BMC Election 2026: Official Results</h3>
            <span className="text-xs opacity-80">Results declared on 16 January 2026</span>
          </div>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Community Representatives</h1>
            <p className="text-base opacity-90 mb-6">
              Meet the elected representatives serving Malad&apos;s wards
            </p>
            <div className="max-w-lg mx-auto relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-lg" />
              <input
                type="text"
                placeholder="Search by name, party, or ward..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-5 py-3.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white placeholder:text-white/60 outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Corporators Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((corp) => {
              const ward = getWardByNumber(corp.wardNumber);
              return (
                <Link href={`/wards/${corp.wardNumber}`} key={corp.id}>
                  <div className="card p-7 card-hover cursor-pointer h-full">
                    <div className="text-center mb-5">
                      {corp.photo ? (
                        <img
                          src={corp.photo}
                          alt={corp.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-3 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 border-3 border-white shadow-md">
                          {corp.name.charAt(0)}
                        </div>
                      )}
                      <span className="inline-block px-3 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full mb-2">
                        {corp.votes.toLocaleString()} votes
                      </span>
                      <h3 className="text-lg font-bold text-gray-800">{corp.name}</h3>
                      <p className="text-sm text-gray-500">{corp.party}</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">
                        Ward {corp.wardNumber} &middot; {ward?.zone || ''}
                      </p>
                    </div>

                    {corp.bio && (
                      <p className="text-sm text-gray-500 text-center line-clamp-2 mb-4">{corp.bio}</p>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
                      <div className="text-center p-2.5 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1">
                          <FiMapPin className="text-blue-500" />
                          <span className="text-base font-bold text-gray-800">{ward?.landmarks.length || 0}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Landmarks</p>
                      </div>
                      <div className="text-center p-2.5 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1">
                          <FiUsers className="text-teal-500" />
                          <span className="text-base font-bold text-gray-800">{ward?.population ? (ward.population / 1000).toFixed(0) + 'K' : '\u2014'}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Population</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No representatives found matching &quot;{search}&quot;</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
