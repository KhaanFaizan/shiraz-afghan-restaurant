import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import AnimatedSection from '../common/AnimatedSection'
import SectionHeading from '../common/SectionHeading'
import OptimizedImage from '../common/OptimizedImage'
import CategoryItemsView from './CategoryItemsView'
import { menuCategories } from '../../data/menuData'

const ease = [0.22, 1, 0.36, 1]

// Single IntersectionObserver on the container; children inherit stagger
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

// ── Category card ─────────────────────────────────────────────────────────────
function CategoryCard({ item, onClick }) {
  return (
    <motion.button
      variants={cardVariants}
      onClick={() => onClick(item.id)}
      className="group relative overflow-hidden aspect-[3/4] bg-[#111111] w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2844b]"
      aria-label={`View ${item.label} menu`}
    >
      {/* Cover image — skeleton + fade-in via OptimizedImage */}
      <OptimizedImage
        src={item.coverImage}
        alt={item.label}
        className="transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Bottom gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.55) 35%, rgba(10,10,10,0.1) 70%, transparent 100%)',
        }}
      />

      {/* Hover darkening */}
      <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/28 transition-colors duration-500 pointer-events-none" />

      {/* Card text */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
        <h3 className="font-display text-[#f7efe2] text-xl leading-tight mb-1.5">
          {item.label}
        </h3>
        <p className="text-[#c8bfb3]/70 text-[10px] tracking-widest uppercase mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {item.items.length} {item.items.length === 1 ? 'item' : 'items'} — tap to view
        </p>
        {/* Expanding gold line */}
        <div
          className="h-px bg-[#c2844b] w-8 group-hover:w-full"
          style={{ transition: 'width 500ms cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </div>
    </motion.button>
  )
}

// ── All categories grid ───────────────────────────────────────────────────────
function CategoriesGrid({ onSelect }) {
  return (
    <motion.div
      key="categories"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease }}
    >
      {/* Heading */}
      <div className="max-w-3xl mx-auto px-6 mb-14">
        <SectionHeading
          label="Food &amp; Drink"
          title="The Shiraz Menu"
          subtitle="A curated journey through Afghanistan's most celebrated flavours. Tap any category to explore the full selection."
        />
      </div>

      {/* Grid — single whileInView observer on the container */}
      <div className="px-3 sm:px-4 lg:px-6">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
        >
          {menuCategories.map((item) => (
            <CategoryCard key={item.id} item={item} onClick={onSelect} />
          ))}
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <AnimatedSection delay={0.2} className="mt-14 flex justify-center px-6">
        <Link
          to="/booking"
          className="inline-flex items-center gap-3 px-10 py-3.5 text-xs tracking-[0.3em] uppercase border border-[#c2844b] text-[#c2844b] hover:bg-[#c2844b] hover:text-[#0a0a0a] transition-all duration-300"
        >
          Reserve Your Table
        </Link>
      </AnimatedSection>
    </motion.div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function MenuSection() {
  const [selectedId, setSelectedId] = useState(null)

  const selectedCategory = selectedId
    ? menuCategories.find(c => c.id === selectedId)
    : null

  return (
    <section id="menu" className="bg-[#0f0d0b] py-24 md:py-32">
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <CategoriesGrid key="grid" onSelect={setSelectedId} />
        ) : (
          <CategoryItemsView
            key={selectedId}
            category={selectedCategory}
            onBack={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
