# Portfolio

A plain HTML/CSS/JS portfolio for photography, videography and design. It has no build step and no dependencies.

## Structure

```
index.html          Home: endless gallery of all work (List / Slider views)
photography.html    Same gallery, filtered by category
videography.html
design.html
project.html        One template for every project (project.html?p=<slug>)
about.html          Gallery with the About overlay open (About is also a button on every page)
css/style.css       All styling (colours & spacing are variables at the top)
js/data.js          ← ALL CONTENT LIVES HERE
js/main.js          Renders the pages from data.js
assets/             Put your images & videos here
```

## Adding your work

1. Make a folder per project, e.g. `assets/coastal-light/`, and put the images in it.
   Export JPGs at about 2000px on the long edge, quality ~80, so pages load fast.
2. In `js/data.js`, edit or copy a project:

```js
{
  slug: "coastal-light",                 // used in the URL, must be unique
  title: "Coastal Light",
  category: "photography",               // photography | videography | design
  year: 2026,
  client: "Personal",
  role: "Photography",
  cover: "assets/coastal-light/cover.jpg",   // shown in the gallery
  // ratio: 0.8,                         // optional width/height; otherwise read from the image
  summary: "One-line summary.",
  description: ["Paragraph one.", "Paragraph two."],
  media: [
    { type: "image", src: "assets/coastal-light/01.jpg", caption: "Optional" },
    { type: "vimeo", id: "123456789" },
    { type: "youtube", id: "dQw4w9WgXcQ" },
    { type: "file", src: "assets/coastal-light/clip.mp4", poster: "assets/coastal-light/poster.jpg" },
  ],
},
```

Projects show up in the order they're listed and are numbered 01/, 02/… in the index. Your name, intro, about text, email and social links are in the `SITE` object at the top of the same file.

## Preview locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Publishing

Any static host will do. Upload the whole folder to Netlify (drag and drop), GitHub Pages, Cloudflare Pages or Vercel.

## Design notes

The design draws on cathydolle.com: a white page, small uppercase type pinned to the corners, and a single column (or strip) of images that loops forever. Every image gets roughly the same area, so portrait shots come out narrow and landscape shots wide.

The font is **Inter Tight** from Google Fonts. To get closer to the reference, license **Neue Montreal** (free for personal use from Pangram Pangram), add the font files and change `--font` at the top of `css/style.css`.
