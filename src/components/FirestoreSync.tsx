'use client';

import { useEffect } from 'react';
import { initFirestoreSync } from '@/hooks/useStore';

export default function FirestoreSync() {
  useEffect(() => {
    const cleanup = initFirestoreSync();
    return cleanup;
  }, []);
  return null;
}
