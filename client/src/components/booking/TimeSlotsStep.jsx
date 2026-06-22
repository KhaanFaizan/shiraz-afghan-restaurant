import { Clock, RefreshCw } from 'lucide-react'

function SlotSkeleton() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="h-11 rounded bg-[#1a1a1a] border border-[#2a2a2a] animate-pulse"
        />
      ))}
    </div>
  )
}

function formatSlotTime(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

export default function TimeSlotsStep({
  slots,
  loading,
  error,
  value,
  onChange,
  onNext,
  onBack,
  date,
  partySize,
  onRetry,
}) {
  const formattedDate = date
    ? new Date(date + 'T12:00:00Z').toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : ''

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-[#c2844b] mb-1">
          <Clock size={16} />
          <span className="text-xs tracking-[0.35em] uppercase">Time</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-[#f7efe2]">
          Available times
        </h2>
        <p className="text-[#c8bfb3] text-sm">
          {formattedDate} · {partySize} {partySize === 1 ? 'guest' : 'guests'}
        </p>
      </div>

      {/* Slots area */}
      {loading ? (
        <SlotSkeleton />
      ) : error ? (
        <div className="text-center space-y-4 py-8">
          <p className="text-[#c8bfb3] text-sm">{error}</p>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#c2844b] hover:text-[#d4976a] transition-colors"
          >
            <RefreshCw size={13} />
            Try again
          </button>
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <p className="text-[#f7efe2] text-sm">No availability on this date</p>
          <p className="text-[#c8bfb3] text-xs">
            Please go back and choose a different date.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map(({ time }) => (
            <button
              key={time}
              onClick={() => onChange(time)}
              className={`py-2.5 text-sm rounded border transition-all duration-200 active:scale-95 ${
                value === time
                  ? 'bg-[#c2844b]/10 border-[#c2844b] text-[#c2844b] font-medium'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#c8bfb3] hover:border-[#c2844b]/50 hover:text-[#f7efe2]'
              }`}
            >
              {formatSlotTime(time)}
            </button>
          ))}
        </div>
      )}

      {/* Reservation duration note */}
      {!loading && !error && slots.length > 0 && (
        <p className="text-[#c8bfb3] text-xs text-center">
          Each reservation is allocated 90 minutes.
        </p>
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
          Continue
        </button>
      </div>
    </div>
  )
}
