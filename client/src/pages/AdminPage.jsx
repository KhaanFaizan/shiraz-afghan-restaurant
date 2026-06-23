import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays, LayoutGrid, CheckCircle2, AlertCircle,
  CalendarCheck2, Users, Utensils, BarChart3,
} from 'lucide-react'
import BookingsPanel from '../components/admin/BookingsPanel'
import ModifyModal   from '../components/admin/ModifyModal'
import TablesPanel   from '../components/admin/TablesPanel'
import {
  getReservations,
  cancelReservation,
  modifyReservation,
  getTables,
  toggleTableService,
} from '../api/adminApi'
import { extractApiError } from '../api/api'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-center gap-3 px-5 py-3.5 text-[14px] shadow-xl border min-w-[280px] ${
        type === 'success'
          ? 'bg-[#0a1510] border-emerald-600/30 text-emerald-400'
          : 'bg-[#160a0a] border-red-500/30 text-red-400'
      }`}
    >
      {type === 'success'
        ? <CheckCircle2 size={16} className="shrink-0" />
        : <AlertCircle  size={16} className="shrink-0" />
      }
      <span className="flex-1">{message}</span>
    </motion.div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group bg-[#131110] border border-[#2e2924] p-6 hover:border-[#c2844b]/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-5">
        <p className="text-[#b8ada0] text-[12px] tracking-[0.28em] uppercase leading-snug max-w-[120px]">
          {label}
        </p>
        <Icon
          size={18}
          className="text-[#c2844b]/40 group-hover:text-[#c2844b]/70 transition-colors duration-300 shrink-0 mt-0.5"
        />
      </div>
      <p className="font-display text-[2.4rem] text-[#f5efe6] leading-none tracking-wide">
        {value}
      </p>
      <div className="mt-5 h-px bg-[#2e2924] group-hover:bg-[#c2844b]/25 transition-colors duration-300" />
    </motion.div>
  )
}

const TABS = [
  { key: 'bookings', label: 'Reservations', icon: CalendarDays },
  { key: 'tables',   label: 'Tables',       icon: LayoutGrid   },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [activeTab,  setActiveTab]  = useState('bookings')
  const [viewFilter, setViewFilter] = useState('today')
  const [customDate, setCustomDate] = useState(todayStr())

  const [reservations, setReservations] = useState([])
  const [resLoading,   setResLoading]   = useState(false)
  const [resError,     setResError]     = useState('')
  const [cancelling,   setCancelling]   = useState(null)

  const [tables,     setTables]     = useState([])
  const [tabLoading, setTabLoading] = useState(false)
  const [tabError,   setTabError]   = useState('')
  const [toggling,   setToggling]   = useState(null)

  const [modifyTarget, setModifyTarget] = useState(null)
  const [saving,       setSaving]       = useState(false)
  const [saveError,    setSaveError]    = useState('')

  const [toast, setToast] = useState(null)
  const showToast = (message, type = 'success') => setToast({ message, type })

  // ── Data fetching ────────────────────────────────────────────────────────
  const fetchReservations = useCallback(async () => {
    setResLoading(true)
    setResError('')
    try {
      const params = {}
      if (viewFilter === 'today')  { params.date = todayStr(); params.view = 'day' }
      if (viewFilter === 'week')   { params.date = todayStr(); params.view = 'week' }
      if (viewFilter === 'custom' && customDate) { params.date = customDate; params.view = 'day' }
      const { data } = await getReservations(params)
      setReservations(data.data ?? [])
    } catch {
      setResError('Failed to load reservations')
    } finally {
      setResLoading(false)
    }
  }, [viewFilter, customDate])

  useEffect(() => { fetchReservations() }, [fetchReservations])

  const fetchTables = useCallback(async () => {
    setTabLoading(true)
    setTabError('')
    try {
      const { data } = await getTables()
      setTables(data.data ?? [])
    } catch {
      setTabError('Failed to load tables')
    } finally {
      setTabLoading(false)
    }
  }, [])

  useEffect(() => { fetchTables() }, [fetchTables])

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return
    setCancelling(id)
    try {
      await cancelReservation(id)
      setReservations(prev => prev.map(r => r._id === id ? { ...r, status: 'CANCELLED' } : r))
      showToast('Reservation cancelled')
    } catch (err) {
      showToast(extractApiError(err, 'Failed to cancel reservation'), 'error')
    } finally {
      setCancelling(null)
    }
  }

  const handleModify = (reservation) => { setSaveError(''); setModifyTarget(reservation) }

  const handleSave = async (id, payload) => {
    if (Object.keys(payload).length === 0) { setModifyTarget(null); return }
    setSaving(true)
    setSaveError('')
    try {
      const { data } = await modifyReservation(id, payload)
      setReservations(prev => prev.map(r => r._id === id ? data.data : r))
      setModifyTarget(null)
      showToast('Reservation updated')
    } catch (err) {
      setSaveError(extractApiError(err, 'Failed to update reservation'))
    } finally {
      setSaving(false)
    }
  }

  const handleToggleTable = async (id) => {
    setToggling(id)
    try {
      const { data } = await toggleTableService(id)
      setTables(prev => prev.map(t => t._id === id ? data.data : t))
      showToast(data.message)
    } catch (err) {
      showToast(extractApiError(err, 'Failed to update table status'), 'error')
    } finally {
      setToggling(null)
    }
  }

  // ── Stats ────────────────────────────────────────────────────────────────
  const todayConfirmed  = reservations.filter(r => r.date === todayStr() && r.status === 'CONFIRMED')
  const totalGuests     = todayConfirmed.reduce((s, r) => s + r.partySize, 0)
  const inServiceTables = tables.filter(t => !t.isOutOfService).length

  const STATS = [
    { label: "Today's Bookings",  value: todayConfirmed.length,  icon: CalendarCheck2 },
    { label: "Today's Guests",    value: totalGuests,             icon: Users          },
    { label: "Tables In Service", value: inServiceTables || '—', icon: Utensils       },
    { label: "This View Total",   value: reservations.length,    icon: BarChart3      },
  ]

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 max-w-[1400px]">

      {/* Page header */}
      <div className="border-b border-[#2e2924] pb-7">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-[3px] h-5 bg-[#c2844b]" />
          <span className="text-[#c2844b] text-[12px] tracking-[0.45em] uppercase font-medium">
            Shiraz Admin
          </span>
        </div>
        <h1 className="font-display text-[2.5rem] text-[#f5efe6] leading-tight">
          Dashboard
        </h1>
        <p className="text-[#b8ada0] text-[15px] mt-2 tracking-wide">
          Manage reservations and tables
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon }, i) => (
          <StatCard key={label} label={label} value={value} icon={icon} delay={i * 0.06} />
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-[#2e2924]">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2.5 px-6 py-3.5 text-[13px] tracking-[0.22em] uppercase border-b-2 -mb-px transition-all duration-200 ${
              activeTab === key
                ? 'border-[#c2844b] text-[#c2844b]'
                : 'border-transparent text-[#7a7068] hover:text-[#f5efe6] hover:border-[#2e2924]'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'bookings' && (
            <BookingsPanel
              reservations={reservations}
              loading={resLoading}
              error={resError}
              viewFilter={viewFilter}
              onViewChange={(v) => { setViewFilter(v); if (v !== 'custom') setCustomDate(todayStr()) }}
              customDate={customDate}
              onCustomDateChange={setCustomDate}
              onModify={handleModify}
              onCancel={handleCancel}
              cancelling={cancelling}
            />
          )}

          {activeTab === 'tables' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[#f5efe6] text-[15px] font-medium tracking-wide">
                  Restaurant Tables
                </h2>
                <div className="flex items-center gap-4 text-[13px] text-[#7a7068]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    {inServiceTables} in service
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                    {tables.length - inServiceTables} out
                  </span>
                </div>
              </div>
              <TablesPanel
                tables={tables}
                loading={tabLoading}
                error={tabError}
                onToggle={handleToggleTable}
                toggling={toggling}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modify modal */}
      {modifyTarget && (
        <ModifyModal
          reservation={modifyTarget}
          onClose={() => setModifyTarget(null)}
          onSave={handleSave}
          saving={saving}
          saveError={saveError}
        />
      )}

      {/* Toast */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toast && (
            <Toast
              key={toast.message}
              message={toast.message}
              type={toast.type}
              onDismiss={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
