import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'

// Brand SVG icons (lucide-react excludes brand/social icons)
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

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2a2a2a]">
      {/* Decorative divider */}
      <div className="flex items-center gap-4 px-12 pt-12 pb-0">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c2844b]/40" />
        <span className="text-[#c2844b] text-xs tracking-[0.4em] uppercase">Shiraz</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c2844b]/40" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Find Us */}
        <div>
          <h3 className="text-[#c2844b] text-xs tracking-[0.3em] uppercase mb-4 font-medium">
            Find Us
          </h3>
          <ul className="space-y-3 text-[#c8bfb3] text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="shrink-0 mt-0.5 text-[#c2844b]" />
              123 Kabul Street, London, UK
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="shrink-0 text-[#c2844b]" />
              +44 20 0000 0000
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="shrink-0 text-[#c2844b]" />
              hello@shirazrestaurant.co.uk
            </li>
          </ul>
        </div>

        {/* Brand centre */}
        <div className="flex flex-col items-center justify-center text-center gap-3">
          <span className="font-display text-[#c2844b] text-2xl tracking-[0.4em] uppercase">
            Shiraz
          </span>
          <p className="text-[#c8bfb3] text-xs tracking-widest uppercase">
            Afghan Restaurant
          </p>
          <Link
            to="/booking"
            className="mt-2 px-6 py-2 text-xs tracking-[0.2em] uppercase border border-[#c2844b] text-[#c2844b] hover:bg-[#c2844b] hover:text-[#0a0a0a] transition-all duration-300"
          >
            Book a Table
          </Link>
        </div>

        {/* Social */}
        <div className="md:text-right">
          <h3 className="text-[#c2844b] text-xs tracking-[0.3em] uppercase mb-4 font-medium">
            Follow Us
          </h3>
          <div className="flex md:justify-end gap-4">
            <a
              href="#"
              className="text-[#c8bfb3] hover:text-[#c2844b] transition-colors"
              aria-label="Instagram"
            >
              <IconInstagram size={18} />
            </a>
            <a
              href="#"
              className="text-[#c8bfb3] hover:text-[#c2844b] transition-colors"
              aria-label="Facebook"
            >
              <IconFacebook size={18} />
            </a>
          </div>
          <p className="text-[#c8bfb3] text-xs mt-4">
            Open daily · 12pm – 10:30pm
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2a2a2a] px-6 py-4 text-center text-[#c8bfb3] text-xs tracking-wider">
        © {new Date().getFullYear()} Shiraz Afghan Restaurant. All rights reserved.
      </div>
    </footer>
  )
}
