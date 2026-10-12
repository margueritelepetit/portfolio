// Shared by every page: helpers, header, about overlay, cursor,
// page transitions, lightbox, scroll reveals and the "next project" pull.

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const esc = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const pad = (n) => String(n).padStart(2, "0");
const mod = (n, m) => ((n % m) + m) % m;
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const projectUrl = (p) => `project.html?p=${encodeURIComponent(p.slug)}`;
const projectNumber = (p) => pad(PROJECTS.indexOf(p) + 1);

const PAGE = document.body.dataset.page;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const isMobile = () => innerWidth <= 760;
// Chrome/Edge/Safari 18+ animate between pages natively (see @view-transition in CSS).
const crossDocVT = "onpagereveal" in window;

const session = {
  get(key) {
    try { return sessionStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { sessionStorage.setItem(key, value); } catch {}
  },
};

/* ── Header ─────────────────────────────────────────────── */


function renderHeader() {
  const onProjects = PAGE === "home" || PAGE === "project";
  $("#site-header").innerHTML = `
    <a class="name" href="index.html">${esc(SITE.name)}</a>
    <a class="projects-link" href="index.html"${onProjects ? ' aria-current="page"' : ""}>Projects</a>
    <div class="right">
      <a href="experimental.html"${PAGE === "experimental" ? ' aria-current="page"' : ""}>
        <span class="long">Experimental zone</span><span class="short">Lab</span></a>
      <button class="about-toggle" aria-expanded="false" aria-controls="about">About</button>
    </div>`;
}

/* ── About overlay ──────────────────────────────────────── */

function renderAbout() {
  const el = document.createElement("div");
  el.className = "about";
  el.id = "about";
  el.setAttribute("aria-hidden", "true");
  const rows = (list) => list.map(([a, b]) => `<li><span>${esc(a)}</span><span>${esc(b)}</span></li>`).join("");
  el.innerHTML = `
    <div class="about-inner">
      <div class="about-col">
        <p class="ui">Work and intentions</p>
        ${SITE.statement.map((t) => `<p>${esc(t)}</p>`).join("")}
        <p class="ui disciplines">${SITE.disciplines.map(esc).join("<br>")}</p>
      </div>
      <div class="about-col">
        <p class="ui muted">Education</p>
        <ul class="rows">${rows(SITE.education)}</ul>
        <p class="ui muted">Occupation</p>
        <ul class="rows">${rows(SITE.occupation)}</ul>
        <p class="ui muted">Contact</p>
        <ul class="rows">
          <li><span>Mail</span><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></li>
          ${SITE.socials.map((s) => `<li><span>${esc(s.label)}</span><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.handle)}</a></li>`).join("")}
          <li><span>Based in</span><span>${esc(SITE.location)}</span></li>
        </ul>
      </div>
    </div>`;
  document.body.appendChild(el);

  const toggle = $(".about-toggle");
  const setOpen = (open) => {
    document.body.classList.toggle("about-open", open);
    el.setAttribute("aria-hidden", !open);
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "Close" : "About";
  };
  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("about-open")));
  el.addEventListener("click", (e) => e.target.closest(".about-col") || setOpen(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
  if (document.body.dataset.about === "open") setOpen(true);
}

/* ── Cursor: a small square that adapts to what it's over ── */
// Elements can set data-cursor="Label" to show a word beside it.

function initCursor() {
  if (!finePointer || reducedMotion) return;
  const c = document.createElement("div");
  c.className = "cursor";
  c.setAttribute("aria-hidden", "true");
  c.innerHTML = '<span class="cursor-box"></span><span class="cursor-label"></span>';
  document.body.appendChild(c);
  document.documentElement.classList.add("has-cursor");
  const label = $(".cursor-label", c);

  let x = -100, y = -100, cx = x, cy = y;
  addEventListener("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;
    const target = e.target.closest?.("[data-cursor]");
    const link = e.target.closest?.("a, button, [role=button]");
    const title = e.target.closest?.(".index-col button, .next-link");
    c.classList.toggle("is-label", !!target && !title);
    c.classList.toggle("is-title", !!title);
    c.classList.toggle("is-link", !target && !title && !!link);
    if (target && label.textContent !== target.dataset.cursor) label.textContent = target.dataset.cursor;
  }, { passive: true });
  document.addEventListener("pointerleave", () => { x = y = -100; });
  addEventListener("pointerdown", () => c.classList.add("is-down"));
  addEventListener("pointerup", () => c.classList.remove("is-down"));
  (function loop() {
    cx += (x - cx) * 0.3;
    cy += (y - cy) * 0.3;
    c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  })();
}

/* ── Page transitions ───────────────────────────────────── */
// Browsers with cross-document view transitions morph the clicked image
// into the next page's hero ("hero" view-transition-name). Others get a
// short fade handled here.

function clearHeroNames() {
  $$("[style*='view-transition-name']").forEach((el) => (el.style.viewTransitionName = ""));
}

function markHero(el) {
  if (!el || !crossDocVT) return;
  clearHeroNames();
  el.style.viewTransitionName = "hero";
}

function initPageTransitions() {
  if (crossDocVT) {
    // Once the incoming animation is done, free the name for the next navigation.
    addEventListener("pagereveal", (e) => {
      e.viewTransition?.ready.catch(() => {}); // a skipped transition is fine
      (e.viewTransition?.finished ?? Promise.resolve()).finally(() => setTimeout(clearHeroNames, 50));
    });
    // Leaving a project without picking a specific image (e.g. back to the
    // index): its hero is what morphs.
    addEventListener("pageswap", () => {
      if (!$("[style*='view-transition-name']")) markHero($("[data-hero]"));
    });
    return;
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
    e.preventDefault();
    navigate(url.href);
  });
  // Coming back via the back button restores a faded-out page from cache.
  addEventListener("pageshow", (e) => e.persisted && document.documentElement.classList.remove("is-leaving"));
}

function navigate(href) {
  if (crossDocVT || reducedMotion) {
    location.href = href;
    return;
  }
  document.documentElement.classList.add("is-leaving");
  setTimeout(() => (location.href = href), 380);
}

/* ── Reveal on scroll ───────────────────────────────────── */

function initReveal(root = document) {
  const els = $$("[data-reveal]", root);
  els.filter((el) => el.querySelector("[data-hero]")).forEach((el) => el.classList.add("in"));
  if (reducedMotion || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((el) => io.observe(el));
  // Whatever is on screen at load animates in right away.
  setTimeout(() => els.forEach((el) => el.getBoundingClientRect().top < innerHeight && el.classList.add("in")), 80);
}

/* ── Lightbox ───────────────────────────────────────────── */
// Any <img data-lightbox> inside root opens full screen; arrows cycle through them.

function initLightbox(root = document) {
  const imgs = $$("img[data-lightbox]", root);
  if (!imgs.length) return;
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Image viewer");
  box.hidden = true;
  box.innerHTML = `
    <img alt="" data-cursor="Next">
    <button class="lb-close ui">Close</button>
    <button class="lb-prev ui">Prev</button>
    <button class="lb-next ui">Next</button>
    <div class="lb-count ui"></div>`;
  document.body.appendChild(box);

  const big = $("img", box);
  const count = $(".lb-count", box);
  let current = 0;
  let lastFocus = null;

  const show = (i) => {
    current = mod(i, imgs.length);
    big.src = imgs[current].dataset.full || imgs[current].src;
    big.alt = imgs[current].alt;
    count.textContent = `${pad(current + 1)} / ${pad(imgs.length)}`;
  };
  const open = (i) => {
    lastFocus = document.activeElement;
    show(i);
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add("open"));
    document.documentElement.classList.add("lb-open");
    $(".lb-close", box).focus();
  };
  const close = () => {
    box.classList.remove("open");
    document.documentElement.classList.remove("lb-open");
    setTimeout(() => (box.hidden = true), 300);
    lastFocus?.focus();
  };

  imgs.forEach((el, i) => {
    el.dataset.cursor ||= "View";
    el.tabIndex = 0;
    el.addEventListener("click", () => open(i));
    el.addEventListener("keydown", (e) => e.key === "Enter" && open(i));
  });
  $(".lb-close", box).addEventListener("click", close);
  $(".lb-prev", box).addEventListener("click", () => show(current - 1));
  $(".lb-next", box).addEventListener("click", () => show(current + 1));
  big.addEventListener("click", () => show(current + 1));
  box.addEventListener("click", (e) => e.target === box && close());
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
}

/* ── Scroll on to the next project ──────────────────────── */
// A slim indicator at the end of each project. Scrolling past the end
// fills the line; when it's full a panel wipes across the screen and the
// next project opens behind it (clicking the indicator works too).

const WIPE_MS = 650;

function wipeTo(href) {
  const panel = document.createElement("div");
  panel.className = "wipe";
  document.body.appendChild(panel);
  session.set("wipe", "1");
  requestAnimationFrame(() => panel.classList.add("cover"));
  setTimeout(() => (location.href = href), reducedMotion ? 0 : WIPE_MS);
}

// On arrival after a wipe, the panel is already covering: lift it away.
function wipeIn() {
  if (session.get("wipe") !== "1") return;
  session.set("wipe", "");
  const panel = document.createElement("div");
  panel.className = "wipe cover";
  document.body.appendChild(panel);
  setTimeout(() => panel.classList.add("lift"), 120);
  setTimeout(() => panel.remove(), 120 + WIPE_MS + 100);
}

function initNextPull(section) {
  if (!section) return;
  const link = $(".next-link", section);
  const bar = $(".next-bar span", section);
  const pct = $(".next-pct", section);
  let progress = 0, target = 0, idle, done = false;

  const atBottom = () => innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
  const go = () => {
    if (done) return;
    done = true;
    target = 1;
    wipeTo(link.href);
  };
  const push = (delta) => {
    if (done || !atBottom() || delta <= 0) return;
    target = clamp(target + delta / 800, 0, 1);
    clearTimeout(idle);
    idle = setTimeout(() => !done && (target = 0), 900); // let go → line drains
    if (target >= 1) go();
  };

  addEventListener("wheel", (e) => push(e.deltaY * (e.deltaMode === 1 ? 40 : 1)), { passive: true });
  let lastY = null;
  addEventListener("touchstart", (e) => (lastY = e.touches[0].clientY), { passive: true });
  addEventListener("touchmove", (e) => {
    if (lastY === null) return;
    const y = e.touches[0].clientY;
    push((lastY - y) * 2.2);
    lastY = y;
  }, { passive: true });
  link.addEventListener("click", (e) => {
    e.preventDefault();
    go();
  });

  const tick = () => {
    progress += (target - progress) * 0.15;
    bar.style.transform = `scaleX(${progress})`;
    pct.textContent = `${String(Math.round(progress * 100)).padStart(3, "0")}%`;
    section.classList.toggle("pulling", progress > 0.02);
    setTimeout(tick, 16);
  };
  tick();
}

function nextHtml(p) {
  return `
    <section class="next" id="next">
      <a class="next-link ui" href="${projectUrl(p)}" data-cursor="Next">
        <span class="muted">Next project</span>
        <span class="next-name">${projectNumber(p)}/ ${esc(p.title)}</span>
        <span class="next-bar"><span></span></span>
        <span class="next-pct">000%</span>
      </a>
      <p class="next-hint ui muted">Keep scrolling <span class="next-arrow">↓</span></p>
    </section>`;
}

/* ── Boot shared parts ──────────────────────────────────── */

function bootSite() {
  renderHeader();
  renderAbout();
  initCursor();
  initPageTransitions();
  wipeIn();
}
