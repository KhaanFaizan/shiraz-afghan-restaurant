import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, LayoutDashboard } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/booking', label: 'Book a Table' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#2a2a2a]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-[#c2844b] text-xl tracking-[0.3em] uppercase"
        >
          Shiraz
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `text-sm tracking-widest uppercase transition-colors ${
                  isActive
                    ? 'text-[#c2844b]'
                    : 'text-[#c8bfb3] hover:text-[#f7efe2]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-[0.2em] uppercase border border-[#2a2a2a] text-[#c8bfb3] hover:border-[#c8bfb3]/50 hover:text-[#f7efe2] transition-all duration-300"
          >
            <LayoutDashboard size={13} />
            View Bookings
          </Link>
          <Link
            to="/booking"
            className="inline-flex items-center px-5 py-2 text-xs tracking-[0.2em] uppercase border border-[#c2844b] text-[#c2844b] hover:bg-[#c2844b] hover:text-[#0a0a0a] transition-all duration-300"
          >
            Reserve
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#c8bfb3] hover:text-[#f7efe2] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111111] border-t border-[#2a2a2a] px-6 py-4 space-y-4">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block text-sm tracking-widest uppercase py-2 transition-colors ${
                  isActive ? 'text-[#c2844b]' : 'text-[#c8bfb3]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 text-sm tracking-widest uppercase py-2 text-[#c8bfb3] hover:text-[#f7efe2] transition-colors"
          >
            <LayoutDashboard size={14} />
            View Bookings
          </Link>
        </div>
      )}
    </header>
  )
}
