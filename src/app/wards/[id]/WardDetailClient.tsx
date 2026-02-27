'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMapPin, FiArrowLeft, FiHeart, FiEdit3, FiCalendar, FiUsers as FiUsersIcon } from 'react-icons/fi';
import { wardsData, getCorporatorByWard } from '@/data/wards';
import { useStore } from '@/hooks/useStore';
import { useAuth } from '@/context/AuthContext';
import { toggleSupport, subscribeToSupportCount, hasUserSupported, isFirebaseConfigured, WardUpdate, subscribeToWardUpdates } from '@/lib/firestore';
import dynamic from 'next/dynamic';
const MaladMap = dynamic(() => import('@/components/ui/MaladMap'), {
  loading: () => <div className="h-[350px] bg-gray-100 rounded-2xl animate-pulse" />,
  ssr: false,
});
import toast from 'react-hot-toast';

const activityCategoryLabels: Record<string, string> = {
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

const activityCategoryColors: Record<string, string> = {
  cleanliness_drive: 'bg-emerald-100 text-emerald-700',
  health_camp: 'bg-rose-100 text-rose-700',
  food_distribution: 'bg-orange-100 text-orange-700',
  education: 'bg-amber-100 text-amber-700',
  tree_planting: 'bg-green-100 text-green-700',
  blood_donation: 'bg-red-100 text-red-700',
  sports: 'bg-blue-100 text-blue-700',
  cultural: 'bg-purple-100 text-purple-700',
  infrastructure: 'bg-gray-100 text-gray-700',
  other: 'bg-slate-100 text-slate-700',
};

export default function WardDetailClient() {
  const params = useParams();
  const wardNum = Number(params.id);
  const ward = wardsData.find((w) => w.number === wardNum);
  const corporator = getCorporatorByWard(wardNum);
  const { activities } = useStore();
  const { user } = useAuth();
  const wardActivities = activities.filter((a) => a.wardNumber === wardNum);

  const [supportCount, setSupportCount] = useState(0);
  const [hasSupported, setHasSupported] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);
  const [wardUpdates, setWardUpdates] = useState<WardUpdate[]>([]);

  useEffect(() => {
    if (!isFirebaseConfigured() || !wardNum) return;
    const unsub = subscribeToSupportCount(wardNum, setSupportCount);
    return () => unsub();
  }, [wardNum]);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const unsub = subscribeToWardUpdates((updates) => {
      setWardUpdates(updates.filter((u) => u.wardNumber === wardNum));
    });
    return () => unsub();
  }, [wardNum]);

  useEffect(() => {
    if (!isFirebaseConfigured() || !user || !wardNum) return;
    hasUserSupported(wardNum, user.uid).then(setHasSupported);
  }, [wardNum, user]);

  const handleSupport = async () => {
    if (!user) {
      toast.error('Please sign in to support your representative');
      return;
    }
    setSupportLoading(true);
    try {
      const supported = await toggleSupport(wardNum, user.uid);
      setHasSupported(supported);
      toast.success(supported ? 'You support this representative!' : 'Support removed');
    } catch {
      toast.error('Failed to update support');
    }
    setSupportLoading(false);
  };

  if (!ward) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Ward Not Found</h1>
          <p className="text-gray-500 mb-4">This ward doesn&apos;t exist in our system.</p>
          <Link href="/wards" className="text-blue-600 font-medium hover:underline">
            &larr; Back to Wards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link href="/wards" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-4 transition-colors">
            <FiArrowLeft /> Back to Wards
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            {/* Left: Ward Info */}
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl sm:text-5xl font-extrabold">Ward {ward.number}</span>
              </div>
              <p className="text-lg opacity-90 mb-2">{ward.name}</p>
              <span className="inline-block bg-white/15 px-4 py-1 rounded-full text-sm border border-white/20">
                {ward.zone} &middot; {ward.area}
              </span>
            </div>

            {/* Right: Stats + Representative */}
            <div className="flex flex-wrap items-end gap-4">
              {/* Quick Stats */}
              <div className="flex gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15 text-center min-w-[80px]">
                  <div className="text-2xl font-extrabold">{ward.voters ? ward.voters.toLocaleString('en-IN') : '\u2014'}</div>
                  <div className="text-[10px] uppercase tracking-wider opacity-70 mt-0.5">Voters</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15 text-center min-w-[80px]">
                  <div className="text-2xl font-extrabold">{ward.population ? ward.population.toLocaleString('en-IN') : '\u2014'}</div>
                  <div className="text-[10px] uppercase tracking-wider opacity-70 mt-0.5">Population</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15 text-center min-w-[80px]">
                  <div className="text-2xl font-extrabold">{wardActivities.length}</div>
                  <div className="text-[10px] uppercase tracking-wider opacity-70 mt-0.5">Activities</div>
                </div>
              </div>

              {/* Representative Badge */}
              {corporator && (
                <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
                  <div className="text-sm font-bold">{corporator.name}</div>
                  <div className="text-xs opacity-80 mt-0.5">{corporator.party}</div>
                  <div className="text-[10px] opacity-60 mt-1">{corporator.votes.toLocaleString()} votes secured</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[350px_1fr] gap-8">
            {/* Representative Sidebar */}
            <div className="space-y-6">
              {corporator && (
                <div className="card p-7 sticky top-24">
                  <div className="text-center mb-5">
                    {corporator.photo ? (
                      <img
                        src={corporator.photo}
                        alt={corporator.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 border-4 border-white shadow-lg">
                        {corporator.name.charAt(0)}
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-gray-800">{corporator.name}</h3>
                    <p className="text-sm text-gray-500">{corporator.party}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                      {corporator.votes.toLocaleString()} votes
                    </span>
                  </div>
                  {corporator.bio && (
                    <p className="text-sm text-gray-500 mb-5 leading-relaxed">{corporator.bio}</p>
                  )}

                  {/* I Support Button — only for logged-in users */}
                  {user ? (
                    <button
                      onClick={handleSupport}
                      disabled={supportLoading}
                      className={`w-full mt-3 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                        hasSupported
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200'
                          : 'bg-gray-50 text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <FiHeart className={hasSupported ? 'fill-current' : ''} />
                      {hasSupported ? `You Support ${corporator.name.split(' ')[0]}` : `I Support ${corporator.name.split(' ')[0]}`}
                      {supportCount > 0 && (
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${hasSupported ? 'bg-white/20' : 'bg-gray-200'}`}>
                          {supportCount}
                        </span>
                      )}
                    </button>
                  ) : supportCount > 0 ? (
                    <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-400">
                      <FiHeart /> {supportCount} supporter{supportCount !== 1 ? 's' : ''}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Ward Info */}
              <div className="card p-6">
                <h4 className="font-semibold text-gray-800 mb-3">About This Ward</h4>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{ward.description}</p>
                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Landmarks</h5>
                <div className="flex flex-wrap gap-2">
                  {ward.landmarks.map((l) => (
                    <span key={l} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-md border border-gray-100">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div>
              {/* Ward Map */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiMapPin className="text-blue-500" /> Ward {ward.number} Map
                </h2>
                <MaladMap focusWard={wardNum} height="350px" showLandmarks={true} />
              </div>

              {/* Ward Updates */}
              {wardUpdates.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FiEdit3 className="text-teal-500" /> Community Updates
                  </h2>
                  <div className="space-y-4">
                    {wardUpdates.slice(0, 3).map((update) => (
                      <div key={update.id} className="card p-5 card-hover border-l-4 border-l-teal-500">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                            {update.corporatorName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(update.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-gray-800 mb-1">{update.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{update.content}</p>
                        {update.imageUrls.length > 0 && (
                          <div className="flex gap-2 mt-3 overflow-x-auto">
                            {update.imageUrls.map((url, i) => (
                              <img key={i} src={url} alt={`Update ${i + 1}`} className="w-24 h-24 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ward Activities */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FiCalendar className="text-blue-500" />
                  Foundation Activities <span className="text-sm font-medium text-gray-400">({wardActivities.length})</span>
                </h2>
                <Link
                  href="/our-work"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all"
                >
                  View All Work
                </Link>
              </div>

              {wardActivities.length > 0 ? (
                <div className="space-y-4">
                  {wardActivities.map((activity) => (
                    <div key={activity.id} className="card p-5 card-hover">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{activity.description}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${activityCategoryColors[activity.category] || 'bg-gray-100 text-gray-700'}`}>
                          {activityCategoryLabels[activity.category] || activity.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="text-blue-500" />
                          {new Date(activity.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMapPin className="text-blue-500" />
                          {activity.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiUsersIcon className="text-blue-500" />
                          {activity.volunteersCount} volunteers
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 card">
                  <FiCalendar className="text-4xl text-blue-300 mx-auto mb-3" />
                  <p className="text-gray-500">No activities recorded for this ward yet.</p>
                  <Link
                    href="/volunteer"
                    className="inline-block mt-4 text-blue-600 font-medium hover:underline text-sm"
                  >
                    Volunteer for this ward
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
