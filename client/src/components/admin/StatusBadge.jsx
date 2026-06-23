const CONFIG = {
  CONFIRMED:  { label: 'Confirmed',  classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  CANCELLED:  { label: 'Cancelled',  classes: 'bg-red-500/10    text-red-400    border-red-500/20'    },
  COMPLETED:  { label: 'Completed',  classes: 'bg-[#2a2a2a]     text-[#c8bfb3]  border-[#2a2a2a]'     },
  NO_SHOW:    { label: 'No Show',    classes: 'bg-amber-500/10  text-amber-400  border-amber-500/20'  },
}

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] ?? CONFIG.CONFIRMED
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase border rounded ${cfg.classes}`}>
      {cfg.label}
    </span>
  )
}
