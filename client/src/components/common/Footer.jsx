import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

function IconInstagram({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconFacebook({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const hours = [
  { day: 'Monday – Thursday', time: '12:00 pm – 10:30 pm' },
  { day: 'Friday',            time: '12:00 pm – 11:00 pm' },
  { day: 'Saturday',          time: '12:00 pm – 11:00 pm' },
  { day: 'Sunday',            time: '12:00 pm – 10:00 pm' },
]

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0a0a0a] border-t border-[#2a2a2a]">

      {/* Decorative top divider */}
      <div className="flex items-center gap-4 px-6 pt-12">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c2844b]/30" />
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rotate-45 bg-[#c2844b]/60" />
          <span className="text-[#c2844b] text-[10px] tracking-[0.55em] uppercase font-medium">Shiraz</span>
          <div className="w-1 h-1 rotate-45 bg-[#c2844b]/60" />
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c2844b]/30" />
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-4">
          <span className="font-display text-[#c2844b] text-2xl tracking-[0.4em] uppercase">
            Shiraz
          </span>
          <p className="text-[#c8bfb3] text-xs tracking-widest uppercase">
            Afghan Restaurant
          </p>
          <p className="text-[#c8bfb3] text-sm leading-relaxed max-w-xs">
            Authentic Afghan cuisine in the heart of London, crafted with heritage 
            recipes and the warmth of traditional hospitality.
          </p>
          <Link
            to="/booking"
            className="mt-1 self-start px-6 py-2.5 text-xs tracking-[0.25em] uppercase border border-[#c2844b] text-[#c2844b] hover:bg-[#c2844b] hover:text-[#0a0a0a] transition-all duration-300"
          >
            Book a Table
          </Link>
        </div>

        {/* Opening Hours */}
        <div>
          <h3 className="text-[#c2844b] text-[10px] tracking-[0.35em] uppercase mb-5 font-medium flex items-center gap-2">
            <Clock size={12} />
            Opening Hours
          </h3>
          <ul className="space-y-3">
            {hours.map(({ day, time }) => (
              <li key={day} className="text-[#c8bfb3] text-xs">
                <span className="text-[#f7efe2]">{day}</span>
                <br />
                <span className="text-[#c8bfb3]">{time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Find Us */}
        <div>
          <h3 className="text-[#c2844b] text-[10px] tracking-[0.35em] uppercase mb-5 font-medium">
            Find Us
          </h3>
          <ul className="space-y-3 text-[#c8bfb3] text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={13} className="shrink-0 mt-0.5 text-[#c2844b]" />
              <span>123 Kabul Street,<br />London, UK</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={13} className="shrink-0 text-[#c2844b]" />
              <a href="tel:+442000000000" className="hover:text-[#c2844b] transition-colors">
                +44 20 0000 0000
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={13} className="shrink-0 text-[#c2844b]" />
              <a href="mailto:hello@shirazrestaurant.co.uk" className="hover:text-[#c2844b] transition-colors text-xs break-all">
                hello@shirazrestaurant.co.uk
              </a>
            </li>
          </ul>
        </div>

        {/* Social + Links */}
        <div>
          <h3 className="text-[#c2844b] text-[10px] tracking-[0.35em] uppercase mb-5 font-medium">
            Follow Us
          </h3>
          <div className="flex gap-4 mb-6">
            <a href="#" className="text-[#c8bfb3] hover:text-[#c2844b] transition-colors" aria-label="Instagram">
              <IconInstagram size={18} />
            </a>
            <a href="#" className="text-[#c8bfb3] hover:text-[#c2844b] transition-colors" aria-label="Facebook">
              <IconFacebook size={18} />
            </a>
          </div>

          {/* Quick links */}
          <h3 className="text-[#c2844b] text-[10px] tracking-[0.35em] uppercase mb-3 font-medium">
            Quick Links
          </h3>
          <ul className="space-y-2 text-xs text-[#c8bfb3]">
            <li>
              <Link to="/" className="hover:text-[#c2844b] transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/booking" className="hover:text-[#c2844b] transition-colors">Reservations</Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-[#c2844b] transition-colors opacity-60">
                Admin Dashboard
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2a2a2a] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#c8bfb3] text-xs tracking-wider">
        <span>© {new Date().getFullYear()} Shiraz Afghan Restaurant. All rights reserved.</span>
        <span className="text-[#c8bfb3]/40">Crafted with passion · London</span>
      </div>
    </footer>
  )
}
