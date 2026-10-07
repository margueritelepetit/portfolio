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
    description: [
      "Fragments of the city reduced to line, plane and shadow.",
    ],
    media: [
      { type: "image", src: ph("urban1", 2000, 1500) },
      { type: "image", src: ph("urban2", 2000, 1500) },
      { type: "image", src: ph("urban3", 2000, 1500) },
    ],
  },
  {
    slug: "summer-in-the-south",
    title: "Summer in the South",
    category: "photography",
    year: 2025,
    client: "Travel magazine",
    role: "Photography",
    cover: ph("south1", 1200, 1500),
    summary: "A travel story along the Mediterranean.",
    description: [
      "Commissioned travel essay shot over two weeks between Marseille and Nice.",
    ],
    media: [
      { type: "image", src: ph("south1", 1600, 2000) },
      { type: "image", src: ph("south2", 1600, 2000) },
      { type: "image", src: ph("south3", 1600, 2000) },
    ],
  },
  {
    slug: "dancers",
    title: "Dancers",
    category: "photography",
    year: 2025,
    client: "Ballet company",
    role: "Portrait photography",
    cover: ph("dance1", 1200, 1600),
    summary: "Portraits of a contemporary dance company.",
    description: [
      "A season campaign for a contemporary dance company, shot in rehearsal.",
    ],
    media: [
      { type: "image", src: ph("dance1", 1600, 2000) },
      { type: "image", src: ph("dance2", 1600, 2000) },
      { type: "image", src: ph("dance3", 1600, 2000) },
    ],
  },
  {
    slug: "quiet-interiors",
    title: "Quiet Interiors",
    category: "photography",
    year: 2024,
    client: "Interior studio",
    role: "Photography",
    cover: ph("interior1", 1500, 1200),
    summary: "Interiors photographed in natural light.",
    description: [
      "An interiors series for an architecture studio's new monograph.",
    ],
    media: [
      { type: "image", src: ph("interior1", 2000, 1600) },
      { type: "image", src: ph("interior2", 2000, 1600) },
      { type: "image", src: ph("interior3", 2000, 1600) },
    ],
  },
  {
    slug: "night-walks",
    title: "Night Walks",
    category: "photography",
    year: 2023,
    client: "Personal",
    role: "Photography",
    cover: ph("night1", 1200, 1500),
    summary: "The city after midnight.",
    description: [
      "A personal series made on long walks through empty streets at night.",
    ],
    media: [
      { type: "image", src: ph("night1", 1600, 2000) },
      { type: "image", src: ph("night2", 1600, 2000) },
      { type: "image", src: ph("night3", 1600, 2000) },
    ],
  },
  {
    slug: "fashion-week-recap",
    title: "Fashion Week Recap",
    category: "videography",
    year: 2026,
    client: "Fashion label",
    role: "Director, Editor",
    cover: ph("fashion1", 1600, 900),
    summary: "Backstage film from a Paris show.",
    description: [
      "A two-minute backstage film cut overnight for release the morning after the show.",
    ],
    media: [
      { type: "youtube", id: "aqz-KE-bpKQ" },
      { type: "image", src: ph("fashion2", 2000, 1125) },
      { type: "image", src: ph("fashion3", 2000, 1125) },
    ],
  },
  {
    slug: "chef-portrait",
    title: "The Chef",
    category: "videography",
    year: 2025,
    client: "Restaurant",
    role: "Director, DP",
    cover: ph("chef1", 1600, 1000),
    summary: "A short portrait of a young chef.",
    description: [
      "A three-minute portrait film made for a restaurant opening.",
    ],
    media: [
      { type: "youtube", id: "aqz-KE-bpKQ" },
      { type: "image", src: ph("chef2", 2000, 1250) },
      { type: "image", src: ph("chef3", 2000, 1250) },
    ],
  },
  {
    slug: "product-launch",
    title: "Product Launch Film",
    category: "videography",
    year: 2025,
    client: "Design brand",
    role: "Director, Editor",
    cover: ph("lamp1", 1600, 900),
    summary: "Launch film for a lighting collection.",
    description: [
      "A 45-second launch film for a new collection of table lamps.",
    ],
    media: [
      { type: "youtube", id: "aqz-KE-bpKQ" },
      { type: "image", src: ph("lamp2", 2000, 1125) },
      { type: "image", src: ph("lamp3", 2000, 1125) },
    ],
  },
  {
    slug: "road-trip",
    title: "Road Trip",
    category: "videography",
    year: 2024,
    client: "Personal",
    role: "Camera, Editor",
    cover: ph("road1", 1600, 1000),
    summary: "Super 8 diary from a road trip.",
    description: [
      "Shot on Super 8 during a week-long drive through Portugal.",
    ],
    media: [
      { type: "youtube", id: "aqz-KE-bpKQ" },
      { type: "image", src: ph("road2", 2000, 1250) },
      { type: "image", src: ph("road3", 2000, 1250) },
    ],
  },
  {
    slug: "wedding-film",
    title: "A Wedding in Provence",
    category: "videography",
    year: 2023,
    client: "Private client",
    role: "Director, Camera",
    cover: ph("wedding1", 1600, 900),
    summary: "A wedding film in the countryside.",
    description: [
      "A documentary-style wedding film shot over a weekend in Provence.",
    ],
    media: [
      { type: "youtube", id: "aqz-KE-bpKQ" },
      { type: "image", src: ph("wedding2", 2000, 1125) },
      { type: "image", src: ph("wedding3", 2000, 1125) },
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
    description: [
      "A set of five posters built on a shared grid and a single typeface.",
    ],
    media: [
      { type: "image", src: ph("poster1", 1600, 2000) },
      { type: "image", src: ph("poster2", 1600, 2000) },
      { type: "image", src: ph("poster3", 1600, 2000) },
    ],
  },
  {
    slug: "bookshop-identity",
    title: "Bookshop Identity",
    category: "design",
    year: 2026,
    client: "Independent bookshop",
    role: "Visual identity",
    cover: ph("books1", 1200, 1200),
    summary: "Identity and signage for a neighbourhood bookshop.",
    description: [
      "Logo, bags, bookmarks and shop signage for an independent bookshop.",
    ],
    media: [
      { type: "image", src: ph("books1", 1600, 2000) },
      { type: "image", src: ph("books2", 1600, 2000) },
      { type: "image", src: ph("books3", 1600, 2000) },
    ],
  },
  {
    slug: "album-artwork",
    title: "Album Artwork",
    category: "design",
    year: 2025,
    client: "Musician",
    role: "Art direction, Design",
    cover: ph("album1", 1200, 1200),
    summary: "Cover and vinyl packaging for a debut album.",
    description: [
      "Cover artwork, vinyl sleeve and social assets for a debut album.",
    ],
    media: [
      { type: "image", src: ph("album1", 1600, 2000) },
      { type: "image", src: ph("album2", 1600, 2000) },
      { type: "image", src: ph("album3", 1600, 2000) },
    ],
  },
  {
    slug: "exhibition-catalogue",
    title: "Exhibition Catalogue",
    category: "design",
    year: 2025,
    client: "Gallery",
    role: "Editorial design",
    cover: ph("catalogue1", 1200, 1500),
    summary: "Catalogue for a group photography show.",
    description: [
      "A 96-page catalogue designed for a group exhibition.",
    ],
    media: [
      { type: "image", src: ph("catalogue1", 1600, 2000) },
      { type: "image", src: ph("catalogue2", 1600, 2000) },
      { type: "image", src: ph("catalogue3", 1600, 2000) },
    ],
  },
  {
    slug: "wine-labels",
    title: "Wine Labels",
    category: "design",
    year: 2024,
    client: "Vineyard",
    role: "Packaging design",
    cover: ph("wine1", 1200, 1600),
    summary: "Label series for a natural wine producer.",
    description: [
      "A family of labels for six natural wines, printed on textured paper.",
    ],
    media: [
      { type: "image", src: ph("wine1", 1600, 2000) },
      { type: "image", src: ph("wine2", 1600, 2000) },
      { type: "image", src: ph("wine3", 1600, 2000) },
    ],
  },
  {
    slug: "website-design",
    title: "Studio Website",
    category: "design",
    year: 2023,
    client: "Architecture studio",
    role: "Web design",
    cover: ph("web1", 1600, 1000),
    summary: "Website for a small architecture practice.",
    description: [
      "A minimal website design for an architecture studio's portfolio.",
    ],
    media: [
      { type: "image", src: ph("web1", 2000, 1250) },
      { type: "image", src: ph("web2", 2000, 1250) },
      { type: "image", src: ph("web3", 2000, 1250) },
    ],
  },
];
