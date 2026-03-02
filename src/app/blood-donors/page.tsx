'use client';

import { useState } from 'react';
import {
  FiUser,
  FiPhone,
  FiDroplet,
  FiHeart,
  FiSearch,
  FiCheckCircle,
  FiSend,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { BloodDonor, BloodGroup } from '@/types';
import { wardsData } from '@/data/wards';
import { createBloodDonorInFirestore, isFirebaseConfigured } from '@/lib/firestore';

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

type Tab = 'find' | 'register';

export default function BloodDonorsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('find');

  // Find Donors state
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | ''>('');
  const [selectedWard, setSelectedWard] = useState<number | ''>('');

  // Register form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [wardNumber, setWardNumber] = useState<number | ''>('');
  const [age, setAge] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!bloodGroup) {
      toast.error('Please select your blood group');
      return;
    }
    if (age && (Number(age) < 18 || Number(age) > 65)) {
      toast.error('Donors must be between 18 and 65 years old');
      return;
    }

    setSubmitting(true);

    try {
      const donorData: Omit<BloodDonor, 'id'> = {
        name: name.trim(),
        phone,
        bloodGroup,
        wardNumber: wardNumber || undefined,
        age: age ? Number(age) : undefined,
        createdAt: new Date().toISOString(),
        isAvailable: true,
      };

      if (isFirebaseConfigured()) {
        await createBloodDonorInFirestore(donorData);
      }

      setSubmitted(true);
      toast.success('Thank you for registering as a blood donor!');
    } catch (err) {
      console.error('Blood donor registration error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setBloodGroup('');
    setWardNumber('');
    setAge('');
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
            <span className="bg-gradient-to-r from-red-300 to-rose-200 bg-clip-text text-transparent">
              Blood Donor
            </span>{' '}
            Registry
          </h1>
          <p className="text-base opacity-90 max-w-xl mx-auto">
            Find blood donors in Malad or register as a donor. Every drop counts &mdash; help save lives in your community.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Tabs */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setActiveTab('find')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
                activeTab === 'find'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200/50'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-200'
              }`}
            >
              <FiSearch className="text-base" /> Find Donors
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200/50'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-200'
              }`}
            >
              <FiHeart className="text-base" /> Register as Donor
            </button>
          </div>

          {/* Find Donors Tab */}
          {activeTab === 'find' && (
            <div className="card p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FiSearch className="text-emerald-600" /> Find Blood Donors
              </h2>

              {/* Blood Group Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Blood Group
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {bloodGroups.map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setSelectedBloodGroup(selectedBloodGroup === bg ? '' : bg)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                        selectedBloodGroup === bg
                          ? 'bg-red-50 text-red-700 border-red-300 ring-1 ring-red-200'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-red-200 hover:text-red-500'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ward Filter */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Filter by Ward
                </label>
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="">All Wards</option>
                  {wardsData.map((ward) => (
                    <option key={ward.number} value={ward.number}>
                      Ward {ward.number} &mdash; {ward.area}
                    </option>
                  ))}
                </select>
              </div>

              {/* Registry Message */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-8 text-center border border-red-100">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiDroplet className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Blood Donor Registry is Growing
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                  Register below and help save lives in Malad. For privacy, donor contact details are not displayed publicly. In an emergency, reach out to us and we&rsquo;ll connect you with a matching donor.
                </p>
                <button
                  onClick={() => setActiveTab('register')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-red-200/50 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <FiHeart /> Register as Donor
                </button>
              </div>
            </div>
          )}

          {/* Register as Donor Tab */}
          {activeTab === 'register' && (
            <div>
              {submitted ? (
                <div className="card p-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle className="text-white text-3xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You, Donor!</h2>
                  <p className="text-gray-500 mb-1">Your registration has been received.</p>
                  <p className="text-gray-500 mb-6">
                    You&rsquo;re now part of the OneMalad Blood Donor Registry. We&rsquo;ll reach out when someone in Malad needs your blood group.
                  </p>
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Register Another Donor
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FiHeart className="text-red-500" /> Register as Blood Donor
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
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                      </div>
                      {phone.length > 0 && phone.length < 10 && (
                        <p className="text-xs text-amber-600 mt-1">{10 - phone.length} more digits needed</p>
                      )}
                    </div>

                    {/* Blood Group */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Blood Group <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiDroplet className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                          required
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
                        >
                          <option value="">Select your blood group</option>
                          {bloodGroups.map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Ward */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Ward <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          value={wardNumber}
                          onChange={(e) => setWardNumber(e.target.value ? Number(e.target.value) : '')}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
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

                    {/* Age */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Age <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Your age (18-65)"
                        min={18}
                        max={65}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-200/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                      {submitting ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <FiSend /> Register as Blood Donor
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-rose-700" />
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
            </div>
            <div className="relative px-8 sm:px-16 py-12 sm:py-16 text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Every Drop Saves a Life
              </h2>
              <p className="text-base text-red-100/80 max-w-xl mx-auto">
                Blood donation is the gift of life. Register today and be ready to help when someone in Malad needs you most. Together, we are OneMalad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
