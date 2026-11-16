/** Small line drawings per case. Strokes ink in on hover of the parent card. */
export function CaseDrawing({ slug }: { slug: string }) {
  return (
    <svg className="cd" viewBox="0 0 400 300" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {slug === 'invoiceautomate' && (
          <>
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${36 + i * 14} ${44 + i * 14})`}>
                <rect width="110" height="140" rx="4" className="cd-paper" />
                <path d="M16 26h60M16 44h78M16 62h44M16 104h30M70 104h24" />
              </g>
            ))}
            <path className="cd-live" pathLength="1" d="M180 140h40c10 0 10-30 20-30h20M240 140h80M260 140c10 0 10 40 20 40h40" />
            <rect x="320" y="92" width="48" height="36" rx="6" />
            <rect x="320" y="122" width="48" height="36" rx="6" className="cd-hot" />
            <rect x="320" y="164" width="48" height="36" rx="6" />
            <path d="M332 140l7 7 13-14" className="cd-live" pathLength="1" />
          </>
        )}
        {slug === 'saleschat' && (
          <>
            <rect x="40" y="50" width="200" height="200" rx="18" />
            <path d="M64 92h120M64 116h80" />
            <rect x="96" y="146" width="122" height="34" rx="17" className="cd-hot" />
            <rect x="64" y="196" width="104" height="30" rx="15" />
            {Array.from({ length: 16 }, (_, i) => (
              <path key={i} className="cd-wave" style={{ animationDelay: `${-i * 0.11}s` }} d={`M${268 + i * 7} ${150 - (8 + ((i * 13) % 26))}v${2 * (8 + ((i * 13) % 26))}`} />
            ))}
            <path className="cd-live" pathLength="1" d="M240 150h22" />
          </>
        )}
        {slug === 'wellness-app' && (
          <>
            <rect x="140" y="20" width="120" height="250" rx="22" />
            <path d="M180 34h40" />
            <rect x="156" y="64" width="88" height="56" rx="10" className="cd-hot" />
            <rect x="156" y="130" width="88" height="32" rx="8" />
            <rect x="156" y="170" width="88" height="32" rx="8" />
            <rect x="156" y="210" width="88" height="32" rx="8" />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={30 + (i % 2) * 40} y={40 + i * 44} width="30" height="30" rx="7" opacity=".55" />
            ))}
            <path className="cd-live" pathLength="1" d="M100 85c20 0 20 6 40 6M100 130c20 0 20 16 40 16M100 175c20 0 20 11 40 11M100 220c20 0 20-6 40-6" />
          </>
        )}
      </g>
    </svg>
  );
}
