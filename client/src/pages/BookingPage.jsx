import { motion } from 'framer-motion'
import { CalendarDays, Users, Clock, User, Mail, Phone } from 'lucide-react'

const inputBase =
  'w-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#f7efe2] placeholder-[#c8bfb3]/40 px-4 py-3 text-sm focus:outline-none focus:border-[#c2844b] transition-colors'

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 space-y-3"
        >
          <span className="text-[#c2844b] text-xs tracking-[0.5em] uppercase">
            Reservations
          </span>
          <h1 className="font-display text-4xl text-[#f7efe2]">Book a Table</h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="w-8 h-px bg-[#c2844b]" />
            <div className="w-2 h-2 rotate-45 border border-[#c2844b]" />
            <div className="w-8 h-px bg-[#c2844b]" />
          </div>

          <p className="text-[#c8bfb3] text-sm leading-relaxed max-w-sm mx-auto pt-1">
            We look forward to welcoming you. Reservations are recommended for weekend dining.
          </p>
        </motion.div>

        {/* Form placeholder */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={(e) => e.preventDefault()}
          className="space-y-4 border border-[#2a2a2a] p-8 bg-[#111111]"
        >
          {/* Name */}
          <div>
            <label className="block text-[#c8bfb3] text-xs tracking-widest uppercase mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c2844b]/60" />
              <input
                type="text"
                placeholder="Your name"
                className={`${inputBase} pl-9`}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#c8bfb3] text-xs tracking-widest uppercase mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c2844b]/60" />
              <input
                type="email"
                placeholder="your@email.com"
                className={`${inputBase} pl-9`}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[#c8bfb3] text-xs tracking-widest uppercase mb-1.5">
              Phone
            </label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c2844b]/60" />
              <input
                type="tel"
                placeholder="+44..."
                className={`${inputBase} pl-9`}
              />
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#c8bfb3] text-xs tracking-widest uppercase mb-1.5">
                Date
              </label>
              <div className="relative">
                <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c2844b]/60" />
                <input
                  type="date"
                  className={`${inputBase} pl-9 [color-scheme:dark]`}
                />
              </div>
            </div>
            <div>
              <label className="block text-[#c8bfb3] text-xs tracking-widest uppercase mb-1.5">
                Time
              </label>
              <div className="relative">
                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c2844b]/60" />
                <input
                  type="time"
                  className={`${inputBase} pl-9 [color-scheme:dark]`}
                />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-[#c8bfb3] text-xs tracking-widest uppercase mb-1.5">
              Guests
            </label>
            <div className="relative">
              <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c2844b]/60" />
              <select className={`${inputBase} pl-9 appearance-none`}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
                <option value="9+">9+ guests</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[#c8bfb3] text-xs tracking-widest uppercase mb-1.5">
              Special Requests
            </label>
            <textarea
              rows={3}
              placeholder="Dietary requirements, celebrations, accessibility needs…"
              className={`${inputBase} resize-none`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 text-xs tracking-[0.3em] uppercase border border-[#c2844b] text-[#c2844b] hover:bg-[#c2844b] hover:text-[#0a0a0a] transition-all duration-300 mt-2"
          >
            Confirm Reservation
          </button>

          <p className="text-[#c8bfb3]/60 text-xs text-center">
            Booking form will connect to backend API
          </p>
        </motion.form>
      </div>
    </div>
  )
}
