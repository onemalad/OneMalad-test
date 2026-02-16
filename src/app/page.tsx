'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiMapPin, FiUsers, FiAlertCircle, FiCheckCircle, FiClock, FiLoader, FiCalendar, FiSend, FiHeart } from 'react-icons/fi';
import { HiOutlineLocationMarker, HiOutlineSparkles } from 'react-icons/hi';
import { wardsData, corporatorsData } from '@/data/wards';
import { useStore } from '@/hooks/useStore';
import { useAuth } from '@/context/AuthContext';
import { isFirebaseConfigured, createThoughtInFirestore, subscribeToThoughts, Thought } from '@/lib/firestore';
import PromoBanner from '@/components/ui/PromoBanner';
import toast from 'react-hot-toast';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: <FiClock className="text-xs" /> },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: <FiLoader className="text-xs" /> },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', icon: <FiCheckCircle className="text-xs" /> },
};

// Daily motivational quotes about community and civic engagement
const dailyQuotes = [
  { text: 'The strength of the community is each individual member. The strength of each member is the community.', author: 'Phil Jackson' },
  { text: 'Alone we can do so little; together we can do so much.', author: 'Helen Keller' },
  { text: 'Never doubt that a small group of thoughtful, committed citizens can change the world.', author: 'Margaret Mead' },
  { text: 'The best way to find yourself is to lose yourself in the service of others.', author: 'Mahatma Gandhi' },
  { text: 'We make a living by what we get, but we make a life by what we give.', author: 'Winston Churchill' },
  { text: 'In every community, there is work to be done. In every nation, there are wounds to heal.', author: 'Marianne Williamson' },
  { text: 'Coming together is a beginning, staying together is progress, and working together is success.', author: 'Henry Ford' },
  { text: 'The greatness of a community is most accurately measured by the compassionate actions of its members.', author: 'Coretta Scott King' },
  { text: 'It is not enough to be compassionate. You must act.', author: 'Dalai Lama' },
  { text: 'A nation\'s greatness is measured by how it treats its weakest members.', author: 'Mahatma Gandhi' },
  { text: 'What we have done for ourselves alone dies with us; what we have done for others remains and is immortal.', author: 'Albert Pike' },
  { text: 'No one has ever become poor by giving.', author: 'Anne Frank' },
  { text: 'Service to others is the rent you pay for your room here on earth.', author: 'Muhammad Ali' },
  { text: 'Be the change you wish to see in the world.', author: 'Mahatma Gandhi' },
  { text: 'If you want to go fast, go alone. If you want to go far, go together.', author: 'African Proverb' },
  { text: 'The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate.', author: 'Ralph Waldo Emerson' },
  { text: 'We rise by lifting others.', author: 'Robert Ingersoll' },
  { text: 'Think globally, act locally.', author: 'Patrick Geddes' },
  { text: 'Every great dream begins with a dreamer. You have within you the strength to reach for the stars.', author: 'Harriet Tubman' },
  { text: 'Volunteers do not necessarily have the time; they have the heart.', author: 'Elizabeth Andrew' },
  { text: 'Unity is strength. When there is teamwork and collaboration, wonderful things can be achieved.', author: 'Mattie Stepanek' },
  { text: 'Our lives begin to end the day we become silent about things that matter.', author: 'Martin Luther King Jr.' },
  { text: 'You must not lose faith in humanity. Humanity is an ocean; a few drops do not make the ocean dirty.', author: 'Mahatma Gandhi' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'A community is like a ship; everyone ought to be prepared to take the helm.', author: 'Henrik Ibsen' },
  { text: 'Small acts, when multiplied by millions of people, can transform the world.', author: 'Howard Zinn' },
  { text: 'One person can make a difference, and everyone should try.', author: 'John F. Kennedy' },
  { text: 'The world is changed by your example, not by your opinion.', author: 'Paulo Coelho' },
  { text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
  { text: 'Together, ordinary people can achieve extraordinary results.', author: 'Becka Schoettle' },
  { text: 'Let us remember: One book, one pen, one child, and one teacher can change the world.', author: 'Malala Yousafzai' },
];

function getDailyQuote() {
  const now = new Date();
  // Changes at 6 AM daily
  const hours = now.getHours();
  const dayIndex = hours < 6
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getDate()
    : now.getDate();
  const monthSeed = now.getMonth() * 31;
  const index = (dayIndex + monthSeed) % dailyQuotes.length;
  return dailyQuotes[index];
}

export default function HomePage() {
  const { issues, events } = useStore();
  const { user } = useAuth();
  const recentIssues = issues.slice(0, 3);
  const upcomingEvents = events.filter((e) => e.isUpcoming).slice(0, 3);

  const totalIssues = issues.length;
  const resolvedIssues = issues.filter((i) => i.status === 'resolved').length;
  const inProgressIssues = issues.filter((i) => i.status === 'in_progress').length;

  const partyCount: Record<string, number> = {};
  corporatorsData.forEach((c) => {
    partyCount[c.party] = (partyCount[c.party] || 0) + 1;
  });

  const quote = getDailyQuote();

  // Thoughts state
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [newThought, setNewThought] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const unsub = subscribeToThoughts(setThoughts);
    return () => unsub();
  }, []);

  const handleSubmitThought = async () => {
    if (!user) {
      toast.error('Please sign in to share your thoughts');
      return;
    }
    if (!newThought.trim()) return;
    setSubmitting(true);
    try {
      await createThoughtInFirestore({
        userName: user.displayName,
        userEmail: user.email,
        text: newThought.trim(),
        createdAt: new Date().toISOString(),
      });
      setNewThought('');
      toast.success('Thought shared!');
    } catch {
      toast.error('Failed to share thought');
    }
    setSubmitting(false);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjZykiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24 relative w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-200">Live for Malad Wards 32, 33, 34, 48, 49</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] mb-6">
                Your Voice,{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Your Malad
                </span>
              </h1>
              <p className="text-lg text-blue-200/80 mb-8 leading-relaxed max-w-xl">
                The civic platform where Malad residents raise issues, track real-time progress, and hold corporators accountable. Join the movement to build a better Malad.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/dashboard" className="px-7 py-3.5 bg-white text-gray-900 font-bold rounded-xl hover:shadow-xl hover:shadow-white/10 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 text-sm">
                  Join OneMalad - Free <FiArrowRight />
                </Link>
                <Link href="/issues?action=raise" className="px-7 py-3.5 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-blue-500/20 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 text-sm border border-white/10">
                  Raise an Issue <FiAlertCircle />
                </Link>
              </div>
              <div className="flex items-center gap-5 text-sm text-blue-300/60">
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-green-400" /> Free forever</span>
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-green-400" /> 100% transparent</span>
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-green-400" /> No spam</span>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: '5', lbl: 'Wards Covered', icon: <FiMapPin className="text-xl" />, gradient: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-400/20', iconColor: 'text-blue-400' },
                  { val: `${totalIssues}+`, lbl: 'Issues Raised', icon: <FiAlertCircle className="text-xl" />, gradient: 'from-amber-500/15 to-orange-500/15', border: 'border-amber-400/20', iconColor: 'text-amber-400' },
                  { val: `${resolvedIssues}`, lbl: 'Resolved', icon: <FiCheckCircle className="text-xl" />, gradient: 'from-green-500/15 to-emerald-500/15', border: 'border-green-400/20', iconColor: 'text-green-400' },
                  { val: '5', lbl: 'Corporators', icon: <FiUsers className="text-xl" />, gradient: 'from-purple-500/15 to-pink-500/15', border: 'border-purple-400/20', iconColor: 'text-purple-400' },
                ].map((s) => (
                  <div key={s.lbl} className={`bg-gradient-to-br ${s.gradient} backdrop-blur-sm rounded-2xl p-6 border ${s.border} hover:scale-105 transition-transform duration-300`}>
                    <div className={`${s.iconColor} mb-3`}>{s.icon}</div>
                    <div className="text-3xl font-extrabold text-white mb-1">{s.val}</div>
                    <p className="text-sm text-blue-200/60">{s.lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="grid grid-cols-4 gap-3 mt-10 lg:hidden">
            {[
              { val: '5', lbl: 'Wards' },
              { val: `${totalIssues}`, lbl: 'Issues' },
              { val: `${resolvedIssues}`, lbl: 'Resolved' },
              { val: '5', lbl: 'Corporators' },
            ].map((s) => (
              <div key={s.lbl} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-center">
                <div className="text-xl font-extrabold">{s.val}</div>
                <p className="text-[10px] text-blue-200/70 mt-0.5">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Quote */}
      <section className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-b border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HiOutlineSparkles className="text-amber-500" />
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Thought of the Day</span>
            <HiOutlineSparkles className="text-amber-500" />
          </div>
          <p className="text-lg sm:text-xl font-medium text-gray-700 italic leading-relaxed">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="text-sm text-amber-600 font-semibold mt-2">&mdash; {quote.author}</p>
        </div>
      </section>

      {/* Hero Promo Banner */}
      <PromoBanner placement="hero" />

      {/* Discover Malad - Blog Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-teal-50 text-teal-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">Explore</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
              Discover <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">Malad</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">From historic forts and serene beaches to vibrant markets and community landmarks &mdash; explore what makes Malad special</p>
          </div>

          {/* Featured Places Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                slug: 'marve-beach',
                title: 'Marve Beach',
                ward: 32,
                image: 'https://mumbaitourism.travel/images/places-to-visit/headers/marve-beach-mumbai-tourism-entry-fee-timings-holidays-reviews-header.jpg',
                desc: 'A serene getaway at the tip of Malad West. Known for its calm shores, stunning sunsets, and the iconic ferry service to Manori and Essel World.',
                tag: 'Beach',
                tagColor: 'bg-cyan-50 text-cyan-700',
              },
              {
                slug: 'madh-fort',
                title: 'Madh Fort',
                ward: 49,
                image: 'https://media3.thrillophilia.com/filestore/klmq0f5fn2qknwzlnoksjnvmo976_1573213125_madh-fort-mumbai-1920x1434.jpg',
                desc: 'A 17th-century Portuguese watchtower standing guard over the Arabian Sea with panoramic ocean views and rich history.',
                tag: 'Heritage',
                tagColor: 'bg-amber-50 text-amber-700',
              },
              {
                slug: 'malwani',
                title: 'Malwani',
                ward: 34,
                image: 'https://media3.thrillophilia.com/filestore/fx2oqw5y8nllsmkoaco390nn68nd_shutterstock_1980977681.jpg',
                desc: 'The heart of Malad\'s community life. Famous Malwani cuisine, bustling Gate 6 & Gate 7, and one of Mumbai\'s most culturally rich neighbourhoods.',
                tag: 'Community',
                tagColor: 'bg-purple-50 text-purple-700',
              },
              {
                slug: 'aksa-beach',
                title: 'Aksa Beach',
                ward: 49,
                image: 'https://media3.thrillophilia.com/filestore/8ernb5ogs4w98zn5fftrc8pgnrbw_shutterstock_1271510506.jpg',
                desc: 'A peaceful stretch of golden sand between Malad and Madh Island. Perfect for evening strolls, picnics, and escaping the city chaos.',
                tag: 'Beach',
                tagColor: 'bg-cyan-50 text-cyan-700',
              },
              {
                slug: 'st-bonaventure-church',
                title: 'St. Bonaventure Church',
                ward: 49,
                image: 'https://media3.thrillophilia.com/filestore/sh6vouszgvfcrgk939fyngwoqzb0_shutterstock_1924548245.jpg',
                desc: 'A 16th-century Portuguese church on Madh Island with beautiful stained glass windows. One of the oldest churches in Mumbai.',
                tag: 'Heritage',
                tagColor: 'bg-amber-50 text-amber-700',
              },
            ].map((place) => (
              <Link key={place.slug} href={`/discover/${place.slug}`} className="group">
                <div className="card overflow-hidden card-hover h-full">
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={place.image}
                      alt={place.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${place.tagColor}`}>{place.tag}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{place.title}</h3>
                      <span className="text-[10px] text-gray-400 font-medium ml-auto">Ward {place.ward}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{place.desc}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold mt-3 group-hover:underline">
                      Read More <FiArrowRight className="text-[10px]" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Malad Quick Facts */}
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-72 h-72 bg-teal-400 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
            </div>
            <div className="relative p-8 sm:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-extrabold text-white mb-2">Malad at a Glance</h3>
                <p className="text-gray-400 text-sm">Key facts about our vibrant neighbourhood</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { val: '2L+', lbl: 'Registered Voters', emoji: '\u{1F5F3}\uFE0F' },
                  { val: '5', lbl: 'Electoral Wards', emoji: '\u{1F3D9}\uFE0F' },
                  { val: '4.4L+', lbl: 'Population', emoji: '\u{1F46A}' },
                  { val: '3', lbl: 'Beaches', emoji: '\u{1F3D6}\uFE0F' },
                  { val: '2', lbl: 'BMC Zones', emoji: '\u{1F3DB}\uFE0F' },
                  { val: '400+', lbl: 'Years of History', emoji: '\u{1F3F0}' },
                ].map((fact) => (
                  <div key={fact.lbl} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-center hover:bg-white/10 transition-colors">
                    <span className="text-2xl mb-2 block">{fact.emoji}</span>
                    <div className="text-xl font-extrabold text-white mb-1">{fact.val}</div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider leading-tight">{fact.lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ward Highlights */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiMapPin className="text-blue-500" /> Ward Highlights
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {wardsData.map((ward) => {
                const corp = corporatorsData.find((c) => c.wardNumber === ward.number);
                const wIssues = issues.filter((i) => i.wardNumber === ward.number);
                const resolved = wIssues.filter((i) => i.status === 'resolved').length;
                const rate = wIssues.length > 0 ? Math.round((resolved / wIssues.length) * 100) : 0;
                return (
                  <Link key={ward.number} href={`/wards/${ward.number}`} className="card p-5 card-hover group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {ward.number}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{ward.landmarks[0]}</p>
                        <p className="text-[10px] text-gray-400">{ward.zone}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Voters</span>
                        <span className="font-semibold text-gray-700">{ward.voters?.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Issues</span>
                        <span className="font-semibold text-gray-700">{wIssues.length}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Resolved</span>
                        <span className="font-semibold text-green-600">{rate}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all" style={{ width: `${rate}%` }} />
                      </div>
                    </div>
                    {corp && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        {corp.photo ? (
                          <img src={corp.photo} alt={corp.name} className="w-5 h-5 rounded-full object-cover" />
                        ) : (
                          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-[8px] font-bold">{corp.name.charAt(0)}</div>
                        )}
                        <span className="text-[10px] text-gray-500 truncate">{corp.name}</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* What is OneMalad - Blog Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">About Us</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 leading-tight">
                What is <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">OneMalad</span>?
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-800">OneMalad</strong> is a citizen-first civic engagement platform built for the people of Malad.
                  We believe that every resident deserves a direct line to their elected representatives and the power to demand accountability.
                </p>
                <p>
                  From waterlogged streets in Malwani to broken roads in Rathodi, from garbage issues in Jankalyan to electricity problems in Madh Island &mdash;
                  OneMalad gives you a platform to raise your voice, track progress, and see real results in your neighbourhood.
                </p>
                <p>
                  We cover <strong>5 key wards</strong> (32, 33, 34, 48, 49) across P-North and P-South zones, representing over
                  <strong> 2 lakh registered voters</strong> and their families. Our mission is simple: <em>One Malad, One Voice, One Change.</em>
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                  <FiCheckCircle className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Free & Transparent</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                  <FiCheckCircle className="text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Real-time Tracking</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                  <FiCheckCircle className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Direct to Corporator</span>
                </div>
              </div>
            </div>

            {/* Logo / Brand Card */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
                <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center text-white text-4xl font-extrabold mx-auto mb-6 shadow-lg shadow-blue-200">
                    1
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-800 mb-1">
                    <span className="text-blue-600">One</span><span className="text-teal-500">Malad</span>
                  </h3>
                  <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mb-6">For The People</p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FiMapPin className="text-blue-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">5 Wards Covered</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FiUsers className="text-teal-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">2L+ Registered Voters</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FiHeart className="text-pink-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">By Malad, For Malad</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unity in Diversity - Festivals Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">Our Pride</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
              One Malad, <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">All Faiths</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Malad is known across Mumbai for its beautiful unity &mdash; where Hindu, Muslim, Christian, Sikh, and Buddhist families
              live together as one community, celebrating every festival together with love and respect.
            </p>
          </div>

          {/* Festival Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              {
                festival: 'Eid ul-Fitr',
                emoji: '\u{1F31F}',
                community: 'Muslim',
                desc: 'Malwani comes alive with the spirit of Eid. Families prepare sheer khurma and biryani, mosques overflow with prayers, and neighbours of all faiths visit each other\'s homes to share sweets and warm wishes.',
                gradient: 'from-emerald-500 to-teal-600',
                bg: 'bg-emerald-50',
              },
              {
                festival: 'Ganesh Chaturthi',
                emoji: '\u{1F406}',
                community: 'Hindu',
                desc: 'The thunderous beats of dhol-tasha echo through every lane as Ganpati Bappa arrives. From small home mandaps to grand community pandals, all of Malad comes together for the 10-day celebration with aarti, prasad, and visarjan processions.',
                gradient: 'from-orange-500 to-red-500',
                bg: 'bg-orange-50',
              },
              {
                festival: 'Christmas',
                emoji: '\u{1F384}',
                community: 'Christian',
                desc: 'Madh Island and Malwani\'s East Indian community deck up homes with stars and lights. Midnight Mass at St. Bonaventure Church, homemade kuswar sweets, and carol singing unite the neighbourhood in Christmas joy.',
                gradient: 'from-red-500 to-rose-600',
                bg: 'bg-red-50',
              },
              {
                festival: 'Diwali',
                emoji: '\u{1FA94}',
                community: 'Hindu',
                desc: 'The festival of lights transforms Malad into a sparkling wonderland. Rangoli competitions, firecracker shows, laxmi puja, and the tradition of sharing faral (snacks) with every neighbour regardless of religion make Diwali truly special.',
                gradient: 'from-amber-500 to-yellow-500',
                bg: 'bg-amber-50',
              },
            ].map((f) => (
              <div key={f.festival} className={`card p-6 card-hover ${f.bg} border-0`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${f.gradient} rounded-xl flex items-center justify-center text-2xl shadow-md`}>
                    {f.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{f.festival}</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{f.community}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* More festivals - compact row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
            {[
              { name: 'Holi', emoji: '\u{1F308}', desc: 'Festival of Colours' },
              { name: 'Muharram', emoji: '\u{1F54C}', desc: 'Tazia processions' },
              { name: 'Navratri', emoji: '\u{1F483}', desc: 'Garba & Dandiya nights' },
              { name: 'Easter', emoji: '\u{2728}', desc: 'Resurrection Sunday' },
              { name: 'Buddha Purnima', emoji: '\u{1F4AE}', desc: 'Peace & wisdom' },
              { name: 'Guru Nanak Jayanti', emoji: '\u{1F64F}', desc: 'Langar & seva' },
            ].map((f) => (
              <div key={f.name} className="card p-4 text-center card-hover">
                <span className="text-3xl block mb-2">{f.emoji}</span>
                <p className="text-sm font-bold text-gray-800">{f.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Unity Quote Banner */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600" />
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4" />
            </div>
            <div className="relative px-8 sm:px-16 py-10 sm:py-14 text-center">
              <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed max-w-3xl mx-auto">
                &ldquo;In Malad, we don&rsquo;t ask which religion our neighbour follows &mdash; we ask what time to bring the biryani for their festival.&rdquo;
              </p>
              <p className="text-sm text-white/70 mt-4 font-medium">&mdash; The Spirit of Malad</p>
              <div className="flex justify-center gap-3 mt-6">
                <span className="text-3xl">&#x1F54C;</span>
                <span className="text-3xl">&#x1F6D5;</span>
                <span className="text-3xl">&#x26EA;</span>
                <span className="text-3xl">&#x1F64F;</span>
                <span className="text-3xl">&#x2638;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Three simple steps to make your voice heard</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Raise an Issue',
                desc: 'Report civic problems in your ward — drainage, roads, garbage, water supply, and more.',
                color: 'from-blue-500 to-blue-600',
              },
              {
                step: '02',
                title: 'Track Progress',
                desc: 'Follow real-time status updates as your corporator and BMC work on resolving the issue.',
                color: 'from-teal-500 to-teal-600',
              },
              {
                step: '03',
                title: 'See Results',
                desc: 'Get notified when issues are resolved. Rate the response and hold leaders accountable.',
                color: 'from-cyan-500 to-cyan-600',
              },
            ].map((item) => (
              <div key={item.step} className="card p-8 card-hover text-center">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white text-xl font-extrabold mx-auto mb-5`}
                >
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Issues */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800">Recent Issues</h2>
              <p className="text-gray-500 mt-1">Latest civic issues from Malad residents</p>
            </div>
            <Link href="/issues" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentIssues.map((issue) => {
              const status = statusConfig[issue.status];
              return (
                <div key={issue.id} className="card p-6 card-hover">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      Ward {issue.wardNumber}
                    </span>
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{issue.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{issue.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <HiOutlineLocationMarker /> {issue.location.split(',')[0]}
                    </span>
                    <span className="text-xs text-gray-400">{issue.upvotes} upvotes</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inline Promo */}
      <PromoBanner placement="inline" />

      {/* Share Your Thoughts */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Share Your Thoughts!</h2>
            <p className="text-gray-500">Express your views about your ward, community, or anything related to Malad</p>
          </div>

          {/* Input */}
          <div className="card p-5 mb-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                {user ? user.displayName.charAt(0) : '?'}
              </div>
              <div className="flex-1">
                <textarea
                  value={newThought}
                  onChange={(e) => setNewThought(e.target.value)}
                  placeholder={user ? "What's on your mind about Malad?" : 'Sign in to share your thoughts...'}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  disabled={!user}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">{newThought.length}/280 characters</p>
                  <button
                    onClick={handleSubmitThought}
                    disabled={submitting || !newThought.trim() || !user}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <FiSend className="text-xs" /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Thoughts Feed */}
          <div className="space-y-4">
            {thoughts.slice(0, 5).map((thought) => (
              <div key={thought.id} className="card p-5 card-hover">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {thought.userName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{thought.userName}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(thought.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{thought.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {thoughts.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No thoughts shared yet. Be the first to share!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ward Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800">Malad Wards</h2>
              <p className="text-gray-500 mt-1">Explore wards and their corporators</p>
            </div>
            <Link href="/wards" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
              All Wards <FiArrowRight />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {wardsData.map((ward) => {
              const corp = corporatorsData.find((c) => c.wardNumber === ward.number);
              const wardIssueCount = issues.filter((i) => i.wardNumber === ward.number).length;
              return (
                <Link key={ward.number} href={`/wards/${ward.number}`} className="card card-hover group overflow-hidden">
                  {ward.image && (
                    <img src={ward.image} alt={ward.name} className="w-full h-32 object-cover" />
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                      {ward.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">{ward.area}</p>
                    {corp && (
                      <div className="flex items-center gap-2 mb-3">
                        {corp.photo ? (
                          <img src={corp.photo} alt={corp.name} className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold">
                            {corp.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-semibold text-gray-700">{corp.name}</p>
                          <p className="text-[10px] text-gray-400">{corp.party}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">{wardIssueCount} issues</span>
                      <span className="text-xs text-blue-600 font-semibold group-hover:underline flex items-center gap-1">
                        View <FiArrowRight />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Party Distribution */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Party Representation</h2>
            <p className="text-gray-500">Political distribution across Malad wards (BMC 2026)</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {Object.entries(partyCount).map(([party, count]) => (
              <div key={party} className="card p-6 text-center card-hover">
                <div className="text-3xl font-extrabold text-gray-800 mb-1">{count}</div>
                <p className="text-sm text-gray-500">{party}</p>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"
                    style={{ width: `${(count / corporatorsData.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-800">Upcoming Events</h2>
                <p className="text-gray-500 mt-1">Community events by OneMalad</p>
              </div>
              <Link href="/events" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                All Events <FiArrowRight />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="card p-6 card-hover">
                  <span className="inline-block px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-md mb-3 capitalize">
                    {event.category}
                  </span>
                  <h3 className="font-bold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{event.description}</p>
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <FiCalendar /> {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <HiOutlineLocationMarker /> {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <FiUsers /> {event.attendees} expected
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Join OneMalad */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">Why Join OneMalad?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Be part of the change you want to see in your neighbourhood</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Direct Impact', desc: 'Your issues reach corporators directly. No middlemen, no delays.', icon: <FiAlertCircle className="text-2xl" />, color: 'from-blue-500 to-blue-600' },
              { title: 'Real Tracking', desc: 'Watch your complaints move from pending to resolved in real-time.', icon: <FiClock className="text-2xl" />, color: 'from-amber-500 to-orange-500' },
              { title: 'Community Power', desc: 'Upvote issues that matter. High-priority problems get attention first.', icon: <FiUsers className="text-2xl" />, color: 'from-teal-500 to-green-500' },
              { title: 'Full Transparency', desc: 'See corporator response rates, ward performance, and issue statistics.', icon: <FiCheckCircle className="text-2xl" />, color: 'from-purple-500 to-indigo-500' },
            ].map((item) => (
              <div key={item.title} className="card p-6 card-hover text-center group">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700" />
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
            </div>
            <div className="relative px-8 sm:px-16 py-16 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg text-blue-100/80 max-w-2xl mx-auto mb-10">
                Join OneMalad today. Raise issues, connect with your ward corporator, and help build the Malad we all deserve.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/dashboard" className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl text-lg hover:shadow-2xl hover:shadow-white/20 transition-all hover:-translate-y-1 inline-flex items-center gap-2">
                  Create Free Account <FiArrowRight />
                </Link>
                <Link href="/wards" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl text-lg border border-white/20 hover:bg-white/20 transition-all inline-flex items-center gap-2">
                  Explore Wards <FiMapPin />
                </Link>
              </div>
              <p className="text-sm text-blue-200/50 mt-6">Takes 30 seconds. No credit card needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BMC Administration */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="card p-8 sm:p-12 bg-gradient-to-br from-gray-800 to-gray-900 text-white border-0">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">BMC P-North & P-South Ward</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                The Malad area falls under BMC&apos;s P-North and P-South wards. OneMalad covers 5 key electoral wards
                (32, 33, 34, 48, 49) that together represent over 2 lakh registered voters across Malad West.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { val: '2L+', lbl: 'Voters' },
                  { val: '5', lbl: 'Wards' },
                  { val: '2', lbl: 'BMC Zones' },
                  { val: `${resolvedIssues}`, lbl: 'Resolved' },
                ].map((s) => (
                  <div key={s.lbl} className="text-center">
                    <div className="text-2xl font-extrabold text-teal-400">{s.val}</div>
                    <p className="text-xs text-gray-400 mt-1">{s.lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
