'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { FiCheckCircle, FiClock, FiLoader, FiAlertCircle, FiTrendingUp, FiAward, FiEdit3, FiTrash2, FiImage } from 'react-icons/fi';
import { HiOutlineLocationMarker, HiOutlineCamera, HiOutlinePhotograph, HiOutlineX } from 'react-icons/hi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { IssueStatus } from '@/types';
import {
  isFirebaseConfigured,
  WardUpdate,
  subscribeToWardUpdates,
  createWardUpdateInFirestore,
  deleteWardUpdateFromFirestore,
} from '@/lib/firestore';
import { uploadIssueImages } from '@/lib/storage';

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bgColor: 'bg-amber-100 text-amber-700', icon: <FiClock /> },
  in_progress: { label: 'In Progress', color: 'text-blue-700', bgColor: 'bg-blue-100 text-blue-700', icon: <FiLoader /> },
  resolved: { label: 'Resolved', color: 'text-green-700', bgColor: 'bg-green-100 text-green-700', icon: <FiCheckCircle /> },
};

const categoryColors: Record<string, string> = {
  drainage: 'bg-amber-100 text-amber-800',
  roads: 'bg-orange-100 text-orange-800',
  garbage: 'bg-green-100 text-green-800',
  water: 'bg-blue-100 text-blue-800',
  electricity: 'bg-pink-100 text-pink-800',
  sanitation: 'bg-purple-100 text-purple-800',
  encroachment: 'bg-red-100 text-red-800',
  other: 'bg-gray-100 text-gray-800',
};

export default function CorporatorPanelPage() {
  const { user } = useAuth();
  const { issues, updateIssueStatus } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'issues' | 'updates' | 'achievements'>('dashboard');
  const [filter, setFilter] = useState<'all' | IssueStatus>('all');

  // Ward Updates state
  const [wardUpdates, setWardUpdates] = useState<WardUpdate[]>([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [updateImages, setUpdateImages] = useState<string[]>([]);
  const [updateImageFiles, setUpdateImageFiles] = useState<File[]>([]);
  const [postingUpdate, setPostingUpdate] = useState(false);
  const updateFileRef = useRef<HTMLInputElement>(null);
  const updateCameraRef = useRef<HTMLInputElement>(null);

  // Resolved proof state
  const resolvedProofRef = useRef<HTMLInputElement>(null);
  const resolvedCameraRef = useRef<HTMLInputElement>(null);
  const [resolvingIssueId, setResolvingIssueId] = useState<string | null>(null);
  const [resolvedProofPreviews, setResolvedProofPreviews] = useState<string[]>([]);
  const [resolvedProofFiles, setResolvedProofFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const unsub = subscribeToWardUpdates(setWardUpdates);
    return () => unsub();
  }, []);

  if (!user || (user.role !== 'corporator' && user.role !== 'admin')) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-4">You need corporator access to view this page.</p>
          <Link href="/dashboard" className="text-blue-600 font-medium hover:underline">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const wardNumber = user.wardNumber || 32;
  const wardIssues = issues.filter((i) => i.wardNumber === wardNumber);
  const filteredIssues = filter === 'all' ? wardIssues : wardIssues.filter((i) => i.status === filter);
  const myUpdates = wardUpdates.filter((u) => u.wardNumber === wardNumber);

  const pendingCount = wardIssues.filter((i) => i.status === 'pending').length;
  const progressCount = wardIssues.filter((i) => i.status === 'in_progress').length;
  const resolvedCount = wardIssues.filter((i) => i.status === 'resolved').length;

  const handleStatusChange = (issueId: string, newStatus: IssueStatus) => {
    updateIssueStatus(issueId, newStatus);
    toast.success(`Issue status updated to ${newStatus.replace('_', ' ')}`);
  };

  // Ward update image handling
  const handleUpdateImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }
      setUpdateImages((prev) => [...prev, URL.createObjectURL(file)].slice(0, 4));
      setUpdateImageFiles((prev) => [...prev, file].slice(0, 4));
    });
    if (updateFileRef.current) updateFileRef.current.value = '';
    if (updateCameraRef.current) updateCameraRef.current.value = '';
  };

  const removeUpdateImage = (index: number) => {
    setUpdateImages((prev) => { URL.revokeObjectURL(prev[index]); return prev.filter((_, i) => i !== index); });
    setUpdateImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePostUpdate = async () => {
    if (!updateTitle.trim() || !updateContent.trim()) {
      toast.error('Please fill in title and content');
      return;
    }
    setPostingUpdate(true);
    try {
      let imageUrls: string[] = updateImages;
      if (isFirebaseConfigured() && updateImageFiles.length > 0) {
        imageUrls = await uploadIssueImages(updateImageFiles);
      }
      await createWardUpdateInFirestore({
        wardNumber,
        corporatorName: user.displayName,
        title: updateTitle.trim(),
        content: updateContent.trim(),
        imageUrls,
        createdAt: new Date().toISOString(),
      });
      toast.success('Ward update posted!');
      setShowUpdateForm(false);
      setUpdateTitle('');
      setUpdateContent('');
      setUpdateImages([]);
      setUpdateImageFiles([]);
    } catch {
      toast.error('Failed to post update');
    }
    setPostingUpdate(false);
  };

  const handleDeleteUpdate = async (id: string) => {
    try {
      await deleteWardUpdateFromFirestore(id);
      toast.success('Update deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  // Resolved proof handling
  const handleResolvedProofSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }
      setResolvedProofPreviews((prev) => [...prev, URL.createObjectURL(file)].slice(0, 4));
      setResolvedProofFiles((prev) => [...prev, file].slice(0, 4));
    });
    if (resolvedProofRef.current) resolvedProofRef.current.value = '';
    if (resolvedCameraRef.current) resolvedCameraRef.current.value = '';
  };

  const handleResolveWithProof = async (issueId: string) => {
    handleStatusChange(issueId, 'resolved');
    setResolvingIssueId(null);
    setResolvedProofPreviews([]);
    setResolvedProofFiles([]);
    toast.success('Issue marked as resolved with proof!');
  };

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                {user.displayName?.charAt(0) || 'C'}
              </div>
              <div>
                <p className="text-xs text-blue-200 uppercase tracking-wider font-medium">Corporator Panel</p>
                <h1 className="text-xl font-bold">{user.displayName}</h1>
                <p className="text-sm text-blue-200">Ward {wardNumber}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 flex-wrap">
            {[
              { val: 'dashboard' as const, label: 'Dashboard' },
              { val: 'issues' as const, label: 'Manage Issues' },
              { val: 'updates' as const, label: 'Ward Updates' },
              { val: 'achievements' as const, label: 'Achievements' },
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setActiveTab(tab.val)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.val ? 'bg-white text-blue-700' : 'text-blue-200 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Issues', val: wardIssues.length, icon: <FiAlertCircle />, color: 'text-gray-800', bg: 'bg-gray-50' },
                  { label: 'Pending', val: pendingCount, icon: <FiClock />, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'In Progress', val: progressCount, icon: <FiLoader />, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Resolved', val: resolvedCount, icon: <FiCheckCircle />, color: 'text-green-600', bg: 'bg-green-50' },
                ].map((s) => (
                  <div key={s.label} className={`card p-5 text-center ${s.bg}`}>
                    <div className={`text-2xl ${s.color} flex justify-center mb-1`}>{s.icon}</div>
                    <div className={`text-3xl font-extrabold ${s.color}`}>{s.val}</div>
                    <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Resolution Rate */}
              <div className="card p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiTrendingUp className="text-green-500" />
                  <h3 className="font-semibold text-gray-800">Resolution Rate</h3>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                    style={{ width: `${wardIssues.length > 0 ? (resolvedCount / wardIssues.length) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {resolvedCount} of {wardIssues.length} issues resolved ({wardIssues.length > 0 ? Math.round((resolvedCount / wardIssues.length) * 100) : 0}%)
                </p>
              </div>

              {/* Recent Pending Issues */}
              <h3 className="font-semibold text-gray-800 mb-3">Recent Pending Issues</h3>
              <div className="space-y-3">
                {wardIssues
                  .filter((i) => i.status === 'pending')
                  .slice(0, 3)
                  .map((issue) => (
                    <div key={issue.id} className="card p-4 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm truncate">{issue.title}</h4>
                        <p className="text-xs text-gray-400">{issue.location}</p>
                      </div>
                      <button
                        onClick={() => handleStatusChange(issue.id, 'in_progress')}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                      >
                        Start Working
                      </button>
                    </div>
                  ))}
                {wardIssues.filter((i) => i.status === 'pending').length === 0 && (
                  <div className="card p-8 text-center">
                    <p className="text-gray-400">No pending issues for your ward</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Issues Tab */}
          {activeTab === 'issues' && (
            <>
              <div className="flex gap-2 flex-wrap mb-6">
                {[
                  { val: 'all' as const, label: 'All' },
                  { val: 'pending' as const, label: `Pending (${pendingCount})` },
                  { val: 'in_progress' as const, label: `In Progress (${progressCount})` },
                  { val: 'resolved' as const, label: `Resolved (${resolvedCount})` },
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

              {/* Hidden inputs for resolved proof */}
              <input ref={resolvedProofRef} type="file" accept="image/*" multiple onChange={handleResolvedProofSelect} className="hidden" />
              <input ref={resolvedCameraRef} type="file" accept="image/*" capture="environment" onChange={handleResolvedProofSelect} className="hidden" />

              <div className="space-y-4">
                {filteredIssues.map((issue) => {
                  const status = statusConfig[issue.status];
                  return (
                    <div key={issue.id} className="card p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                            {issue.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-800">{issue.userName}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(issue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bgColor}`}>
                          {status.icon} {status.label}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-gray-800 mb-1">{issue.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{issue.description}</p>

                      {/* Issue images */}
                      {issue.imageUrls.length > 0 && (
                        <div className="flex gap-2 mb-3 overflow-x-auto">
                          {issue.imageUrls.map((url, i) => (
                            <img key={i} src={url} alt={`Issue ${i + 1}`} className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${categoryColors[issue.category]}`}>
                          {issue.category.replace('_', ' ')}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <HiOutlineLocationMarker /> {issue.location}
                        </span>
                      </div>

                      {/* Resolve with proof UI */}
                      {resolvingIssueId === issue.id && (
                        <div className="bg-green-50 rounded-xl p-4 mb-3 border border-green-100">
                          <p className="text-sm font-medium text-green-700 mb-3">Add resolved proof photos (optional)</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {resolvedProofPreviews.map((src, i) => (
                              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-green-200">
                                <img src={src} alt={`Proof ${i + 1}`} className="w-full h-full object-cover" />
                                <button
                                  onClick={() => {
                                    setResolvedProofPreviews((prev) => { URL.revokeObjectURL(prev[i]); return prev.filter((_, idx) => idx !== i); });
                                    setResolvedProofFiles((prev) => prev.filter((_, idx) => idx !== i));
                                  }}
                                  className="absolute top-0 right-0 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center text-white text-[8px]"
                                >
                                  <HiOutlineX />
                                </button>
                              </div>
                            ))}
                            {resolvedProofPreviews.length < 4 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => resolvedCameraRef.current?.click()}
                                  className="w-16 h-16 rounded-lg border-2 border-dashed border-green-300 flex flex-col items-center justify-center text-green-500 hover:bg-green-100 transition-all"
                                >
                                  <HiOutlineCamera className="text-lg" />
                                  <span className="text-[9px]">Camera</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => resolvedProofRef.current?.click()}
                                  className="w-16 h-16 rounded-lg border-2 border-dashed border-green-300 flex flex-col items-center justify-center text-green-400 hover:bg-green-100 transition-all"
                                >
                                  <HiOutlinePhotograph className="text-lg" />
                                  <span className="text-[9px]">Gallery</span>
                                </button>
                              </>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleResolveWithProof(issue.id)}
                              className="px-4 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Confirm Resolved
                            </button>
                            <button
                              onClick={() => { setResolvingIssueId(null); setResolvedProofPreviews([]); setResolvedProofFiles([]); }}
                              className="px-4 py-1.5 bg-white text-gray-600 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Status Actions */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        {issue.status !== 'pending' && (
                          <button
                            onClick={() => handleStatusChange(issue.id, 'pending')}
                            className="px-3 py-1.5 bg-amber-50 text-amber-600 text-xs font-medium rounded-lg hover:bg-amber-100 transition-colors"
                          >
                            Mark Pending
                          </button>
                        )}
                        {issue.status !== 'in_progress' && (
                          <button
                            onClick={() => handleStatusChange(issue.id, 'in_progress')}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Mark In Progress
                          </button>
                        )}
                        {issue.status !== 'resolved' && (
                          <button
                            onClick={() => setResolvingIssueId(issue.id)}
                            className="px-3 py-1.5 bg-green-50 text-green-600 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
                          >
                            <HiOutlineCamera className="text-sm" /> Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {filteredIssues.length === 0 && (
                  <div className="card p-10 text-center">
                    <p className="text-gray-400">No issues found</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Ward Updates Tab */}
          {activeTab === 'updates' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Ward Updates</h2>
                  <p className="text-sm text-gray-500">Post updates, achievements, and news for your ward residents</p>
                </div>
                <button
                  onClick={() => setShowUpdateForm(!showUpdateForm)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <FiEdit3 /> New Update
                </button>
              </div>

              {/* New Update Form */}
              {showUpdateForm && (
                <div className="card p-6 mb-6 border-2 border-blue-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Create Ward Update</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={updateTitle}
                        onChange={(e) => setUpdateTitle(e.target.value)}
                        placeholder="e.g. Road repair completed at Gate 6"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        value={updateContent}
                        onChange={(e) => setUpdateContent(e.target.value)}
                        placeholder="Describe the update, work done, or announcement..."
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Photos (optional, max 4)</label>
                      <input ref={updateFileRef} type="file" accept="image/*" multiple onChange={handleUpdateImageSelect} className="hidden" />
                      <input ref={updateCameraRef} type="file" accept="image/*" capture="environment" onChange={handleUpdateImageSelect} className="hidden" />
                      <div className="flex flex-wrap gap-3">
                        {updateImages.map((src, i) => (
                          <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group">
                            <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeUpdateImage(i)}
                              className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <HiOutlineX className="text-xs" />
                            </button>
                          </div>
                        ))}
                        {updateImages.length < 4 && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateCameraRef.current?.click()}
                              className="w-20 h-20 rounded-xl border-2 border-dashed border-blue-300 flex flex-col items-center justify-center text-blue-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            >
                              <HiOutlineCamera className="text-xl" />
                              <span className="text-[10px] mt-0.5 font-medium">Camera</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => updateFileRef.current?.click()}
                              className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-gray-50 transition-all"
                            >
                              <HiOutlinePhotograph className="text-xl" />
                              <span className="text-[10px] mt-0.5 font-medium">Gallery</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        onClick={() => { setShowUpdateForm(false); setUpdateTitle(''); setUpdateContent(''); setUpdateImages([]); setUpdateImageFiles([]); }}
                        className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePostUpdate}
                        disabled={postingUpdate}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold text-sm hover:shadow-md transition-all disabled:opacity-50"
                      >
                        {postingUpdate ? 'Posting...' : 'Post Update'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Updates List */}
              <div className="space-y-4">
                {myUpdates.map((update) => (
                  <div key={update.id} className="card p-6 card-hover">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">{update.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(update.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteUpdate(update.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{update.content}</p>
                    {update.imageUrls.length > 0 && (
                      <div className="flex gap-2 mt-3 overflow-x-auto">
                        {update.imageUrls.map((url, i) => (
                          <img key={i} src={url} alt={`Update photo ${i + 1}`} className="w-28 h-28 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {myUpdates.length === 0 && !showUpdateForm && (
                  <div className="text-center py-16 card">
                    <FiEdit3 className="text-4xl text-blue-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Updates Yet</h3>
                    <p className="text-gray-500 text-sm mb-4">Share news, completed works, and announcements with your ward residents.</p>
                    <button
                      onClick={() => setShowUpdateForm(true)}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-semibold rounded-xl"
                    >
                      + Post First Update
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="text-center py-16 card">
              <FiAward className="text-4xl text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Works & Achievements</h3>
              <p className="text-gray-500 text-sm mb-4">Post your completed works and achievements here to showcase them to citizens.</p>
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-semibold rounded-xl">
                + Add Achievement
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
