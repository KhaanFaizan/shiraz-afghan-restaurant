// ─────────────────────────────────────────────────────────────────────────────
// Complete menu data built from the real raw-assests folder/subfolder structure.
// Each category maps to one or more source folders.
// Names are derived directly from filenames; only ambiguous exports are labelled manually.
// ─────────────────────────────────────────────────────────────────────────────

// ── Starters ── starters/
import img_hummus         from '../raw-assests/starters/hummus.png'
import img_olives         from '../raw-assests/starters/olives.png'
import img_paneerTikka    from '../raw-assests/starters/paneer tikka.png'
import img_chiliPaneer    from '../raw-assests/starters/Chili paneer.png'
import img_yogurtCuke     from '../raw-assests/starters/yogurt with cucumber.png'

// ── Sides used as starters ── Sides/
import img_chips          from '../raw-assests/Sides/chips.png'
import img_salad          from '../raw-assests/Sides/shiraz special salad.png'
import img_rice           from '../raw-assests/Sides/Rice.png'

// ── Signature Kebabs ── Main course/shiraz special kebabs/
import img_afgLambTikka   from '../raw-assests/Main course/shiraz special kebabs/afghan lamb tikka kebab.png'
import img_chickenWings   from '../raw-assests/Main course/shiraz special kebabs/Chicken Wings 10pcs.png'
import img_chickenTikka   from '../raw-assests/Main course/shiraz special kebabs/Chicken_Tikka.png'
import img_chopan         from '../raw-assests/Main course/shiraz special kebabs/Chopan kebab.png'
import img_grilledChicken from '../raw-assests/Main course/shiraz special kebabs/Grilled chicken.png'
import img_lambChops      from '../raw-assests/Main course/shiraz special kebabs/Lamb Chops (4pcs).png'
import img_lambKofta      from '../raw-assests/Main course/shiraz special kebabs/Lamb Kofta Kebab.png'
import img_lambRibs       from '../raw-assests/Main course/shiraz special kebabs/lamb ribs.png'
import img_peshChapli     from '../raw-assests/Main course/shiraz special kebabs/peshawari chapli kebab.png'

// ── Mixed Grill ── Main course/shiraz mix grill/ + grilled kebabs with rice/ + Seafood/
import img_mixGrill       from '../raw-assests/Main course/shiraz mix grill/Shiraz Mix Grill.png'
import img_fullHalfRice   from '../raw-assests/Main course/grilled kebabs with rice/Full Chicken & Half chicken with rice.png'
import img_grillKebabRice from '../raw-assests/Main course/grilled kebabs with rice/grilled kebabs with rice.png'
import img_lambRibsRice   from '../raw-assests/Main course/grilled kebabs with rice/lamb ribs with rice.png'
import img_namkinLamb     from '../raw-assests/Main course/grilled kebabs with rice/Namkin Lamb Chops with rice.png'
import img_grilledFish    from '../raw-assests/Main course/Shiraz Seafood Special/Grilled Fish_(Seabass).png'
import img_kingPrawn      from '../raw-assests/Main course/Shiraz Seafood Special/King Prawn.png'
import img_masalaFish     from '../raw-assests/Main course/Shiraz Seafood Special/Masala Fish_(Seabass).png'

// ── Karahis & Curries ── Shiraz Karahis/ + Curry dishes/
import img_chickenKarahi  from '../raw-assests/Main course/Shiraz Karahis/full chicken karahi.png'
import img_namakMandi     from '../raw-assests/Main course/Shiraz Karahis/Namak Mandi Style Karahi.png'
import img_jalfrezi       from '../raw-assests/Main course/Curry dishes/Chicken Jalfrezi.png'
import img_koftaCurry     from '../raw-assests/Main course/Curry dishes/Kofta Curry.png'
import img_nihari         from '../raw-assests/Main course/Curry dishes/nihari.png'
import img_spinach        from '../raw-assests/Main course/Curry dishes/Spinach (sabzi).png'
import img_tarakaDaal     from '../raw-assests/Main course/Curry dishes/Taraka Daal.png'

// ── Biryani ── Shiraz Biryani Special/
import img_chickenBiryani from '../raw-assests/Main course/Shiraz Biryani Special/Chicken Biryani.png'
import img_lambBiryani    from '../raw-assests/Main course/Shiraz Biryani Special/Lamb Biryani.png'

// ── Afghan Dumplings & Kitchen ── pasta dish/ + afghan main course/ + Naans/
import img_mantu          from '../raw-assests/pasta dish/mantu.png'
import img_ashak          from '../raw-assests/pasta dish/Ashak.png'
import img_bandjanBorani  from '../raw-assests/Main course/afghan main course/Bandjan Borani.png'
import img_chapliFamily   from '../raw-assests/Main course/afghan main course/peshawari Chapli kebab (family deal).png'
import img_afgSpeciality  from '../raw-assests/Main course/afghan main course/Unknown-18.png'
import img_naan           from '../raw-assests/Main course/Naans/SHIRAZ FIRST EXPORT-123.png'

// ── Desserts ── Desserts/
import img_jalebi         from '../raw-assests/Desserts/Afghani Jeelebe (4 Pcs).png'
import img_gulabJamun     from '../raw-assests/Desserts/Gulab Jamun (4 Pcs).png'
import img_kheer          from '../raw-assests/Desserts/Kheer.png'
import img_sheeryakh      from '../raw-assests/Desserts/Sheeryakh.png'

// ── Drinks ── Drinks/
import img_freshOJ        from '../raw-assests/Drinks/Fresh Orange Juice.png'
import img_houseSelection from '../raw-assests/Drinks/SHIRAZ FIRST EXPORT-117.png'

// ─────────────────────────────────────────────────────────────────────────────
// Category definitions
// ─────────────────────────────────────────────────────────────────────────────
export const menuCategories = [
  {
    id: 'starters',
    label: 'Starters',
    coverImage: img_hummus,
    description: 'Light bites, dips and sharing plates to begin your Afghan dining experience.',
    items: [
      { id: 's1', name: 'Hummus',                 image: img_hummus      },
      { id: 's2', name: 'Olives',                  image: img_olives      },
      { id: 's3', name: 'Paneer Tikka',            image: img_paneerTikka },
      { id: 's4', name: 'Chili Paneer',            image: img_chiliPaneer },
      { id: 's5', name: 'Yogurt with Cucumber',    image: img_yogurtCuke  },
      { id: 's6', name: 'Chips',                   image: img_chips       },
      { id: 's7', name: 'Shiraz Special Salad',    image: img_salad       },
    ],
  },
  {
    id: 'kebabs',
    label: 'Signature Kebabs',
    coverImage: img_chopan,
    description: 'Marinated overnight and grilled over charcoal — the heart of Afghan cuisine.',
    items: [
      { id: 'k1', name: 'Afghan Lamb Tikka Kebab',  image: img_afgLambTikka   },
      { id: 'k2', name: 'Chicken Wings (10 pcs)',   image: img_chickenWings   },
      { id: 'k3', name: 'Chicken Tikka',            image: img_chickenTikka   },
      { id: 'k4', name: 'Chopan Kebab',             image: img_chopan         },
      { id: 'k5', name: 'Grilled Chicken',          image: img_grilledChicken },
      { id: 'k6', name: 'Lamb Chops (4 pcs)',       image: img_lambChops      },
      { id: 'k7', name: 'Lamb Kofta Kebab',         image: img_lambKofta      },
      { id: 'k8', name: 'Lamb Ribs',                image: img_lambRibs       },
      { id: 'k9', name: 'Peshawari Chapli Kebab',   image: img_peshChapli     },
    ],
  },
  {
    id: 'grill',
    label: 'Mixed Grill',
    coverImage: img_mixGrill,
    description: 'A feast of flame and flavour — platters, grills and fresh-caught seafood.',
    items: [
      { id: 'g1', name: 'Shiraz Mix Grill',                   image: img_mixGrill       },
      { id: 'g2', name: 'Full & Half Chicken with Rice',       image: img_fullHalfRice   },
      { id: 'g3', name: 'Grilled Kebabs with Rice',            image: img_grillKebabRice },
      { id: 'g4', name: 'Lamb Ribs with Rice',                 image: img_lambRibsRice   },
      { id: 'g5', name: 'Namkin Lamb Chops with Rice',         image: img_namkinLamb     },
      { id: 'g6', name: 'Grilled Fish (Seabass)',              image: img_grilledFish    },
      { id: 'g7', name: 'King Prawn',                          image: img_kingPrawn      },
      { id: 'g8', name: 'Masala Fish (Seabass)',               image: img_masalaFish     },
    ],
  },
  {
    id: 'karahi',
    label: 'Karahis',
    coverImage: img_chickenKarahi,
    description: 'Slow-cooked in a traditional iron wok with tomatoes, ginger and fresh spices.',
    items: [
      { id: 'ka1', name: 'Full Chicken Karahi',       image: img_chickenKarahi },
      { id: 'ka2', name: 'Namak Mandi Style Karahi',  image: img_namakMandi    },
      { id: 'ka3', name: 'Chicken Jalfrezi',           image: img_jalfrezi      },
      { id: 'ka4', name: 'Kofta Curry',               image: img_koftaCurry    },
      { id: 'ka5', name: 'Nihari',                     image: img_nihari        },
      { id: 'ka6', name: 'Spinach (Sabzi)',            image: img_spinach       },
      { id: 'ka7', name: 'Taraka Daal',               image: img_tarakaDaal    },
    ],
  },
  {
    id: 'biryani',
    label: 'Biryani',
    coverImage: img_lambBiryani,
    description: 'Fragrant basmati rice slow-cooked with tender meat and aromatic whole spices.',
    items: [
      { id: 'b1', name: 'Chicken Biryani', image: img_chickenBiryani },
      { id: 'b2', name: 'Lamb Biryani',    image: img_lambBiryani    },
      { id: 'b3', name: 'Rice',            image: img_rice           },
    ],
  },
  {
    id: 'pasta',
    label: 'Afghan Dumplings',
    coverImage: img_mantu,
    description: 'Handmade Afghan dumplings, classic dishes and fresh naan from our kitchen.',
    items: [
      { id: 'p1', name: 'Mantu',                              image: img_mantu         },
      { id: 'p2', name: 'Ashak',                              image: img_ashak         },
      { id: 'p3', name: 'Bandjan Borani',                     image: img_bandjanBorani },
      { id: 'p4', name: 'Peshawari Chapli Kebab (Family)',    image: img_chapliFamily  },
      { id: 'p5', name: 'Afghan Speciality',                  image: img_afgSpeciality },
      { id: 'p6', name: 'Fresh Naan',                         image: img_naan          },
    ],
  },
  {
    id: 'desserts',
    label: 'Desserts',
    coverImage: img_jalebi,
    description: 'Traditional Afghan sweets and delicacies to complete your meal.',
    items: [
      { id: 'd1', name: 'Afghani Jalebi (4 pcs)', image: img_jalebi    },
      { id: 'd2', name: 'Gulab Jamun (4 pcs)',    image: img_gulabJamun },
      { id: 'd3', name: 'Kheer',                  image: img_kheer      },
      { id: 'd4', name: 'Sheeryakh',              image: img_sheeryakh  },
    ],
  },
  {
    id: 'drinks',
    label: 'Fresh Drinks',
    coverImage: img_freshOJ,
    description: 'Cold-pressed juices and house-made beverages to refresh and complement your meal.',
    items: [
      { id: 'dr1', name: 'Fresh Orange Juice', image: img_freshOJ        },
      { id: 'dr2', name: 'House Selection',    image: img_houseSelection  },
    ],
  },
]
