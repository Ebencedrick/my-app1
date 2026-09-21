type BrandLogoProps = {
  showTagline?: boolean;
  compact?: boolean;
};

export default function BrandLogo({
  showTagline = false,
  compact = false,
}: BrandLogoProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <svg
        viewBox="0 0 260 200"
        className={compact ? "h-10 w-10 shrink-0" : "h-16 w-16 sm:h-20 sm:w-20 shrink-0"}
        aria-label="AdFlux brand mark"
        role="img"
      >
        <defs>
          <linearGradient id="adfluxRibbonA" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#31d9ff" />
            <stop offset="32%" stopColor="#2fb8ff" />
            <stop offset="100%" stopColor="#695dff" />
          </linearGradient>
          <linearGradient id="adfluxRibbonB" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#ff4fcf" />
            <stop offset="45%" stopColor="#ef45ff" />
            <stop offset="100%" stopColor="#7f4fff" />
          </linearGradient>
          <linearGradient id="adfluxRibbonC" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#eafcff" />
            <stop offset="100%" stopColor="#dfe9ff" />
          </linearGradient>
        </defs>

        <g transform="translate(0,8)">
          <path
            d="M18,120 C38,95 70,70 102,32 L136,32 C118,65 92,96 72,113 L44,113 L56,96 L92,96 L78,115 L44,115 L18,120 Z"
            fill="url(#adfluxRibbonA)"
            opacity="0.96"
          />
          <path
            d="M62,123 L110,39 L138,39 L116,93 L176,93 L100,172 L62,123 Z"
            fill="url(#adfluxRibbonA)"
            opacity="0.96"
          />
          <path
            d="M74,150 L130,123 L174,84 L188,96 L148,150 L74,150 Z"
            fill="url(#adfluxRibbonB)"
            opacity="0.96"
          />
          <path
            d="M178,36 L202,42 L172,86 L146,78 L178,36 Z"
            fill="url(#adfluxRibbonC)"
            opacity="0.92"
          />
        </g>
      </svg>

      <div className="flex flex-col leading-none">
        <svg
          viewBox="0 0 720 110"
          className={compact ? "h-7 w-auto" : "h-12 w-auto sm:h-16 lg:h-[5.3rem]"}
          aria-label="AdFlux wordmark"
          role="img"
        >
          <defs>
            <linearGradient id="adfluxWordGrad" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#2cdfef" />
              <stop offset="48%" stopColor="#2bb9ff" />
              <stop offset="100%" stopColor="#ff5fe1" />
            </linearGradient>
          </defs>

          <text
            x="0"
            y="82"
            fontSize="92"
            fontWeight="900"
            letterSpacing="-9"
            fill="#f2f5ff"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            Ad
          </text>
          <text
            x="172"
            y="82"
            fontSize="92"
            fontWeight="900"
            letterSpacing="-9"
            fill="url(#adfluxWordGrad)"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            Flux
          </text>
        </svg>

        {showTagline && (
          <svg viewBox="0 0 720 54" className="h-5 w-auto sm:h-7 lg:h-8">
            <text
              x="0"
              y="35"
              fontSize="30"
              fontWeight="300"
              letterSpacing="0"
              fill="#e5ecff"
              fontFamily="Arial, Helvetica, sans-serif"
            >
              <tspan>Turn</tspan>
              <tspan dx="12" fill="#f8fbff">Attention</tspan>
              <tspan dx="12">Into</tspan>
              <tspan dx="12" fill="#ff8ef6">Growth.</tspan>
            </text>
          </svg>
        )}
      </div>
    </div>
  );
}
