'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { FiMail, FiLock, FiUser, FiClock, FiCheckCircle, FiLoader, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import toast from 'react-hot-toast';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: <FiClock /> },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: <FiLoader /> },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', icon: <FiCheckCircle /> },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, forgotPassword, logout } = useAuth();
  const { issues } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
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

  // Not logged in - show auth forms
  if (!user) {
    return (
      <>
        <section className="page-header-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl font-bold mb-2">
              {showForgotPassword ? 'Reset Password' : isLogin ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="opacity-90">
              {showForgotPassword
                ? 'Enter your email and we\'ll send you a reset link'
                : 'Join OneMalad to raise issues and participate in community events'}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-md mx-auto px-4">
            <div className="card p-8">
              {/* Forgot Password Form */}
              {showForgotPassword ? (
                <>
                  {resetSent ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiCheckCircle className="text-3xl text-green-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Check Your Email</h3>
                      <p className="text-sm text-gray-500 mb-6">
                        We&apos;ve sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
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

                  {/* Email Form */}
                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        {isLogin && (
                          <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-xs text-blue-600 hover:underline font-medium"
                          >
                            Forgot password?
                          </button>
                        )}
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
                      {authLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                  </form>

                  <p className="text-center text-sm text-gray-500 mt-5">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </>
    );
  }

  // Logged in - show dashboard
  const userIssues = issues.filter((i) => i.userEmail === user.email);

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
              {user.role === 'corporator' && (
                <Link
                  href="/corporator-panel"
                  className="px-4 py-2 bg-white/15 border border-white/25 rounded-lg text-sm font-medium hover:bg-white/25 transition-all"
                >
                  Corporator Panel
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
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'My Issues', val: userIssues.length, icon: <FiAlertCircle />, color: 'text-blue-600' },
              { label: 'Pending', val: userIssues.filter((i) => i.status === 'pending').length, icon: <FiClock />, color: 'text-amber-600' },
              { label: 'In Progress', val: userIssues.filter((i) => i.status === 'in_progress').length, icon: <FiLoader />, color: 'text-blue-600' },
              { label: 'Resolved', val: userIssues.filter((i) => i.status === 'resolved').length, icon: <FiCheckCircle />, color: 'text-green-600' },
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
            <Link href="/issues?action=raise" className="card p-5 card-hover text-center">
              <div className="text-2xl mb-2">+</div>
              <h3 className="font-semibold text-gray-800">Raise New Issue</h3>
              <p className="text-sm text-gray-500">Report a civic problem</p>
            </Link>
            <Link href="/wards" className="card p-5 card-hover text-center">
              <div className="text-2xl mb-2">&#128506;</div>
              <h3 className="font-semibold text-gray-800">Find Your Ward</h3>
              <p className="text-sm text-gray-500">Explore ward information</p>
            </Link>
            <Link href="/events" className="card p-5 card-hover text-center">
              <div className="text-2xl mb-2">&#127881;</div>
              <h3 className="font-semibold text-gray-800">Events</h3>
              <p className="text-sm text-gray-500">Community activities</p>
            </Link>
          </div>

          {/* My Issues */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Issues</h2>
          {userIssues.length > 0 ? (
            <div className="space-y-3">
              {userIssues.map((issue) => {
                const status = statusConfig[issue.status];
                return (
                  <div key={issue.id} className="card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{issue.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">Ward {issue.wardNumber} &middot; {issue.location}</p>
                      </div>
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card p-10 text-center">
              <p className="text-gray-400 mb-3">You haven&apos;t raised any issues yet</p>
              <Link
                href="/issues?action=raise"
                className="inline-flex px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-semibold rounded-lg"
              >
                Raise Your First Issue
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
