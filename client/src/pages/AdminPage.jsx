import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, LayoutGrid, CheckCircle2, AlertCircle } from 'lucide-react'
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

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`flex items-center gap-3 px-4 py-3 text-sm shadow-lg border ${
        type === 'success'
          ? 'bg-[#111111] border-emerald-500/30 text-emerald-400'
          : 'bg-[#111111] border-red-500/30 text-red-400'
      }`}
    >
      {type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
      {message}
    </motion.div>
  )
}

const TABS = [
  { key: 'bookings', label: 'Bookings',  Icon: CalendarDays },
  { key: 'tables',   label: 'Tables',    Icon: LayoutGrid },
]

export default function AdminPage() {
  const [activeTab,   setActiveTab]   = useState('bookings')
  const [viewFilter,  setViewFilter]  = useState('today')
  const [customDate,  setCustomDate]  = useState(todayStr())

  // Reservations state
  const [reservations, setReservations] = useState([])
  const [resLoading,   setResLoading]   = useState(false)
  const [resError,     setResError]     = useState('')
  const [cancelling,   setCancelling]   = useState(null)

  // Tables state
  const [tables,      setTables]      = useState([])
  const [tabLoading,  setTabLoading]  = useState(false)
  const [tabError,    setTabError]    = useState('')
  const [toggling,    setToggling]    = useState(null)

  // Modify modal state
  const [modifyTarget, setModifyTarget] = useState(null)
  const [saving,       setSaving]       = useState(false)
  const [saveError,    setSaveError]    = useState('')

  // Toast
  const [toast, setToast] = useState(null)
  const showToast = (message, type = 'success') => setToast({ message, type })

  // ── Fetch reservations ─────────────────────────────────────────────────────
  const fetchReservations = useCallback(async () => {
    setResLoading(true)
    setResError('')
    try {
      const params = {}
      if (viewFilter === 'today')  { params.date = todayStr(); params.view = 'day' }
      if (viewFilter === 'week')   { params.date = todayStr(); params.view = 'week' }
      if (viewFilter === 'custom' && customDate) { params.date = customDate; params.view = 'day' }
      // 'all' → no params

      const { data } = await getReservations(params)
      setReservations(data.data ?? [])
    } catch {
      setResError('Failed to load reservations')
    } finally {
      setResLoading(false)
    }
  }, [viewFilter, customDate])

  useEffect(() => { fetchReservations() }, [fetchReservations])

  // ── Fetch tables ───────────────────────────────────────────────────────────
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

  // ── Cancel ─────────────────────────────────────────────────────────────────
  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return
    setCancelling(id)
    try {
      await cancelReservation(id)
      setReservations(prev =>
        prev.map(r => r._id === id ? { ...r, status: 'CANCELLED' } : r)
      )
      showToast('Reservation cancelled')
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Failed to cancel', 'error')
    } finally {
      setCancelling(null)
    }
  }

  // ── Modify ─────────────────────────────────────────────────────────────────
  const handleModify = (reservation) => {
    setSaveError('')
    setModifyTarget(reservation)
  }

  const handleSave = async (id, payload) => {
    if (Object.keys(payload).length === 0) {
      setModifyTarget(null)
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      const { data } = await modifyReservation(id, payload)
      setReservations(prev =>
        prev.map(r => r._id === id ? data.data : r)
      )
      setModifyTarget(null)
      showToast('Reservation updated')
    } catch (err) {
      setSaveError(err.response?.data?.message ?? 'Failed to update reservation')
    } finally {
      setSaving(false)
    }
  }

  // ── Toggle table ───────────────────────────────────────────────────────────
  const handleToggleTable = async (id) => {
    setToggling(id)
    try {
      const { data } = await toggleTableService(id)
      setTables(prev => prev.map(t => t._id === id ? data.data : t))
      showToast(data.message)
    } catch {
      showToast('Failed to update table', 'error')
    } finally {
      setToggling(null)
    }
  }

  // ── Stats (derived) ────────────────────────────────────────────────────────
  const todayConfirmed = reservations.filter(
    r => r.date === todayStr() && r.status === 'CONFIRMED'
  )
  const totalGuests = todayConfirmed.reduce((s, r) => s + r.partySize, 0)
  const inServiceTables = tables.filter(t => !t.isOutOfService).length

  const stats = [
    { label: "Today's Bookings", value: todayConfirmed.length },
    { label: "Today's Guests",   value: totalGuests },
    { label: "Tables In Service", value: inServiceTables || '—' },
    { label: "This View Total",  value: reservations.length },
  ]

  return (
    <div className="space-y-6">

      {/* Page title */}
      <div>
        <h1 className="font-display text-2xl text-[#f7efe2]">Dashboard</h1>
        <p className="text-[#c8bfb3] text-sm mt-1">Manage reservations and tables</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="bg-[#111111] border border-[#2a2a2a] px-4 py-4"
          >
            <p className="text-[#c8bfb3] text-[10px] tracking-widest uppercase">{label}</p>
            <p className="font-display text-3xl text-[#f7efe2] mt-2">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-[#2a2a2a] pb-0">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-wider uppercase border-b-2 -mb-px transition-colors ${
              activeTab === key
                ? 'border-[#c2844b] text-[#c2844b]'
                : 'border-transparent text-[#c8bfb3] hover:text-[#f7efe2]'
            }`}
          >
            <Icon size={14} />
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
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#f7efe2] text-sm font-medium">Restaurant Tables</h2>
                <span className="text-[#c8bfb3] text-xs">
                  {inServiceTables} in service · {tables.length - inServiceTables} out
                </span>
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

      {/* Toast notifications */}
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
