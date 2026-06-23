import { useState, useEffect, useCallback } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Routes that exist: /  and  /booking
// All others link to homepage sections via hash anchors
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Home',      type: 'route', to: '/',         end: true  },
  { label: 'Booking',   type: 'route', to: '/booking',  end: false },
  { label: 'Our Story', type: 'hash',  href: '/#story'             },
  { label: 'Menu',      type: 'hash',  href: '/#menu'              },
  { label: 'Contact',   type: 'hash',  href: '/#contact'           },
]

const ease = [0.22, 1, 0.36, 1]

// Desktop link: underline slides in on hover / stays on active
const desktopCls = (isActive) =>
  `relative text-[13px] tracking-[0.18em] uppercase font-medium transition-colors duration-200 pb-[3px] ` +
  `border-b-[1.5px] ${isActive
    ? 'text-[#c2844b] border-[#c2844b]'
    : 'text-[#c8bfb3] hover:text-[#f7efe2] border-transparent hover:border-[#f7efe2]/25'
  }`

// Mobile link
const mobileCls = (isActive) =>
  `block text-sm tracking-[0.2em] uppercase font-medium py-4 border-b border-[#ffffff]/5 transition-colors duration-200 ` +
  (isActive ? 'text-[#c2844b]' : 'text-[#c8bfb3] hover:text-[#f7efe2]')

// ── Single nav item ───────────────────────────────────────────────────────────
function NavItem({ item, mobile = false, onClose }) {
  if (item.type === 'route') {
    return (
      <NavLink
        to={item.to}
        end={item.end}
        onClick={onClose}
        className={({ isActive }) => mobile ? mobileCls(isActive) : desktopCls(isActive)}
      >
        {item.label}
      </NavLink>
    )
  }
  // Hash anchor: native browser scroll, no React Router
  return (
    <a
      href={item.href}
      onClick={onClose}
      className={mobile ? mobileCls(false) : desktopCls(false)}
    >
      {item.label}
    </a>
  )
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 55)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = useCallback(() => setMenuOpen(false), [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? 'bg-[#0a0a0a]/97 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.05)]'
          : 'bg-gradient-to-b from-[#0a0a0a]/65 to-transparent'
      }`}
    >
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 h-[68px] md:h-[80px] flex items-center justify-between gap-6">

        {/* Brand */}
        <Link
          to="/"
          onClick={close}
          aria-label="Shiraz Afghan Restaurant — home"
          className="shrink-0 group flex items-baseline gap-2.5"
        >
          <span className="font-display text-[1.5rem] md:text-[1.7rem] text-[#c2844b] tracking-[0.28em] uppercase leading-none group-hover:text-[#d4976a] transition-colors duration-300">
            Shiraz
          </span>
          <span className="hidden lg:block text-[11px] text-[#c8bfb3]/65 tracking-[0.32em] uppercase font-light self-end mb-[2px]">
            Afghan Restaurant
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Main navigation">
          {NAV_ITEMS.map(item => (
            <NavItem key={item.label} item={item} onClose={close} />
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block shrink-0">
          <Link
            to="/admin"
            className="inline-flex items-center px-6 py-3 rounded-full text-[12px] tracking-[0.22em] uppercase font-semibold border-2 border-[#c2844b] text-[#c2844b] hover:bg-[#c2844b] hover:text-[#0a0a0a] transition-all duration-300 shadow-[0_0_0_0_rgba(194,132,75,0)] hover:shadow-[0_0_16px_rgba(194,132,75,0.25)]"
          >
            View Bookings
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-11 h-11 text-[#c8bfb3] hover:text-[#f7efe2] transition-colors"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen
              ? <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.16 }}><X size={22} /></motion.span>
              : <motion.span key="m" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.16 }}><Menu size={22} /></motion.span>
            }
          </AnimatePresence>
        </button>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            key="drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease }}
            className="md:hidden border-t border-[#ffffff]/6 bg-[#0a0a0a]/98 backdrop-blur-xl"
            aria-label="Mobile navigation"
          >
            <div className="px-5 sm:px-8 pt-2 pb-7">
              {/* Links with stagger */}
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.045, ease }}
                >
                  <NavItem item={item} mobile onClose={close} />
                </motion.div>
              ))}

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: 0.24, ease }}
                className="mt-6"
              >
                <Link
                  to="/admin"
                  onClick={close}
                  className="flex items-center justify-center w-full py-4 rounded-full text-[13px] tracking-[0.25em] uppercase font-semibold bg-[#c2844b] text-[#0a0a0a] hover:bg-[#d4976a] transition-colors duration-300"
                >
                  View Bookings
                </Link>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
