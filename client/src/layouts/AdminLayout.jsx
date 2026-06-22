import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Settings } from 'lucide-react'

const sideLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-[#2a2a2a] flex flex-col">
        <div className="px-6 py-6 border-b border-[#2a2a2a]">
          <span className="font-display text-[#c2844b] text-lg tracking-widest uppercase">
            Shiraz
          </span>
          <p className="text-[10px] text-[#c8bfb3] tracking-[0.2em] uppercase mt-0.5">
            Admin
          </p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sideLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  isActive
                    ? 'bg-[#c2844b]/10 text-[#c2844b]'
                    : 'text-[#c8bfb3] hover:text-[#f7efe2] hover:bg-[#1a1a1a]'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-[#2a2a2a] flex items-center px-6">
          <span className="text-[#c8bfb3] text-sm">Admin Panel</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
