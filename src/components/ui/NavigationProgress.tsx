'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const startProgress = useCallback(() => {
    setVisible(true);
    setProgress(20);
    const t1 = setTimeout(() => setProgress(50), 100);
    const t2 = setTimeout(() => setProgress(70), 300);
    const t3 = setTimeout(() => setProgress(85), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    setProgress(100);
    const timeout = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  // Intercept link clicks to start progress bar immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;
      if (href === pathname) return;
      startProgress();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname, startProgress]);

  if (!visible && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-cyan-400 shadow-lg shadow-blue-500/30"
        style={{
          width: `${progress}%`,
          transition: progress === 0 ? 'none' : progress === 100 ? 'width 200ms ease-out' : 'width 400ms ease-out',
        }}
      />
    </div>
  );
}
