'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { wardsData, corporatorsData, getCorporatorByWard } from '@/data/wards';
import {
  FiUsers, FiMapPin, FiCalendar, FiCheckCircle, FiHeart,
  FiTrash2, FiPlus, FiX, FiBarChart2, FiSettings, FiImage, FiActivity
} from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CommunityEvent, Activity, ActivityCategory } from '@/types';
import {
  isFirebaseConfigured,
  Banner,
  subscribeToBanners,
  createBannerInFirestore,
  updateBannerInFirestore,
  deleteBannerFromFirestore,
  updateUserRole,
  createActivityInFirestore,
  deleteActivityFromFirestore,
  subscribeToVolunteers,
} from '@/lib/firestore';
import { Volunteer } from '@/types';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const DEFAULT_BANNERS: Banner[] = [
  { id: 'b1', title: 'OneMalad Cricket Premier League 2026', subtitle: 'Register your ward team now!', ctaText: 'Register Now', ctaLink: '/events', placement: 'hero', bgGradient: 'from-violet-600 via-purple-600 to-indigo-700', active: true },
  { id: 'b2', title: 'Join the OneMalad Movement', subtitle: 'Volunteer for community drives in your ward', ctaText: 'Get Involved', ctaLink: '/volunteer', placement: 'hero', bgGradient: 'from-blue-600 via-cyan-600 to-teal-500', active: true },
  { id: 'b3', title: 'Advertise Here', subtitle: 'Reach 50,000+ Malad residents', ctaText: 'Contact Us', ctaLink: '#', placement: 'sidebar', bgGradient: 'from-gray-100 to-gray-50', active: true },
  { id: 'b4', title: 'Free Health Camp - Feb 28', subtitle: 'General checkup, eye testing, dental checkup', ctaText: 'Learn More', ctaLink: '/events', placement: 'inline', bgGradient: 'from-emerald-500 to-teal-600', active: true },
  { id: 'b5', title: 'Partner with OneMalad', subtitle: 'Local businesses & organizations - lets build Malad together', ctaText: 'Get in Touch', ctaLink: '#', placement: 'footer', bgGradient: 'from-violet-600 to-blue-600', active: true },
];

const activityCategories: { val: ActivityCategory; label: string }[] = [
  { val: 'cleanliness_drive', label: 'Cleanliness Drive' },
  { val: 'health_camp', label: 'Health Camp' },
  { val: 'food_distribution', label: 'Food Distribution' },
  { val: 'education', label: 'Education' },
  { val: 'tree_planting', label: 'Tree Planting' },
  { val: 'blood_donation', label: 'Blood Donation' },
  { val: 'sports', label: 'Sports' },
  { val: 'cultural', label: 'Cultural' },
  { val: 'infrastructure', label: 'Infrastructure' },
  { val: 'other', label: 'Other' },
];

export default function AdminPage() {
  const { user } = useAuth();
  const { activities, events, impactStats, addActivity, deleteActivity, addEvent, deleteEvent } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'events' | 'volunteers' | 'users' | 'banners' | 'wards' | 'settings'>('overview');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  // Activity form
  const [actTitle, setActTitle] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actCategory, setActCategory] = useState<ActivityCategory>('cleanliness_drive');
  const [actDate, setActDate] = useState('');
  const [actLocation, setActLocation] = useState('');
  const [actWard, setActWard] = useState('');
  const [actVolunteers, setActVolunteers] = useState('');
  const [actBeneficiaries, setActBeneficiaries] = useState('');

  // Event form
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventCategory, setEventCategory] = useState('social');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventVenue, setEventVenue] = useState('');

  // Banner form
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerCta, setBannerCta] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [bannerPlacement, setBannerPlacement] = useState<'hero' | 'sidebar' | 'inline' | 'footer'>('hero');
  const [bannerGradient, setBannerGradient] = useState('from-violet-600 via-purple-600 to-indigo-700');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState('');
  const bannerFileRef = useRef<HTMLInputElement>(null);

  // State
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);
  const [users, setUsers] = useState<Array<{ uid: string; email: string; displayName: string; role: string; wardNumber?: number; createdAt?: string }>>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  // Subscribe to Firestore
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const unsub = subscribeToBanners((firestoreBanners) => {
      setBanners(firestoreBanners.length > 0 ? firestoreBanners : DEFAULT_BANNERS);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() } as { uid: string; email: string; displayName: string; role: string; wardNumber?: number; createdAt?: string }));
      setUsers(usersList);
    }, (error) => {
      console.error('Firestore users listener error:', error);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const unsub = subscribeToVolunteers((vols) => {
      setVolunteers(vols);
    });
    return unsub;
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-4">You need admin access to view this page.</p>
          <Link href="/dashboard" className="text-blue-600 font-medium hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date()).length;

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle || !actDate || !actLocation) {
      toast.error('Fill all required fields');
      return;
    }
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      title: actTitle,
      description: actDesc,
      category: actCategory,
      date: actDate,
      location: actLocation,
      wardNumber: actWard ? Number(actWard) : undefined,
      imageUrls: [],
      volunteersCount: Number(actVolunteers) || 0,
      beneficiariesCount: Number(actBeneficiaries) || 0,
      createdAt: new Date().toISOString(),
    };
    if (isFirebaseConfigured()) {
      const { id, ...data } = newActivity;
      await createActivityInFirestore(data);
    } else {
      addActivity(newActivity);
    }
    toast.success('Activity created!');
    setShowActivityModal(false);
    setActTitle(''); setActDesc(''); setActDate(''); setActLocation(''); setActWard(''); setActVolunteers(''); setActBeneficiaries('');
  };

  const handleDeleteActivity = (id: string) => {
    deleteActivity(id);
    toast.success('Activity deleted');
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDate || !eventVenue) {
      toast.error('Fill all required fields');
      return;
    }
    const newEvent: CommunityEvent = {
      id: `event-${Date.now()}`,
      title: eventTitle,
      description: eventDesc,
      category: eventCategory as CommunityEvent['category'],
      date: eventDate,
      time: eventTime,
      location: eventVenue,
      organizer: 'OneMalad Foundation',
      attendees: 0,
      isUpcoming: new Date(eventDate) >= new Date(),
    };
    addEvent(newEvent);
    toast.success('Event created!');
    setShowEventModal(false);
    setEventTitle(''); setEventDesc(''); setEventDate(''); setEventTime(''); setEventVenue('');
  };

  const handleBannerImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large (max 5MB)');
      return;
    }
    setBannerImageFile(file);
    setBannerImagePreview(URL.createObjectURL(file));
    setBannerImageUrl('');
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle) {
      toast.error('Banner title is required');
      return;
    }
    let imageUrl = bannerImageUrl;
    if (bannerImageFile && isFirebaseConfigured()) {
      const { uploadIssueImages } = await import('@/lib/storage');
      const urls = await uploadIssueImages([bannerImageFile]);
      imageUrl = urls[0] || '';
    }
    const newBanner: Omit<Banner, 'id'> = {
      title: bannerTitle,
      subtitle: bannerSubtitle,
      ctaText: bannerCta,
      ctaLink: bannerLink,
      placement: bannerPlacement,
      bgGradient: bannerGradient,
      active: true,
      ...(imageUrl ? { imageUrl } : {}),
    };
    if (isFirebaseConfigured()) {
      await createBannerInFirestore(newBanner);
    } else {
      setBanners((prev) => [...prev, { id: `b-${Date.now()}`, ...newBanner }]);
    }
    toast.success('Banner created!');
    setShowBannerModal(false);
    setBannerTitle(''); setBannerSubtitle(''); setBannerCta(''); setBannerLink(''); setBannerImageUrl('');
    setBannerImageFile(null);
    if (bannerImagePreview) URL.revokeObjectURL(bannerImagePreview);
    setBannerImagePreview('');
  };

  const handleDeleteBanner = async (id: string) => {
    if (isFirebaseConfigured()) {
      await deleteBannerFromFirestore(id);
    } else {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
    toast.success('Banner deleted');
  };

  const handleToggleBanner = async (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (!banner) return;
    if (isFirebaseConfigured()) {
      await updateBannerInFirestore(id, { active: !banner.active });
    } else {
      setBanners((prev) => prev.map((b) => b.id === id ? { ...b, active: !b.active } : b));
    }
  };

  const handleRoleChange = async (uid: string, newRole: string, wardNumber?: number) => {
    try {
      await updateUserRole(uid, newRole, wardNumber);
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      console.error('Error updating role:', err);
      toast.error('Failed to update role');
    }
  };

  const tabs = [
    { val: 'overview' as const, label: 'Overview', icon: <FiBarChart2 /> },
    { val: 'activities' as const, label: 'Activities', icon: <FiActivity /> },
    { val: 'events' as const, label: 'Events', icon: <FiCalendar /> },
    { val: 'volunteers' as const, label: 'Volunteers', icon: <FiHeart /> },
    { val: 'users' as const, label: 'Users', icon: <FiUsers /> },
    { val: 'banners' as const, label: 'Banners', icon: <FiImage /> },
    { val: 'wards' as const, label: 'Wards', icon: <FiMapPin /> },
    { val: 'settings' as const, label: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Foundation Admin</p>
              <h1 className="text-xl font-bold">OneMalad Admin Panel</h1>
            </div>
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              View Site &rarr;
            </Link>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.val}
                onClick={() => setActiveTab(tab.val)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.val ? 'bg-white text-gray-900' : 'text-gray-400 hover:bg-white/10'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {[
                  { label: 'Activities', val: activities.length, icon: <FiActivity />, color: 'text-blue-600' },
                  { label: 'Volunteers', val: volunteers.length, icon: <FiHeart />, color: 'text-rose-600' },
                  { label: 'Events', val: upcomingEvents, icon: <FiCalendar />, color: 'text-purple-600' },
                  { label: 'Users', val: users.length, icon: <FiUsers />, color: 'text-teal-600' },
                  { label: 'Banners', val: banners.filter((b) => b.active).length, icon: <FiImage />, color: 'text-amber-600' },
                ].map((s) => (
                  <div key={s.label} className="card p-5 text-center">
                    <div className={`text-xl ${s.color} flex justify-center mb-1`}>{s.icon}</div>
                    <div className={`text-2xl font-extrabold ${s.color}`}>{s.val}</div>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Impact Stats */}
              <h3 className="font-semibold text-gray-800 mb-4">Foundation Impact</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {impactStats.sort((a, b) => a.order - b.order).map((stat) => (
                  <div key={stat.id} className="card p-4 text-center">
                    <div className="text-2xl mb-1">{stat.emoji}</div>
                    <div className="text-xl font-extrabold text-gray-800">{stat.value.toLocaleString()}{stat.suffix}</div>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Ward Overview */}
              <h3 className="font-semibold text-gray-800 mb-4">Ward Overview</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {wardsData.map((ward) => {
                  const corp = getCorporatorByWard(ward.number);
                  const wardActivities = activities.filter((a) => a.wardNumber === ward.number);
                  return (
                    <div key={ward.number} className="card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">Ward {ward.number}</h4>
                          <p className="text-xs text-gray-400">{corp?.name || 'No representative'}</p>
                        </div>
                        <span className="text-sm font-bold text-blue-600">{wardActivities.length}</span>
                      </div>
                      <p className="text-xs text-gray-400">{wardActivities.length} activities &middot; {ward.population ? ward.population.toLocaleString('en-IN') : '\u2014'} population</p>
                    </div>
                  );
                })}
              </div>

              {/* Representatives */}
              <h3 className="font-semibold text-gray-800 mb-4">Community Representatives</h3>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="text-left px-4 py-3">Representative</th>
                      <th className="text-left px-4 py-3">Ward</th>
                      <th className="text-left px-4 py-3">Party</th>
                      <th className="text-center px-4 py-3">Votes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {corporatorsData.map((corp) => (
                      <tr key={corp.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{corp.name}</td>
                        <td className="px-4 py-3 text-gray-500">Ward {corp.wardNumber}</td>
                        <td className="px-4 py-3 text-gray-500">{corp.party}</td>
                        <td className="px-4 py-3 text-center text-blue-600 font-medium">{corp.votes.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Activities Management */}
          {activeTab === 'activities' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Activities ({activities.length})</h2>
                <button
                  onClick={() => setShowActivityModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <FiPlus /> New Activity
                </button>
              </div>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="card p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                        <p className="text-xs text-gray-400">
                          {activity.category.replace('_', ' ')} &middot; {activity.location} &middot; {new Date(activity.date).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{activity.description}</p>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>{activity.volunteersCount} volunteers</span>
                      <span>{activity.beneficiariesCount} beneficiaries</span>
                      {activity.wardNumber && <span>Ward {activity.wardNumber}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* New Activity Modal */}
              {showActivityModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Create Activity</h2>
                      <button onClick={() => setShowActivityModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                        <FiX className="text-xl text-gray-500" />
                      </button>
                    </div>
                    <form onSubmit={handleAddActivity} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Activity Title *</label>
                        <input type="text" value={actTitle} onChange={(e) => setActTitle(e.target.value)} placeholder="Activity name" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select value={actCategory} onChange={(e) => setActCategory(e.target.value as ActivityCategory)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500">
                          {activityCategories.map((c) => (
                            <option key={c.val} value={c.val}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea value={actDesc} onChange={(e) => setActDesc(e.target.value)} rows={3} placeholder="Activity description" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 resize-y" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                          <input type="date" value={actDate} onChange={(e) => setActDate(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                          <select value={actWard} onChange={(e) => setActWard(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500">
                            <option value="">All Wards</option>
                            {wardsData.map((w) => (
                              <option key={w.number} value={w.number}>Ward {w.number}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                        <input type="text" value={actLocation} onChange={(e) => setActLocation(e.target.value)} placeholder="e.g. Marve Beach, Malad West" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500" required />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Volunteers</label>
                          <input type="number" value={actVolunteers} onChange={(e) => setActVolunteers(e.target.value)} placeholder="0" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiaries</label>
                          <input type="number" value={actBeneficiaries} onChange={(e) => setActBeneficiaries(e.target.value)} placeholder="0" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500" />
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={() => setShowActivityModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold text-sm">Create Activity</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Events Management */}
          {activeTab === 'events' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Events ({events.length})</h2>
                <button
                  onClick={() => setShowEventModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <FiPlus /> New Event
                </button>
              </div>
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="card p-5 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{event.title}</h3>
                      <p className="text-xs text-gray-400">
                        {new Date(event.date).toLocaleDateString('en-IN')} &middot; {event.location} &middot; {event.category}
                      </p>
                    </div>
                    <button
                      onClick={() => { deleteEvent(event.id); toast.success('Event deleted'); }}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>

              {/* New Event Modal */}
              {showEventModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Create Event</h2>
                      <button onClick={() => setShowEventModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                        <FiX className="text-xl text-gray-500" />
                      </button>
                    </div>
                    <form onSubmit={handleAddEvent} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                        <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Event name" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select value={eventCategory} onChange={(e) => setEventCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500">
                          <option value="social">Social</option>
                          <option value="cultural">Cultural</option>
                          <option value="sports">Sports</option>
                          <option value="education">Education</option>
                          <option value="health">Health</option>
                          <option value="cleanliness">Cleanliness</option>
                          <option value="environment">Environment</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} rows={3} placeholder="Event description" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 resize-y" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                          <input type="text" value={eventTime} onChange={(e) => setEventTime(e.target.value)} placeholder="e.g. 5:00 PM - 9:00 PM" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
                        <input type="text" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} placeholder="Event venue" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500" required />
                      </div>
                      <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={() => setShowEventModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold text-sm">Create Event</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Volunteers */}
          {activeTab === 'volunteers' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Volunteer Registrations ({volunteers.length})</h2>
                  <p className="text-sm text-gray-500">People who signed up to volunteer through the website</p>
                </div>
              </div>

              {volunteers.length === 0 ? (
                <div className="text-center py-16 card">
                  <FiHeart className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">No volunteer registrations yet.</p>
                  {!isFirebaseConfigured() && <p className="text-xs text-amber-500 mt-2">Firestore not connected — volunteers will appear when Firebase is configured.</p>}
                </div>
              ) : (
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="text-left px-4 py-3">Name</th>
                        <th className="text-left px-4 py-3">Phone</th>
                        <th className="text-left px-4 py-3">Email</th>
                        <th className="text-left px-4 py-3">Ward</th>
                        <th className="text-left px-4 py-3">Interests</th>
                        <th className="text-left px-4 py-3">Status</th>
                        <th className="text-left px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {volunteers.map((v) => (
                        <tr key={v.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{v.name}</td>
                          <td className="px-4 py-3 text-gray-500">{v.phone}</td>
                          <td className="px-4 py-3 text-gray-500">{v.email || '\u2014'}</td>
                          <td className="px-4 py-3 text-gray-500">{v.wardNumber ? `Ward ${v.wardNumber}` : '\u2014'}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {v.interests.slice(0, 2).map((i) => (
                                <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-md font-medium">
                                  {i.replace('_', ' ')}
                                </span>
                              ))}
                              {v.interests.length > 2 && (
                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-md">+{v.interests.length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                              {v.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(v.createdAt).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Users Management */}
          {activeTab === 'users' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">User Management ({users.length})</h2>
                  <p className="text-sm text-gray-500">Manage user roles — assign volunteer or admin</p>
                </div>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-16 card">
                  <FiUsers className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">No registered users yet. Users will appear here after they sign up.</p>
                  {!isFirebaseConfigured() && <p className="text-xs text-amber-500 mt-2">Firestore not connected — update Firestore rules first.</p>}
                </div>
              ) : (
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="text-left px-4 py-3">User</th>
                        <th className="text-left px-4 py-3">Email</th>
                        <th className="text-left px-4 py-3">Role</th>
                        <th className="text-left px-4 py-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u.uid} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                                {u.displayName?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <span className="font-medium text-gray-800">{u.displayName || '\u2014'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{u.email}</td>
                          <td className="px-4 py-3">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                              className="px-2 py-1 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
                            >
                              <option value="volunteer">Volunteer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '\u2014'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Banners Management */}
          {activeTab === 'banners' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Banner Management</h2>
                  <p className="text-sm text-gray-500">Manage promotional banners across all pages</p>
                </div>
                <button
                  onClick={() => setShowBannerModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <FiPlus /> New Banner
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {(['hero', 'sidebar', 'inline', 'footer'] as const).map((p) => {
                  const count = banners.filter((b) => b.placement === p).length;
                  const activeCount = banners.filter((b) => b.placement === p && b.active).length;
                  const placementLabels = { hero: 'Hero Carousel', sidebar: 'Sidebar Ads', inline: 'Inline Strips', footer: 'Footer CTA' };
                  const placementColors = { hero: 'text-purple-600', sidebar: 'text-blue-600', inline: 'text-emerald-600', footer: 'text-violet-600' };
                  return (
                    <div key={p} className="card p-5 text-center">
                      <div className={`text-2xl font-extrabold ${placementColors[p]}`}>{count}</div>
                      <p className="text-xs text-gray-500 mt-1">{placementLabels[p]}</p>
                      <p className="text-[10px] text-gray-400">{activeCount} active</p>
                    </div>
                  );
                })}
              </div>

              {(['hero', 'sidebar', 'inline', 'footer'] as const).map((placement) => {
                const placementBanners = banners.filter((b) => b.placement === placement);
                if (placementBanners.length === 0) return null;
                const placementLabels = { hero: 'Hero Carousel Banners', sidebar: 'Sidebar Ad Banners', inline: 'Inline Strip Banners', footer: 'Footer CTA Banners' };
                return (
                  <div key={placement} className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{placementLabels[placement]}</h3>
                    <div className="space-y-3">
                      {placementBanners.map((banner) => (
                        <div key={banner.id} className="card p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${banner.bgGradient} flex-shrink-0`} />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 text-sm">{banner.title}</h4>
                                {banner.subtitle && <p className="text-xs text-gray-500 mt-0.5">{banner.subtitle}</p>}
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium uppercase">{banner.placement}</span>
                                  {banner.ctaText && <span className="text-[10px] text-gray-400">CTA: {banner.ctaText}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleBanner(banner.id)}
                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                  banner.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {banner.active ? 'Active' : 'Paused'}
                              </button>
                              <button
                                onClick={() => handleDeleteBanner(banner.id)}
                                className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <FiTrash2 className="text-sm" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {banners.length === 0 && (
                <div className="text-center py-16 card">
                  <FiImage className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">No banners yet. Create your first banner above.</p>
                </div>
              )}

              {/* New Banner Modal */}
              {showBannerModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Create Banner</h2>
                      <button onClick={() => setShowBannerModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                        <FiX className="text-xl text-gray-500" />
                      </button>
                    </div>
                    <form onSubmit={handleAddBanner} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title *</label>
                        <input type="text" value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} placeholder="Banner headline" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <input type="text" value={bannerSubtitle} onChange={(e) => setBannerSubtitle(e.target.value)} placeholder="Supporting text" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                        <select value={bannerPlacement} onChange={(e) => setBannerPlacement(e.target.value as typeof bannerPlacement)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500">
                          <option value="hero">Hero Carousel (Home page top)</option>
                          <option value="inline">Inline Strip (Between sections)</option>
                          <option value="sidebar">Sidebar (Ward detail pages)</option>
                          <option value="footer">Footer CTA (Above footer)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Background Gradient</label>
                        <select value={bannerGradient} onChange={(e) => setBannerGradient(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500">
                          <option value="from-violet-600 via-purple-600 to-indigo-700">Purple</option>
                          <option value="from-blue-600 via-cyan-600 to-teal-500">Ocean</option>
                          <option value="from-emerald-500 to-teal-600">Green</option>
                          <option value="from-orange-500 to-red-500">Warm</option>
                          <option value="from-pink-500 to-rose-500">Pink</option>
                          <option value="from-gray-700 to-gray-900">Dark</option>
                          <option value="from-gray-100 to-gray-50">Light</option>
                        </select>
                        <div className={`mt-2 h-8 rounded-lg bg-gradient-to-r ${bannerGradient}`} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
                          <input type="text" value={bannerCta} onChange={(e) => setBannerCta(e.target.value)} placeholder="e.g. Learn More" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                          <input type="text" value={bannerLink} onChange={(e) => setBannerLink(e.target.value)} placeholder="/events or URL" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (optional)</label>
                        <input ref={bannerFileRef} type="file" accept="image/*" onChange={handleBannerImageSelect} className="hidden" />
                        {bannerImagePreview ? (
                          <div className="relative mb-2">
                            <img src={bannerImagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                            <button
                              type="button"
                              onClick={() => { setBannerImageFile(null); URL.revokeObjectURL(bannerImagePreview); setBannerImagePreview(''); }}
                              className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white"
                            >
                              <FiX className="text-xs" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => bannerFileRef.current?.click()}
                            className="w-full h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors mb-2"
                          >
                            <FiImage className="text-xl mb-1" />
                            <span className="text-xs">Click to upload image</span>
                          </button>
                        )}
                        <p className="text-xs text-gray-400">Or paste an image URL:</p>
                        <input type="text" value={bannerImageUrl} onChange={(e) => setBannerImageUrl(e.target.value)} placeholder="https://... or /images/banner.jpg" className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500" />
                      </div>
                      <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={() => setShowBannerModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold text-sm">Create Banner</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Wards */}
          {activeTab === 'wards' && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Ward Management</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {wardsData.map((ward) => {
                  const corp = getCorporatorByWard(ward.number);
                  const wardActivities = activities.filter((a) => a.wardNumber === ward.number);
                  return (
                    <div key={ward.number} className="card p-6">
                      <div className="text-2xl font-extrabold text-blue-600 mb-1">Ward {ward.number}</div>
                      <p className="text-sm text-gray-500 mb-3">{ward.name}</p>
                      <div className="p-3 bg-gray-50 rounded-lg mb-3">
                        <p className="text-sm font-semibold text-gray-700">{corp?.name || 'No representative'}</p>
                        <p className="text-xs text-gray-400">{corp?.party || '-'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <div className="font-bold text-blue-600">{wardActivities.length}</div>
                          <div className="text-gray-400">Activities</div>
                        </div>
                        <div className="p-2 bg-teal-50 rounded-lg">
                          <div className="font-bold text-teal-600">{ward.population ? (ward.population / 1000).toFixed(0) + 'K' : '\u2014'}</div>
                          <div className="text-gray-400">Population</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Platform Settings</h2>
              <div className="space-y-4">
                <div className="card p-5">
                  <h3 className="font-semibold text-gray-800 mb-2">Site Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Platform Name</label>
                      <input type="text" defaultValue="OneMalad.in" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Contact Email</label>
                      <input type="email" defaultValue="onemaladconnect@gmail.com" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Contact Phone</label>
                      <input type="text" defaultValue="+91 99207 66971" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500" />
                    </div>
                  </div>
                </div>
                <div className="card p-5">
                  <h3 className="font-semibold text-gray-800 mb-2">Social Media</h3>
                  <div className="space-y-3">
                    {['Twitter/X', 'Instagram', 'Facebook', 'YouTube'].map((platform) => (
                      <div key={platform}>
                        <label className="block text-sm text-gray-500 mb-1">{platform}</label>
                        <input type="url" placeholder={`https://${platform.toLowerCase().replace('/', '')}.com/onemalad`} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500" />
                      </div>
                    ))}
                  </div>
                </div>
                <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold text-sm">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
