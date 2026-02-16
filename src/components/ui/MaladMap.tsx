'use client';

import { FiMapPin, FiNavigation } from 'react-icons/fi';
import { HiOutlineLocationMarker } from 'react-icons/hi';

// Ward data with Google Maps search queries
const wardData: Record<number, { name: string; query: string; areas: string[]; color: string }> = {
  32: {
    name: 'Jankalyan Old MHADA - Marve - Manori',
    query: 'Jankalyan+Malad+West+Mumbai',
    areas: ['Jankalyan Old MHADA', 'Jankalyan', 'Marve', 'Manori Village'],
    color: '#f97316',
  },
  33: {
    name: 'Rathodi - Malwani 6 No',
    query: 'Rathodi+Malwani+Malad+West+Mumbai',
    areas: ['Rathodi', 'Malwani 6 No'],
    color: '#0ea5e9',
  },
  34: {
    name: 'Malwani 1 No - NCC - Gate 6 & 7',
    query: 'Malwani+Malad+West+Mumbai',
    areas: ['Malwani 1 No', 'NCC', 'Gate 6', 'Gate 7'],
    color: '#22c55e',
  },
  48: {
    name: 'Malwani MHADA - 7 No',
    query: 'Malwani+MHADA+Malad+West+Mumbai',
    areas: ['Malwani MHADA', 'Malwani 7 No'],
    color: '#8b5cf6',
  },
  49: {
    name: 'Madh Island - Ambujwadi',
    query: 'Madh+Island+Mumbai',
    areas: ['Madh Island', 'Ambujwadi', 'Madh Jetty', 'Madh Fort'],
    color: '#ec4899',
  },
};

// All wards for overview
const allWards = Object.entries(wardData).map(([num, data]) => ({
  wardNumber: Number(num),
  ...data,
}));

interface MaladMapProps {
  focusWard?: number;
  height?: string;
  showLandmarks?: boolean;
}

export default function MaladMap({ focusWard, height = '500px', showLandmarks = true }: MaladMapProps) {
  const ward = focusWard ? wardData[focusWard] : null;
  const query = ward ? ward.query : 'Malwani+Malad+West+Mumbai';

  return (
    <div className="relative">
      {/* Google Maps Embed */}
      <div
        style={{ height }}
        className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
      >
        <iframe
          src={`https://maps.google.com/maps?q=${query}&t=&z=${focusWard ? 15 : 13}&ie=UTF8&iwloc=&output=embed`}
          style={{ width: '100%', height: '100%', border: 0, borderRadius: '16px' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Ward Legend (overview mode) */}
      {!focusWard && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {allWards.map((w) => (
            <div
              key={w.wardNumber}
              className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-100 hover:border-gray-300 transition-colors cursor-default"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: w.color }}
              >
                {w.wardNumber}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-700 truncate">{w.name.split(' - ')[0]}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Focused ward areas */}
      {focusWard && ward && showLandmarks && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Areas Covered</h4>
          <div className="flex flex-wrap gap-2">
            {ward.areas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-gray-100 text-xs text-gray-600"
              >
                <HiOutlineLocationMarker className="text-gray-400" />
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
