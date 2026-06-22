import { useState } from 'react'
import { User, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react'

const inputBase =
  'w-full bg-[#1a1a1a] border text-[#f7efe2] placeholder-[#c8bfb3]/30 px-4 py-3 text-sm focus:outline-none transition-colors'

function Field({ label, icon: Icon, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[#c8bfb3] text-[10px] tracking-[0.3em] uppercase">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c2844b]/60 pointer-events-none"
          />
        )}
        {children}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

function validate(form) {
  const errors = {}
  if (!form.customerName.trim() || form.customerName.trim().length < 2)
    errors.customerName = 'Please enter your full name'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Please enter a valid email address'
  if (!form.phone.trim() || form.phone.trim().length < 7)
    errors.phone = 'Please enter a valid phone number'
  return errors
}

export default function CustomerFormStep({
  form,
  onChange,
  onSubmit,
  onBack,
  submitting,
  submitError,
  booking,
}) {
  const [touched, setTouched] = useState({})
  const errors = validate(form)
  const hasErrors = Object.keys(errors).length > 0

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }))
  const touchAll = () =>
    setTouched({ customerName: true, email: true, phone: true })

  const handleSubmit = () => {
    touchAll()
    if (!hasErrors) onSubmit()
  }

  const formattedDate = booking.date
    ? new Date(booking.date + 'T12:00:00Z').toLocaleDateString('en-GB', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      })
    : ''

  function formatTime(t) {
    if (!t) return ''
    const [h, m] = t.split(':').map(Number)
    const p = h >= 12 ? 'PM' : 'AM'
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${p}`
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-[#c2844b] mb-1">
          <User size={16} />
          <span className="text-xs tracking-[0.35em] uppercase">Your Details</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-[#f7efe2]">
          About you
        </h2>
      </div>

      {/* Booking summary pill */}
      <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-[#c8bfb3]">
        <span className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full">
          {booking.partySize} {booking.partySize === 1 ? 'guest' : 'guests'}
        </span>
        <span className="text-[#2a2a2a]">·</span>
        <span className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full">
          {formattedDate}
        </span>
        <span className="text-[#2a2a2a]">·</span>
        <span className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full">
          {formatTime(booking.time)}
        </span>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <Field label="Full Name" icon={User} error={touched.customerName && errors.customerName}>
          <input
            type="text"
            value={form.customerName}
            onChange={(e) => onChange('customerName', e.target.value)}
            onBlur={() => touch('customerName')}
            placeholder="e.g. Ahmad Khan"
            className={`${inputBase} pl-9 ${
              touched.customerName && errors.customerName
                ? 'border-red-500/60 focus:border-red-500'
                : 'border-[#2a2a2a] focus:border-[#c2844b]'
            }`}
          />
        </Field>

        <Field label="Email Address" icon={Mail} error={touched.email && errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => onChange('email', e.target.value)}
            onBlur={() => touch('email')}
            placeholder="your@email.com"
            className={`${inputBase} pl-9 ${
              touched.email && errors.email
                ? 'border-red-500/60 focus:border-red-500'
                : 'border-[#2a2a2a] focus:border-[#c2844b]'
            }`}
          />
        </Field>

        <Field label="Phone Number" icon={Phone} error={touched.phone && errors.phone}>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            onBlur={() => touch('phone')}
            placeholder="+44 7700 000000"
            className={`${inputBase} pl-9 ${
              touched.phone && errors.phone
                ? 'border-red-500/60 focus:border-red-500'
                : 'border-[#2a2a2a] focus:border-[#c2844b]'
            }`}
          />
        </Field>

        <Field label="Special Requests (optional)" icon={MessageSquare}>
          <textarea
            value={form.specialRequest}
            onChange={(e) => onChange('specialRequest', e.target.value)}
            placeholder="Dietary requirements, celebrations, high chair needed…"
            rows={3}
            className={`${inputBase} pl-9 pt-3 border-[#2a2a2a] focus:border-[#c2844b] resize-none`}
          />
        </Field>
      </div>

      {/* Backend submission error */}
      {submitError && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {submitError}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex-1 py-3.5 text-xs tracking-[0.3em] uppercase border border-[#2a2a2a] text-[#c8bfb3] hover:border-[#c8bfb3] hover:text-[#f7efe2] disabled:opacity-30 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-[2] py-3.5 text-xs tracking-[0.3em] uppercase border border-[#c2844b] text-[#c2844b] hover:bg-[#c2844b] hover:text-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Confirming…
            </>
          ) : (
            'Confirm Reservation'
          )}
        </button>
      </div>
    </div>
  )
}
