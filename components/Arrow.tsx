export function Arrow({ className, dir = 'right' }: { className?: string; dir?: 'right' | 'left' | 'up' | 'diag' }) {
  const rot = { right: 0, left: 180, up: -90, diag: -45 }[dir];
  return (
    <svg className={className} viewBox="0 0 28 12" fill="none" aria-hidden="true" style={rot ? { rotate: `${rot}deg` } : undefined}>
      <path d="M1 6h25M20.5 1.2 26 6l-5.5 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
