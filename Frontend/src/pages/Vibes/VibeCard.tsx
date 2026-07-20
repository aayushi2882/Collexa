export interface VibeCardData {
  vibe: string;
  category?: string;
  note?: string;
  imageUrl: string;
  height: string;
  accent?: string;
}

interface VibeCardProps {
  card: VibeCardData;
  isSelected: boolean;
  isDimmed: boolean;
  onClick: (vibe: string) => void;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
  className?: string;
}

export default function VibeCard({ card, isSelected, isDimmed, onClick, ref, style, className }: VibeCardProps) {
  const baseClasses =
    "vibe-card relative bg-[#251e19] rounded-xl overflow-hidden cursor-pointer group border border-white/5 flex-shrink-0 w-full text-left focus:outline-none hover:scale-[1.02] hover:z-50 hover:shadow-[0_0_30px_rgba(255,178,107,0.1)] transition-transform duration-500 ease-out";

  const selectedClasses = isSelected
    ? "ring-2 ring-[#FFB26B] shadow-[0_0_20px_rgba(255,178,107,0.2)] scale-[1.02] z-50"
    : "";

  const dimmedClasses = isDimmed ? "opacity-60 grayscale-[0.2]" : "";

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${selectedClasses} ${dimmedClasses} ${className || ""}`}
      style={{ ...style, height: card.height }}
      onClick={() => onClick(card.vibe)}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center scale-110 group-hover:scale-100 transition-transform duration-700"
        style={{ backgroundImage: `url('${card.imageUrl}')` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#18120d] to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute bottom-6 left-6 z-10">
        {card.accent && (
          <span className="font-['Playfair_Display'] text-4xl mb-4 text-white opacity-30 block">
            {card.accent}
          </span>
        )}
        {card.vibe === "Hackathons" && (
          <div className="flex gap-1 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-[#ffb26b]" />
          </div>
        )}
        {card.category && (
          <span className="font-['Manrope'] text-[10px] font-semibold text-[#ffb26b] uppercase tracking-widest mb-1 block">
            {card.category}
          </span>
        )}
        <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-white">
          {card.vibe}
        </h3>
        {card.note && (
          <p className="font-['Manrope'] text-xs text-white/70 mt-1">{card.note}</p>
        )}
        {card.vibe === "Debate" && card.note && (
          <span className="font-['Manrope'] text-[10px] font-semibold text-white/50 uppercase mt-2 block">
            {card.note}
          </span>
        )}
      </div>
    </button>
  );
}