// Renders every page from the content in data.js.
// Each HTML page sets <body data-page="..."> to pick what gets built.

const $ = (sel, root = document) => root.querySelector(sel);

const esc = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const pad = (n) => String(n).padStart(2, "0");
const mod = (n, m) => ((n % m) + m) % m;
const projectUrl = (p) => `project.html?p=${encodeURIComponent(p.slug)}`;
const isVideo = (m) => m.type === "youtube" || m.type === "vimeo" || m.type === "file";

const PAGE = document.body.dataset.page;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const isMobile = () => innerWidth <= 760;

const store = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  },
};

/* ── Header, about overlay ──────────────────────────────── */

function renderHeader(activeCategory) {
  const filters = [
    ["all", "index.html", "All"],
    ["photography", "photography.html", "Photo"],
    ["videography", "videography.html", "Video"],
    ["design", "design.html", "Design"],
  ];
  const slotA =
    PAGE === "project"
      ? `<a href="index.html">← Index</a>`
      : `<button data-mode="list">List</button><button data-mode="slider">Slider</button>`;

  $("#site-header").innerHTML = `
    <a class="name" href="index.html">${esc(SITE.name)}</a>
    <div class="slot-a">${slotA}</div>
    <nav class="slot-b" aria-label="Categories">
      ${filters
        .map(([key, href, label]) => `<a href="${href}"${key === activeCategory ? ' aria-current="page"' : ""}>${label}</a>`)
        .join("")}
    </nav>
    <button class="slot-c about-toggle" aria-expanded="false" aria-controls="about">About</button>`;
}

function renderAbout() {
  const el = document.createElement("div");
  el.className = "about";
  el.id = "about";
  el.innerHTML = `
    <div class="about-inner">
      <p class="ui">${esc(SITE.tagline.replace(/\.$/, ""))}</p>
      <div class="about-bio">${SITE.about.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
      <div class="about-lists">
        <div><p class="ui muted">Services</p><ul>${SITE.services.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
        <div><p class="ui muted">Selected clients</p><ul>${SITE.clients.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></div>
      </div>
      <p class="ui muted">${esc(SITE.location)}</p>
      <div class="about-links ui">
        <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
        ${SITE.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("")}
      </div>
    </div>`;
  document.body.appendChild(el);

  const toggle = $(".about-toggle");
  const setOpen = (open) => {
    document.body.classList.toggle("about-open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "Close" : "About";
  };
  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("about-open")));
  // Clicking the empty overlay closes it; clicking text/links doesn't.
  el.addEventListener("click", (e) => e.target.closest(".about-inner") || setOpen(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
  if (document.body.dataset.about === "open") setOpen(true);
}

/* ── Custom cursor (desktop only) ───────────────────────── */

function initCursor() {
  if (!finePointer || reducedMotion) return;
  const c = document.createElement("div");
  c.className = "cursor";
  c.innerHTML = '<span class="cursor-box"></span><span class="cursor-label ui">Open project</span>';
  document.body.appendChild(c);
  document.body.classList.add("has-cursor");

  let x = -100, y = -100, cx = x, cy = y;
  addEventListener("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;
    c.classList.toggle("is-over", !!e.target.closest(".item"));
    c.classList.toggle("is-link", !e.target.closest(".item") && !!e.target.closest("a, button"));
  });
  document.addEventListener("pointerleave", () => { x = y = -100; });
  (function loop() {
    cx += (x - cx) * 0.35;
    cy += (y - cy) * 0.35;
    c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  })();
}

/* ── Intro loader: blinking square → row of thumbnails ──── */

function runLoader(projects) {
  const loader = $("#loader");
  let seen = false;
  try { seen = !!sessionStorage.getItem("intro-seen"); sessionStorage.setItem("intro-seen", "1"); } catch {}

  loader.innerHTML = `<span class="loader-dot"></span><div class="loader-row">${projects.map(() => "<span></span>").join("")}</div>`;
  const slots = loader.querySelectorAll(".loader-row span");

  // Load every cover once to learn its aspect ratio; show it as a thumbnail when ready.
  const ratios = projects.map((p, i) =>
    new Promise((resolve) => {
      const img = new Image();
      const done = (ratio) => {
        loader.classList.add("has-thumbs");
        slots[i].classList.add("in");
        resolve(ratio);
      };
      const timer = setTimeout(() => done(p.ratio || 0.75), 8000);
      img.onload = () => {
        clearTimeout(timer);
        slots[i].appendChild(img);
        done(p.ratio || img.naturalWidth / img.naturalHeight);
      };
      img.onerror = () => { clearTimeout(timer); done(p.ratio || 0.75); };
      img.alt = "";
      img.src = p.cover;
    })
  );

  return Promise.all(ratios).then(
    (r) =>
      new Promise((resolve) =>
        setTimeout(() => {
          loader.classList.add("done");
          resolve(r);
        }, seen || reducedMotion ? 150 : 700)
      )
  );
}

/* ── Gallery (home + category pages) ────────────────────── */

async function initGallery() {
  const cat = document.body.dataset.category || "all";
  const projects = cat === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === cat);
  const stage = $("#stage");
  const index = $("#index");

  $("#site-footer").innerHTML = `<span class="ui active-label" id="active-label"></span>
    <a class="ui contact" href="mailto:${esc(SITE.email)}">Contact</a>`;
  const label = $("#active-label");

  if (!projects.length) {
    $("#loader").remove();
    stage.innerHTML = '<p class="ui empty">No work here yet</p>';
    return;
  }

  // Numbered index split into two columns (left / right), like a table of contents.
  const half = Math.ceil(projects.length / 2);
  const row = (p, i) =>
    `<li><button data-i="${i}"><span class="num">${pad(i + 1)}/</span><span class="title">${esc(p.title)}</span></button></li>`;
  index.innerHTML = `
    <ol class="index-col left">${projects.slice(0, half).map((p, i) => row(p, i)).join("")}</ol>
    <ol class="index-col right">${projects.slice(half).map((p, i) => row(p, i + half)).join("")}</ol>`;
  index.style.setProperty("--rows", half);
  const indexButtons = [...index.querySelectorAll("button")];

  const ratios = await runLoader(projects);

  let mode = store.get("gallery-mode") === "slider" ? "slider" : "list";
  let els = [];
  let total = 0;
  let current = 0;
  let target = 0;
  let active = -1;

  // Every image gets roughly the same visual area, so portraits are narrow and landscapes wide.
  function sizeFor(ar) {
    const vw = innerWidth, vh = innerHeight;
    let w;
    if (mode === "list") {
      const portraitW = isMobile() ? vw * 0.6 : Math.max(vw * 0.16, 170);
      w = Math.sqrt(((portraitW * portraitW) / (2 / 3)) * ar);
      w = Math.min(w, vw - 32);
    } else {
      const portraitH = isMobile() ? vh * 0.55 : vh * 0.74;
      w = Math.sqrt(portraitH * (portraitH * (2 / 3)) * ar);
      w = Math.min(w, vw * (isMobile() ? 0.85 : 0.6));
    }
    return [w, w / ar];
  }

  const span = () => (mode === "list" ? innerHeight : innerWidth);

  function build(focus = 0) {
    document.body.classList.toggle("mode-list", mode === "list");
    document.body.classList.toggle("mode-slider", mode === "slider");
    document.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.mode === mode));

    stage.innerHTML = "";
    els = [];
    total = 0;
    const sizes = projects.map((p, i) => sizeFor(ratios[i]));
    const maxSize = Math.max(...sizes.map(([w, h]) => (mode === "list" ? h : w)));

    // Repeat the set until it's long enough to loop seamlessly.
    for (let rep = 0; rep === 0 || (total < span() + maxSize * 2 && rep < 30); rep++) {
      projects.forEach((p, pi) => {
        const [w, h] = sizes[pi];
        const a = document.createElement("a");
        a.className = "item";
        a.href = projectUrl(p);
        a.style.width = `${w}px`;
        a.style.height = `${h}px`;
        a.style.setProperty("--d", `${Math.min(els.length * 0.05, 0.8)}s`);
        if (rep > 0) {
          a.tabIndex = -1;
          a.setAttribute("aria-hidden", "true");
        }
        a.innerHTML = `<img src="${esc(p.cover)}" alt="${esc(p.title)}" draggable="false">${
          p.media.some(isVideo) ? '<span class="badge ui">Video</span>' : ""
        }`;
        stage.appendChild(a);
        const size = mode === "list" ? h : w;
        els.push({ el: a, pi, size, offset: total });
        total += size;
      });
    }
    current = target = centerOf(focus);
    active = -1;
  }

  // Scroll position that centres the copy of project `pi` nearest to where we are now.
  function centerOf(pi) {
    const it = els.find((e) => e.pi === pi);
    let s = it.offset + it.size / 2 - span() / 2;
    if (total) s += Math.round((current - s) / total) * total;
    return s;
  }

  function setActive(pi) {
    if (pi === active) return;
    active = pi;
    indexButtons.forEach((b, i) => b.classList.toggle("is-active", i === pi));
    label.textContent = pi >= 0 ? `${pad(pi + 1)}/ ${projects[pi].title}` : "";
  }

  function render() {
    current += (target - current) * (reducedMotion ? 1 : 0.085);
    if (Math.abs(target - current) < 0.05) current = target;
    const s = span();
    const center = s / 2;
    const margin = (total - s) / 2;
    let found = -1;
    for (const it of els) {
      const pos = mod(it.offset - current + margin, total) - margin;
      it.el.style.transform = mode === "list" ? `translate3d(-50%, ${pos}px, 0)` : `translate3d(${pos}px, -50%, 0)`;
      if (pos <= center && pos + it.size > center) found = it.pi;
    }
    setActive(found);
    requestAnimationFrame(render);
  }

  build(0);
  // Timer, not rAF: rAF doesn't fire in background tabs, which would leave images hidden.
  setTimeout(() => document.body.classList.add("ready"), 30);
  render();

  /* Input: wheel, touch, keys, index clicks, mode toggle */

  addEventListener(
    "wheel",
    (e) => {
      if (document.body.classList.contains("about-open")) return;
      e.preventDefault();
      target += (e.deltaY + e.deltaX) * (e.deltaMode === 1 ? 40 : 1);
    },
    { passive: false }
  );

  let touchPos = null, velocity = 0, dragged = false;
  const touchCoord = (t) => (mode === "list" ? t.clientY : Math.abs(t.clientX - touchPos.x0) > Math.abs(t.clientY - touchPos.y0) ? t.clientX : t.clientY);
  stage.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    touchPos = { x0: t.clientX, y0: t.clientY, last: mode === "list" ? t.clientY : t.clientX };
    velocity = 0;
    dragged = false;
  }, { passive: true });
  stage.addEventListener("touchmove", (e) => {
    if (!touchPos) return;
    e.preventDefault();
    const now = touchCoord(e.touches[0]);
    const delta = touchPos.last - now;
    touchPos.last = now;
    velocity = delta;
    target += delta * 1.3;
    if (Math.abs(e.touches[0].clientX - touchPos.x0) + Math.abs(e.touches[0].clientY - touchPos.y0) > 8) dragged = true;
  }, { passive: false });
  stage.addEventListener("touchend", () => {
    target += velocity * 14;
    touchPos = null;
  });
  // A swipe shouldn't count as a tap on a project.
  stage.addEventListener("click", (e) => dragged && e.preventDefault(), true);

  document.addEventListener("keydown", (e) => {
    if (document.body.classList.contains("about-open")) return;
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    target = centerOf(mod((active < 0 ? 0 : active) + step, projects.length));
  });

  index.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn) target = centerOf(Number(btn.dataset.i));
  });

  function switchMode(next) {
    if (next === mode) return;
    const focus = Math.max(active, 0);
    stage.classList.add("switching");
    setTimeout(() => {
      mode = next;
      store.set("gallery-mode", mode);
      build(focus);
      stage.classList.remove("switching");
    }, reducedMotion ? 0 : 350);
  }
  document.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => switchMode(b.dataset.mode)));

  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => build(Math.max(active, 0)), 150);
  });
}

/* ── Project page ───────────────────────────────────────── */

function mediaHtml(m, i, title) {
  switch (m.type) {
    case "image":
      return `<figure class="media-item"><img src="${esc(m.src)}" alt="${esc(m.alt || title)}" data-index="${i}">${
        m.caption ? `<figcaption class="ui muted">${esc(m.caption)}</figcaption>` : ""
      }</figure>`;
    case "youtube":
      return `<figure class="media-item video"><iframe src="https://www.youtube-nocookie.com/embed/${esc(m.id)}" title="${esc(title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></figure>`;
    case "vimeo":
      return `<figure class="media-item video"><iframe src="https://player.vimeo.com/video/${esc(m.id)}" title="${esc(title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></figure>`;
    case "file":
      return `<figure class="media-item video"><video src="${esc(m.src)}" ${m.poster ? `poster="${esc(m.poster)}"` : ""} controls playsinline preload="metadata"></video></figure>`;
    default:
      return "";
  }
}

function initProject() {
  const slug = new URLSearchParams(location.search).get("p");
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const root = $("#project");

  if (index === -1) {
    renderHeader(null);
    root.innerHTML = `<div class="not-found ui">Project not found — <a href="index.html">Back to index</a></div>`;
    return;
  }

  const p = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  document.title = `${p.title} — ${SITE.name}`;
  renderHeader(p.category);

  root.innerHTML = `
    <aside class="project-info">
      <p class="ui muted">${pad(index + 1)}/</p>
      <h1 class="ui">${esc(p.title)}</h1>
      <div class="desc">${p.description.map((d) => `<p>${esc(d)}</p>`).join("")}</div>
    </aside>
    <dl class="project-facts ui">
      <div><dt>Category</dt><dd>${CATEGORIES[p.category]}</dd></div>
      <div><dt>Year</dt><dd>${p.year}</dd></div>
      <div><dt>Client</dt><dd>${esc(p.client)}</dd></div>
      <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
    </dl>
    <div class="project-media">${p.media.map((m, i) => mediaHtml(m, i, p.title)).join("")}</div>`;

  $("#site-footer").innerHTML = `
    <a class="ui" href="${projectUrl(prev)}">← ${esc(prev.title)}</a>
    <a class="ui" href="${projectUrl(next)}">${esc(next.title)} →</a>`;

  initLightbox(p.media.filter((m) => m.type === "image"), root);
}

/* ── Lightbox for project images ────────────────────────── */

function initLightbox(images, root) {
  if (!images.length) return;
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.hidden = true;
  box.innerHTML = `
    <img alt="">
    <button class="lb-close ui">Close</button>
    <button class="lb-prev ui">Prev</button>
    <button class="lb-next ui">Next</button>
    <div class="lb-count ui"></div>`;
  document.body.appendChild(box);

  const img = $("img", box);
  const count = $(".lb-count", box);
  let current = 0;

  const show = (i) => {
    current = mod(i, images.length);
    img.src = images[current].src;
    img.alt = images[current].alt || "";
    count.textContent = `${pad(current + 1)}/${pad(images.length)}`;
  };
  const open = (i) => {
    show(i);
    box.hidden = false;
    document.body.style.overflow = "hidden";
    $(".lb-close", box).focus();
  };
  const close = () => {
    box.hidden = true;
    document.body.style.overflow = "";
  };

  // Position among images only (videos excluded).
  root.querySelectorAll(".media-item img").forEach((el, i) => el.addEventListener("click", () => open(i)));

  $(".lb-close", box).addEventListener("click", close);
  $(".lb-prev", box).addEventListener("click", () => show(current - 1));
  $(".lb-next", box).addEventListener("click", () => show(current + 1));
  img.addEventListener("click", () => show(current + 1));
  box.addEventListener("click", (e) => e.target === box && close());
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
}

/* ── Boot ───────────────────────────────────────────────── */

if (PAGE === "project") {
  initProject();
} else {
  renderHeader(document.body.dataset.category || "all");
  initCursor();
  initGallery();
}
renderAbout();
