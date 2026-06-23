import { MapPin, Users, WrenchIcon, CheckCircle2 } from 'lucide-react'

const ZONE_ORDER = ['Window', 'Main Hall', 'Family Area', 'Private Dining']

function TableCard({ table, onToggle, toggling }) {
  const oos = table.isOutOfService
  const isToggling = toggling === table._id

  return (
    <div
      className={`relative p-5 border transition-all duration-300 ${
        oos
          ? 'border-red-700/25 bg-red-900/8 opacity-60'
          : 'border-[#2e2924] bg-[#131110] hover:border-[#c2844b]/30'
      }`}
    >
      {/* Status dot */}
      <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${oos ? 'bg-red-400' : 'bg-emerald-400'}`} />

      {/* Info */}
      <div className="space-y-2 mb-5 pr-6">
        <p className="text-[#f5efe6] text-[18px] font-display leading-none">{table.name}</p>
        <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#b8ada0]">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-[#c2844b]/60" />
            {table.zone}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={12} className="text-[#c2844b]/60" />
            {table.capacity}&nbsp;seats
          </span>
        </div>
      </div>

      {/* Status label */}
      <p className={`text-[11px] tracking-[0.32em] uppercase mb-4 ${oos ? 'text-red-400/80' : 'text-emerald-400/80'}`}>
        {oos ? '● Out of service' : '● In service'}
      </p>

      {/* Toggle */}
      <button
        onClick={() => onToggle(table._id)}
        disabled={isToggling}
        className={`w-full py-2.5 text-[11px] tracking-[0.28em] uppercase border transition-all duration-200 flex items-center justify-center gap-2 ${
          oos
            ? 'border-emerald-600/35 text-emerald-400/80 hover:bg-emerald-900/20'
            : 'border-red-600/30 text-red-400/80 hover:bg-red-900/15'
        } disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        {isToggling ? (
          <span className="animate-pulse">Updating…</span>
        ) : oos ? (
          <><CheckCircle2 size={13} />Mark Available</>
        ) : (
          <><WrenchIcon size={13} />Out of Service</>
        )}
      </button>
    </div>
  )
}

export default function TablesPanel({ tables, loading, error, onToggle, toggling }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-40 border border-[#2e2924] bg-[#131110] animate-pulse"
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-red-400 text-[14px] text-center py-10">{error}</p>
  }

  const byZone = ZONE_ORDER.reduce((acc, zone) => {
    const zoneTables = tables.filter(t => t.zone === zone)
    if (zoneTables.length) acc[zone] = zoneTables
    return acc
  }, {})

  tables.forEach(t => {
    if (!ZONE_ORDER.includes(t.zone) && !byZone[t.zone]) {
      byZone[t.zone] = tables.filter(x => x.zone === t.zone)
    }
  })

  return (
    <div className="space-y-8">
      {Object.entries(byZone).map(([zone, zoneTables]) => (
        <div key={zone}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[3px] h-4 bg-[#c2844b]/60" />
            <h3 className="text-[#b8ada0] text-[12px] tracking-[0.38em] uppercase">{zone}</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {zoneTables.map(table => (
              <TableCard
                key={table._id}
                table={table}
                onToggle={onToggle}
                toggling={toggling}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
