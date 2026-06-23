const CONFIG = {
  CONFIRMED: {
    label:   'Confirmed',
    classes: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/40',
    dot:     'bg-emerald-400',
  },
  CANCELLED: {
    label:   'Cancelled',
    classes: 'bg-red-900/30 text-red-300/80 border-red-700/30',
    dot:     'bg-red-400',
  },
  COMPLETED: {
    label:   'Completed',
    classes: 'bg-[#1c1814] text-[#b8ada0] border-[#2e2924]',
    dot:     'bg-[#7a7068]',
  },
  NO_SHOW: {
    label:   'No Show',
    classes: 'bg-amber-900/30 text-amber-300 border-amber-700/30',
    dot:     'bg-amber-400',
  },
}

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] ?? CONFIG.CONFIRMED
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-[0.22em] uppercase border font-medium whitespace-nowrap ${cfg.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}
