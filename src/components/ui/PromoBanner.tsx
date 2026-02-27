'use client';

import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { isFirebaseConfigured, Banner, subscribeToBanners } from '@/lib/firestore';

// Fallback banners when Firestore is not connected
const defaultBanners: Banner[] = [
  { id: 'hero-1', title: 'OneMalad Cricket Premier League 2026', subtitle: 'Register your ward team now! Exciting prizes worth Rs 1 Lakh', ctaText: 'Register Now', ctaLink: '/events', placement: 'hero', bgGradient: 'from-violet-600 via-purple-600 to-indigo-700', active: true },
  { id: 'hero-2', title: 'Join the OneMalad Movement', subtitle: 'Volunteer for community drives in your ward. Together we serve, together we grow.', ctaText: 'Get Involved', ctaLink: '/volunteer', placement: 'hero', bgGradient: 'from-blue-600 via-cyan-600 to-teal-500', active: true },
  { id: 'inline-1', title: 'Free Health Camp - Feb 28', subtitle: 'General checkup, eye testing, dental checkup at Tanaji Nagar', ctaText: 'Learn More', ctaLink: '/events', placement: 'inline', bgGradient: 'from-emerald-500 to-teal-600', active: true },
  { id: 'footer-1', title: 'Partner with OneMalad', subtitle: 'Local businesses & organizations - lets build Malad together', ctaText: 'Get in Touch', ctaLink: '#', placement: 'footer', bgGradient: 'from-violet-600 to-blue-600', active: true },
];

interface PromoBannerProps {
  placement: 'hero' | 'sidebar' | 'inline' | 'footer';
  className?: string;
}

export default function PromoBanner({ placement, className = '' }: PromoBannerProps) {
  const [allBanners, setAllBanners] = useState<Banner[]>(defaultBanners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Subscribe to Firestore banners
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const unsub = subscribeToBanners((firestoreBanners) => {
      if (firestoreBanners.length > 0) {
        setAllBanners(firestoreBanners);
      }
    });
    return unsub;
  }, []);

  const banners = allBanners.filter((b) => b.placement === placement && b.active);

  // Auto-rotate hero banners
  useEffect(() => {
    if (placement !== 'hero' || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [placement, banners.length]);

  if (dismissed || banners.length === 0) return null;

  const safeIndex = currentIndex % Math.max(banners.length, 1);
  const banner = banners[safeIndex];
  if (!banner) return null;

  if (placement === 'hero') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${banner.bgGradient} text-white p-6 sm:p-8 ${className}`}>
        <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-[-30%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {banner.imageUrl && (
              <img src={banner.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-lg" />
            )}
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-1">{banner.title}</h3>
              {banner.subtitle && <p className="text-sm opacity-90">{banner.subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {banner.ctaText && (
              <a
                href={banner.ctaLink || '#'}
                className="px-5 py-2.5 bg-white text-gray-900 font-semibold text-sm rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
              >
                {banner.ctaText}
              </a>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiX />
            </button>
          </div>
        </div>
        {banners.length > 1 && (
          <div className="flex gap-1.5 mt-4 justify-center">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === safeIndex ? 'bg-white w-5' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (placement === 'sidebar') {
    return (
      <div className={`rounded-xl border-2 border-dashed border-gray-200 bg-gradient-to-br ${banner.bgGradient} p-5 text-center ${className}`}>
        {banner.imageUrl && (
          <img src={banner.imageUrl} alt="" className="w-full h-24 rounded-lg object-cover mb-3" />
        )}
        <p className={`text-sm font-bold ${banner.bgGradient.includes('gray-1') ? 'text-gray-600' : 'text-white'} mb-1`}>{banner.title}</p>
        {banner.subtitle && (
          <p className={`text-xs ${banner.bgGradient.includes('gray-1') ? 'text-gray-400' : 'text-white/70'} mb-3`}>{banner.subtitle}</p>
        )}
        {banner.ctaText && (
          <a
            href={banner.ctaLink || '#'}
            className="inline-block px-4 py-1.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all"
          >
            {banner.ctaText}
          </a>
        )}
      </div>
    );
  }

  if (placement === 'inline') {
    return (
      <div className={`rounded-xl bg-gradient-to-r ${banner.bgGradient} text-white px-5 py-4 flex items-center justify-between gap-4 flex-wrap ${className}`}>
        <div className="flex items-center gap-3">
          {banner.imageUrl && (
            <img src={banner.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
          )}
          <div>
            <h4 className="font-bold text-sm">{banner.title}</h4>
            {banner.subtitle && <p className="text-xs opacity-90">{banner.subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {banner.ctaText && (
            <a
              href={banner.ctaLink || '#'}
              className="px-4 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold rounded-lg hover:bg-white/30 transition-all"
            >
              {banner.ctaText}
            </a>
          )}
          <button onClick={() => setDismissed(true)} className="p-1 hover:bg-white/20 rounded">
            <FiX className="text-sm" />
          </button>
        </div>
      </div>
    );
  }

  // Footer banner
  return (
    <div className={`rounded-xl bg-gradient-to-r ${banner.bgGradient} text-white px-6 py-5 text-center ${className}`}>
      {banner.imageUrl && (
        <img src={banner.imageUrl} alt="" className="w-full h-28 rounded-lg object-cover mb-3 mx-auto max-w-sm" />
      )}
      <h4 className="font-bold text-base mb-1">{banner.title}</h4>
      {banner.subtitle && <p className="text-sm opacity-80 mb-3">{banner.subtitle}</p>}
      {banner.ctaText && (
        <a
          href={banner.ctaLink || '#'}
          className="inline-block px-5 py-2 bg-white text-gray-900 font-semibold text-sm rounded-lg hover:shadow-lg transition-all"
        >
          {banner.ctaText}
        </a>
      )}
    </div>
  );
}
