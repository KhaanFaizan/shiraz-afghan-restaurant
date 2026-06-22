import { CalendarDays } from 'lucide-react'

// Quick-pick offsets in days from today
const QUICK_PICKS = [
  { label: 'Today',     offset: 0 },
  { label: 'Tomorrow',  offset: 1 },
  { label: 'This Fri',  offset: daysUntil(5) },
  { label: 'This Sat',  offset: daysUntil(6) },
]

function daysUntil(targetDay) {
  const today = new Date().getDay()
  const diff = (targetDay - today + 7) % 7
  return diff === 0 ? 7 : diff
}

function toDateString(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

function formatDisplay(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T12:00:00Z').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function DateStep({ value, onChange, onNext, onBack }) {
  const today   = toDateString(0)
  const maxDate = toDateString(30)

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-[#c2844b] mb-1">
          <CalendarDays size={16} />
          <span className="text-xs tracking-[0.35em] uppercase">Date</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-[#f7efe2]">
          Choose a date
        </h2>
        <p className="text-[#c8bfb3] text-sm">We take bookings up to 30 days in advance</p>
      </div>

      {/* Quick picks */}
      <div className="grid grid-cols-4 gap-2">
        {QUICK_PICKS.map(({ label, offset }) => {
          const dateStr = toDateString(offset)
          return (
            <button
              key={label}
              onClick={() => onChange(dateStr)}
              className={`py-2.5 text-xs tracking-wider rounded border transition-all duration-200 ${
                value === dateStr
                  ? 'bg-[#c2844b]/10 border-[#c2844b] text-[#c2844b]'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#c8bfb3] hover:border-[#c2844b]/50 hover:text-[#f7efe2]'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Date input */}
      <div className="space-y-2">
        <label className="block text-[#c8bfb3] text-xs tracking-widest uppercase">
          Or pick a date
        </label>
        <input
          type="date"
          value={value}
          min={today}
          max={maxDate}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#f7efe2] px-4 py-3 text-sm focus:outline-none focus:border-[#c2844b] transition-colors [color-scheme:dark] cursor-pointer"
        />
      </div>

      {/* Selected date display */}
      {value && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#c2844b]/5 border border-[#c2844b]/20">
          <div className="w-1 h-10 bg-[#c2844b]" />
          <div>
            <p className="text-[10px] text-[#c2844b] tracking-widest uppercase">Selected</p>
            <p className="text-[#f7efe2] text-sm mt-0.5">{formatDisplay(value)}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 text-xs tracking-[0.3em] uppercase border border-[#2a2a2a] text-[#c8bfb3] hover:border-[#c8bfb3] hover:text-[#f7efe2] transition-all duration-300"
        >
          Back
        </button>
        <button
          disabled={!value}
          onClick={onNext}
          className="flex-[2] py-3.5 text-xs tracking-[0.3em] uppercase border border-[#c2844b] text-[#c2844b] hover:bg-[#c2844b] hover:text-[#0a0a0a] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
        >
          Find Available Times
        </button>
      </div>
    </div>
  )
}
