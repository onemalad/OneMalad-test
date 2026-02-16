import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'white';
}

export default function Logo({ size = 'md', variant = 'default' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8 text-sm', text: 'text-lg', tagline: 'text-[9px]' },
    md: { icon: 'w-10 h-10 text-base', text: 'text-xl', tagline: 'text-[10px]' },
    lg: { icon: 'w-14 h-14 text-xl', text: 'text-3xl', tagline: 'text-xs' },
  };

  const s = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* Icon Mark */}
      <div className={`${s.icon} relative rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <span className="relative z-10">1</span>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <div className={`${s.text} font-black tracking-tight leading-none`}>
          {variant === 'white' ? (
            <span className="text-white">
              One<span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">Malad</span>
            </span>
          ) : (
            <>
              <span className="text-gray-900">One</span>
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
                Malad
              </span>
            </>
          )}
        </div>
        <span className={`${s.tagline} font-bold tracking-[0.15em] uppercase ${variant === 'white' ? 'text-white/40' : 'text-gray-400'}`}>
          For the people
        </span>
      </div>
    </Link>
  );
}
