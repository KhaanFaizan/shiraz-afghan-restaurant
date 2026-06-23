import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import AnimatedSection from '../common/AnimatedSection'
import OptimizedImage from '../common/OptimizedImage'
import { storyImage } from '../../data/menuAssets'

// Value card images — directly from their category subfolders
import naanImg   from '../../raw-assests/Main course/Naans/SHIRAZ FIRST EXPORT-123.png'
import hummusImg from '../../raw-assests/starters/hummus.png'
import chopanImg from '../../raw-assests/Main course/shiraz special kebabs/Chopan kebab.png'

const ease = [0.22, 1, 0.36, 1]

const STORY_PARAS = [
  `For over two decades, Shiraz has been a sanctuary for Afghan cuisine in the heart of London. Born from family traditions carried across continents, every dish we serve traces back to the open charcoal grills of Kabul, the aromatic spice markets of Kandahar, and the warm hearths of Afghan homes.`,
  `From slow-cooked Karahis and fragrant Biryanis to handmade Mantu dumplings and crisp-grilled kebabs — our kitchen honours the soul of Afghan hospitality: mehmani, the timeless art of welcoming every guest as family.`,
  `We source our spices fresh, marinate overnight, and cook with patience. The result is food that carries memory, culture, and warmth in every bite.`,
]

const STATS = [
  { num: '28+',    label: 'Years of Heritage'  },
  { num: '100%',   label: 'Family Recipes'     },
  { num: '1000s',  label: 'Guests Welcomed'    },
  { num: '★★★★★', label: 'Afghan Hospitality'  },
]

const VALUES = [
  {
    image: naanImg,
    title: 'Heritage & Tradition',
    desc:  'Recipes passed through generations, carrying the soul of Afghan cuisine from Kabul to London.',
  },
  {
    image: hummusImg,
    title: 'Afghan Hospitality',
    desc:  'Mehmani — the art of welcoming every guest as family. Warmth is served with every plate.',
  },
  {
    image: chopanImg,
    title: 'Fire & Craft',
    desc:  'Overnight marinades, charcoal grills, and slow-cooked perfection. Craft behind every flame.',
  },
]

function GoldDivider({ center = false }) {
  return (
    <div className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
      <div className="w-10 h-px bg-[#c2844b]" />
      <div className="w-1.5 h-1.5 rotate-45 bg-[#c2844b] shrink-0" />
      <div className="w-10 h-px bg-[#c2844b]" />
    </div>
  )
}

function ValueCard({ card, index }) {
  const ref   = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease }}
      className="group relative overflow-hidden aspect-[4/3] bg-[#111111]"
    >
      <OptimizedImage
        src={card.image}
        alt={card.title}
        className="transition-transform duration-700 group-hover:scale-105"
      />

      {/* Heavy overlay for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.78) 45%, rgba(10,10,10,0.35) 100%)',
        }}
      />

      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
        <div
          className="h-px bg-[#c2844b] mb-4 w-6 group-hover:w-14"
          style={{ transition: 'width 450ms cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
        <h3 className="font-display text-[#f7efe2] text-lg sm:text-xl leading-tight mb-2">
          {card.title}
        </h3>
        <p className="text-[#c8bfb3] text-sm leading-relaxed">
          {card.desc}
        </p>
      </div>
    </motion.div>
  )
}

export default function StorySection() {
  return (
    <section id="story" className="bg-[#0a0a0a] overflow-hidden">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Part 1 — Banner with headline + stat grid                           */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <div className="relative border-b border-[#2a2a2a]/40">
        {/* Ambient warm glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 55% 70% at 25% 50%, rgba(194,132,75,0.06) 0%, transparent 65%)',
          }}
        />

        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: headline */}
          <div className="space-y-6">
            <AnimatedSection>
              <span className="text-[#c2844b] text-[10px] tracking-[0.6em] uppercase font-medium">
                Our Story
              </span>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] text-[#f7efe2] leading-[1.05]">
                Heritage<br />Served with Fire
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.18}>
              <GoldDivider />
            </AnimatedSection>
            <AnimatedSection delay={0.26}>
              <p className="text-[#c8bfb3] text-base leading-[1.8] max-w-md">
                Two decades of Afghan culinary tradition in the heart of London — where every dish
                carries the warmth of a thousand family tables.
              </p>
            </AnimatedSection>
          </div>

          {/* Right: stat cards grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {STATS.map(({ num, label }, i) => (
              <AnimatedSection key={label} delay={0.12 + i * 0.07}>
                <div className="border border-[#2a2a2a] p-5 hover:border-[#c2844b]/30 transition-colors duration-300 group">
                  <p className="font-display text-2xl sm:text-3xl text-[#c2844b] leading-none group-hover:text-[#d4976a] transition-colors duration-300">
                    {num}
                  </p>
                  <p className="text-[#c8bfb3]/70 text-[10px] tracking-widest uppercase mt-2">
                    {label}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Part 2 — Split: image left, story text right                        */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Image */}
          <AnimatedSection direction="right" className="order-2 lg:order-1">
            <div className="relative">
              <div className="relative overflow-hidden aspect-[4/5] max-w-sm mx-auto lg:max-w-none bg-[#111111]">
                <OptimizedImage
                  src={storyImage}
                  alt="Afghan culinary tradition at Shiraz Restaurant"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(10,10,10,0.12) 0%, transparent 50%, rgba(10,10,10,0.18) 100%)',
                  }}
                />
              </div>
              {/* Decorative offset borders */}
              <div aria-hidden className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border border-[#c2844b]/18 pointer-events-none hidden lg:block" />
              <div aria-hidden className="absolute -top-4 -left-4 w-1/3 h-1/3 border border-[#c2844b]/10 pointer-events-none hidden lg:block" />
              {/* Floating stat */}
              <div className="absolute bottom-6 -right-2 lg:-right-8 bg-[#111111] border border-[#2a2a2a] px-5 py-4 hidden sm:block">
                <p className="font-display text-3xl text-[#c2844b]">28+</p>
                <p className="text-[#c8bfb3] text-[10px] tracking-widest uppercase mt-1">Years of Heritage</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Text */}
          <div className="order-1 lg:order-2 space-y-7">
            <AnimatedSection>
              <span className="text-[#c2844b] text-[10px] tracking-[0.55em] uppercase font-medium">
                Our Kitchen
              </span>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <h3 className="font-display text-[clamp(1.9rem,3.5vw,3rem)] text-[#f7efe2] leading-tight">
                The Flavours of<br />Afghanistan
              </h3>
            </AnimatedSection>
            <AnimatedSection delay={0.17}>
              <GoldDivider />
            </AnimatedSection>

            <div className="space-y-5 pt-1">
              {STORY_PARAS.map((para, i) => (
                <AnimatedSection key={i} delay={0.22 + i * 0.1}>
                  <p className="text-[#c8bfb3] text-[0.95rem] leading-[1.9]">
                    {para}
                  </p>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.58}>
              <div className="flex items-center gap-4 pt-2">
                <div className="w-8 h-px bg-[#c2844b]" />
                <span className="text-[#c2844b] text-[10px] tracking-[0.45em] uppercase">
                  Authentic · Traditional · Unforgettable
                </span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Part 3 — Value cards                                                */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <div className="border-t border-[#2a2a2a]/40 py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-6 text-center mb-12 space-y-4">
          <AnimatedSection>
            <span className="text-[#c2844b] text-[10px] tracking-[0.55em] uppercase font-medium">
              What We Stand For
            </span>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h3 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-[#f7efe2]">
              Our Values
            </h3>
          </AnimatedSection>
          <AnimatedSection delay={0.17}>
            <GoldDivider center />
          </AnimatedSection>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {VALUES.map((card, i) => (
              <ValueCard key={i} card={card} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Part 4 — Quote callout                                              */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <div className="border-t border-[#2a2a2a]/40 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimatedSection>
            <div
              aria-hidden="true"
              className="font-display text-[6rem] md:text-[7rem] text-[#c2844b]/15 leading-none select-none"
            >
              "
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <blockquote className="font-display text-[clamp(1.25rem,2.8vw,2rem)] text-[#f7efe2] italic leading-[1.55] -mt-6">
              Every meal at Shiraz is served with warmth, patience,
              and the spirit of Afghan hospitality.
            </blockquote>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="w-10 h-px bg-[#c2844b]/40" />
              <span className="text-[#c2844b] text-[10px] tracking-[0.5em] uppercase">
                Shiraz Afghan Restaurant · London
              </span>
              <div className="w-10 h-px bg-[#c2844b]/40" />
            </div>
          </AnimatedSection>
        </div>
      </div>

    </section>
  )
}
