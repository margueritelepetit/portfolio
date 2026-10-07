/*
  ─────────────────────────────────────────────────────────────
  SITE CONTENT
  Everything on the site comes from this file. To add work:
    1. Put your files in assets/<project-slug>/
    2. Copy a project block below and edit it.
  Images: use paths like "assets/my-project/01.jpg".
  Videos: { type: "youtube", id: "..." } | { type: "vimeo", id: "..." }
          | { type: "file", src: "assets/my-project/reel.mp4" }
  Placeholder images come from picsum.photos — replace them.
  ─────────────────────────────────────────────────────────────
*/

const SITE = {
  name: "Marguerite Le Petit",
  tagline: "Photographer, filmmaker and designer.",
  intro:
    "I make images, moving pictures and visual identities. Based in Paris, working everywhere.",
  email: "hello@example.com",
  location: "Paris, France",
  socials: [
    { label: "Instagram", url: "https://instagram.com/" },
    { label: "Vimeo", url: "https://vimeo.com/" },
    { label: "Behance", url: "https://behance.net/" },
  ],
  about: [
    "I’m a multidisciplinary visual artist working across photography, film and graphic design. My work moves between commissioned projects for brands and editorial clients and long-form personal series.",
    "I care about light, rhythm and restraint: images that hold attention without shouting, and design that gets out of the way of the story.",
  ],
  services: [
    "Editorial & portrait photography",
    "Brand & campaign photography",
    "Short films & music videos",
    "Visual identity & art direction",
    "Print & editorial design",
  ],
  clients: ["Client One", "Client Two", "Client Three", "Client Four", "Client Five"],
  portrait: "https://picsum.photos/seed/portrait-mlp/900/1200",
};

const CATEGORIES = {
  photography: "Photography",
  videography: "Videography",
  design: "Design",
};

// Helper for placeholder images — delete once you use real files.
const ph = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const PROJECTS = [
  {
    slug: "coastal-light",
    title: "Coastal Light",
    category: "photography",
    year: 2026,
    client: "Personal",
    role: "Photography",
    cover: ph("coast1", 1200, 1500),
    summary: "A slow study of the Atlantic coast through winter.",
    description: [
      "Shot over three months along the Breton coastline, Coastal Light follows the shifting quality of winter light on water, stone and fog.",
      "The series was made entirely on medium format film and printed as a limited edition of silver gelatin prints.",
    ],
    media: [
      { type: "image", src: ph("coast1", 1600, 2000) },
      { type: "image", src: ph("coast2", 2000, 1333) },
      { type: "image", src: ph("coast3", 1600, 2000) },
      { type: "image", src: ph("coast4", 1600, 2000) },
      { type: "image", src: ph("coast5", 2000, 1333) },
    ],
  },
  {
    slug: "brand-campaign-film",
    title: "Atelier — Brand Film",
    category: "videography",
    year: 2026,
    client: "Atelier Studio",
    role: "Director, DP, Editor",
    cover: ph("atelierfilm", 1600, 900),
    summary: "A 90-second brand film about craft and patience.",
    description: [
      "A short brand film for a ceramics studio, focusing on hands, material and the quiet rhythm of making.",
    ],
    media: [
      // Placeholder video — replace with your own YouTube/Vimeo ID or file.
      { type: "youtube", id: "aqz-KE-bpKQ" },
      { type: "image", src: ph("atelier2", 2000, 1125) },
      { type: "image", src: ph("atelier3", 2000, 1125) },
    ],
  },
  {
    slug: "maison-identity",
    title: "Maison Identity",
    category: "design",
    year: 2025,
    client: "Maison Café",
    role: "Visual identity, Art direction",
    cover: ph("maison1", 1200, 1200),
    summary: "Identity system for a neighbourhood café and bakery.",
    description: [
      "A warm, typographic identity for a family-run café: wordmark, colour system, packaging and signage.",
      "The system is built around a custom monogram and a palette taken from the bakery’s original 1950s tiles.",
    ],
    media: [
      { type: "image", src: ph("maison1", 2000, 2000) },
      { type: "image", src: ph("maison2", 2000, 1333) },
      { type: "image", src: ph("maison3", 2000, 1333) },
      { type: "image", src: ph("maison4", 1600, 2000) },
    ],
  },
  {
    slug: "portraits-of-the-market",
    title: "Portraits of the Market",
    category: "photography",
    year: 2025,
    client: "Editorial",
    role: "Photography",
    cover: ph("market1", 1200, 1600),
    summary: "Vendors and regulars of a Saturday market.",
    description: [
      "An editorial portrait series made over six Saturdays, published as a photo essay.",
    ],
    media: [
      { type: "image", src: ph("market1", 1500, 2000) },
      { type: "image", src: ph("market2", 1500, 2000) },
      { type: "image", src: ph("market3", 1500, 2000) },
      { type: "image", src: ph("market4", 1500, 2000) },
    ],
  },
  {
    slug: "night-swim-music-video",
    title: "Night Swim — Music Video",
    category: "videography",
    year: 2025,
    client: "Artist Name",
    role: "Director, Editor",
    cover: ph("nightswim", 1600, 1000),
    summary: "Music video shot in a single night at a city pool.",
    description: [
      "A one-night shoot in an empty municipal pool, lit entirely with practicals and handheld LEDs.",
    ],
    media: [
      { type: "youtube", id: "aqz-KE-bpKQ" },
      { type: "image", src: ph("nightswim2", 2000, 1125) },
    ],
  },
  {
    slug: "risograph-zine",
    title: "Risograph Zine",
    category: "design",
    year: 2025,
    client: "Self-published",
    role: "Design, Print production",
    cover: ph("zine1", 1200, 1500),
    summary: "A two-colour riso zine collecting a year of photographs.",
    description: [
      "32 pages, printed in fluorescent pink and blue on recycled stock in an edition of 200.",
    ],
    media: [
      { type: "image", src: ph("zine1", 1600, 2000) },
      { type: "image", src: ph("zine2", 2000, 1333) },
      { type: "image", src: ph("zine3", 2000, 1333) },
    ],
  },
  {
    slug: "still-life-series",
    title: "Still Life",
    category: "photography",
    year: 2024,
    client: "Personal",
    role: "Photography, Styling",
    cover: ph("still1", 1200, 1200),
    summary: "Everyday objects arranged in natural light.",
    description: ["A studio series exploring form, shadow and colour in domestic objects."],
    media: [
      { type: "image", src: ph("still1", 2000, 2000) },
      { type: "image", src: ph("still2", 2000, 2000) },
      { type: "image", src: ph("still3", 2000, 2000) },
    ],
  },
  {
    slug: "festival-poster-series",
    title: "Festival Posters",
    category: "design",
    year: 2024,
    client: "Film Festival",
    role: "Poster design",
    cover: ph("poster1", 1200, 1700),
    summary: "Poster series for a small independent film festival.",
    description: ["A set of five posters built on a shared grid and a single typeface."],
    media: [
      { type: "image", src: ph("poster1", 1400, 2000) },
      { type: "image", src: ph("poster2", 1400, 2000) },
      { type: "image", src: ph("poster3", 1400, 2000) },
    ],
  },
  {
    slug: "documentary-short",
    title: "Hands — Documentary Short",
    category: "videography",
    year: 2024,
    client: "Personal",
    role: "Director, Camera",
    cover: ph("hands", 1600, 900),
    summary: "Six minutes with a third-generation bookbinder.",
    description: ["A short observational documentary about a craft that is quietly disappearing."],
    media: [{ type: "youtube", id: "aqz-KE-bpKQ" }],
  },
  {
    slug: "urban-geometry",
    title: "Urban Geometry",
    category: "photography",
    year: 2024,
    client: "Personal",
    role: "Photography",
    cover: ph("urban1", 1200, 900),
    summary: "Architecture, lines and shadow.",
    description: ["Fragments of the city reduced to line, plane and shadow."],
    media: [
      { type: "image", src: ph("urban1", 2000, 1500) },
      { type: "image", src: ph("urban2", 1500, 2000) },
      { type: "image", src: ph("urban3", 2000, 1500) },
    ],
  },
];
