import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { imgGrillBg } from '../../data/menuAssets'

const ease = [0.22, 1, 0.36, 1]

export default function ReservationCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      id="reserve"
      className="relative overflow-hidden py-32 md:py-44"
    >
      {/* Background image */}
      <img
        src={imgGrillBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        loading="lazy"
      />

      {/* Dark overlay — heavier so text is readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(10,10,10,0.80) 0%,
            rgba(10,10,10,0.72) 50%,
            rgba(10,10,10,0.85) 100%
          )`,
        }}
      />

      {/* Warm amber inner glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(194,132,75,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-10 h-px bg-[#c2844b]/60" />
          <span className="text-[#c2844b] text-[9px] tracking-[0.6em] uppercase">
            Join Us
          </span>
          <div className="w-10 h-px bg-[#c2844b]/60" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.22, ease }}
          className="font-display text-[clamp(2.2rem,6vw,4.5rem)] text-[#f7efe2] leading-tight mb-6"
        >
          A Table Awaits You
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.36, ease }}
          className="text-[#c8bfb3] text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10"
        >
          Whether it's an intimate dinner for two or a family celebration, 
          we're ready to make your evening extraordinary. Reserve your seat 
          at Shiraz and experience Afghan hospitality at its finest.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.48, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/booking"
            className="min-w-[200px] px-10 py-4 text-xs tracking-[0.3em] uppercase bg-[#c2844b] text-[#0a0a0a] font-semibold hover:bg-[#d4976a] transition-colors duration-300 text-center"
          >
            Book a Table
          </Link>
          <a
            href="tel:+442000000000"
            className="min-w-[200px] px-10 py-4 text-xs tracking-[0.3em] uppercase border border-[#f7efe2]/30 text-[#f7efe2] hover:border-[#c2844b] hover:text-[#c2844b] transition-all duration-300 text-center"
          >
            Call Us
          </a>
        </motion.div>

        {/* Opening hours note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-8 text-[#c8bfb3]/60 text-xs tracking-widest"
        >
          Open daily · Monday – Sunday · 12:00 pm – 10:30 pm
        </motion.p>
      </div>
    </section>
  )
}
