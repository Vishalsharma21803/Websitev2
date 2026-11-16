'use client';
import dynamic from 'next/dynamic';

const SoloCanvas = dynamic(() => import('./three/Scene').then((m) => m.SoloCanvas), { ssr: false, loading: () => <div className="solo-loading" /> });

export function Solo({ which }: { which: 0 | 1 | 2 | 3 }) {
  return <SoloCanvas which={which} />;
}
