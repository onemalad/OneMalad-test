'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { wardsData, corporatorsData, getCorporatorByWard } from '@/data/wards';
import {
  FiUsers, FiMapPin, FiAlertCircle, FiCalendar, FiCheckCircle, FiClock, FiLoader,
  FiTrendingUp, FiTrash2, FiEdit, FiPlus, FiX, FiBarChart2, FiSettings, FiImage
} from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { IssueStatus, CommunityEvent } from '@/types';
import {
  isFirebaseConfigured,
  Banner,
  subscribeToBanners,
  createBannerInFirestore,
  updateBannerInFirestore,
  deleteBannerFromFirestore,
  updateUserRole,
} from '@/lib/firestore';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const DEFAULT_BANNERS: Banner[] = [
  { id: 'b1', title: 'OneMalad Cricket Premier League 2026', subtitle: 'Register your ward team now!', ctaText: 'Register Now', ctaLink: '/events', placement: 'hero', bgGradient: 'from-violet-600 via-purple-600 to-indigo-700', active: true },
  { id: 'b2', title: 'Your Ward, Your Voice', subtitle: 'Raise civic issues directly to your corporator', ctaText: 'Raise Issue', ctaLink: '/issues?action=raise', placement: 'hero', bgGradient: 'from-blue-600 via-cyan-600 to-teal-500', active: true },
  { id: 'b3', title: 'Advertise Here', subtitle: 'Reach 50,000+ Malad residents', ctaText: 'Contact Us', ctaLink: '#', placement: 'sidebar', bgGradient: 'from-gray-100 to-gray-50', active: true },
  { id: 'b4', title: 'Free Health Camp - Feb 28', subtitle: 'General checkup, eye testing, dental checkup', ctaText: 'Learn More', ctaLink: '/events', placement: 'inline', bgGradient: 'from-emerald-500 to-teal-600', active: true },
  { id: 'b5', title: 'Partner with OneMalad', subtitle: 'Local businesses & organizations - lets build Malad together', ctaText: 'Get in Touch', ctaLink: '#', placement: 'footer', bgGradient: 'from-violet-600 to-blue-600', active: true },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: <FiClock /> },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: <FiLoader /> },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', icon: <FiCheckCircle /> },
};

export default function AdminPage() {
  const { user } = useAuth();
  const { issues, events, updateIssueStatus, deleteIssue, addEvent, deleteEvent } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'events' | 'users' | 'banners' | 'wards' | 'settings'>('overview');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

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

  // Resolve issue modal state
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveIssueId, setResolveIssueId] = useState('');
  const [resolveResponse, setResolveResponse] = useState('');
  const [resolveImageUrls, setResolveImageUrls] = useState('');

  // Banners state — synced with Firestore when configured
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);

  // Users state
  const [users, setUsers] = useState<Array<{ uid: string; email: string; displayName: string; role: string; wardNumber?: number; createdAt?: string }>>([]);

  // Subscribe to Firestore banners when configured
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const unsub = subscribeToBanners((firestoreBanners) => {
      setBanners(firestoreBanners.length > 0 ? firestoreBanners : DEFAULT_BANNERS);
    });
    return unsub;
  }, []);

  // Subscribe to Firestore users
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

  const pendingCount = issues.filter((i) => i.status === 'pending').length;
  const progressCount = issues.filter((i) => i.status === 'in_progress').length;
  const resolvedCount = issues.filter((i) => i.status === 'resolved').length;
  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date()).length;

  const handleStatusChange = (id: string, status: IssueStatus) => {
    updateIssueStatus(id, status);
    toast.success('Issue status updated');
  };

  const handleDeleteIssue = (id: string) => {
    deleteIssue(id);
    toast.success('Issue deleted');
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
      organizer: 'OneMalad Community',
      attendees: 0,
      isUpcoming: new Date(eventDate) >= new Date(),
    };
    addEvent(newEvent);
    toast.success('Event created!');
    setShowEventModal(false);
    setEventTitle('');
    setEventDesc('');
    setEventDate('');
    setEventTime('');
    setEventVenue('');
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
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerCta('');
    setBannerLink('');
    setBannerImageUrl('');
    setBannerImageFile(null);
    if (bannerImagePreview) URL.revokeObjectURL(bannerImagePreview);
    setBannerImagePreview('');
  };

  const handleResolveIssue = async () => {
    if (!resolveIssueId) return;
    const updateData: Record<string, unknown> = {
      status: 'resolved' as IssueStatus,
      resolvedAt: new Date().toISOString(),
    };
    if (resolveResponse) updateData.corporatorResponse = resolveResponse;
    if (resolveImageUrls.trim()) {
      updateData.resolvedImageUrls = resolveImageUrls.split(',').map((u) => u.trim()).filter(Boolean);
    }
    updateIssueStatus(resolveIssueId, 'resolved');
    if (isFirebaseConfigured()) {
      const { updateIssueInFirestore } = await import('@/lib/firestore');
      await updateIssueInFirestore(resolveIssueId, updateData as Partial<import('@/types').Issue>);
    }
    toast.success('Issue marked as resolved!');
    setShowResolveModal(false);
    setResolveIssueId('');
    setResolveResponse('');
    setResolveImageUrls('');
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
    { val: 'issues' as const, label: 'Issues', icon: <FiAlertCircle /> },
    { val: 'events' as const, label: 'Events', icon: <FiCalendar /> },
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
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Super Admin</p>
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
                  { label: 'Total Issues', val: issues.length, icon: <FiAlertCircle />, color: 'text-gray-800' },
                  { label: 'Pending', val: pendingCount, icon: <FiClock />, color: 'text-amber-600' },
                  { label: 'In Progress', val: progressCount, icon: <FiLoader />, color: 'text-blue-600' },
                  { label: 'Resolved', val: resolvedCount, icon: <FiCheckCircle />, color: 'text-green-600' },
                  { label: 'Events', val: upcomingEvents, icon: <FiCalendar />, color: 'text-purple-600' },
                ].map((s) => (
                  <div key={s.label} className="card p-5 text-center">
                    <div className={`text-xl ${s.color} flex justify-center mb-1`}>{s.icon}</div>
                    <div className={`text-2xl font-extrabold ${s.color}`}>{s.val}</div>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Ward Performance */}
              <h3 className="font-semibold text-gray-800 mb-4">Ward Performance</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {wardsData.map((ward) => {
                  const corp = getCorporatorByWard(ward.number);
                  const wardIssues = issues.filter((i) => i.wardNumber === ward.number);
                  const resolved = wardIssues.filter((i) => i.status === 'resolved').length;
                  const rate = wardIssues.length > 0 ? Math.round((resolved / wardIssues.length) * 100) : 0;
                  return (
                    <div key={ward.number} className="card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">Ward {ward.number}</h4>
                          <p className="text-xs text-gray-400">{corp?.name || 'No corporator'}</p>
                        </div>
                        <span className="text-sm font-bold text-green-600">{rate}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${rate}%` }} />
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>{wardIssues.length} issues</span>
                        <span>{resolved} resolved</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Corporators */}
              <h3 className="font-semibold text-gray-800 mb-4">Corporators Overview</h3>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="text-left px-4 py-3">Corporator</th>
                      <th className="text-left px-4 py-3">Ward</th>
                      <th className="text-left px-4 py-3">Party</th>
                      <th className="text-center px-4 py-3">Issues</th>
                      <th className="text-center px-4 py-3">Resolved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {corporatorsData.map((corp) => (
                      <tr key={corp.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{corp.name}</td>
                        <td className="px-4 py-3 text-gray-500">Ward {corp.wardNumber}</td>
                        <td className="px-4 py-3 text-gray-500">{corp.party}</td>
                        <td className="px-4 py-3 text-center">{corp.issuesReceived}</td>
                        <td className="px-4 py-3 text-center text-green-600 font-medium">{corp.issuesResolved}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Issues Management */}
          {activeTab === 'issues' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">All Issues ({issues.length})</h2>
              </div>
              <div className="space-y-3">
                {issues.map((issue) => {
                  const status = statusConfig[issue.status];
                  return (
                    <div key={issue.id} className="card p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">{issue.title}</h3>
                          <p className="text-xs text-gray-400">
                            Ward {issue.wardNumber} &middot; {issue.userName} &middot; {new Date(issue.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{issue.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusChange(issue.id, e.target.value as IssueStatus)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <button
                          onClick={() => { setResolveIssueId(issue.id); setShowResolveModal(true); }}
                          className="px-3 py-1.5 bg-green-50 text-green-600 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
                        >
                          <FiCheckCircle /> Resolve with Details
                        </button>
                        <button
                          onClick={() => handleDeleteIssue(issue.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
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

          {/* Users Management */}
          {activeTab === 'users' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">User Management ({users.length})</h2>
                  <p className="text-sm text-gray-500">Manage user roles — assign corporator, admin, or citizen</p>
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
                        <th className="text-left px-4 py-3">Ward</th>
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
                              <span className="font-medium text-gray-800">{u.displayName || '—'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{u.email}</td>
                          <td className="px-4 py-3">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.uid, e.target.value, u.wardNumber)}
                              className="px-2 py-1 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
                            >
                              <option value="citizen">Citizen</option>
                              <option value="corporator">Corporator</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            {u.role === 'corporator' ? (
                              <select
                                value={u.wardNumber || ''}
                                onChange={(e) => handleRoleChange(u.uid, u.role, Number(e.target.value))}
                                className="px-2 py-1 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
                              >
                                <option value="">Select Ward</option>
                                {wardsData.map((w) => (
                                  <option key={w.number} value={w.number}>Ward {w.number}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
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

              {/* Banner Placement Stats */}
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

              {/* Banners List by Placement */}
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
                  const wardIssues = issues.filter((i) => i.wardNumber === ward.number);
                  const pending = wardIssues.filter((i) => i.status === 'pending').length;
                  const inProgress = wardIssues.filter((i) => i.status === 'in_progress').length;
                  const resolved = wardIssues.filter((i) => i.status === 'resolved').length;
                  return (
                    <div key={ward.number} className="card p-6">
                      <div className="text-2xl font-extrabold text-blue-600 mb-1">Ward {ward.number}</div>
                      <p className="text-sm text-gray-500 mb-3">{ward.name}</p>
                      <div className="p-3 bg-gray-50 rounded-lg mb-3">
                        <p className="text-sm font-semibold text-gray-700">{corp?.name || 'No corporator'}</p>
                        <p className="text-xs text-gray-400">{corp?.party || '-'}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 bg-amber-50 rounded-lg">
                          <div className="font-bold text-amber-600">{pending}</div>
                          <div className="text-gray-400">Pending</div>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <div className="font-bold text-blue-600">{inProgress}</div>
                          <div className="text-gray-400">Progress</div>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                          <div className="font-bold text-green-600">{resolved}</div>
                          <div className="text-gray-400">Resolved</div>
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
                      <input type="text" defaultValue="+91 98XX XXX XXX" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500" />
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

      {/* Resolve Issue Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Resolve Issue</h2>
              <button onClick={() => { setShowResolveModal(false); setResolveIssueId(''); }} className="p-1 hover:bg-gray-100 rounded-lg">
                <FiX className="text-xl text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Response</label>
                <textarea
                  value={resolveResponse}
                  onChange={(e) => setResolveResponse(e.target.value)}
                  placeholder="Describe what was done to resolve this issue..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Image URLs</label>
                <textarea
                  value={resolveImageUrls}
                  onChange={(e) => setResolveImageUrls(e.target.value)}
                  placeholder="Paste image URLs separated by commas (e.g. https://...image1.jpg, https://...image2.jpg)"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">Add before/after photos or proof of resolution</p>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => { setShowResolveModal(false); setResolveIssueId(''); }} className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm">Cancel</button>
                <button onClick={handleResolveIssue} className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold text-sm flex items-center gap-1.5">
                  <FiCheckCircle /> Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
