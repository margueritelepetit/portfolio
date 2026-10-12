/*
  ─────────────────────────────────────────────────────────────
  SITE CONTENT — everything the site shows comes from this file.

  PROJECTS are listed in the order they appear (and are numbered).
  Each project uses one of three page templates:
    "series" — photography: fixed text column + editorial image flow
    "film"   — videography: full-screen video, then the editorial grid
    "case"   — digital / branding: case study with sections
  Images live in assets/<slug>/ ; w/h are the image's pixel size.
  Videos currently stream from Cargo (freight.cargo.site). To move
  them to Vimeo, replace the URL with a direct video file URL.
  ─────────────────────────────────────────────────────────────
*/

const SITE = {
  "name": "Marguerite Le Petit",
  "disciplines": [
    "Image production",
    "Art direction",
    "Digital project management"
  ],
  "statement": [
    "What began as childhood curiosity has grown into a practice centred on editorial, fashion and artistic storytelling. Today I bridge my background in photography with my training as a digital project manager. To me, a photograph is more than a composition — it is a vessel for feeling and meaning.",
    "Bringing visual craft and digital strategy together lets me approach every project with a dual perspective: the sensitivity of an artist and the structure of a project lead. Whether it is a high-fashion editorial or a brand campaign, my intention stays the same — to work with deep human consideration."
  ],
  "education": [
    [
      "Penninghen",
      "Preparatory year"
    ],
    [
      "EFET",
      "Bachelor's degree in photography"
    ],
    [
      "ESD",
      "Third year, in progress — digital project management"
    ]
  ],
  "occupation": [
    [
      "Student",
      "Digital project manager"
    ],
    [
      "Freelance",
      "Photography — videography"
    ]
  ],
  "email": "margueritelepetit1@gmail.com",
  "location": "Paris",
  "socials": [
    {
      "label": "Instagram",
      "handle": "@margueritelfabre",
      "url": "https://www.instagram.com/margueritelfabre/"
    }
  ]
};

const CATEGORIES = {
  "photography": "Photography",
  "videography": "Videography",
  "digital": "Digital / Branding"
};

const PROJECTS = [
  {
    "slug": "rooting-mother",
    "title": "Rooting Mother",
    "category": "photography",
    "template": "series",
    "cover": {
      "src": "assets/rooting-mother/cover.jpg",
      "w": 800,
      "h": 1201
    },
    "thumb": {"src": "assets/rooting-mother/thumb.jpg", "w": 799, "h": 1200, "frame": [22, 0.8], "focus": "50% 30%"},
    "subtitle": "Mother's roots",
    "meta": [
      [
        "Category",
        "Photography"
      ],
      [
        "Type",
        "Personal series"
      ],
      [
        "Role",
        "Photography"
      ]
    ],
    "text": [
      "There is a specific kind of grief in watching someone who cannot get better.",
      "In a studio turned parlour, I set aside the mother I had hoped for and turned to the woman who is actually there. These photographs depict a harsh reality: a bond built on trust and vulnerability, yet shadowed by the lasting scars of addiction, grief and time.",
      "The camera opened a rare, silent space. It let me reach her in a way that bypassed her usual instability, offering a stillness our shared history has never had. She never posed and I never directed — the lens simply followed a woman unfolding, in all her complexity, through an honest conversation.",
      "I am documenting the woman who brought me into this world, and acknowledging both the beauty and the tragedy of her many faces."
    ],
    "media": [
      {
        "src": "assets/rooting-mother/01.jpg",
        "w": 1181,
        "h": 1773
      },
      {
        "src": "assets/rooting-mother/02.jpg",
        "w": 1400,
        "h": 2100
      },
      {
        "src": "assets/rooting-mother/03.jpg",
        "w": 1185,
        "h": 1659
      },
      {
        "src": "assets/rooting-mother/04.jpg",
        "w": 1400,
        "h": 2100
      },
      {
        "src": "assets/rooting-mother/05.jpg",
        "w": 2000,
        "h": 1333
      },
      {
        "src": "assets/rooting-mother/06.jpg",
        "w": 1400,
        "h": 2101
      }
    ]
  },
  {
    "slug": "beau",
    "title": "Beau",
    "category": "photography",
    "template": "series",
    "cover": {
      "src": "assets/beau/cover.jpg",
      "w": 609,
      "h": 914
    },
    "thumb": {"src": "assets/beau/thumb.jpg", "w": 800, "h": 1200, "frame": [27, 1], "focus": "50% 18%"},
    "subtitle": "A study of form",
    "meta": [
      [
        "Category",
        "Photography"
      ],
      [
        "Type",
        "Fashion / fine art"
      ],
      [
        "Role",
        "Photography"
      ]
    ],
    "text": [
      "Beau explores the complete erasure of the individual in favour of form. Merged with an oversized, hand-sculpted bow — crafted from repurposed curtains — the body stops being a person and becomes a foundation for the garment.",
      "The elusive quality of the series comes from the play of light and shadow: the subject does not simply wear the piece but melts into its graphic structure. It is a study of enforced anonymity, where identity is given up to achieve a single, monolithic silhouette."
    ],
    "media": [
      {
        "src": "assets/beau/01.jpg",
        "w": 1400,
        "h": 2100
      },
      {
        "src": "assets/beau/02.jpg",
        "w": 609,
        "h": 914
      },
      {
        "src": "assets/beau/03.jpg",
        "w": 1400,
        "h": 2100
      },
      {
        "src": "assets/beau/04.jpg",
        "w": 715,
        "h": 1073
      }
    ]
  },
  {
    "slug": "tech-archives",
    "title": "Tech Archives",
    "category": "photography",
    "template": "series",
    "cover": {
      "src": "assets/tech-archives/cover.jpg",
      "w": 800,
      "h": 1200
    },
    "thumb": {"src": "assets/tech-archives/thumb.jpg", "w": 1200, "h": 800, "frame": [36, 1.5], "focus": "50% 50%"},
    "subtitle": "A documentation of sound through sight",
    "meta": [
      [
        "Category",
        "Photography"
      ],
      [
        "Type",
        "Documentary"
      ],
      [
        "Subject",
        "DJ collective"
      ],
      [
        "Role",
        "Photography"
      ]
    ],
    "text": [
      "For several months I immersed myself in a DJ collective, with complete artistic freedom to document the pulse of their movement. Tech Archives is the result: a raw, unfiltered look at what happens when the music takes over.",
      "Beyond the decks and the speakers, the series looks at the human experience of nightlife — at liberation and the search for a safe space. In the darkness of the club boundaries dissolve, and people lose themselves only to find themselves again.",
      "Shot entirely in black and white, it strips away neon and strobe to focus on what matters: sweat, tension, collective euphoria and fleeting moments of pure presence."
    ],
    "quote": "A documentation of sound through sight — capturing the soul of the rave.",
    "media": [
      {
        "src": "assets/tech-archives/01.jpg",
        "w": 1400,
        "h": 2100
      },
      {
        "src": "assets/tech-archives/02.jpg",
        "w": 1080,
        "h": 608
      },
      {
        "src": "assets/tech-archives/03.jpg",
        "w": 1976,
        "h": 1317
      },
      {
        "src": "assets/tech-archives/04.jpg",
        "w": 711,
        "h": 1067
      },
      {
        "src": "assets/tech-archives/05.jpg",
        "w": 2000,
        "h": 1333
      },
      {
        "src": "assets/tech-archives/06.jpg",
        "w": 2000,
        "h": 1125
      },
      {
        "src": "assets/tech-archives/07.jpg",
        "w": 1400,
        "h": 2100
      },
      {
        "src": "assets/tech-archives/08.jpg",
        "w": 1400,
        "h": 1400
      },
      {
        "src": "assets/tech-archives/09.jpg",
        "w": 1080,
        "h": 1349
      },
      {
        "src": "assets/tech-archives/10.jpg",
        "w": 1080,
        "h": 1350
      },
      {
        "src": "assets/tech-archives/11.jpg",
        "w": 1080,
        "h": 1350
      },
      {
        "src": "assets/tech-archives/12.jpg",
        "w": 1080,
        "h": 1350
      },
      {
        "src": "assets/tech-archives/13.jpg",
        "w": 1080,
        "h": 1350
      }
    ]
  },
  {
    "slug": "ghorba-club",
    "title": "Ghorba Club",
    "category": "photography",
    "template": "series",
    "cover": {
      "src": "assets/ghorba-club/cover.jpg",
      "w": 800,
      "h": 1200
    },
    "thumb": {"src": "assets/ghorba-club/thumb.jpg", "w": 800, "h": 1200, "frame": [17, 0.6667], "focus": "50% 50%"},
    "subtitle": "Against boxes",
    "meta": [
      [
        "Category",
        "Photography"
      ],
      [
        "Type",
        "Brand campaign"
      ],
      [
        "Client",
        "Ghorba"
      ],
      [
        "Role",
        "Photography"
      ]
    ],
    "text": [
      "Ghorba takes its name from a word that resists translation. In Arabic it evokes exile — an exile that brings people closer rather than pulling them apart; a tension between what is left behind and what is being built. Perhaps the most beautiful starting point a house could have.",
      "Since 2023 the brand has been doing what no one else was: dressing the diaspora with the same exacting standards they apply to their own lives. No folklore, no clichés — Ghorba speaks to those who never had to choose between here and there.",
      "Against boxes. For the freedom to be everything we are, all at once."
    ],
    "media": [
      {
        "src": "assets/ghorba-club/01.jpg",
        "w": 1080,
        "h": 1440
      },
      {
        "src": "assets/ghorba-club/02.jpg",
        "w": 1080,
        "h": 1440
      },
      {
        "src": "assets/ghorba-club/03.jpg",
        "w": 1080,
        "h": 1440
      },
      {
        "src": "assets/ghorba-club/04.jpg",
        "w": 1080,
        "h": 1440
      },
      {
        "src": "assets/ghorba-club/05.jpg",
        "w": 1080,
        "h": 1440
      },
      {
        "src": "assets/ghorba-club/06.jpg",
        "w": 1080,
        "h": 1440
      },
      {
        "src": "assets/ghorba-club/07.jpg",
        "w": 1080,
        "h": 1440
      },
      {
        "src": "assets/ghorba-club/08.jpg",
        "w": 1080,
        "h": 1440
      },
      {
        "src": "assets/ghorba-club/09.jpg",
        "w": 1080,
        "h": 1440
      },
      {
        "src": "assets/ghorba-club/10.jpg",
        "w": 1080,
        "h": 1440
      },
      {
        "src": "assets/ghorba-club/11.jpg",
        "w": 2000,
        "h": 1066
      }
    ]
  },
  {
    "slug": "nothing-changed",
    "title": "Nothing Changed",
    "category": "videography",
    "template": "film",
    "cover": {
      "src": "assets/nothing-changed/cover.jpg",
      "w": 1100,
      "h": 718
    },
    "thumb": {"src": "assets/nothing-changed/thumb.jpg", "w": 1200, "h": 783, "frame": [40, 1.7778], "focus": "50% 45%"},
    "video": {
      "src": "https://freight.cargo.site/m/O2841332771117651242101057786029/NOTHING-CHANGED-web-.mp4",
      "poster": "assets/nothing-changed/cover.jpg"
    },
    "subtitle": "Fashion editorial",
    "meta": [
      [
        "Category",
        "Videography"
      ],
      [
        "Type",
        "Fashion editorial"
      ],
      [
        "Roles",
        "Videographer / Editor, Music composer"
      ],
      [
        "Press",
        "Featured in Vanguard Magazine"
      ]
    ],
    "text": [
      "Nothing Changed explores the anatomy of a lingering absence, and a silence that grows deafening. Between raw nostalgia and exposed vulnerability, the images capture a shared solitude in which bodies become echoes of what once was.",
      "It is an immersion into the intimacy of the void, where love dissolves into a distant idea and every gaze becomes a desperate attempt not to disappear from the frame."
    ],
    "media": [
      {
        "src": "assets/nothing-changed/01.jpg",
        "w": 1400,
        "h": 1960
      },
      {
        "src": "assets/nothing-changed/02.jpg",
        "w": 1400,
        "h": 1960
      },
      {
        "src": "assets/nothing-changed/03.jpg",
        "w": 1400,
        "h": 1960
      },
      {
        "src": "assets/nothing-changed/04.jpg",
        "w": 1400,
        "h": 1960
      },
      {
        "src": "assets/nothing-changed/05.jpg",
        "w": 1400,
        "h": 1960
      },
      {
        "src": "assets/nothing-changed/06.jpg",
        "w": 941,
        "h": 1318
      },
      {
        "src": "assets/nothing-changed/07.jpg",
        "w": 1020,
        "h": 1251
      },
      {
        "src": "assets/nothing-changed/08.jpg",
        "w": 1400,
        "h": 2104
      },
      {
        "src": "assets/nothing-changed/09.jpg",
        "w": 1020,
        "h": 1251
      },
      {
        "src": "assets/nothing-changed/10.jpg",
        "w": 1400,
        "h": 1987
      },
      {
        "src": "assets/nothing-changed/11.jpg",
        "w": 1020,
        "h": 1251
      },
      {
        "src": "assets/nothing-changed/12.jpg",
        "w": 2000,
        "h": 1265
      },
      {
        "src": "assets/nothing-changed/13.jpg",
        "w": 2000,
        "h": 1347
      },
      {
        "src": "assets/nothing-changed/14.jpg",
        "w": 1400,
        "h": 2104
      },
      {
        "src": "assets/nothing-changed/15.jpg",
        "w": 2000,
        "h": 1306
      },
      {
        "src": "assets/nothing-changed/16.jpg",
        "w": 2000,
        "h": 1331
      },
      {
        "src": "assets/nothing-changed/17.jpg",
        "w": 1400,
        "h": 2186
      }
    ]
  },
  {
    "slug": "2-much",
    "title": "2 Much",
    "category": "videography",
    "template": "film",
    "cover": {
      "src": "assets/2-much/cover.jpg",
      "w": 1100,
      "h": 619
    },
    "thumb": {"src": "assets/2-much/thumb.jpg", "w": 798, "h": 1200, "frame": [20, 0.75], "focus": "50% 35%"},
    "video": {
      "src": "https://freight.cargo.site/m/V2841251704613423060336496873645/2MUCH_WEB.mp4",
      "poster": "assets/2-much/cover.jpg"
    },
    "subtitle": "Fashion editorial",
    "meta": [
      [
        "Category",
        "Videography"
      ],
      [
        "Type",
        "Fashion editorial"
      ],
      [
        "Roles",
        "Videographer / Editor, Technician"
      ],
      [
        "Press",
        "Featured in PAP Magazine"
      ]
    ],
    "text": [
      "2 Much tells the story of a generation unafraid to express itself — too free to be contained, too expressive to be silenced, too multifaceted to be locked away.",
      "Its silhouettes move between bruised romanticism, punk energy and utilitarian details that anchor the chaos in reality. Together they map a territory where identities overlap, collide and embrace — without asking for forgiveness."
    ],
    "media": [
      {
        "src": "assets/2-much/01.jpg",
        "w": 2000,
        "h": 1331
      },
      {
        "src": "assets/2-much/02.jpg",
        "w": 2000,
        "h": 1331
      },
      {
        "src": "assets/2-much/03.jpg",
        "w": 2000,
        "h": 1331
      },
      {
        "src": "assets/2-much/04.jpg",
        "w": 2000,
        "h": 1331
      },
      {
        "src": "assets/2-much/05.jpg",
        "w": 2000,
        "h": 1331
      },
      {
        "src": "assets/2-much/06.jpg",
        "w": 1400,
        "h": 2104
      },
      {
        "src": "assets/2-much/07.jpg",
        "w": 2000,
        "h": 1331
      },
      {
        "src": "assets/2-much/08.jpg",
        "w": 1400,
        "h": 2104
      },
      {
        "src": "assets/2-much/09.jpg",
        "w": 2000,
        "h": 1331
      },
      {
        "src": "assets/2-much/10.jpg",
        "w": 1400,
        "h": 2104
      },
      {
        "src": "assets/2-much/11.jpg",
        "w": 2000,
        "h": 1331
      },
      {
        "src": "assets/2-much/12.jpg",
        "w": 2000,
        "h": 1125
      },
      {
        "src": "assets/2-much/13.jpg",
        "w": 2000,
        "h": 1331
      },
      {
        "src": "assets/2-much/14.jpg",
        "w": 1400,
        "h": 2104
      },
      {
        "src": "assets/2-much/15.jpg",
        "w": 2000,
        "h": 1125
      }
    ]
  },
  {
    "slug": "oxy",
    "title": "Oxy",
    "category": "digital",
    "template": "case",
    "cover": {
      "src": "assets/oxy/cover.jpg",
      "w": 800,
      "h": 1199
    },
    "thumb": {"src": "assets/oxy/thumb.jpg", "w": 800, "h": 1200, "frame": [26, 1], "focus": "50% 50%"},
    "subtitle": "The breath of the earth",
    "meta": [
      [
        "Category",
        "Digital / Branding"
      ],
      [
        "Type",
        "Fictional project"
      ],
      [
        "Scope",
        "Branding, Art direction, Product concept"
      ]
    ],
    "text": [
      "OXY is a fragrance born from a need for clarity. In a world of digital noise and synthetic artifice, it stands for a sensory return to the essential — a reconnection with the self through the most vital human act: breathing.",
      "More than a scent, it is an atmospheric reset."
    ],
    "hero": {
      "src": "assets/oxy/hero.jpg",
      "w": 1400,
      "h": 1750
    },
    "sections": [
      {
        "layout": "grid-3",
        "media": [
          {
            "src": "assets/oxy/01.jpg",
            "w": 1008,
            "h": 1266
          },
          {
            "src": "assets/oxy/02.jpg",
            "w": 1298,
            "h": 1622
          },
          {
            "src": "assets/oxy/03.jpg",
            "w": 1080,
            "h": 1350
          }
        ],
        "title": "Art direction",
        "text": [
          "Water, stone and light: the visual world of OXY is built from raw natural textures and a restrained, almost clinical palette."
        ]
      },
      {
        "quote": "OXY doesn't just rest on your skin; it breathes into you. It is the scent of a woman who knows the truest path is the one you forge yourself — deeply, authentically alive."
      },
      {
        "layout": "grid-4",
        "media": [
          {
            "src": "assets/oxy/04.jpg",
            "w": 1080,
            "h": 1350
          },
          {
            "src": "assets/oxy/05.jpg",
            "w": 1080,
            "h": 1350
          },
          {
            "src": "assets/oxy/06.jpg",
            "w": 1080,
            "h": 1350
          },
          {
            "src": "assets/oxy/07.jpg",
            "w": 1080,
            "h": 1350
          }
        ],
        "title": "Campaign"
      }
    ]
  },
  {
    "slug": "pop-beauty",
    "title": "Pop Beauty",
    "category": "digital",
    "template": "case",
    "cover": {
      "src": "assets/pop-beauty/cover.jpg",
      "w": 800,
      "h": 1200
    },
    "thumb": {"src": "assets/pop-beauty/thumb.jpg", "w": 1200, "h": 768, "frame": [34, 1.5], "focus": "50% 50%"},
    "subtitle": "Skincare you can chew",
    "meta": [
      [
        "Category",
        "Digital / Branding"
      ],
      [
        "Type",
        "Brand concept"
      ],
      [
        "Scope",
        "Branding, Product design, Packaging"
      ]
    ],
    "text": [
      "How can a mundane daily habit become a radical act of self-care? Pop Beauty reimagines chewing gum as a portable skincare delivery system. By infusing supplements and vitamins into an everyday item, the project blurs the line between nutricosmetics and street culture."
    ],
    "hero": {
      "src": "assets/pop-beauty/hero.jpg",
      "w": 1400,
      "h": 2100
    },
    "sections": [
      {
        "layout": "grid-3",
        "media": [
          {
            "src": "assets/pop-beauty/01.jpg",
            "w": 2000,
            "h": 1414
          },
          {
            "src": "assets/pop-beauty/02.jpg",
            "w": 2000,
            "h": 1414
          },
          {
            "src": "assets/pop-beauty/03.jpg",
            "w": 2000,
            "h": 1414
          }
        ],
        "title": "The lineup",
        "text": [
          "Three targeted formulas, each designed to treat the skin from the inside out."
        ],
        "items": [
          [
            "Hydrate",
            "Hyaluronic acid, vitamin E and vitamin C for a deep glow."
          ],
          [
            "Clear It Up",
            "Zinc, niacinamide and probiotics to refine and balance."
          ],
          [
            "Repair",
            "Hydrolysed collagen and essential minerals to restore."
          ]
        ]
      },
      {
        "layout": "grid-2",
        "media": [
          {
            "src": "assets/pop-beauty/04.jpg",
            "w": 1400,
            "h": 2100
          },
          {
            "src": "assets/pop-beauty/05.jpg",
            "w": 791,
            "h": 1418
          }
        ],
        "title": "Visual identity",
        "text": [
          "The art direction plays on the contrast between clinical precision and pop aesthetics. Blister packs usually reserved for pharmaceuticals underline the treatment side of the product, while bold typography and gritty, high-flash photography keep it rooted in fashion and nightlife."
        ]
      },
      {
        "quote": "Pop Beauty is more than gum — it's a supplement you actually want to carry."
      },
      {
        "layout": "grid-3",
        "media": [
          {
            "src": "assets/pop-beauty/06.jpg",
            "w": 1400,
            "h": 1600
          },
          {
            "src": "assets/pop-beauty/07.jpg",
            "w": 1400,
            "h": 1661
          },
          {
            "src": "assets/pop-beauty/08.jpg",
            "w": 2000,
            "h": 1500
          }
        ],
        "title": "Packaging",
        "text": [
          "The packaging follows a clinical hierarchy — medical blister packs and slide-drawer boxes evoke lab-grade efficacy. That surgical minimalism is disrupted by industrial textures such as silver bubble mailers, grounding the brand in a raw, editorial aesthetic and turning a daily object into a functional, high-end accessory."
        ]
      },
      {
        "layout": "stack",
        "media": [
          {
            "src": "assets/pop-beauty/09.jpg",
            "w": 2000,
            "h": 1280
          },
          {
            "src": "assets/pop-beauty/10.jpg",
            "w": 2000,
            "h": 1556
          }
        ],
        "title": "Posters & ads"
      }
    ]
  },
  {
    "slug": "lululemon-edge",
    "title": "Lululemon Edge",
    "category": "digital",
    "template": "case",
    "cover": {
      "src": "assets/lululemon-edge/cover.jpg",
      "w": 800,
      "h": 1200
    },
    "thumb": {"src": "assets/lululemon-edge/thumb.jpg", "w": 800, "h": 1200, "frame": [18, 0.6667], "focus": "50% 40%"},
    "subtitle": "Campaign strategy",
    "meta": [
      [
        "Category",
        "Digital / Branding"
      ],
      [
        "Type",
        "Campaign strategy"
      ],
      [
        "Client",
        "Lululemon (concept)"
      ]
    ],
    "text": [
      "Edge is a campaign strategy for Lululemon. The deck takes the brand from context and objectives to target audiences, strategic levers and channels, an activation calendar, social media, influencer partnerships, paid media and the KPIs used to measure performance."
    ],
    "hero": {
      "src": "assets/lululemon-edge/hero.jpg",
      "w": 2000,
      "h": 1039
    },
    "sections": [
      {
        "layout": "grid-2",
        "media": [
          {
            "src": "assets/lululemon-edge/01.jpg",
            "w": 2000,
            "h": 1123
          },
          {
            "src": "assets/lululemon-edge/02.jpg",
            "w": 2000,
            "h": 1121
          },
          {
            "src": "assets/lululemon-edge/03.jpg",
            "w": 2000,
            "h": 1116
          },
          {
            "src": "assets/lululemon-edge/04.jpg",
            "w": 2000,
            "h": 1123
          },
          {
            "src": "assets/lululemon-edge/05.jpg",
            "w": 2000,
            "h": 1119
          },
          {
            "src": "assets/lululemon-edge/06.jpg",
            "w": 2000,
            "h": 1126
          }
        ],
        "title": "Strategy",
        "text": [
          "Context, objectives, targets and the strategic levers behind the campaign."
        ]
      },
      {
        "layout": "grid-2",
        "media": [
          {
            "src": "assets/lululemon-edge/07.jpg",
            "w": 2000,
            "h": 1128
          },
          {
            "src": "assets/lululemon-edge/08.jpg",
            "w": 2000,
            "h": 1123
          },
          {
            "src": "assets/lululemon-edge/09.jpg",
            "w": 2000,
            "h": 1125
          },
          {
            "src": "assets/lululemon-edge/10.jpg",
            "w": 2000,
            "h": 1121
          },
          {
            "src": "assets/lululemon-edge/11.jpg",
            "w": 2000,
            "h": 1120
          },
          {
            "src": "assets/lululemon-edge/12.jpg",
            "w": 2000,
            "h": 1113
          },
          {
            "src": "assets/lululemon-edge/13.jpg",
            "w": 2000,
            "h": 1120
          },
          {
            "src": "assets/lululemon-edge/14.jpg",
            "w": 2000,
            "h": 1123
          },
          {
            "src": "assets/lululemon-edge/15.jpg",
            "w": 2000,
            "h": 1118
          }
        ],
        "title": "Activation",
        "text": [
          "Calendar, social media, influence and paid media — and how performance is tracked."
        ]
      },
      {
        "layout": "single-narrow",
        "media": [
          {
            "src": "assets/lululemon-edge/16.jpg",
            "w": 472,
            "h": 1022
          }
        ],
        "title": "Mobile"
      }
    ]
  },
  {
    "slug": "dripped",
    "title": "Dripped",
    "category": "digital",
    "template": "case",
    "cover": {
      "src": "assets/dripped/cover.jpg",
      "w": 800,
      "h": 1200
    },
    "thumb": {"src": "assets/dripped/thumb.jpg", "w": 1200, "h": 747, "frame": [35, 1.6], "focus": "50% 50%"},
    "subtitle": "A smart digital wardrobe & AI stylist",
    "meta": [
      [
        "Category",
        "Digital / Branding"
      ],
      [
        "Type",
        "Mobile app concept"
      ],
      [
        "Scope",
        "UI/UX design"
      ]
    ],
    "text": [
      "Dripped is a mobile app that bridges the gap between a physical wardrobe and digital self-expression. Acting as a personal style assistant, it removes choice paralysis by organising the user's wardrobe and offering daily, AI-driven outfit ideas.",
      "The goal: make getting dressed efficient, sustainable and genuinely fun."
    ],
    "hero": {
      "src": "assets/dripped/hero.jpg",
      "w": 1584,
      "h": 986
    },
    "sections": [
      {
        "layout": "grid-2",
        "media": [
          {
            "src": "assets/dripped/01.jpg",
            "w": 586,
            "h": 1290
          },
          {
            "src": "assets/dripped/02.jpg",
            "w": 988,
            "h": 1186
          }
        ],
        "title": "Design system & UX",
        "items": [
          [
            "Visual identity",
            "A high-contrast dark mode lets the clothing photography stand out, with fluorescent green as the primary action colour to guide the eye to key buttons and states."
          ],
          [
            "Simple yet fun",
            "Clean lines and generous negative space make the app feel premium, while a sketchy avatar adds an indie personality that keeps the brand approachable."
          ],
          [
            "User flow",
            "Built for speed: from the home screen the user is one tap away from their Dressing or a New Look — matching the pace of a morning routine."
          ]
        ]
      },
      {
        "layout": "grid-2",
        "media": [
          {
            "src": "assets/dripped/03.jpg",
            "w": 1088,
            "h": 1114
          },
          {
            "src": "assets/dripped/04.jpg",
            "w": 1850,
            "h": 1398
          }
        ],
        "title": "Key features",
        "items": [
          [
            "Today's look",
            "An outfit of the day generated by AI from the user's existing wardrobe."
          ],
          [
            "The dressing",
            "A digital inventory where pieces are uploaded and sorted — tops, jackets, bottoms — for a bird's-eye view of everything owned."
          ],
          [
            "Avatar builder",
            "A hand-drawn workspace where items are dragged onto an avatar to try proportions and styles without changing clothes."
          ],
          [
            "Lookbook",
            "Favourite combinations are saved to My Looks, sorted (Chill Guy, Office…) and shared with the community."
          ],
          [
            "Under the hood",
            "Item IDs and brand tags (Uniqlo, Dr. Martens…) keep the wardrobe searchable; profile settings come with a cheeky “Anna Wintour” placeholder."
          ]
        ]
      }
    ]
  },
  {
    "slug": "grdf",
    "title": "GRDF",
    "category": "digital",
    "template": "case",
    "cover": {
      "src": "assets/grdf/cover.jpg",
      "w": 800,
      "h": 1203
    },
    "thumb": {"src": "assets/grdf/thumb.jpg", "w": 798, "h": 1200, "frame": [31, 1.5], "focus": "50% 45%"},
    "subtitle": "Internship — communication & UI/UX",
    "meta": [
      [
        "Category",
        "Digital / Branding"
      ],
      [
        "Type",
        "Internship"
      ],
      [
        "Scope",
        "Internal communication, UI/UX"
      ],
      [
        "Award",
        "1st prize — Hackathon"
      ]
    ],
    "text": [
      "A selection of the work I produced during my internship at GRDF, combining internal communication with UI/UX design for tools and apps used by employees."
    ],
    "hero": {
      "src": "assets/grdf/hero.jpg",
      "w": 1400,
      "h": 2100
    },
    "sections": [
      {
        "layout": "grid-2",
        "media": [
          {
            "src": "assets/grdf/01.jpg",
            "w": 1920,
            "h": 1080
          },
          {
            "src": "assets/grdf/02.jpg",
            "w": 1920,
            "h": 1080
          },
          {
            "src": "assets/grdf/03.jpg",
            "w": 1920,
            "h": 1080
          },
          {
            "src": "assets/grdf/04.jpg",
            "w": 1920,
            "h": 1080
          },
          {
            "src": "assets/grdf/05.jpg",
            "w": 1920,
            "h": 1080
          },
          {
            "src": "assets/grdf/06.jpg",
            "w": 1920,
            "h": 1080
          }
        ],
        "title": "Pimp My App",
        "text": [
          "Flyers and screen displays announcing upcoming innovation events."
        ]
      },
      {
        "layout": "grid-4",
        "media": [
          {
            "src": "assets/grdf/07.jpg",
            "w": 595,
            "h": 842
          },
          {
            "src": "assets/grdf/08.jpg",
            "w": 595,
            "h": 842
          },
          {
            "src": "assets/grdf/09.jpg",
            "w": 595,
            "h": 842
          },
          {
            "src": "assets/grdf/10.jpg",
            "w": 595,
            "h": 842
          }
        ]
      },
      {
        "layout": "grid-5",
        "media": [
          {
            "src": "assets/grdf/11.jpg",
            "w": 734,
            "h": 1080
          },
          {
            "src": "assets/grdf/12.jpg",
            "w": 734,
            "h": 1080
          },
          {
            "src": "assets/grdf/13.jpg",
            "w": 595,
            "h": 842
          },
          {
            "src": "assets/grdf/14.jpg",
            "w": 595,
            "h": 842
          },
          {
            "src": "assets/grdf/15.jpg",
            "w": 595,
            "h": 842
          }
        ],
        "title": "Hackathon",
        "text": [
          "Internal communication for the hackathon — a competition in which employees teamed up to find a tech solution to a given brief: running order, posters, schedule and on-the-day slides."
        ]
      },
      {
        "layout": "grid-2",
        "media": [
          {
            "src": "assets/grdf/16.jpg",
            "w": 1920,
            "h": 1080
          },
          {
            "src": "assets/grdf/17.jpg",
            "w": 1926,
            "h": 1086
          },
          {
            "src": "assets/grdf/18.jpg",
            "w": 1926,
            "h": 1086
          },
          {
            "src": "assets/grdf/19.jpg",
            "w": 1926,
            "h": 1086
          },
          {
            "src": "assets/grdf/20.jpg",
            "w": 1926,
            "h": 1086
          },
          {
            "src": "assets/grdf/21.jpg",
            "w": 1926,
            "h": 1086
          }
        ]
      },
      {
        "layout": "grid-2",
        "media": [
          {
            "src": "assets/grdf/22.jpg",
            "w": 1920,
            "h": 1080
          },
          {
            "src": "assets/grdf/23.jpg",
            "w": 1920,
            "h": 1080
          },
          {
            "src": "assets/grdf/24.jpg",
            "w": 1920,
            "h": 1080
          },
          {
            "src": "assets/grdf/25.jpg",
            "w": 1920,
            "h": 1080
          }
        ],
        "title": "Presentation",
        "text": [
          "A short presentation of GRDF designed to be shown at universities and recruitment fairs."
        ]
      },
      {
        "layout": "grid-2",
        "media": [
          {
            "src": "assets/grdf/26.jpg",
            "w": 1920,
            "h": 1080
          },
          {
            "src": "assets/grdf/27.jpg",
            "w": 1970,
            "h": 1130
          },
          {
            "src": "assets/grdf/28.jpg",
            "w": 1970,
            "h": 1130
          },
          {
            "src": "assets/grdf/29.jpg",
            "w": 1970,
            "h": 1130
          },
          {
            "src": "assets/grdf/30.jpg",
            "w": 1808,
            "h": 1544
          }
        ],
        "title": "Green Score",
        "text": [
          "Full design and interface, built in Figma. Winner of the 1st prize at the hackathon.",
          "In an era of digital overload, understanding our environmental impact matters more than ever. My Green Score Dashboard tracks, analyses and helps reduce the digital carbon footprint of corporate users — visualising data consumption and emissions in real time so people can make more responsible choices.",
          "Developed in three days under competition conditions, the project won first prize: the jury praised its intuitive user journey, refined dark-mode design and potential to change behaviour at work."
        ],
        "items": [
          [
            "Personal analytics",
            "A modular My Space where users choose which apps to monitor — Teams, Outlook, OneDrive…"
          ],
          [
            "Data visualisation",
            "Progress charts and gauges for storage (GB), emissions (gCO₂) and data exchanged (MB)."
          ],
          [
            "OS integration",
            "A native-feeling Green Score widget, reachable straight from the taskbar."
          ],
          [
            "Gamification",
            "Usage curves compared against system baselines to encourage better habits."
          ]
        ],
        "video": {
          "src": "https://freight.cargo.site/m/N2858516458102238138664097419437/grdf-demoo.mov",
          "w": 1576,
          "h": 882
        }
      }
    ]
  }
];

// Images floating on the entry screen.
const INTRO = [
  {
    "src": "assets/intro/01.jpg",
    "w": 500,
    "h": 625
  },
  {
    "src": "assets/intro/02.jpg",
    "w": 500,
    "h": 751
  },
  {
    "src": "assets/intro/03.jpg",
    "w": 500,
    "h": 750
  },
  {
    "src": "assets/intro/04.jpg",
    "w": 500,
    "h": 750
  },
  {
    "src": "assets/intro/05.jpg",
    "w": 500,
    "h": 750
  },
  {
    "src": "assets/intro/06.jpg",
    "w": 441,
    "h": 661
  },
  {
    "src": "assets/intro/07.jpg",
    "w": 500,
    "h": 750
  },
  {
    "src": "assets/intro/08.jpg",
    "w": 500,
    "h": 750
  },
  {
    "src": "assets/intro/09.jpg",
    "w": 500,
    "h": 625
  },
  {
    "src": "assets/intro/10.jpg",
    "w": 500,
    "h": 750
  },
  {
    "src": "assets/intro/11.jpg",
    "w": 500,
    "h": 333
  },
  {
    "src": "assets/intro/12.jpg",
    "w": 500,
    "h": 750
  },
  {
    "src": "assets/intro/13.jpg",
    "w": 500,
    "h": 333
  },
  {
    "src": "assets/intro/14.jpg",
    "w": 500,
    "h": 751
  },
  {
    "src": "assets/intro/15.jpg",
    "w": 441,
    "h": 662
  },
  {
    "src": "assets/intro/16.jpg",
    "w": 500,
    "h": 750
  }
];

const EXPERIMENTAL = {
  "text": [
    "Welcome to the experimental zone.",
    "Here I explore art through technology — across mediums and creative coding — building shapes and interactive pieces with TouchDesigner, code and graphic software."
  ],
  "pieces": [
    {
      "video": "https://freight.cargo.site/m/J2857481310296338492163128561837/4374c5857618427a9acce6ba610a1cc4.MOV",
      "w": 1080,
      "h": 1920,
      "title": "Study 01"
    },
    {
      "video": "https://freight.cargo.site/m/I2853725503618083157322836218029/8ecb6f7b97a74209a4883dcbbc36a95a.mov",
      "w": 720,
      "h": 1174,
      "title": "Study 02"
    },
    {
      "video": "https://freight.cargo.site/m/T2863888343741102110339806793901/TD-FLOW.mov",
      "w": 2984,
      "h": 1962,
      "title": "TD Flow"
    },
    {
      "image": {
        "src": "assets/experimental/01.jpg",
        "w": 2000,
        "h": 1147
      },
      "title": "TouchDesigner network"
    },
    {
      "video": "https://freight.cargo.site/m/O2857711221549355588191628300461/tt.mov",
      "w": 3014,
      "h": 1864,
      "title": "Study 03"
    }
  ]
};
