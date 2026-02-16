'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiMapPin, FiClock, FiNavigation, FiArrowRight, FiX } from 'react-icons/fi';
import { HiOutlineLocationMarker, HiOutlineSparkles, HiOutlinePhotograph } from 'react-icons/hi';
import { getPlaceBySlug, placesData } from '@/data/places';
import { wardsData, getCorporatorByWard } from '@/data/wards';

export default function DiscoverPlaceClient() {
  const params = useParams();
  const slug = params.slug as string;
  const place = getPlaceBySlug(slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!place) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Place Not Found</h1>
          <p className="text-gray-500 mb-4">This place doesn&apos;t exist in our directory.</p>
          <Link href="/#discover" className="text-blue-600 font-medium hover:underline">
            &larr; Back to Discover Malad
          </Link>
        </div>
      </div>
    );
  }

  const ward = wardsData.find((w) => w.number === place.ward);
  const corporator = getCorporatorByWard(place.ward);
  const otherPlaces = placesData.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      {/* Hero with Background Image */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={place.images[0]}
            alt={place.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative w-full">
          <Link href="/#discover" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <FiArrowLeft /> Back to Discover Malad
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 text-white">
              {place.tag}
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium border border-white/10 text-white/90">
              Ward {place.ward}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3">
            {place.title}
          </h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
            {place.shortDesc}
          </p>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlinePhotograph className="text-gray-400" />
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Photos</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {place.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="relative group rounded-xl overflow-hidden aspect-[4/3] cursor-pointer"
              >
                <img
                  src={img}
                  alt={`${place.title} photo ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setLightboxIndex(null)}
          >
            <FiX className="text-xl" />
          </button>
          <img
            src={place.images[lightboxIndex]}
            alt={`${place.title} photo ${lightboxIndex + 1}`}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {/* Nav arrows */}
          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
            >
              <FiArrowLeft />
            </button>
          )}
          {lightboxIndex < place.images.length - 1 && (
            <button
              className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
            >
              <FiArrowRight />
            </button>
          )}
          <div className="absolute bottom-4 text-white/60 text-sm">
            {lightboxIndex + 1} / {place.images.length}
          </div>
        </div>
      )}

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_300px] gap-10">
            {/* Main Content - Blog Style */}
            <div>
              <article>
                {place.content.map((para, i) => (
                  <div key={i}>
                    <p className="text-gray-600 leading-[1.85] text-[15px] mb-5">
                      {i === 0 ? (
                        <>
                          <span className="text-4xl font-bold text-gray-800 float-left mr-3 mt-1 leading-none">
                            {para.charAt(0)}
                          </span>
                          {para.slice(1)}
                        </>
                      ) : (
                        para
                      )}
                    </p>
                    {/* Insert an image between paragraphs */}
                    {i === 1 && place.images[1] && (
                      <div className="my-8 rounded-2xl overflow-hidden shadow-lg">
                        <img src={place.images[1]} alt={place.title} className="w-full h-64 sm:h-80 object-cover" />
                      </div>
                    )}
                    {i === 3 && place.images[2] && (
                      <div className="my-8 rounded-2xl overflow-hidden shadow-lg">
                        <img src={place.images[2]} alt={place.title} className="w-full h-64 sm:h-80 object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </article>

              {/* Highlights Grid */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                {place.highlights.map((h) => (
                  <div key={h.label} className="card p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{h.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{h.value}</p>
                  </div>
                ))}
              </div>

              {/* Visit Info */}
              <div className="mt-8 card p-6 bg-gradient-to-br from-blue-50 to-teal-50 border-blue-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <HiOutlineSparkles className="text-blue-500" /> Visitor Info
                </h3>
                <div className="space-y-3">
                  {place.bestTimeToVisit && (
                    <div className="flex items-start gap-3">
                      <FiClock className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Best Time to Visit</p>
                        <p className="text-sm text-gray-700">{place.bestTimeToVisit}</p>
                      </div>
                    </div>
                  )}
                  {place.howToReach && (
                    <div className="flex items-start gap-3">
                      <FiNavigation className="text-teal-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">How to Reach</p>
                        <p className="text-sm text-gray-700">{place.howToReach}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <HiOutlineLocationMarker className="text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nearby Places</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {place.nearbyPlaces.map((np) => (
                          <span key={np} className="px-2.5 py-1 bg-white rounded-lg text-xs text-gray-600 border border-gray-200">{np}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ward Card */}
              {ward && (
                <Link href={`/wards/${ward.number}`} className="card p-5 card-hover block group">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">This Place is in</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {ward.number}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Ward {ward.number}</p>
                      <p className="text-xs text-gray-400">{ward.zone} &middot; {ward.area}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{ward.description}</p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <FiMapPin className="text-gray-400 text-xs" />
                    <span className="text-xs text-gray-400">{ward.voters?.toLocaleString('en-IN')} voters</span>
                  </div>
                </Link>
              )}

              {/* Corporator Card */}
              {corporator && (
                <Link href={`/wards/${place.ward}`} className="card p-5 card-hover block group">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Your Corporator</p>
                  <div className="flex items-center gap-3">
                    {corporator.photo ? (
                      <img src={corporator.photo} alt={corporator.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                        {corporator.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{corporator.name}</p>
                      <p className="text-xs text-gray-500">{corporator.party}</p>
                      <p className="text-[10px] text-gray-400">{corporator.votes.toLocaleString()} votes</p>
                    </div>
                  </div>
                </Link>
              )}

              {/* Explore More */}
              <div className="card p-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Explore More</p>
                <div className="space-y-3">
                  {otherPlaces.map((p) => (
                    <Link key={p.slug} href={`/discover/${p.slug}`} className="flex items-center gap-3 group">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">{p.title}</p>
                        <p className="text-[10px] text-gray-400">Ward {p.ward} &middot; {p.tag}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/#discover" className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold mt-4 hover:underline">
                  View all places <FiArrowRight className="text-[10px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-2xl font-extrabold text-gray-800 mb-3">Have an issue in this area?</h3>
          <p className="text-gray-500 mb-6">Report civic problems near {place.title} and track their resolution</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`/issues?action=raise&ward=${place.ward}`} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm inline-flex items-center gap-2">
              Raise an Issue <FiArrowRight />
            </Link>
            <Link href={`/wards/${place.ward}`} className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all text-sm inline-flex items-center gap-2">
              View Ward {place.ward} <FiMapPin />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
