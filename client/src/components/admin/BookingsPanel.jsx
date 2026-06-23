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
  { key: 'today',  label: 'Today'     },
  { key: 'week',   label: 'This Week' },
  { key: 'all',    label: 'All'       },
  { key: 'custom', label: 'Date'      },
]

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <CalendarDays size={32} className="text-[#2e2924]" />
      <p className="text-[#f5efe6] text-[15px]">No bookings found</p>
      <p className="text-[#7a7068] text-[13px] max-w-xs leading-relaxed">
        {filter === 'today'
          ? 'No reservations for today.'
          : filter === 'week'
          ? 'No reservations this week.'
          : 'No reservations match the selected filter.'}
      </p>
    </div>
  )
}

// ── Booking row ───────────────────────────────────────────────────────────────
function BookingRow({ booking, onModify, onCancel, cancelling }) {
  const isCancelled = booking.status === 'CANCELLED'

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-3 sm:gap-5 items-center
        px-6 py-5 border-b border-[#1c1814] last:border-0 transition-colors duration-150
        ${isCancelled ? 'opacity-40' : 'hover:bg-[#161310]'}`}
    >
      {/* Customer */}
      <div className="min-w-0">
        <p className="text-[#f5efe6] text-[15px] font-medium truncate leading-snug">
          {booking.customerName}
        </p>
        <p className="text-[#b8ada0] text-[13px] truncate mt-1">
          {booking.email}
        </p>
        {/* Mobile summary */}
        <p className="text-[#7a7068] text-[12px] mt-1.5 sm:hidden">
          {formatDate(booking.date)} &middot; {formatTime(booking.startTime)} &middot; {booking.partySize}&nbsp;guests
        </p>
      </div>

      {/* Date / Time — desktop */}
      <div className="hidden sm:block text-right min-w-[120px]">
        <p className="text-[#f5efe6] text-[14px] leading-snug">{formatDate(booking.date)}</p>
        <p className="text-[#b8ada0] text-[13px] mt-1">{formatTime(booking.startTime)}</p>
      </div>

      {/* Party + table — desktop */}
      <div className="hidden sm:flex items-center gap-2 text-[#b8ada0] text-[13px] min-w-[96px] justify-end">
        <Users size={14} />
        {booking.partySize}
        {booking.table && (
          <span className="ml-1 text-[#c2844b]/80">&middot;&nbsp;{booking.table.name}</span>
        )}
      </div>

      {/* Status */}
      <div className="flex sm:justify-end">
        <StatusBadge status={booking.status} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:justify-end">
        {!isCancelled && (
          <>
            <button
              onClick={() => onModify(booking)}
              title="Modify reservation"
              aria-label="Modify reservation"
              className="w-9 h-9 flex items-center justify-center text-[#b8ada0] hover:text-[#c2844b] hover:bg-[#c2844b]/10 transition-all duration-150"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onCancel(booking._id)}
              disabled={cancelling === booking._id}
              title="Cancel reservation"
              aria-label="Cancel reservation"
              className="w-9 h-9 flex items-center justify-center text-[#b8ada0] hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            >
              <Ban size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Panel ─────────────────────────────────────────────────────────────────────
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
    <div className="bg-[#0f0d0b] border border-[#2e2924] overflow-hidden">

      {/* Panel header */}
      <div className="px-6 py-5 border-b border-[#2e2924] flex flex-col sm:flex-row sm:items-center gap-4 bg-[#131110]">

        <h2 className="text-[#f5efe6] text-[15px] font-medium tracking-wide shrink-0">
          Reservations
        </h2>

        <div className="flex-1 flex flex-wrap items-center gap-3">
          {/* View filter toggle */}
          <div className="flex items-center gap-0.5 p-1 bg-[#0b0a08] border border-[#2e2924]">
            {VIEWS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onViewChange(key)}
                className={`px-3.5 py-1.5 text-[12px] tracking-[0.2em] uppercase transition-all duration-150 ${
                  viewFilter === key
                    ? 'bg-[#c2844b] text-[#0b0a08] font-semibold'
                    : 'text-[#7a7068] hover:text-[#f5efe6]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Custom date */}
          {viewFilter === 'custom' && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => onCustomDateChange(e.target.value)}
              className="bg-[#0b0a08] border border-[#2e2924] text-[#f5efe6] px-3.5 py-1.5 text-[13px] focus:outline-none focus:border-[#c2844b] transition-colors [color-scheme:dark]"
            />
          )}
        </div>

        {/* Search */}
        <div className="relative shrink-0">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7a7068] pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="bg-[#0b0a08] border border-[#2e2924] text-[#f5efe6] placeholder-[#7a7068] pl-9 pr-8 py-2 text-[13px] focus:outline-none focus:border-[#c2844b] w-full sm:w-56 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a7068] hover:text-[#b8ada0] transition-colors"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Column headers */}
      <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-5 px-6 py-3 border-b border-[#1c1814] bg-[#0d0b09]">
        {['Customer', 'Date / Time', 'Party / Table', 'Status', ''].map((h, i) => (
          <span
            key={i}
            className={`text-[11px] tracking-[0.32em] uppercase text-[#7a7068] ${i > 0 && i < 4 ? 'text-right' : ''}`}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Body */}
      {loading ? (
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-[76px] border-b border-[#1c1814] animate-pulse bg-[#131110]/60"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="px-6 py-10 text-center text-red-400 text-[14px]">{error}</div>
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

      {/* Footer */}
      {!loading && !error && (
        <div className="px-6 py-3.5 border-t border-[#1c1814] bg-[#0d0b09] text-[#7a7068] text-[12px] tracking-wide">
          {filtered.length}&nbsp;{filtered.length === 1 ? 'reservation' : 'reservations'}
          {search && ` matching "${search}"`}
        </div>
      )}
    </div>
  )
}
