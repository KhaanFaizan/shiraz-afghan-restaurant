const STEPS = [
  { n: 1, label: 'Party' },
  { n: 2, label: 'Date' },
  { n: 3, label: 'Time' },
  { n: 4, label: 'Details' },
]

export default function BookingProgress({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map(({ n, label }, i) => {
        const done    = currentStep > n
        const active  = currentStep === n
        const pending = currentStep < n

        return (
          <div key={n} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border transition-all duration-400 ${
                  done
                    ? 'bg-[#c2844b] border-[#c2844b] text-[#0a0a0a]'
                    : active
                    ? 'bg-transparent border-[#c2844b] text-[#c2844b]'
                    : 'bg-transparent border-[#2a2a2a] text-[#2a2a2a]'
                }`}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  n
                )}
              </div>
              <span
                className={`text-[10px] tracking-widest uppercase transition-colors duration-300 ${
                  active ? 'text-[#c2844b]' : done ? 'text-[#c8bfb3]' : 'text-[#2a2a2a]'
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-px mx-2 mb-5 transition-colors duration-400 ${
                  currentStep > n ? 'bg-[#c2844b]' : 'bg-[#2a2a2a]'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
