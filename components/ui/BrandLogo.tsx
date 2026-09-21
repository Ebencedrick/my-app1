type BrandLogoProps = {
  showTagline?: boolean;
  compact?: boolean;
};

export default function BrandLogo({
  showTagline = false,
  compact = false,
}: BrandLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={
          compact
            ? "relative h-9 w-9 shrink-0"
            : "relative h-12 w-12 shrink-0"
        }
        aria-label="AdFlux brand mark"
      >
        <div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-cyan-400 via-blue-500 to-pink-500 opacity-90 shadow-[0_0_28px_rgba(34,211,238,0.6)]" />
        <div className="absolute inset-[7px] rotate-[-18deg] rounded-[12px] bg-white/10 backdrop-blur-sm" />
        <div className="absolute left-[15%] top-[18%] h-[54%] w-[46%] rotate-[-28deg] rounded-[18px] bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-600 shadow-[0_0_18px_rgba(56,189,248,0.9)]" />
        <div className="absolute right-[18%] top-[22%] h-[38%] w-[38%] rotate-[28deg] rounded-[18px] bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 shadow-[0_0_18px_rgba(236,72,153,0.9)]" />
        <div className="absolute right-[17%] top-[22%] h-[15%] w-[45%] rotate-[-35deg] rounded-full bg-white/90" />
      </div>

      <div className="flex flex-col leading-none">
        <div
          className={
            compact
              ? "text-lg font-black tracking-[-0.07em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-pink-300"
              : "text-2xl sm:text-3xl font-black tracking-[-0.08em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-pink-300"
          }
        >
          AdFlux
        </div>
        {showTagline && (
          <div className="mt-1 text-[10px] font-medium tracking-[0.28em] text-slate-300 uppercase">
            Turn Attention Into Growth
          </div>
        )}
      </div>
    </div>
  );
}
