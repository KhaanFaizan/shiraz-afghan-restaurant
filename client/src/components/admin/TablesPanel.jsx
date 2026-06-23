import { MapPin, Users, WrenchIcon, CheckCircle2 } from 'lucide-react'

const ZONE_ORDER = ['Window', 'Main Hall', 'Family Area', 'Private Dining']

function TableCard({ table, onToggle, toggling }) {
  const oos = table.isOutOfService
  return (
    <div
      className={`relative p-4 border transition-all duration-300 ${
        oos
          ? 'border-red-500/20 bg-red-500/5 opacity-70'
          : 'border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#c2844b]/30'
      }`}
    >
      {/* Status indicator */}
      <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${oos ? 'bg-red-400' : 'bg-emerald-400'}`} />

      {/* Table info */}
      <div className="space-y-2 mb-4">
        <p className="text-[#f7efe2] text-lg font-display">{table.name}</p>
        <div className="flex items-center gap-3 text-xs text-[#c8bfb3]">
          <span className="flex items-center gap-1">
            <MapPin size={11} className="text-[#c2844b]" />
            {table.zone}
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} className="text-[#c2844b]" />
            {table.capacity} seats
          </span>
        </div>
      </div>

      {/* Status label */}
      <p className={`text-[10px] tracking-widest uppercase mb-3 ${oos ? 'text-red-400' : 'text-emerald-400'}`}>
        {oos ? 'Out of service' : 'In service'}
      </p>

      {/* Toggle button */}
      <button
        onClick={() => onToggle(table._id)}
        disabled={toggling === table._id}
        className={`w-full py-1.5 text-[10px] tracking-widest uppercase border transition-all duration-200 flex items-center justify-center gap-1.5 ${
          oos
            ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
            : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {oos
          ? <><CheckCircle2 size={11} /> Mark Available</>
          : <><WrenchIcon size={11} /> Out of Service</>
        }
      </button>
    </div>
  )
}

export default function TablesPanel({ tables, loading, error, onToggle, toggling }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-36 border border-[#2a2a2a] bg-[#1a1a1a] animate-pulse rounded" />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-red-400 text-sm text-center py-8">{error}</p>
  }

  // Group by zone in order
  const byZone = ZONE_ORDER.reduce((acc, zone) => {
    const zoneTables = tables.filter(t => t.zone === zone)
    if (zoneTables.length) acc[zone] = zoneTables
    return acc
  }, {})

  // Include any zones not in ZONE_ORDER
  tables.forEach(t => {
    if (!ZONE_ORDER.includes(t.zone) && !byZone[t.zone]) {
      byZone[t.zone] = tables.filter(x => x.zone === t.zone)
    }
  })

  return (
    <div className="space-y-6">
      {Object.entries(byZone).map(([zone, zoneTables]) => (
        <div key={zone}>
          <h3 className="text-[#c2844b] text-[10px] tracking-[0.35em] uppercase mb-3">{zone}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
