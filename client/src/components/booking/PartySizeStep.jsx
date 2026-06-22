import { Users } from 'lucide-react'

const SIZES = [1, 2, 3, 4, 5, 6, 7, 8]

export default function PartySizeStep({ value, onChange, onNext }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-[#c2844b] mb-1">
          <Users size={16} />
          <span className="text-xs tracking-[0.35em] uppercase">Party Size</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-[#f7efe2]">
          How many guests?
        </h2>
        <p className="text-[#c8bfb3] text-sm">Select the number of people dining</p>
      </div>

      {/* Size grid */}
      <div className="grid grid-cols-4 gap-3">
        {SIZES.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={`aspect-square flex flex-col items-center justify-center rounded border text-sm font-medium transition-all duration-200 active:scale-95 ${
              value === size
                ? 'bg-[#c2844b]/10 border-[#c2844b] text-[#c2844b]'
                : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#c8bfb3] hover:border-[#c2844b]/50 hover:text-[#f7efe2]'
            }`}
          >
            <span className="text-xl font-display leading-none">{size}</span>
            <span className="text-[10px] mt-1 tracking-wider opacity-70">
              {size === 1 ? 'guest' : 'guests'}
            </span>
          </button>
        ))}
      </div>

      {/* Large group note */}
      <button
        onClick={() => onChange(9)}
        className={`w-full py-3 rounded border text-sm transition-all duration-200 ${
          value >= 9
            ? 'bg-[#c2844b]/10 border-[#c2844b] text-[#c2844b]'
            : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#c8bfb3] hover:border-[#c2844b]/50'
        }`}
      >
        9 or more guests — Large group
      </button>

      {value >= 9 && (
        <p className="text-[#c8bfb3] text-xs text-center">
          For groups of 9+, we will assign our Private Dining area.
        </p>
      )}

      <button
        disabled={!value}
        onClick={onNext}
        className="w-full py-3.5 text-xs tracking-[0.3em] uppercase border border-[#c2844b] text-[#c2844b] hover:bg-[#c2844b] hover:text-[#0a0a0a] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
      >
        Continue
      </button>
    </div>
  )
}
