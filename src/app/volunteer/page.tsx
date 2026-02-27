'use client';

import { useState } from 'react';
import {
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiSend,
  FiCheckCircle,
  FiHeart,
  FiBookOpen,
  FiPackage,
  FiActivity,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useStore } from '@/hooks/useStore';
import { wardsData } from '@/data/wards';
import { ActivityCategory } from '@/types';
import { createVolunteerInFirestore, isFirebaseConfigured } from '@/lib/firestore';

const interestOptions: { value: ActivityCategory; label: string }[] = [
  { value: 'cleanliness_drive', label: 'Cleanliness Drives' },
  { value: 'health_camp', label: 'Health Camps' },
  { value: 'food_distribution', label: 'Food Distribution' },
  { value: 'education', label: 'Education' },
  { value: 'tree_planting', label: 'Tree Planting' },
  { value: 'blood_donation', label: 'Blood Donation' },
  { value: 'sports', label: 'Sports' },
  { value: 'cultural', label: 'Cultural Events' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'other', label: 'Other' },
];

const volunteerRoles = [
  {
    title: 'Organize Drives',
    desc: 'Lead cleanliness drives, tree plantations, and awareness campaigns in your ward.',
    icon: <FiPackage className="text-xl" />,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Assist at Camps',
    desc: 'Help run health checkup camps, blood donation drives, and medical outreach events.',
    icon: <FiActivity className="text-xl" />,
    gradient: 'from-teal-500 to-teal-600',
  },
  {
    title: 'Distribute Food',
    desc: 'Join meal distribution drives during Ramadan, festivals, and for underprivileged families.',
    icon: <FiHeart className="text-xl" />,
    gradient: 'from-orange-500 to-orange-600',
  },
  {
    title: 'Teach & Mentor',
    desc: 'Volunteer as a tutor, mentor school students, or run skill development workshops.',
    icon: <FiBookOpen className="text-xl" />,
    gradient: 'from-purple-500 to-purple-600',
  },
];

export default function VolunteerPage() {
  const { impactStats } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [wardNumber, setWardNumber] = useState<number | ''>('');
  const [interests, setInterests] = useState<ActivityCategory[]>([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleInterest = (val: ActivityCategory) => {
    setInterests((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubmitting(true);

    try {
      const volunteerData = {
        name: name.trim(),
        phone,
        email: email.trim() || undefined,
        wardNumber: wardNumber || undefined,
        interests,
        message: message.trim() || undefined,
        createdAt: new Date().toISOString(),
        status: 'pending' as const,
      };

      if (isFirebaseConfigured()) {
        await createVolunteerInFirestore(volunteerData);
      }

      setSubmitted(true);
      toast.success('Thank you for volunteering!');
    } catch (err) {
      console.error('Volunteer signup error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="page-header-gradient relative overflow-hidden">
        <div className="absolute top-[-40%] right-[-15%] w-[400px] h-[400px] bg-white/5 rounded-full" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <span className="inline-block bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-5 border border-white/20">
            OneMalad Foundation
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Join the{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-teal-200 bg-clip-text text-transparent">
              OneMalad
            </span>{' '}
            Movement
          </h1>
          <p className="text-base opacity-90 max-w-xl mx-auto">
            Volunteer with us to make Malad cleaner, healthier, and stronger. No login needed &mdash; just sign up and start making a difference.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_360px] gap-10">
            {/* Sign-up Form */}
            <div>
              {submitted ? (
                <div className="card p-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle className="text-white text-3xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
                  <p className="text-gray-500 mb-1">Your volunteer registration has been received.</p>
                  <p className="text-gray-500 mb-6">We&rsquo;ll contact you soon with upcoming opportunities.</p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setPhone('');
                      setEmail('');
                      setWardNumber('');
                      setInterests([]);
                      setMessage('');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Register Another Volunteer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FiHeart className="text-pink-500" /> Volunteer Sign-Up
                  </h2>

                  <div className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="10-digit phone number"
                          required
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      {phone.length > 0 && phone.length < 10 && (
                        <p className="text-xs text-amber-600 mt-1">{10 - phone.length} more digits needed</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Email <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Ward */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Ward <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          value={wardNumber}
                          onChange={(e) => setWardNumber(e.target.value ? Number(e.target.value) : '')}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                        >
                          <option value="">Select your ward (optional)</option>
                          {wardsData.map((ward) => (
                            <option key={ward.number} value={ward.number}>
                              Ward {ward.number} &mdash; {ward.area}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Interests */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Interests
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {interestOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => toggleInterest(opt.value)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                              interests.includes(opt.value)
                                ? 'bg-blue-50 text-blue-700 border-blue-300 ring-1 ring-blue-200'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-blue-200 hover:text-blue-600'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Message <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                        placeholder="Tell us why you want to volunteer or any skills you can offer..."
                        rows={3}
                        maxLength={200}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      />
                      <p className="text-xs text-gray-400 text-right mt-1">
                        {message.length}/200
                      </p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                      {submitting ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FiSend /> Sign Up as Volunteer
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Impact Stats */}
              {impactStats.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">
                    Our Impact
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {impactStats
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((stat) => (
                        <div
                          key={stat.id}
                          className="bg-gray-50 rounded-xl p-3 text-center hover:bg-blue-50 transition-colors"
                        >
                          <span className="text-xl block mb-1">{stat.emoji}</span>
                          <div className="text-lg font-extrabold text-gray-800">
                            {stat.value.toLocaleString()}
                            {stat.suffix}
                          </div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider leading-tight mt-0.5">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* What Volunteers Do */}
              <div className="card p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">
                  What Volunteers Do
                </h3>
                <div className="space-y-3">
                  {volunteerRoles.map((role) => (
                    <div
                      key={role.title}
                      className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${role.gradient} rounded-lg flex items-center justify-center text-white flex-shrink-0`}
                      >
                        {role.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">{role.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                          {role.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700" />
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
            </div>
            <div className="relative px-8 sm:px-16 py-12 sm:py-16 text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Every Volunteer Counts
              </h2>
              <p className="text-base text-blue-100/80 max-w-xl mx-auto">
                Whether you have an hour or a whole day, your time and effort can transform lives in Malad. Together, we are OneMalad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
