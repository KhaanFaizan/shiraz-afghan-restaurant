import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'

const inputCls = 'w-full bg-[#0a0a0a] border border-[#2a2a2a] text-[#f7efe2] px-3 py-2 text-sm focus:outline-none focus:border-[#c2844b] transition-colors'
const labelCls = 'block text-[#c8bfb3] text-[10px] tracking-[0.3em] uppercase mb-1'

const STATUS_OPTIONS = ['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']

function getUTCTimeStr(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate)
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

function toDateStr(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

export default function ModifyModal({ reservation, onClose, onSave, saving, saveError }) {
  const [form, setForm] = useState({
    customerName:   '',
    phone:          '',
    date:           '',
    time:           '',
    partySize:      2,
    specialRequest: '',
    status:         'CONFIRMED',
  })

  // Pre-fill form when reservation is provided
  useEffect(() => {
    if (!reservation) return
    setForm({
      customerName:   reservation.customerName ?? '',
      phone:          reservation.phone ?? '',
      date:           reservation.date ?? '',
      time:           getUTCTimeStr(reservation.startTime),
      partySize:      reservation.partySize ?? 2,
      specialRequest: reservation.specialRequest ?? '',
      status:         reservation.status ?? 'CONFIRMED',
    })
  }, [reservation])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = () => {
    const payload = {}
    if (form.customerName !== reservation.customerName) payload.customerName = form.customerName
    if (form.phone        !== reservation.phone)        payload.phone        = form.phone
    if (form.specialRequest !== reservation.specialRequest) payload.specialRequest = form.specialRequest
    if (form.status       !== reservation.status)       payload.status       = form.status
    if (form.date         !== reservation.date)         payload.date         = form.date
    if (form.partySize    !== reservation.partySize)    payload.partySize    = Number(form.partySize)

    const existingTime = getUTCTimeStr(reservation.startTime)
    if (form.time !== existingTime)                     payload.time         = form.time

    onSave(reservation._id, payload)
  }

  if (!reservation) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full sm:max-w-lg bg-[#111111] border border-[#2a2a2a] max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] sticky top-0 bg-[#111111] z-10">
            <div>
              <h3 className="text-[#f7efe2] text-sm font-medium">Modify Reservation</h3>
              <p className="text-[#c8bfb3] text-xs mt-0.5">#{reservation._id?.slice(-8).toUpperCase()}</p>
            </div>
            <button onClick={onClose} className="text-[#c8bfb3] hover:text-[#f7efe2] transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <div className="px-6 py-5 space-y-4">
            {/* Customer details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Customer Name</label>
                <input
                  value={form.customerName}
                  onChange={(e) => set('customerName', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Party Size</label>
                <select
                  value={form.partySize}
                  onChange={(e) => set('partySize', Number(e.target.value))}
                  className={`${inputCls} appearance-none`}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Date</label>
                <input
                  type="date"
                  value={form.date}
                  min={toDateStr(0)}
                  max={toDateStr(30)}
                  onChange={(e) => set('date', e.target.value)}
                  className={`${inputCls} [color-scheme:dark]`}
                />
              </div>
              <div>
                <label className={labelCls}>Time</label>
                <input
                  type="time"
                  value={form.time}
                  step="1800"
                  onChange={(e) => set('time', e.target.value)}
                  className={`${inputCls} [color-scheme:dark]`}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className={labelCls}>Status</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className={`${inputCls} appearance-none`}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase().replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Special request */}
            <div>
              <label className={labelCls}>Special Requests</label>
              <textarea
                rows={2}
                value={form.specialRequest}
                onChange={(e) => set('specialRequest', e.target.value)}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Error */}
            {saveError && (
              <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {saveError}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-[#2a2a2a] sticky bottom-0 bg-[#111111]">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-2.5 text-xs tracking-[0.25em] uppercase border border-[#2a2a2a] text-[#c8bfb3] hover:border-[#c8bfb3] hover:text-[#f7efe2] disabled:opacity-30 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-[2] py-2.5 text-xs tracking-[0.25em] uppercase border border-[#c2844b] text-[#c2844b] hover:bg-[#c2844b] hover:text-[#0a0a0a] disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              {saving ? <><Loader2 size={13} className="animate-spin" />Saving…</> : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
