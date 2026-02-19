'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { HiPlus, HiOutlineLocationMarker, HiOutlineX, HiOutlinePhotograph, HiOutlineCamera } from 'react-icons/hi';
import { FiCheckCircle, FiClock, FiLoader, FiThumbsUp } from 'react-icons/fi';
import { useStore } from '@/hooks/useStore';
import { wardsData, getCorporatorByWard } from '@/data/wards';
import { IssueCategory, IssueStatus, Issue } from '@/types';
import { isFirebaseConfigured } from '@/lib/firestore';
import { uploadIssueImages } from '@/lib/storage';
import toast from 'react-hot-toast';

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

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: <FiClock /> },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: <FiLoader /> },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', icon: <FiCheckCircle /> },
};

const categories: { value: IssueCategory; label: string }[] = [
  { value: 'drainage', label: 'Drainage & Sewage' },
  { value: 'roads', label: 'Roads & Footpaths' },
  { value: 'garbage', label: 'Garbage & Waste' },
  { value: 'water', label: 'Water Supply' },
  { value: 'electricity', label: 'Electricity & Lights' },
  { value: 'sanitation', label: 'Sanitation & Health' },
  { value: 'encroachment', label: 'Encroachment' },
  { value: 'other', label: 'Other' },
];

function IssuesContent() {
  const searchParams = useSearchParams();
  const showModal = searchParams.get('action') === 'raise';
  const presetWard = searchParams.get('ward');

  const { issues, addIssue } = useStore();
  const [modalOpen, setModalOpen] = useState(showModal);
  const [filter, setFilter] = useState<'all' | IssueStatus>('all');

  // Personal details
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('drainage');
  const [wardNumber, setWardNumber] = useState(presetWard || '32');
  const [location, setLocation] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showLetter, setShowLetter] = useState<Issue | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPreviews: string[] = [];
    const newFiles: File[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }
      newPreviews.push(URL.createObjectURL(file));
      newFiles.push(file);
    });
    setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 4));
    setImageFiles((prev) => [...prev, ...newFiles].slice(0, 4));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const filtered = filter === 'all' ? issues : issues.filter((i) => i.status === filter);

  const totalIssues = issues.length;
  const pendingCount = issues.filter((i) => i.status === 'pending').length;
  const progressCount = issues.filter((i) => i.status === 'in_progress').length;
  const resolvedCount = issues.filter((i) => i.status === 'resolved').length;

  const generateRefNumber = () => {
    const now = new Date();
    return `OM-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || !citizenPhone.trim()) {
      toast.error('Please enter your name and phone number');
      return;
    }
    if (!title || !description || !location) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (citizenPhone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setSubmitting(true);
    try {
      let uploadedUrls: string[] = imagePreviews;
      if (isFirebaseConfigured() && imageFiles.length > 0) {
        uploadedUrls = await uploadIssueImages(imageFiles);
      }

      const newIssue: Issue = {
        id: generateRefNumber(),
        title,
        description,
        category,
        status: 'pending',
        wardNumber: Number(wardNumber),
        location,
        imageUrls: uploadedUrls,
        userName: citizenName.trim(),
        userEmail: citizenEmail.trim() || '',
        userPhone: citizenPhone.trim(),
        upvotes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addIssue(newIssue);
      toast.success('Issue raised successfully! Your formal complaint letter has been generated.');
      setShowLetter(newIssue);
      setModalOpen(false);
      setCitizenName('');
      setCitizenPhone('');
      setCitizenEmail('');
      setTitle('');
      setDescription('');
      setLocation('');
      setImagePreviews([]);
      setImageFiles([]);
    } catch (err) {
      console.error('Error submitting issue:', err);
      toast.error('Failed to submit issue. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <>
      {/* Header */}
      <section className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Civic Issues</h1>
          <p className="text-base opacity-90">Track and raise civic issues across Malad wards</p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total', count: totalIssues, color: 'text-gray-800' },
              { label: 'Pending', count: pendingCount, color: 'text-amber-600' },
              { label: 'In Progress', count: progressCount, color: 'text-blue-600' },
              { label: 'Resolved', count: resolvedCount, color: 'text-green-600' },
            ].map((s) => (
              <div key={s.label} className="card p-5 text-center">
                <div className={`text-2xl sm:text-3xl font-extrabold ${s.color}`}>{s.count}</div>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div className="flex gap-2 flex-wrap">
              {[
                { val: 'all' as const, label: 'All' },
                { val: 'pending' as const, label: 'Pending' },
                { val: 'in_progress' as const, label: 'In Progress' },
                { val: 'resolved' as const, label: 'Resolved' },
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
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5 hover:shadow-md transition-all"
            >
              <HiPlus className="text-lg" /> Raise an Issue
            </button>
          </div>

          {/* Issues List */}
          <div className="space-y-4">
            {filtered.map((issue) => {
              const status = statusConfig[issue.status];
              const corp = getCorporatorByWard(issue.wardNumber);
              return (
                <div key={issue.id} id={issue.id} className="card p-6 card-hover">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                        {issue.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{issue.userName}</p>
                        <p className="text-xs text-gray-400">
                          Ward {issue.wardNumber} &middot;{' '}
                          {new Date(issue.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mt-4 mb-1.5">{issue.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{issue.description}</p>

                  {issue.imageUrls.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                      {issue.imageUrls.map((url, i) => (
                        <img key={i} src={url} alt={`Issue photo ${i + 1}`} className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${categoryColors[issue.category]}`}>
                        {issue.category.replace('_', ' ')}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <HiOutlineLocationMarker /> {issue.location.split(',')[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowLetter(issue)}
                        className="text-xs text-blue-600 font-medium hover:underline"
                      >
                        View Letter
                      </button>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <FiThumbsUp /> {issue.upvotes} upvotes
                      </span>
                    </div>
                  </div>

                  {corp && (
                    <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 rounded-lg">
                      {corp.photo ? (
                        <img src={corp.photo} alt={corp.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center text-teal-600 text-xs font-semibold flex-shrink-0">
                          {corp.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{corp.name}</p>
                        <p className="text-[11px] text-gray-400">{corp.party} &middot; Ward {issue.wardNumber}</p>
                      </div>
                    </div>
                  )}

                  {issue.corporatorResponse && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="text-xs font-semibold text-green-700 mb-1">Corporator Response:</p>
                      <p className="text-sm text-green-600">{issue.corporatorResponse}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-16 card">
                <p className="text-gray-400 text-lg">No issues found</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Raise Issue Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Raise an Issue</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <HiOutlineX className="text-xl text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <p className="text-sm font-semibold text-gray-700">Your Details</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                    <input
                      type="tel"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit number"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (optional)</label>
                    <input
                      type="email"
                      value={citizenEmail}
                      onChange={(e) => setCitizenEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Issue Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ward</label>
                <select
                  value={wardNumber}
                  onChange={(e) => setWardNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {wardsData.map((w) => (
                    <option key={w.number} value={w.number}>
                      Ward {w.number} - {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IssueCategory)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Issue Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief title for your issue"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Specific location (e.g., Near Bhadaran Nagar junction)"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Image Upload + Camera */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Photos (optional, max 4)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group">
                      <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <HiOutlineX className="text-xs" />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 4 && (
                    <>
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="w-20 h-20 rounded-xl border-2 border-dashed border-blue-300 flex flex-col items-center justify-center text-blue-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                      >
                        <HiOutlineCamera className="text-xl" />
                        <span className="text-[10px] mt-0.5 font-medium">Camera</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
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
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold text-sm hover:shadow-md transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Formal Complaint Letter Modal */}
      {showLetter && (() => {
        const corp = getCorporatorByWard(showLetter.wardNumber);
        const date = new Date(showLetter.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Formal Complaint Letter</h2>
                <button onClick={() => setShowLetter(null)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <HiOutlineX className="text-xl text-gray-500" />
                </button>
              </div>
              <div className="p-6 sm:p-8 font-serif text-sm leading-relaxed text-gray-700">
                <div className="text-center mb-6">
                  <p className="text-xs font-sans font-semibold text-blue-600 tracking-wider uppercase">OneMalad Foundation</p>
                  <p className="text-[11px] font-sans text-gray-400">Civic Complaint Reference: {showLetter.id}</p>
                </div>

                <p className="text-right mb-6">Date: {date}</p>

                <div className="mb-6">
                  <p className="font-semibold">To,</p>
                  {corp ? (
                    <>
                      <p>{corp.name}</p>
                      <p>Corporator, Ward {showLetter.wardNumber}</p>
                      <p>{corp.party}</p>
                    </>
                  ) : (
                    <p>Ward Corporator, Ward {showLetter.wardNumber}</p>
                  )}
                  <p>Malad, Mumbai</p>
                </div>

                <div className="mb-6">
                  <p className="font-semibold">From,</p>
                  <p>{showLetter.userName}</p>
                  <p>Phone: {showLetter.userPhone}</p>
                  {showLetter.userEmail && <p>Email: {showLetter.userEmail}</p>}
                  <p>{showLetter.location}, Ward {showLetter.wardNumber}, Malad</p>
                </div>

                <p className="font-semibold mb-4">Subject: {showLetter.title}</p>

                <p className="mb-4">Respected Sir/Madam,</p>

                <p className="mb-4 text-justify">
                  I, <strong>{showLetter.userName}</strong>, a resident of <strong>{showLetter.location}, Ward {showLetter.wardNumber}, Malad</strong>,
                  wish to bring to your kind attention the following civic issue under the category of <strong>{showLetter.category.replace('_', ' ')}</strong>:
                </p>

                <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
                  <p className="text-justify">{showLetter.description}</p>
                </div>

                <p className="mb-4 text-justify">
                  This matter is causing significant inconvenience to the residents of the area. I humbly request your immediate intervention
                  and necessary action to resolve this issue at the earliest.
                </p>

                <p className="mb-1">Yours sincerely,</p>
                <p className="font-semibold">{showLetter.userName}</p>
                <p className="text-xs text-gray-400 mt-1">Contact: {showLetter.userPhone}</p>
              </div>

              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                <button
                  onClick={() => setShowLetter(null)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const el = document.querySelector('.font-serif');
                    if (el) {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`<html><head><title>Complaint - ${showLetter.id}</title><style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;padding:20px;font-size:14px;line-height:1.7;color:#333}strong{font-weight:600}.highlight{background:#f0f7ff;border-left:4px solid #2563eb;padding:12px 16px;margin:16px 0;border-radius:0 8px 8px 0}.header{text-align:center;margin-bottom:24px}.ref{font-size:11px;color:#999;font-family:sans-serif}.brand{font-size:12px;color:#2563eb;font-family:sans-serif;text-transform:uppercase;letter-spacing:2px;font-weight:600}</style></head><body>`);
                        printWindow.document.write(`<div class="header"><p class="brand">OneMalad Foundation</p><p class="ref">Civic Complaint Reference: ${showLetter.id}</p></div>`);
                        printWindow.document.write(el.innerHTML);
                        printWindow.document.write('</body></html>');
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold text-sm hover:shadow-md transition-all"
                >
                  Print / Download
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}

export default function IssuesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <IssuesContent />
    </Suspense>
  );
}
