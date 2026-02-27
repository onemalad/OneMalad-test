import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaXTwitter, FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa6';
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-600 via-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/25">
                1
              </div>
              <div>
                <span className="text-lg font-black text-white">One<span className="text-cyan-300">Malad</span></span>
                <span className="block text-[9px] font-semibold tracking-[0.2em] uppercase text-white/40">Community Foundation</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              OneMalad Foundation — Building a stronger Malad through community service,
              social initiatives, and grassroots engagement. Together we serve, together we grow.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaXTwitter, href: 'https://x.com/onemalad' },
                { icon: FaInstagram, href: 'https://instagram.com/onemalad' },
                { icon: FaFacebookF, href: 'https://facebook.com/onemalad' },
                { icon: FaYoutube, href: 'https://youtube.com/@onemalad' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'Our Work', href: '/our-work' },
                { label: 'Events', href: '/events' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Volunteer', href: '/volunteer' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Wards */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Our Wards</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'P North Ward 32', href: '/wards/32' },
                { label: 'P North Ward 33', href: '/wards/33' },
                { label: 'P North Ward 34', href: '/wards/34' },
                { label: 'P South Ward 48', href: '/wards/48' },
                { label: 'P South Ward 49', href: '/wards/49' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm">
                <FiMapPin className="text-base mt-0.5 flex-shrink-0" />
                Malad West, Mumbai - 400064, Maharashtra
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <FiMail className="text-base flex-shrink-0" />
                onemaladconnect@gmail.com
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <FiPhone className="text-base flex-shrink-0" />
                +91 99207 66971
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} OneMalad.in - All Rights Reserved. Built for Malad, by Malad.</p>
        </div>
      </div>
    </footer>
  );
}
