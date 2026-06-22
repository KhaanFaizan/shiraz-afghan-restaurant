import { motion } from 'framer-motion'
import { CalendarDays, Users, CheckCircle, Clock } from 'lucide-react'

const stats = [
  { label: "Today's Bookings", value: '—', icon: CalendarDays },
  { label: 'Total Guests', value: '—', icon: Users },
  { label: 'Confirmed', value: '—', icon: CheckCircle },
  { label: 'Pending', value: '—', icon: Clock },
]

export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-display text-2xl text-[#f7efe2]">Dashboard</h1>
        <p className="text-[#c8bfb3] text-sm mt-1">
          Overview of today's reservations and activity.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="bg-[#111111] border border-[#2a2a2a] p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[#c8bfb3] text-xs tracking-wider uppercase">
                {label}
              </span>
              <Icon size={16} className="text-[#c2844b]" />
            </div>
            <p className="font-display text-3xl text-[#f7efe2]">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Placeholder table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="bg-[#111111] border border-[#2a2a2a]"
      >
        <div className="px-6 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
          <h2 className="text-[#f7efe2] text-sm font-medium tracking-wide">
            Recent Bookings
          </h2>
          <span className="text-[#c2844b] text-xs tracking-wider uppercase">
            View All
          </span>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <CalendarDays size={32} className="text-[#2a2a2a]" />
          <p className="text-[#c8bfb3] text-sm">No bookings yet</p>
          <p className="text-[#c8bfb3]/50 text-xs max-w-xs">
            Bookings will appear here once the backend is connected and customers
            start making reservations.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
