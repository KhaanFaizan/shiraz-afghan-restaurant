import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import OptimizedImage from '../common/OptimizedImage'

const ease = [0.22, 1, 0.36, 1]

const gridVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
}

// ── Single item card ──────────────────────────────────────────────────────────
function ItemCard({ item }) {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative overflow-hidden aspect-[3/4] bg-[#111111]"
    >
      <OptimizedImage
        src={item.image}
        alt={item.name}
        className="transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.50) 38%, rgba(10,10,10,0.05) 72%, transparent 100%)',
        }}
      />

      {/* Hover darkening */}
      <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/22 transition-colors duration-500 pointer-events-none" />

      {/* Label */}
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <h4 className="font-display text-[#f7efe2] text-base sm:text-lg leading-tight">
          {item.name}
        </h4>
        <div
          className="h-px bg-[#c2844b] mt-2 w-6 group-hover:w-full"
          style={{ transition: 'width 500ms cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </div>
    </motion.div>
  )
}

// ── Category items view ───────────────────────────────────────────────────────
export default function CategoryItemsView({ category, onBack }) {
  return (
    <motion.div
      key={category.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease }}
    >
      {/*
        ── Sticky back bar ────────────────────────────────────────────────────────
        Sticks just below the main header (68px mobile / 80px desktop) so the
        back button remains visible no matter how far down the user scrolls.
      */}
      <div className="sticky top-[68px] md:top-[80px] z-30 bg-[#0f0d0b]/94 backdrop-blur-md border-b border-[#2a2a2a]/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

          {/* Back button — pill style */}
          <button
            onClick={onBack}
            aria-label="Back to all menu categories"
            className="group flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#2a2a2a] bg-[#111111]/80 text-[#c8bfb3] hover:border-[#c2844b]/50 hover:text-[#c2844b] hover:bg-[#1a1209]/80 transition-all duration-250"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
            />
            <span className="text-[11px] tracking-[0.35em] uppercase font-medium">
              Back to Menu
            </span>
          </button>

          {/* Category crumb — compact name on the right side */}
          <span className="text-[#c8bfb3]/40 text-[10px] tracking-[0.35em] uppercase truncate hidden sm:block">
            {category.label} &bull; {category.items.length}&nbsp;{category.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* ── Category header ─────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-10">
        <span className="text-[#c2844b] text-[10px] tracking-[0.55em] uppercase font-medium">
          Menu
        </span>

        <h2 className="font-display text-4xl md:text-5xl text-[#f7efe2] mt-3 mb-4 leading-tight">
          {category.label}
        </h2>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-px bg-[#c2844b]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#c2844b] shrink-0" />
          <div className="w-10 h-px bg-[#c2844b]" />
        </div>

        {category.description && (
          <p className="text-[#c8bfb3] leading-relaxed text-sm md:text-base max-w-xl">
            {category.description}
          </p>
        )}

        <p className="text-[#c8bfb3]/35 text-[10px] tracking-[0.4em] uppercase mt-3">
          {category.items.length}&nbsp;{category.items.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* ── Items grid — single observer, staggered cards ─────────────────── */}
      <div className="px-3 sm:px-4 lg:px-6 pb-6">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
        >
          {category.items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
