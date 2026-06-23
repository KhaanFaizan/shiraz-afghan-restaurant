import { useState } from 'react'
import { CalendarDays, Users, Search, X, Pencil, Ban } from 'lucide-react'
import StatusBadge from './StatusBadge'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function formatTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const h = d.getUTCHours(), m = d.getUTCMinutes()
  const p = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${p}`
}

const VIEWS = [
  { key: 'today', label: 'Today' },
  { key: 'week',  label: 'This Week' },
  { key: 'all',   label: 'All' },
  { key: 'custom', label: 'Date' },
]

function EmptyState({ filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <CalendarDays size={32} className="text-[#2a2a2a]" />
      <p className="text-[#f7efe2] text-sm">No bookings found</p>
      <p className="text-[#c8bfb3] text-xs max-w-xs">
        {filter === 'today'
          ? "No reservations for today."
          : filter === 'week'
          ? "No reservations this week."
          : "No reservations match the selected filter."}
      </p>
    </div>
  )
}

function BookingRow({ booking, onModify, onCancel, cancelling }) {
  const isCancelled = booking.status === 'CANCELLED'
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-3 sm:gap-4 items-center px-5 py-4 border-b border-[#2a2a2a] last:border-0 transition-colors ${isCancelled ? 'opacity-50' : 'hover:bg-[#1a1a1a]'}`}>

      {/* Customer info */}
      <div className="min-w-0">
        <p className="text-[#f7efe2] text-sm font-medium truncate">{booking.customerName}</p>
        <p className="text-[#c8bfb3] text-xs truncate">{booking.email}</p>
        <p className="text-[#c8bfb3] text-xs mt-0.5 sm:hidden">
          {formatDate(booking.date)} · {formatTime(booking.startTime)} · {booking.partySize} guests
        </p>
      </div>

      {/* Date/Time (desktop) */}
      <div className="hidden sm:block text-right min-w-[110px]">
        <p className="text-[#f7efe2] text-sm">{formatDate(booking.date)}</p>
        <p className="text-[#c8bfb3] text-xs">{formatTime(booking.startTime)}</p>
      </div>

      {/* Party + table (desktop) */}
      <div className="hidden sm:flex items-center gap-1.5 text-[#c8bfb3] text-xs min-w-[80px] justify-end">
        <Users size={12} />
        {booking.partySize}
        {booking.table && (
          <span className="ml-1 text-[#c2844b]">· {booking.table.name}</span>
        )}
      </div>

      {/* Status */}
      <div className="flex sm:justify-end">
        <StatusBadge status={booking.status} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:justify-end">
        {!isCancelled && (
          <>
            <button
              onClick={() => onModify(booking)}
              title="Modify"
              className="p-1.5 text-[#c8bfb3] hover:text-[#c2844b] transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onCancel(booking._id)}
              disabled={cancelling === booking._id}
              title="Cancel"
              className="p-1.5 text-[#c8bfb3] hover:text-red-400 disabled:opacity-40 transition-colors"
            >
              <Ban size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function BookingsPanel({
  reservations,
  loading,
  error,
  viewFilter,
  onViewChange,
  customDate,
  onCustomDateChange,
  onModify,
  onCancel,
  cancelling,
}) {
  const [search, setSearch] = useState('')

  const filtered = reservations.filter((r) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      r.customerName?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.phone?.includes(q) ||
      r.date?.includes(q)
    )
  })

  return (
    <div className="bg-[#111111] border border-[#2a2a2a]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center gap-3">
        <h2 className="text-[#f7efe2] text-sm font-medium tracking-wide shrink-0">Reservations</h2>

        <div className="flex-1 flex flex-wrap items-center gap-2">
          {/* View filter tabs */}
          <div className="flex gap-1">
            {VIEWS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onViewChange(key)}
                className={`px-3 py-1 text-[10px] tracking-wider uppercase rounded border transition-colors ${
                  viewFilter === key
                    ? 'border-[#c2844b] text-[#c2844b] bg-[#c2844b]/5'
                    : 'border-[#2a2a2a] text-[#c8bfb3] hover:border-[#c8bfb3]/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Custom date picker */}
          {viewFilter === 'custom' && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => onCustomDateChange(e.target.value)}
              className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f7efe2] px-3 py-1 text-xs focus:outline-none focus:border-[#c2844b] [color-scheme:dark]"
            />
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8bfb3]/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f7efe2] placeholder-[#c8bfb3]/30 pl-8 pr-8 py-1.5 text-xs focus:outline-none focus:border-[#c2844b] w-full sm:w-48 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#c8bfb3]/50 hover:text-[#c8bfb3]">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Column headers (desktop) */}
      <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-2 text-[10px] tracking-widest uppercase text-[#c8bfb3]/60 border-b border-[#2a2a2a]">
        <span>Customer</span>
        <span className="text-right">Date / Time</span>
        <span className="text-right">Party / Table</span>
        <span>Status</span>
        <span></span>
      </div>

      {/* Body */}
      {loading ? (
        <div className="space-y-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 border-b border-[#2a2a2a] animate-pulse bg-[#1a1a1a]/50" />
          ))}
        </div>
      ) : error ? (
        <div className="px-5 py-8 text-center text-red-400 text-sm">{error}</div>
      ) : filtered.length === 0 ? (
        <EmptyState filter={viewFilter} />
      ) : (
        <div>
          {filtered.map((r) => (
            <BookingRow
              key={r._id}
              booking={r}
              onModify={onModify}
              onCancel={onCancel}
              cancelling={cancelling}
            />
          ))}
        </div>
      )}

      {/* Footer count */}
      {!loading && !error && (
        <div className="px-5 py-3 border-t border-[#2a2a2a] text-[#c8bfb3]/60 text-xs">
          {filtered.length} {filtered.length === 1 ? 'reservation' : 'reservations'}
          {search && ` matching "${search}"`}
        </div>
      )}
    </div>
  )
}
