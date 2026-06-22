import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BookingProgress   from '../components/booking/BookingProgress'
import PartySizeStep     from '../components/booking/PartySizeStep'
import DateStep          from '../components/booking/DateStep'
import TimeSlotsStep     from '../components/booking/TimeSlotsStep'
import CustomerFormStep  from '../components/booking/CustomerFormStep'
import ConfirmationStep  from '../components/booking/ConfirmationStep'
import { getAvailability, createReservation } from '../api/bookingApi'

const INITIAL_FORM = {
  customerName:   '',
  email:          '',
  phone:          '',
  specialRequest: '',
}

const variants = {
  enter:   (dir) => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center:  { opacity: 1, x: 0 },
  exit:    (dir) => ({ opacity: 0, x: dir > 0 ? -48 : 48 }),
}

const transition = { duration: 0.32, ease: [0.22, 1, 0.36, 1] }

export default function BookingPage() {
  const [step,      setStep]      = useState(1)
  const [direction, setDirection] = useState(1)

  // Booking selections
  const [partySize, setPartySize] = useState(null)
  const [date,      setDate]      = useState('')
  const [time,      setTime]      = useState('')
  const [form,      setForm]      = useState(INITIAL_FORM)

  // Availability state
  const [slots,        setSlots]        = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError,   setSlotsError]   = useState('')

  // Submission state
  const [submitting,          setSubmitting]          = useState(false)
  const [submitError,         setSubmitError]         = useState('')
  const [confirmedReservation, setConfirmedReservation] = useState(null)

  // ── Navigation helpers ─────────────────────────────────────────────────────
  const goTo = (n) => {
    setDirection(n > step ? 1 : -1)
    setStep(n)
  }

  // ── Fetch slots when moving to step 3 ─────────────────────────────────────
  const fetchSlots = useCallback(async (selectedDate = date, size = partySize) => {
    setSlotsError('')
    setSlotsLoading(true)
    setSlots([])
    setTime('')

    try {
      const { data } = await getAvailability(selectedDate, size)
      setSlots(data.data?.slots ?? [])
    } catch (err) {
      setSlotsError(
        err.response?.data?.message ?? 'Unable to load available times. Please try again.'
      )
    } finally {
      setSlotsLoading(false)
    }
  }, [date, partySize])

  // ── Step transition handlers ───────────────────────────────────────────────
  const handlePartySizeNext = () => goTo(2)

  const handleDateNext = () => {
    goTo(3)
    fetchSlots(date, partySize)
  }

  const handleTimeNext  = () => goTo(4)

  // ── Form field update ──────────────────────────────────────────────────────
  const handleFormChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  // ── Submit reservation ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')

    try {
      const { data } = await createReservation({
        customerName:   form.customerName.trim(),
        email:          form.email.trim().toLowerCase(),
        phone:          form.phone.trim(),
        date,
        time,
        partySize,
        specialRequest: form.specialRequest.trim(),
      })

      setConfirmedReservation(data.data)
      setDirection(1)
      setStep(5)
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ?? 'Something went wrong. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ── Reset for a new booking ────────────────────────────────────────────────
  const handleNewBooking = () => {
    setStep(1)
    setDirection(1)
    setPartySize(null)
    setDate('')
    setTime('')
    setForm(INITIAL_FORM)
    setSlots([])
    setSlotsError('')
    setSubmitError('')
    setConfirmedReservation(null)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 px-4">
      <div className="max-w-lg mx-auto">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 space-y-3"
        >
          <span className="text-[#c2844b] text-[10px] tracking-[0.5em] uppercase">
            Shiraz Afghan Restaurant
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-[#f7efe2]">
            Reserve a Table
          </h1>
          {/* Gold divider */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="w-8 h-px bg-[#c2844b]" />
            <div className="w-1.5 h-1.5 rotate-45 border border-[#c2844b]" />
            <div className="w-8 h-px bg-[#c2844b]" />
          </div>
        </motion.div>

        {/* Step progress (hidden on confirmation) */}
        {step < 5 && <BookingProgress currentStep={step} />}

        {/* Step card */}
        <div className="bg-[#111111] border border-[#2a2a2a] p-6 sm:p-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            >
              {step === 1 && (
                <PartySizeStep
                  value={partySize}
                  onChange={setPartySize}
                  onNext={handlePartySizeNext}
                />
              )}

              {step === 2 && (
                <DateStep
                  value={date}
                  onChange={setDate}
                  onNext={handleDateNext}
                  onBack={() => goTo(1)}
                />
              )}

              {step === 3 && (
                <TimeSlotsStep
                  slots={slots}
                  loading={slotsLoading}
                  error={slotsError}
                  value={time}
                  onChange={setTime}
                  onNext={handleTimeNext}
                  onBack={() => goTo(2)}
                  date={date}
                  partySize={partySize}
                  onRetry={() => fetchSlots(date, partySize)}
                />
              )}

              {step === 4 && (
                <CustomerFormStep
                  form={form}
                  onChange={handleFormChange}
                  onSubmit={handleSubmit}
                  onBack={() => goTo(3)}
                  submitting={submitting}
                  submitError={submitError}
                  booking={{ partySize, date, time }}
                />
              )}

              {step === 5 && (
                <ConfirmationStep
                  reservation={confirmedReservation}
                  onNewBooking={handleNewBooking}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Privacy note */}
        {step < 5 && (
          <p className="text-center text-[#c8bfb3]/50 text-[11px] mt-6 tracking-wide">
            Your details are used only to manage your reservation and will never be shared.
          </p>
        )}
      </div>
    </div>
  )
}
