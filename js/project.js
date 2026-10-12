// Project pages. One URL (project.html?p=<slug>), three layouts:
//   series — photography: fixed text column, editorial image flow
//   film   — videography: full-screen film, then a numbered image grid
//   case   — digital / branding: case study in sections

const metaHtml = (p) =>
  `<dl class="meta ui">${p.meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;
const textHtml = (paras = []) => paras.map((t) => `<p>${esc(t)}</p>`).join("");
const isPortrait = (m) => m.h >= m.w * 1.05;

function imgHtml(m, alt, { hero = false } = {}) {
  return `<img src="${esc(m.src)}" alt="${esc(alt)}" width="${m.w}" height="${m.h}" style="--r:${(m.w / m.h).toFixed(4)}"${
    hero ? " data-hero" : ' loading="lazy"'
  } data-lightbox>`;
}

/* ── Series (photography) ───────────────────────────────── */
// Images flow in a rhythm of full-height singles, pairs and offset
// singles, so each series reads like a printed editorial.

function seriesRows(media) {
  const pattern = ["full", "pair", "right", "pair", "left"];
  const rows = [];
  let i = 0, step = 0;
  while (i < media.length) {
    const a = media[i], b = media[i + 1];
    let kind = i === 0 ? "full" : pattern[step % pattern.length];
    if (kind === "pair" && !(b && isPortrait(a) && isPortrait(b))) kind = isPortrait(a) ? (step % 2 ? "right" : "left") : "full";
    if (kind !== "pair" && !isPortrait(a)) kind = "full";
    rows.push({ kind, items: kind === "pair" ? [a, b] : [a], start: i });
    i += kind === "pair" ? 2 : 1;
    step++;
  }
  return rows;
}

function seriesHtml(p, num) {
  const total = p.media.length;
  const rows = seriesRows(p.media)
    .map(
      (r) => `
      <div class="row row-${r.kind}">
        ${r.items
          .map(
            (m, k) => `
          <figure data-reveal style="--r:${(m.w / m.h).toFixed(4)}">
            ${imgHtml(m, `${p.title} — image ${r.start + k + 1}`, { hero: r.start + k === 0 })}
            <figcaption class="ui muted">${pad(r.start + k + 1)} / ${pad(total)}</figcaption>
          </figure>`
          )
          .join("")}
      </div>`
    )
    .join("");
  return `
    <div class="series">
      <aside class="series-info">
        <p class="ui muted">ID ${num} — ${esc(CATEGORIES[p.category])}</p>
        <h1 class="ui">${esc(p.title)}</h1>
        <p class="ui muted">${esc(p.subtitle || "")}</p>
        ${metaHtml(p)}
        <div class="text">${textHtml(p.text)}</div>
        ${p.quote ? `<blockquote>“${esc(p.quote)}”</blockquote>` : ""}
        <a class="ui back" href="index.html">← Back to projects</a>
      </aside>
      <div class="series-media">${rows}</div>
    </div>`;
}

/* ── Film (videography) ─────────────────────────────────── */

function filmHtml(p, num) {
  return `
    <section class="film-hero">
      <video class="film-video" data-hero src="${esc(p.video.src)}" poster="${esc(p.video.poster)}"
        muted autoplay loop playsinline preload="auto" data-cursor="Sound on"></video>
      <div class="film-overlay">
        <p class="ui">ID ${num} — ${esc(p.subtitle || CATEGORIES[p.category])}</p>
        <h1 class="display">${esc(p.title)}</h1>
      </div>
      <div class="film-controls ui">
        <button class="film-sound" aria-pressed="false">Sound off</button>
        <span class="film-progress" aria-hidden="true"><span></span></span>
        <span class="film-time">00:00</span>
        <button class="film-full">Full screen</button>
      </div>
    </section>
    <section class="film-info" id="film-info">
      <div data-reveal>
        <p class="ui muted">ID ${num}</p>
        <h2 class="ui">${esc(p.title)}</h2>
        <a class="ui back" href="index.html">← Back to projects</a>
      </div>
      <div class="text" data-reveal>${textHtml(p.text)}</div>
      <div data-reveal>${metaHtml(p)}</div>
    </section>
    <section class="film-grid">
      <p class="ui muted section-label">Editorial — ${pad(p.media.length)} images</p>
      <div class="tiles">
        ${p.media
          .map(
            (m, i) => `
          <figure class="tile" data-reveal>
            <span class="ui tile-num">${pad(i + 1)}</span>
            ${imgHtml(m, `${p.title} — editorial image ${i + 1}`)}
          </figure>`
          )
          .join("")}
      </div>
    </section>`;
}

function initFilm(root) {
  const video = $(".film-video", root);
  const sound = $(".film-sound", root);
  const bar = $(".film-progress span", root);
  const time = $(".film-time", root);
  const fmt = (s) => `${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}`;

  const setMuted = (muted) => {
    video.muted = muted;
    if (!muted) {
      video.volume = 0.6;
      video.play().catch(() => {});
    }
    sound.textContent = muted ? "Sound off" : "Sound on";
    sound.setAttribute("aria-pressed", !muted);
    video.dataset.cursor = muted ? "Sound on" : "Sound off";
    $(".cursor-label")?.replaceChildren(video.dataset.cursor);
  };
  video.addEventListener("click", () => setMuted(!video.muted));
  sound.addEventListener("click", () => setMuted(!video.muted));
  $(".film-full", root).addEventListener("click", () => {
    setMuted(false);
    (video.requestFullscreen || video.webkitEnterFullscreen)?.call(video);
  });
  video.addEventListener("timeupdate", () => {
    if (!video.duration) return;
    bar.style.transform = `scaleX(${video.currentTime / video.duration})`;
    time.textContent = fmt(video.currentTime);
  });
  // Pause when scrolled away, resume when back.
  new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()), { threshold: 0.15 }).observe(video);
}

/* ── Case study (digital / branding) ────────────────────── */

function caseHtml(p, num) {
  let fig = 0, sec = 0;
  const sections = p.sections
    .map((s) => {
      if (s.quote) return `<blockquote class="case-quote" data-reveal>“${esc(s.quote)}”</blockquote>`;
      if (s.title) sec++;
      const label = s.title
        ? `<p class="ui"><span class="muted">${pad(sec)}</span>&nbsp;&nbsp;${esc(s.title)}</p>`
        : "";
      const items = s.items
        ? `<dl class="items">${s.items.map(([a, b]) => `<div><dt class="ui">${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl>`
        : "";
      const video = s.video
        ? `<figure class="span-all" data-reveal><video data-autoplay src="${esc(s.video.src)}" muted loop playsinline preload="metadata"
            style="aspect-ratio:${s.video.w}/${s.video.h}"></video><figcaption class="ui muted">Prototype demo</figcaption></figure>`
        : "";
      return `
        <section class="case-sec${s.title ? "" : " cont"}">
          <div class="case-label">${label}<div class="text">${textHtml(s.text)}</div>${items}</div>
          <div class="case-media layout-${s.layout}">
            ${video}
            ${s.media
              .map(
                (m) => `
              <figure data-reveal>
                ${imgHtml(m, `${p.title}${s.title ? ` — ${s.title}` : ""}`)}
                <figcaption class="ui muted">Fig. ${pad(++fig)}</figcaption>
              </figure>`
              )
              .join("")}
          </div>
        </section>`;
    })
    .join("");

  return `
    <header class="case-head">
      <div data-reveal>
        <p class="ui muted">ID ${num} — ${esc(CATEGORIES[p.category])}</p>
        <h1 class="ui">${esc(p.title)}</h1>
        <p class="ui muted">${esc(p.subtitle || "")}</p>
      </div>
      <div class="text" data-reveal>${textHtml(p.text)}</div>
      <div data-reveal>${metaHtml(p)}</div>
    </header>
    <figure class="case-hero" data-reveal>${imgHtml(p.hero, p.title, { hero: true })}</figure>
    ${sections}
    <p class="case-back"><a class="ui back" href="index.html">← Back to projects</a></p>`;
}

// Inline videos only play while on screen (they stream from Cargo).
function initInlineVideos(root) {
  const vids = $$("video[data-autoplay]", root);
  if (!vids.length) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => (e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause())),
    { threshold: 0.2 }
  );
  vids.forEach((v) => io.observe(v));
}

/* ── Boot ───────────────────────────────────────────────── */

(function initProject() {
  const root = $("#project");
  const slug = new URLSearchParams(location.search).get("p");
  const index = PROJECTS.findIndex((p) => p.slug === slug);

  if (index === -1) {
    bootSite();
    root.innerHTML = `<div class="not-found ui">Project not found — <a href="index.html">Back to index</a></div>`;
    return;
  }

  const p = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const num = pad(index + 1);
  if (p.template === "film") {
    document.documentElement.classList.add("theme-dark");
    document.body.classList.add("t-film-page");
  }
  document.title = `${p.title} — ${SITE.name}`;
  session.set("last", p.slug);
  bootSite();

  const render = { series: seriesHtml, film: filmHtml, case: caseHtml }[p.template];
  root.className = `project t-${p.template}`;
  root.innerHTML = render(p, num) + nextHtml(next);

  markHero($("[data-hero]", root));
  initLightbox(root);
  initReveal(root);
  initInlineVideos(root);
  initNextPull($("#next", root));
  // The fixed series column steps aside when the next project comes up.
  new IntersectionObserver(([e]) => document.body.classList.toggle("at-next", e.isIntersecting), { threshold: 0.25 })
    .observe($("#next", root));
  if (p.template === "film") initFilm(root);
})();
