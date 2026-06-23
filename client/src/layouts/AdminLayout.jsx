import { useState, useEffect } from 'react'
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, ExternalLink, ArrowUpRight, Menu, X } from 'lucide-react'

// ─── Design tokens (admin theme) ──────────────────────────────────────────────
// bg:       #0B0A08  (warm charcoal)
// sidebar:  #080704  (deeper warm black)
// surface:  #131110  (card/row surface)
// border:   #2E2924  (warm dark border)
// gold:     #C2844B
// text-1:   #F5EFE6  (primary text, warm white)
// text-2:   #B8ADA0  (secondary text, readable warm gray)
// text-m:   #7A7068  (muted)
// ─────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
]

const ease = [0.22, 1, 0.36, 1]

// ── Brand mark — matches public Navbar typography ─────────────────────────────
function BrandMark({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Back to Shiraz Restaurant homepage"
      className="group flex flex-col gap-[5px]"
    >
      <span className="font-display text-[1.65rem] text-[#c2844b] tracking-[0.28em] uppercase leading-none group-hover:text-[#d4976a] transition-colors duration-300">
        Shiraz
      </span>
      <span className="text-[12px] text-[#b8ada0]/60 tracking-[0.3em] uppercase font-light leading-none">
        Afghan Restaurant
      </span>
    </Link>
  )
}

// ── Sidebar content ───────────────────────────────────────────────────────────
function SidebarContent({ onLinkClick }) {
  return (
    <div className="flex flex-col h-full">

      {/* Brand */}
      <div className="px-6 pt-8 pb-6 border-b border-[#2e2924]">
        <BrandMark onClick={onLinkClick} />
        <div className="flex items-center gap-2 mt-5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#c2844b]/50" />
          <span className="text-[11px] text-[#7a7068] tracking-[0.38em] uppercase">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-6 pb-3">
        <p className="text-[11px] text-[#7a7068]/60 tracking-[0.4em] uppercase px-3 mb-3 select-none">
          Menu
        </p>
        <div className="space-y-0.5">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={onLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 text-[14px] tracking-wide transition-all duration-200 border-l-2 ${
                  isActive
                    ? 'bg-[#c2844b]/12 text-[#c2844b] border-[#c2844b]'
                    : 'text-[#b8ada0] hover:text-[#f5efe6] hover:bg-[#1c1916] border-transparent'
                }`
              }
            >
              <Icon size={17} className="shrink-0" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Divider */}
      <div className="mx-5 h-px bg-[#2e2924]" />

      {/* View site */}
      <div className="px-3 py-5">
        <Link
          to="/"
          onClick={onLinkClick}
          className="group flex items-center gap-3 px-3 py-3 text-[13px] tracking-wide text-[#b8ada0] hover:text-[#c2844b] hover:bg-[#1c1916] transition-all duration-200"
        >
          <ExternalLink size={15} className="shrink-0" />
          <span>View Restaurant Site</span>
          <ArrowUpRight
            size={13}
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        </Link>
      </div>
    </div>
  )
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  return (
    <div className="min-h-screen flex bg-[#0b0a08]">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-[#2e2924] bg-[#080704]">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] bg-[#080704] border-r border-[#2e2924] flex flex-col lg:hidden"
            >
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation"
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-[#b8ada0] hover:text-[#f5efe6] transition-colors"
              >
                <X size={18} />
              </button>
              <SidebarContent onLinkClick={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar — mobile only elements */}
        <header className="h-[60px] shrink-0 flex items-center gap-3 px-4 sm:px-6 border-b border-[#2e2924] bg-[#0b0a08] lg:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            className="flex items-center justify-center w-10 h-10 text-[#b8ada0] hover:text-[#f5efe6] transition-colors shrink-0"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1">
            <BrandMark />
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-7 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
