'use client';

import Link from 'next/link';
import { FiArrowRight, FiMapPin, FiUsers, FiCheckCircle, FiCalendar, FiHeart } from 'react-icons/fi';
import { HiOutlineLocationMarker, HiOutlineSparkles } from 'react-icons/hi';
import { wardsData, corporatorsData } from '@/data/wards';
import { useStore } from '@/hooks/useStore';

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
  const hours = now.getHours();
  const dayIndex = hours < 6
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getDate()
    : now.getDate();
  const monthSeed = now.getMonth() * 31;
  const index = (dayIndex + monthSeed) % dailyQuotes.length;
  return dailyQuotes[index];
}

const activityCategoryLabels: Record<string, string> = {
  cleanliness_drive: 'Cleanliness',
  health_camp: 'Health',
  food_distribution: 'Food Drive',
  education: 'Education',
  tree_planting: 'Environment',
  blood_donation: 'Blood Donation',
  sports: 'Sports',
  cultural: 'Cultural',
  infrastructure: 'Infrastructure',
  other: 'Other',
};

const activityCategoryColors: Record<string, string> = {
  cleanliness_drive: 'bg-green-100 text-green-800',
  health_camp: 'bg-red-100 text-red-800',
  food_distribution: 'bg-amber-100 text-amber-800',
  education: 'bg-blue-100 text-blue-800',
  tree_planting: 'bg-emerald-100 text-emerald-800',
  blood_donation: 'bg-rose-100 text-rose-800',
  sports: 'bg-orange-100 text-orange-800',
  cultural: 'bg-purple-100 text-purple-800',
  infrastructure: 'bg-gray-100 text-gray-800',
  other: 'bg-gray-100 text-gray-800',
};

export default function HomePage() {
  const { activities, events, impactStats } = useStore();
  const recentActivities = activities.slice(0, 3);
  const upcomingEvents = events.filter((e) => e.isUpcoming).slice(0, 3);

  const quote = getDailyQuote();

  return (
    <>
      {/* 1. Hero Section */}
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
                <span className="text-sm font-medium text-blue-200">Serving Malad Wards 32, 33, 34, 48, 49</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] mb-6">
                Building a Better{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Malad, Together
                </span>
              </h1>
              <p className="text-lg text-blue-200/80 mb-8 leading-relaxed max-w-xl">
                OneMalad Foundation serves the people of Malad through community service, health camps, cleanliness drives, food distribution, and grassroots initiatives. Join us in making a difference.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/our-work" className="px-7 py-3.5 bg-white text-gray-900 font-bold rounded-xl hover:shadow-xl hover:shadow-white/10 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 text-sm">
                  Our Work <FiArrowRight />
                </Link>
                <Link href="/volunteer" className="px-7 py-3.5 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-blue-500/20 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 text-sm border border-white/10">
                  Get Involved <FiHeart />
                </Link>
              </div>
              <div className="flex items-center gap-5 text-sm text-blue-300/60">
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-green-400" /> 100% volunteer-driven</span>
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-green-400" /> 5 wards served</span>
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-green-400" /> Open to all</span>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {impactStats.slice(0, 4).map((stat) => (
                  <div key={stat.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/15 hover:scale-105 transition-transform duration-300">
                    <span className="text-2xl mb-3 block">{stat.emoji}</span>
                    <div className="text-3xl font-extrabold text-white mb-1">{stat.value.toLocaleString()}{stat.suffix}</div>
                    <p className="text-sm text-blue-200/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="grid grid-cols-3 gap-3 mt-10 lg:hidden">
            {impactStats.slice(0, 3).map((stat) => (
              <div key={stat.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-center">
                <div className="text-xl font-extrabold">{stat.value.toLocaleString()}{stat.suffix}</div>
                <p className="text-[10px] text-blue-200/70 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Daily Quote */}
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

      {/* 3. Impact Dashboard */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-72 h-72 bg-teal-400 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
            </div>
            <div className="relative p-8 sm:p-12">
              <div className="text-center mb-8">
                <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">Our Impact</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Making a Real Difference</h2>
                <p className="text-gray-400 text-sm">Numbers that reflect our commitment to Malad</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {impactStats.map((stat) => (
                  <div key={stat.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-center hover:bg-white/10 transition-colors">
                    <span className="text-2xl mb-2 block">{stat.emoji}</span>
                    <div className="text-xl font-extrabold text-white mb-1">{stat.value.toLocaleString()}{stat.suffix}</div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Recent Activities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800">Recent Activities</h2>
              <p className="text-gray-500 mt-1">Latest foundation work across Malad</p>
            </div>
            <Link href="/our-work" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="card p-6 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${activityCategoryColors[activity.category]}`}>
                    {activityCategoryLabels[activity.category]}
                  </span>
                  {activity.wardNumber && (
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      Ward {activity.wardNumber}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{activity.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{activity.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <FiCalendar /> {new Date(activity.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <FiUsers /> {activity.volunteersCount}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <FiHeart /> {activity.beneficiariesCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. What is OneMalad */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">About Us</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 leading-tight">
                What is <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">OneMalad</span>?
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-800">OneMalad Foundation</strong> is a community-driven organization dedicated to serving the people of Malad.
                  We believe that real change starts at the grassroots &mdash; through collective action, compassion, and consistent effort.
                </p>
                <p>
                  From beach cleanups at Marve to health camps in Malwani, from food distribution during Ramadan to tree plantation drives on Madh Island &mdash;
                  OneMalad brings together volunteers from all communities to make Malad a better place for everyone.
                </p>
                <p>
                  We serve <strong>5 key wards</strong> (32, 33, 34, 48, 49) across P-North and P-South zones, representing over
                  <strong> 4 lakh residents</strong> and their families. Our mission is simple: <em>One Malad, One Community, One Purpose.</em>
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                  <FiCheckCircle className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">100% Volunteer-Driven</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                  <FiCheckCircle className="text-green-600" />
                  <span className="text-sm font-medium text-gray-700">All Communities United</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                  <FiCheckCircle className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Transparent Impact</span>
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
                  <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mb-6">Community Foundation</p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FiMapPin className="text-blue-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">5 Wards Served</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FiUsers className="text-teal-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">500+ Volunteers</span>
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

      {/* 6. Malad Wards */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">Wards</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">Malad Wards</h2>
              <p className="text-gray-500 mt-1">The 5 wards we serve across Malad</p>
            </div>
            <Link href="/wards" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
              All Wards <FiArrowRight />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {wardsData.map((ward) => {
              const corp = corporatorsData.find((c) => c.wardNumber === ward.number);
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
                      <span className="text-xs text-gray-400">{ward.population?.toLocaleString('en-IN')} residents</span>
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

      {/* 7. Discover Malad */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-teal-50 text-teal-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">Explore</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
              Discover <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">Malad</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">From historic forts and serene beaches to vibrant markets and community landmarks &mdash; explore what makes Malad special</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </section>

      {/* 8. Unity in Diversity */}
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
                desc: 'The thunderous beats of dhol-tasha echo through every lane as Ganpati Bappa arrives. From small home mandaps to grand community pandals, all of Malad comes together for the 10-day celebration.',
                gradient: 'from-orange-500 to-red-500',
                bg: 'bg-orange-50',
              },
              {
                festival: 'Christmas',
                emoji: '\u{1F384}',
                community: 'Christian',
                desc: 'Madh Island and Malwani\'s East Indian community deck up homes with stars and lights. Midnight Mass at St. Bonaventure Church and carol singing unite the neighbourhood in Christmas joy.',
                gradient: 'from-red-500 to-rose-600',
                bg: 'bg-red-50',
              },
              {
                festival: 'Diwali',
                emoji: '\u{1FA94}',
                community: 'Hindu',
                desc: 'The festival of lights transforms Malad into a sparkling wonderland. Rangoli competitions, laxmi puja, and sharing faral with every neighbour regardless of religion make Diwali truly special.',
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

      {/* 9. Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-800">Upcoming Events</h2>
                <p className="text-gray-500 mt-1">Foundation events and community gatherings</p>
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

      {/* 10. Why OneMalad */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">Why OneMalad?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Be part of the change you want to see in your neighbourhood</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Community Service', desc: 'Regular cleanliness drives, health camps, and food distribution across all 5 wards.', icon: <FiHeart className="text-2xl" />, color: 'from-blue-500 to-blue-600' },
              { title: 'Unity in Action', desc: 'Bringing together people from all communities and faiths to serve as one Malad.', icon: <FiUsers className="text-2xl" />, color: 'from-teal-500 to-green-500' },
              { title: 'Youth Empowerment', desc: 'Engaging the next generation through sports, education, and digital literacy programs.', icon: <FiArrowRight className="text-2xl" />, color: 'from-amber-500 to-orange-500' },
              { title: 'Transparent Impact', desc: 'Every activity documented with real numbers. See our work, verify our impact.', icon: <FiCheckCircle className="text-2xl" />, color: 'from-purple-500 to-indigo-500' },
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

      {/* 11. Volunteer CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700" />
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
            </div>
            <div className="relative px-8 sm:px-16 py-16 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                Join the OneMalad Movement
              </h2>
              <p className="text-lg text-blue-100/80 max-w-2xl mx-auto mb-10">
                Volunteer with us, attend our events, and help build the Malad we all deserve. Every hand makes a difference.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/volunteer" className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl text-lg hover:shadow-2xl hover:shadow-white/20 transition-all hover:-translate-y-1 inline-flex items-center gap-2">
                  Become a Volunteer <FiHeart />
                </Link>
                <Link href="/our-work" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl text-lg border border-white/20 hover:bg-white/20 transition-all inline-flex items-center gap-2">
                  View Our Work <FiArrowRight />
                </Link>
              </div>
              <p className="text-sm text-blue-200/50 mt-6">No registration needed. Just show up and serve.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
