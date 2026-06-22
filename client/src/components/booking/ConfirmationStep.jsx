import { motion } from 'framer-motion'
import { CheckCircle, CalendarDays, Clock, Users, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T12:00:00Z').toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const p = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${p}`
}

const detail = [
  { Icon: CalendarDays, label: 'Date',  getValue: (r) => formatDate(r.date) },
  { Icon: Clock,        label: 'Time',  getValue: (r) => formatTime(r.date ? r.startTime?.slice(11, 16) : '') },
  { Icon: Users,        label: 'Party', getValue: (r) => `${r.partySize} ${r.partySize === 1 ? 'guest' : 'guests'}` },
  { Icon: MapPin,       label: 'Table', getValue: (r) => r.table ? `${r.table.name} — ${r.table.zone}` : '' },
]

export default function ConfirmationStep({ reservation, onNewBooking }) {
  if (!reservation) return null

  return (
    <div className="space-y-8 text-center">
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="w-20 h-20 rounded-full border border-[#c2844b]/30 bg-[#c2844b]/5 flex items-center justify-center">
          <CheckCircle size={36} className="text-[#c2844b]" strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="space-y-2"
      >
        <h2 className="font-display text-3xl sm:text-4xl text-[#f7efe2]">
          Reservation Confirmed
        </h2>
        <p className="text-[#c8bfb3] text-sm">
          Thank you, <span className="text-[#f7efe2]">{reservation.customerName}</span>.
          We look forward to welcoming you.
        </p>
      </motion.div>

      {/* Booking details card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-[#111111] border border-[#2a2a2a] text-left divide-y divide-[#2a2a2a]"
      >
        {detail.map(({ Icon, label, getValue }) => {
          const val = getValue(reservation)
          if (!val) return null
          return (
            <div key={label} className="flex items-center gap-4 px-5 py-4">
              <Icon size={15} className="text-[#c2844b] shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-[#c8bfb3] tracking-widest uppercase">{label}</p>
                <p className="text-[#f7efe2] text-sm mt-0.5 truncate">{val}</p>
              </div>
            </div>
          )
        })}

        {/* Reference */}
        <div className="px-5 py-4">
          <p className="text-[10px] text-[#c8bfb3] tracking-widest uppercase">Reference</p>
          <p className="text-[#c2844b] text-xs font-mono mt-0.5 tracking-widest">
            {reservation._id?.slice(-8).toUpperCase()}
          </p>
        </div>
      </motion.div>

      {/* Confirmation email note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="text-[#c8bfb3] text-xs"
      >
        A confirmation has been sent to{' '}
        <span className="text-[#f7efe2]">{reservation.email}</span>
      </motion.p>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <button
          onClick={onNewBooking}
          className="flex-1 py-3.5 text-xs tracking-[0.3em] uppercase border border-[#2a2a2a] text-[#c8bfb3] hover:border-[#c8bfb3] hover:text-[#f7efe2] transition-all duration-300"
        >
          New Booking
        </button>
        <Link
          to="/"
          className="flex-1 py-3.5 text-xs tracking-[0.3em] uppercase border border-[#c2844b] text-[#c2844b] hover:bg-[#c2844b] hover:text-[#0a0a0a] transition-all duration-300 flex items-center justify-center"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
