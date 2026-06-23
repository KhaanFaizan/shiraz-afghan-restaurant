import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown } from 'lucide-react'
import { heroVideo } from '../../data/menuAssets'

const ease = [0.22, 1, 0.36, 1]

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    // Reduced delays so text is visible as soon as JS loads
    transition: { duration: 0.75, delay: delay * 0.7, ease },
  }
}

export default function HeroSection() {
  const videoRef = useRef(null)

  return (
    <section
      id="hero"
      /* bg-[#0a0a0a] is the visible fallback while the video loads */
      className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* ── Background video ───────────────────────────────────────────────── */}
      {/* preload="metadata" fetches only duration/dimensions, not the full file */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* ── Dark overlay (gradient: darker at top and bottom, lighter in centre) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(10,10,10,0.75) 0%,
              rgba(10,10,10,0.45) 35%,
              rgba(10,10,10,0.50) 65%,
              rgba(10,10,10,0.85) 100%
            )
          `,
        }}
      />

      {/* ── Warm amber vignette ────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 55%, rgba(194,132,75,0.06) 0%, transparent 70%)',
        }}
      />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">

        {/* Eyebrow */}
        <motion.div
          {...fadeUp(0.15)}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-px bg-[#c2844b]/50" />
          <span className="text-[#c2844b] text-[9px] tracking-[0.6em] uppercase font-medium">
            Est. 1995 · London
          </span>
          <div className="w-12 h-px bg-[#c2844b]/50" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.3)}
          className="font-display text-[clamp(3rem,8vw,7rem)] text-[#f7efe2] leading-[0.95] tracking-wide mb-6"
        >
          Shiraz
        </motion.h1>

        <motion.p
          {...fadeUp(0.42)}
          className="font-display text-[clamp(1rem,2.5vw,1.5rem)] text-[#c2844b] italic tracking-wider mb-3"
        >
          Afghan Restaurant
        </motion.p>

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.55)}
          className="text-[#c8bfb3] text-base md:text-lg max-w-lg leading-relaxed mb-10"
        >
          Where Afghan hospitality meets the fire of the charcoal grill —
          saffron, pomegranate, and recipes passed through generations.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.68)}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/booking"
            className="min-w-[180px] px-8 py-3.5 text-xs tracking-[0.3em] uppercase border border-[#c2844b] bg-[#c2844b] text-[#0a0a0a] font-semibold hover:bg-transparent hover:text-[#c2844b] transition-all duration-400"
          >
            Book a Table
          </Link>
          <a
            href="#menu"
            className="min-w-[180px] px-8 py-3.5 text-xs tracking-[0.3em] uppercase border border-[#f7efe2]/30 text-[#f7efe2] hover:border-[#c2844b] hover:text-[#c2844b] transition-all duration-400 text-center"
          >
            Explore Menu
          </a>
        </motion.div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────────────────── */}
      <motion.a
        href="#story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#c2844b]/60 hover:text-[#c2844b] transition-colors group"
        aria-label="Scroll down"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase group-hover:text-[#c2844b] transition-colors">
          Scroll
        </span>
        <ArrowDown size={16} className="animate-bounce" />
      </motion.a>
    </section>
  )
}
