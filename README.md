# Marguerite Le Petit — Portfolio

A portfolio for photography, videography and digital / branding work, written in plain HTML, CSS and JS. It has no build step and no dependencies.

## Pages

```
index.html          Intro (~7 s; first visit and every refresh): white mosaic of small B&W portraits, one fading at a time,
                    pushed aside by the cursor, with an "Entering" bar → "Projects": endless column + index
project.html        Every project: project.html?p=<slug>, rendered with one of three layouts
experimental.html   The experimental zone (TouchDesigner / creative coding)
about.html          Home with the About panel open (About is also a button on every page)
```

## Project layouts

Each project in `js/data.js` has a `template`:

| template | used for | inspired by |
|---|---|---|
| `series` | photography | Pierre Cathala, Rue Saint Abel — fixed text column, editorial image flow with numbered captions |
| `film` | videography | Iconoclast, Jean Khamkwan — full-screen film with big title, then a numbered image grid on black |
| `case` | digital / branding | Ard, KLSR, Yard — three-column header, then sections with sticky labels and figure grids |

All pages share the elements below. The home page and font size follow cathydolle.com:
- a minimal header: name and Projects on the left, Experimental zone and About on the right
- the cursor: a half-circle with a centre dot; it closes into a full circle on links and grows, turning slowly, with a label over images
- the image lightbox
- a slim "next project" line at the end of each project: keep scrolling to fill it, then a wipe opens the next one
- page transitions: in Chrome, Edge and Safari 18+, the clicked image glides into the next page; other browsers fade

## Editing content

Everything is in **`js/data.js`**:
- `SITE`: name, statement, education, contact
- `PROJECTS`: in display order. Numbers (ID 01, 02…) come from this order.
- `INTRO`: extra images for the opening mosaic (project previews are used too)
- each project's `thumb` is its preview in the projects column: `shape` is "P" (portrait 16×24vw) or "L" (landscape 24.25×13.9vw), the two frames of cathydolle.com, and `focus` is the crop point. Shapes are chosen to alternate down the column
- `EXPERIMENTAL`: the experimental zone pieces

Images are in `assets/<slug>/`, and `w`/`h` must match each image's pixel size. Export JPGs at about 2000px on the long edge, quality around 80.

### Videos

The videos currently stream from Cargo (`freight.cargo.site`) because the files are too big for GitHub (Nothing Changed is 139 MB). They will stop working if the Cargo site or its files are deleted. Before that happens, either:
- upload compressed versions (H.264 .mp4, under ~30 MB) to `assets/` and point `video.src` at them, or
- host them on Vimeo (a Pro plan gives a direct file link) and use that link.

## Preview locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. To see the entry screen again, open a new private window, or clear the site's session storage.

## Font

The site uses **Inter Tight** (Google Fonts) as a close, free match for Neue Montreal, the font on cathydolle.com. To use Neue Montreal itself (free for personal use from Pangram Pangram), add the font files and change `--font` at the top of `css/style.css`.

## Publishing

Any static host works: GitHub Pages, Netlify, Cloudflare Pages or Vercel.
