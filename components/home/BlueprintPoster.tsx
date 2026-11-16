/** Static line drawing shown when WebGL is unavailable. */
export function BlueprintPoster() {
  return (
    <svg className="poster" viewBox="0 0 1200 700" role="img" aria-label="Line drawing of a web dashboard, a phone, an AI agent with its tools and an automation line.">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <rect x="560" y="120" width="420" height="270" rx="6" />
        <path d="M560 146h420M760 390v40M700 430h120" />
        <rect x="590" y="170" width="70" height="190" />
        <path d="M680 190h140M680 214h90M680 260h270M680 290h270M680 320h270" opacity=".6" />
        <rect x="430" y="300" width="120" height="240" rx="16" />
        <path d="M470 312h40" />
        <rect x="1000" y="190" width="150" height="190" rx="6" />
        <rect x="1110" y="200" width="44" height="44" />
        <rect x="1110" y="262" width="44" height="44" />
        <rect x="1110" y="324" width="44" height="44" />
        <path d="M600 600h80M700 600h80M800 600h80M900 600h80" />
        <rect x="560" y="580" width="40" height="40" />
        <rect x="660" y="580" width="40" height="40" />
        <rect x="760" y="580" width="40" height="40" />
        <rect x="860" y="580" width="40" height="40" />
        <rect x="960" y="580" width="40" height="40" />
      </g>
    </svg>
  );
}
