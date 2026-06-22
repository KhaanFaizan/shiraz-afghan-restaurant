import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
        {/* Gradient glow */}
        <div
          aria-hidden
          className="absolute inset-0 bg-radial pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(194,132,75,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Decorative top line */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="absolute top-32 left-1/2 -translate-x-1/2 flex items-center gap-3"
        >
          <div className="w-12 h-px bg-[#c2844b]/40" />
          <span className="text-[#c2844b] text-[10px] tracking-[0.4em] uppercase">
            Est. 1995 · London
          </span>
          <div className="w-12 h-px bg-[#c2844b]/40" />
        </motion.div>

        {/* Main heading */}
        <div className="text-center px-6 z-10 space-y-6">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.25}
            className="text-[#c2844b] text-xs tracking-[0.5em] uppercase"
          >
            Afghan Cuisine
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="font-display text-[clamp(2.8rem,7vw,6rem)] text-[#f7efe2] leading-tight tracking-wide"
          >
            Shiraz
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.55}
            className="text-[#c8bfb3] text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            A journey through the flavours of Afghanistan — saffron, cardamom,
            pomegranate, and the warmth of a traditional hearth.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.7}
            className="flex items-center justify-center gap-4 pt-2"
          >
            <Link
              to="/booking"
              className="px-8 py-3 text-xs tracking-[0.25em] uppercase border border-[#c2844b] text-[#c2844b] hover:bg-[#c2844b] hover:text-[#0a0a0a] transition-all duration-300"
            >
              Reserve a Table
            </Link>
            <a
              href="#story"
              className="text-xs tracking-[0.25em] uppercase text-[#c8bfb3] hover:text-[#f7efe2] transition-colors"
            >
              Our Story
            </a>
          </motion.div>
        </div>

        {/* Scroll arrow */}
        <motion.a
          href="#story"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.0}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#c2844b]/60 hover:text-[#c2844b] transition-colors"
          aria-label="Scroll down"
        >
          <ArrowDown size={20} className="animate-bounce" />
        </motion.a>
      </section>

      {/* ── Our Story (placeholder) ── */}
      <section
        id="story"
        className="min-h-screen flex items-center justify-center bg-[#111111] px-6"
      >
        <div className="max-w-2xl text-center space-y-6">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[#c2844b] text-xs tracking-[0.4em] uppercase"
          >
            Our Story
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-4xl md:text-5xl text-[#f7efe2]"
          >
            Heritage Served with Fire
          </motion.h2>

          {/* Gold divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-[#c2844b]" />
            <div className="w-2 h-2 rotate-45 border border-[#c2844b]" />
            <div className="w-8 h-px bg-[#c2844b]" />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#c8bfb3] leading-relaxed text-base"
          >
            This section will tell the Shiraz story — the heritage, the family recipes,
            the journey from Kabul to London. Placeholder content — full UI coming soon.
          </motion.p>
        </div>
      </section>

      {/* ── Menu teaser (placeholder) ── */}
      <section className="min-h-screen flex items-center justify-center bg-[#0f0d0b] px-6">
        <div className="max-w-2xl text-center space-y-6">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[#c2844b] text-xs tracking-[0.4em] uppercase"
          >
            Food &amp; Drink
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-4xl md:text-5xl text-[#f7efe2]"
          >
            The Menu
          </motion.h2>

          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-[#c2844b]" />
            <div className="w-2 h-2 rotate-45 border border-[#c2844b]" />
            <div className="w-8 h-px bg-[#c2844b]" />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#c8bfb3] leading-relaxed text-base"
          >
            Full menu display coming soon — Kabuli Pulao, Mantu, Bolani, Kebabs,
            and more traditional Afghan dishes beautifully presented.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <Link
              to="/booking"
              className="inline-flex items-center px-8 py-3 text-xs tracking-[0.25em] uppercase border border-[#c2844b] text-[#c2844b] hover:bg-[#c2844b] hover:text-[#0a0a0a] transition-all duration-300"
            >
              Book a Table
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
