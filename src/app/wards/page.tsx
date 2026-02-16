'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HiOutlineSearch } from 'react-icons/hi';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { wardsData, getCorporatorByWard } from '@/data/wards';
import { useStore } from '@/hooks/useStore';

export default function WardsPage() {
  const [search, setSearch] = useState('');
  const { issues } = useStore();

  const filtered = wardsData.filter((w) => {
    const corp = getCorporatorByWard(w.number);
    return (
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      (corp && corp.name.toLowerCase().includes(search.toLowerCase())) ||
      w.number.toString().includes(search) ||
      w.area.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <>
      {/* Header */}
      <section className="page-header-gradient relative overflow-hidden">
        <div className="absolute top-[-40%] right-[-15%] w-[400px] h-[400px] bg-white/5 rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Malad Wards</h1>
          <p className="text-base opacity-90 mb-6">Find your ward and see the issues in your area</p>
          <div className="max-w-lg mx-auto relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-lg" />
            <input
              type="text"
              placeholder="Search by ward number, area, or corporator name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white placeholder:text-white/60 outline-none text-sm"
            />
          </div>
        </div>
      </section>

      {/* Wards Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-bold text-gray-800">P-North & P-South Wards</h2>
            <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
              {filtered.length} wards
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {filtered.map((ward) => {
              const corp = getCorporatorByWard(ward.number);
              const wardIssues = issues.filter((i) => i.wardNumber === ward.number);
              const pendingCount = wardIssues.filter((i) => i.status === 'pending').length;
              const resolvedCount = wardIssues.filter((i) => i.status === 'resolved').length;

              return (
                <Link href={`/wards/${ward.number}`} key={ward.number}>
                  <div className="card card-hover cursor-pointer h-full overflow-hidden">
                    {ward.image && (
                      <img src={ward.image} alt={ward.name} className="w-full h-36 object-cover" />
                    )}
                    <div className="p-5 text-center">
                      <h3 className="text-lg font-extrabold text-gray-800 mb-1">{ward.name}</h3>
                      <p className="text-xs text-gray-400 mb-4">{ward.area}</p>

                      {corp && (
                        <div className="flex items-center gap-2.5 justify-center mb-4">
                          {corp.photo ? (
                            <img src={corp.photo} alt={corp.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                              {corp.name.charAt(0)}
                            </div>
                          )}
                          <div className="text-left">
                            <p className="text-sm font-semibold text-gray-700">{corp.name}</p>
                            <p className="text-xs text-gray-400">{corp.party}</p>
                          </div>
                        </div>
                      )}

                      <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-amber-600">
                            <FiAlertCircle className="text-xs" />
                            <span className="text-sm font-bold">{pendingCount}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Pending</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-green-600">
                            <FiCheckCircle className="text-xs" />
                            <span className="text-sm font-bold">{resolvedCount}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Resolved</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No wards found matching &quot;{search}&quot;</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
