'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { FiMail, FiLock, FiCalendar, FiUsers, FiHeart, FiArrowLeft, FiActivity } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle, signInWithEmail, forgotPassword, logout } = useAuth();
  const { activities, events, impactStats } = useStore();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      toast.error(err.message || 'Sign in failed');
    }
    setAuthLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    setAuthLoading(true);
    try {
      await forgotPassword(email);
      setResetSent(true);
    } catch {
      // toast already shown in context
    }
    setAuthLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not logged in — admin sign-in only
  if (!user) {
    return (
      <>
        <section className="page-header-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl font-bold mb-2">
              {showForgotPassword ? 'Reset Password' : 'Foundation Admin Login'}
            </h1>
            <p className="opacity-90">
              {showForgotPassword
                ? 'Enter your email and we\'ll send you a reset link'
                : 'This page is for authorized OneMalad Foundation personnel only'}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-md mx-auto px-4">
            <div className="card p-8">
              {showForgotPassword ? (
                <>
                  {resetSent ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiMail className="text-3xl text-green-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Check Your Email</h3>
                      <p className="text-sm text-gray-500 mb-6">
                        We&apos;ve sent a password reset link to <strong>{email}</strong>.
                      </p>
                      <button
                        onClick={() => { setShowForgotPassword(false); setResetSent(false); }}
                        className="text-blue-600 font-medium text-sm hover:underline flex items-center gap-1 mx-auto"
                      >
                        <FiArrowLeft /> Back to Sign In
                      </button>
                    </div>
                  ) : (
                    <>
                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@example.com"
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              required
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={authLoading}
                          className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-lg hover:shadow-md transition-all disabled:opacity-50"
                        >
                          {authLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                      </form>
                      <button
                        onClick={() => setShowForgotPassword(false)}
                        className="text-blue-600 font-medium text-sm hover:underline flex items-center gap-1 mx-auto mt-5"
                      >
                        <FiArrowLeft /> Back to Sign In
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Google Sign In */}
                  <button
                    onClick={signInWithGoogle}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all mb-6"
                  >
                    <FcGoogle className="text-xl" />
                    Continue with Google
                  </button>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-sm text-gray-400">or</span>
                    </div>
                  </div>

                  {/* Email Sign In */}
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@onemalad.in"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Your password"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {authLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </>
    );
  }

  // Logged in — show dashboard
  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date()).length;

  return (
    <>
      <section className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome, {user.displayName}</h1>
                <p className="text-sm opacity-80">{user.email} &middot; <span className="capitalize">{user.role}</span></p>
              </div>
            </div>
            <div className="flex gap-3">
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-white/15 border border-white/25 rounded-lg text-sm font-medium hover:bg-white/25 transition-all"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="px-4 py-2 bg-red-500/80 rounded-lg text-sm font-medium hover:bg-red-500 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Foundation Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Activities', val: activities.length, icon: <FiActivity />, color: 'text-blue-600' },
              { label: 'Upcoming Events', val: upcomingEvents, icon: <FiCalendar />, color: 'text-purple-600' },
              { label: 'Impact Areas', val: impactStats.length, icon: <FiHeart />, color: 'text-rose-600' },
              { label: 'Wards Covered', val: 5, icon: <FiUsers />, color: 'text-teal-600' },
            ].map((s) => (
              <div key={s.label} className="card p-5 text-center">
                <div className={`text-2xl ${s.color} flex justify-center mb-1`}>{s.icon}</div>
                <div className="text-2xl font-extrabold text-gray-800">{s.val}</div>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {user.role === 'admin' && (
              <Link href="/admin" className="card p-5 card-hover text-center">
                <div className="text-2xl mb-2">&#9881;&#65039;</div>
                <h3 className="font-semibold text-gray-800">Admin Panel</h3>
                <p className="text-sm text-gray-500">Manage foundation platform</p>
              </Link>
            )}
            <Link href="/our-work" className="card p-5 card-hover text-center">
              <div className="text-2xl mb-2">&#128203;</div>
              <h3 className="font-semibold text-gray-800">Our Work</h3>
              <p className="text-sm text-gray-500">View all foundation activities</p>
            </Link>
            <Link href="/wards" className="card p-5 card-hover text-center">
              <div className="text-2xl mb-2">&#128506;</div>
              <h3 className="font-semibold text-gray-800">Wards</h3>
              <p className="text-sm text-gray-500">Explore ward information</p>
            </Link>
          </div>

          {/* Recent Activities */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.slice(0, 10).map((activity) => (
                <div key={activity.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {activity.location} &middot; {new Date(activity.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {activity.volunteersCount} volunteers
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-10 text-center">
              <p className="text-gray-400">No activities recorded yet</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
