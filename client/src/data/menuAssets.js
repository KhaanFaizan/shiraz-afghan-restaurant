// ── Videos ─────────────────────────────────────────────────────────────────────
import heroVideoSrc from '../raw-assests/Horizontal_shiraz video background.mp4'
export const heroVideo = heroVideoSrc

// ── Story / About ──────────────────────────────────────────────────────────────
import storyImgSrc from '../raw-assests/hf_20260510_121510_5616e3ba-3a93-412a-86c2-b69024bba80c.png'
export const storyImage = storyImgSrc

// ── Reservation CTA background ─────────────────────────────────────────────────
import grillBgSrc from '../raw-assests/Main course/grilled kebabs with rice/grilled kebabs with rice.png'
export const imgGrillBg = grillBgSrc

// ── Menu category images ────────────────────────────────────────────────────────
import hummusSrc  from '../raw-assests/starters/hummus.png'
import chopanSrc  from '../raw-assests/Main course/shiraz special kebabs/Chopan kebab.png'
import grillSrc   from '../raw-assests/Main course/shiraz mix grill/Shiraz Mix Grill.png'
import karahiSrc  from '../raw-assests/Main course/Shiraz Karahis/full chicken karahi.png'
import biryaniSrc from '../raw-assests/Main course/Shiraz Biryani Special/Lamb Biryani.png'
import mantuSrc   from '../raw-assests/pasta dish/mantu.png'
import jalebiSrc  from '../raw-assests/Desserts/Afghani Jeelebe (4 Pcs).png'
import juiceSrc   from '../raw-assests/Drinks/Fresh Orange Juice.png'

// ──────────────────────────────────────────────────────────────────────────────
// Menu categories — ordered for display on the homepage
// ──────────────────────────────────────────────────────────────────────────────
export const menuCategories = [
  {
    id: 'starters',
    label: 'Starters',
    description: 'Hummus, olives, paneer tikka and seasonal sharing plates to begin.',
    image: hummusSrc,
  },
  {
    id: 'kebabs',
    label: 'Signature Kebabs',
    description: 'Marinated over charcoal — chopan, tikka, kofta and lamb chops.',
    image: chopanSrc,
  },
  {
    id: 'grill',
    label: 'Mixed Grill',
    description: 'A feast of our finest grilled meats served with fresh naan and salad.',
    image: grillSrc,
  },
  {
    id: 'karahi',
    label: 'Karahis',
    description: 'Slow-cooked in a traditional iron wok with tomatoes and fresh spices.',
    image: karahiSrc,
  },
  {
    id: 'biryani',
    label: 'Biryani',
    description: 'Fragrant basmati layered with tender lamb or chicken, slow-dum cooked.',
    image: biryaniSrc,
  },
  {
    id: 'pasta',
    label: 'Afghan Dumplings',
    description: 'Handmade Mantu and Ashak — Afghan comfort food at its finest.',
    image: mantuSrc,
  },
  {
    id: 'desserts',
    label: 'Desserts',
    description: 'Afghani Jalebi, Gulab Jamun, Kheer and seasonal Afghan sweets.',
    image: jalebiSrc,
  },
  {
    id: 'drinks',
    label: 'Fresh Drinks',
    description: 'Cold-pressed juices, lassi, shakes and house-made Afghan beverages.',
    image: juiceSrc,
  },
]
