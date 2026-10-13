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

// The logo, traced from Marguerite's mark: outer contour, then the inner ring.
const LOGO_PATHS = [
  "M306.0 92.9C300.5 92.6 295.5 92.7 290.0 93.2C284.5 93.7 278.2 95.0 273.0 96.1C267.8 97.2 264.8 97.9 259.0 99.9C253.2 101.9 247.5 103.3 238.0 107.9C228.5 112.6 213.3 120.3 202.0 127.9C190.7 135.5 180.2 143.9 170.0 153.6C159.8 163.2 149.8 174.8 141.0 185.7C132.2 196.7 124.7 206.6 117.0 219.0C109.3 231.4 101.9 245.2 94.9 260.0C87.9 274.8 79.5 295.5 74.9 308.0C70.4 320.5 68.8 329.2 67.3 335.0C65.9 340.8 66.5 339.3 66.2 343.0C65.8 346.7 64.9 351.2 65.2 357.0C65.6 362.8 67.5 373.7 68.4 378.0C69.3 382.3 69.5 381.3 70.5 383.0C71.6 384.7 72.2 386.3 74.7 388.0C77.1 389.7 81.4 392.7 85.0 393.4C88.6 394.2 92.8 393.5 96.0 392.5C99.2 391.6 101.7 389.8 104.0 387.7C106.3 385.6 108.1 384.1 110.1 380.0C112.1 375.9 113.7 379.3 115.9 363.0C118.0 346.7 120.8 302.0 123.0 282.0C125.1 262.0 126.9 253.2 128.9 243.0C130.9 232.8 133.0 227.2 135.0 221.0C136.9 214.8 138.4 211.2 140.7 206.0C142.9 200.8 145.1 196.0 148.5 190.0C151.8 184.0 156.2 176.2 160.8 170.0C165.3 163.8 169.8 158.6 176.0 152.8C182.2 146.9 192.7 139.0 198.0 135.0C203.3 130.9 202.7 131.2 208.0 128.5C213.3 125.8 222.8 121.1 230.0 118.7C237.2 116.3 243.5 114.8 251.0 113.9C258.5 113.0 269.3 113.1 275.0 113.3C280.7 113.5 280.3 113.7 285.0 115.4C289.7 117.0 298.5 120.4 303.0 123.0C307.5 125.7 309.3 128.0 312.0 131.3C314.7 134.6 317.4 139.1 319.3 143.0C321.3 146.9 322.7 151.0 323.6 155.0C324.5 159.0 324.7 161.7 324.8 167.0C324.8 172.3 324.4 182.2 323.9 187.0C323.3 191.8 322.6 192.5 321.4 196.0C320.3 199.5 319.4 203.3 317.0 208.0C314.6 212.7 309.0 221.3 307.0 224.2C305.0 227.1 306.7 226.0 305.0 225.5C303.3 225.0 300.7 222.5 297.0 221.2C293.3 220.0 286.8 218.7 283.0 218.2C279.2 217.6 279.0 217.6 274.0 217.9C269.0 218.3 261.2 218.2 253.0 220.2C244.8 222.2 233.3 226.3 225.0 230.0C216.7 233.6 210.0 237.9 203.0 242.1C196.0 246.3 186.8 254.2 183.0 255.2C179.2 256.2 180.8 250.5 180.2 248.0C179.6 245.5 179.3 243.2 179.4 240.0C179.5 236.8 180.2 232.0 180.8 229.0C181.5 226.0 181.4 225.5 183.3 222.0C185.3 218.5 189.7 211.5 192.5 208.0C195.3 204.5 197.3 203.1 200.0 201.0C202.7 198.9 205.7 197.3 209.0 195.5C212.3 193.7 215.5 191.6 220.0 190.3C224.5 189.0 230.7 187.9 236.0 187.7C241.3 187.4 244.7 187.1 252.0 188.9C259.3 190.7 274.2 196.7 280.0 198.4C285.8 200.0 284.8 198.9 287.0 198.8C289.2 198.7 291.2 198.4 293.0 197.7C294.8 197.1 296.8 195.8 298.0 194.9C299.2 193.9 300.0 193.5 300.4 192.0C300.7 190.5 301.3 188.1 300.2 186.0C299.2 183.9 296.4 181.0 294.0 179.4C291.6 177.8 289.0 177.0 286.0 176.3C283.0 175.6 282.5 174.8 276.0 175.1C269.5 175.5 255.8 176.6 247.0 178.2C238.2 179.9 229.0 182.8 223.0 184.9C217.0 187.0 216.0 187.8 211.0 190.8C206.0 193.8 197.7 198.8 193.2 203.0C188.7 207.2 186.5 210.8 183.9 216.0C181.2 221.2 178.3 229.0 177.2 234.0C176.1 239.0 176.7 242.0 177.3 246.0C177.8 250.0 183.5 252.7 180.5 258.0C177.5 263.3 164.5 272.3 159.2 278.0C153.8 283.7 152.0 286.7 148.3 292.0C144.6 297.3 139.6 304.8 136.9 310.0C134.2 315.2 133.2 319.3 132.0 323.0C130.8 326.7 130.4 327.2 129.7 332.0C129.1 336.8 127.9 346.5 128.3 352.0C128.7 357.5 130.1 360.2 132.1 365.0C134.1 369.8 136.9 376.4 140.3 381.0C143.6 385.6 147.5 389.1 152.0 392.4C156.5 395.6 162.5 398.3 167.0 400.3C171.5 402.3 174.0 403.4 179.0 404.3C184.0 405.3 191.2 405.8 197.0 406.1C202.8 406.3 209.0 406.2 214.0 405.7C219.0 405.2 222.8 404.1 227.0 403.1C231.2 402.2 233.0 402.1 239.0 400.1C245.0 398.1 253.5 395.7 263.0 391.1C272.5 386.6 285.0 380.2 296.0 372.9C307.0 365.5 318.8 356.5 329.1 347.0C339.4 337.5 349.8 325.3 357.7 316.0C365.7 306.7 369.2 302.7 376.6 291.0C384.1 279.3 394.4 262.2 402.4 246.0C410.4 229.8 419.3 209.0 424.6 194.0C430.0 179.0 432.9 166.5 434.5 156.0C436.2 145.5 435.1 136.5 434.8 131.0C434.5 125.5 433.5 125.3 432.7 123.0C432.0 120.7 431.4 118.8 430.4 117.0C429.4 115.2 428.7 113.7 426.7 112.0C424.6 110.3 420.3 107.8 418.0 106.7C415.7 105.6 414.8 105.4 413.0 105.3C411.2 105.2 409.5 105.2 407.0 106.1C404.5 106.9 400.4 108.7 398.0 110.4C395.6 112.0 394.0 114.1 392.5 116.0C391.1 117.9 390.7 118.2 389.3 122.0C388.0 125.8 386.5 121.7 384.4 139.0C382.3 156.3 378.6 208.7 376.9 226.0C375.3 243.3 376.0 235.7 374.6 243.0C373.2 250.3 370.8 261.8 368.4 270.0C366.1 278.2 363.1 285.5 360.5 292.0C357.9 298.5 356.8 302.0 352.8 309.0C348.7 316.0 341.6 326.8 336.0 333.9C330.4 341.0 325.3 345.7 319.0 351.4C312.7 357.0 306.3 362.6 298.0 367.5C289.7 372.5 277.8 378.0 269.0 381.0C260.2 384.1 251.3 385.0 245.0 385.8C238.7 386.7 236.3 386.5 231.0 385.9C225.7 385.4 218.8 384.5 213.0 382.6C207.2 380.6 200.0 376.6 196.0 374.1C192.0 371.6 191.6 371.1 189.0 367.7C186.4 364.4 182.6 358.1 180.6 354.0C178.6 349.9 177.8 347.2 177.1 343.0C176.3 338.8 175.6 335.2 175.9 329.0C176.1 322.8 177.0 312.5 178.5 306.0C180.0 299.5 182.2 295.2 184.6 290.0C187.1 284.8 191.6 277.6 193.3 275.0C195.1 272.4 192.4 273.3 195.0 274.1C197.6 274.9 204.8 278.5 209.0 279.7C213.2 280.9 215.5 281.1 220.0 281.2C224.5 281.3 230.7 281.1 236.0 280.4C241.3 279.8 246.5 278.8 252.0 277.5C257.5 276.1 262.8 274.7 269.0 272.1C275.2 269.6 281.0 266.8 289.0 262.1C297.0 257.4 311.8 245.7 317.0 243.9C322.2 242.0 319.3 247.8 320.0 251.0C320.6 254.2 321.6 258.7 321.0 263.0C320.4 267.3 318.5 272.3 316.4 277.0C314.3 281.7 312.1 286.7 308.4 291.0C304.7 295.3 299.1 299.5 294.0 302.5C288.9 305.6 282.0 307.9 278.0 309.3C274.0 310.7 274.3 310.8 270.0 311.1C265.7 311.3 260.7 312.6 252.0 310.7C243.3 308.9 225.5 301.6 218.0 300.1C210.5 298.6 209.5 301.1 207.0 301.8C204.5 302.4 204.1 303.1 203.0 304.0C201.9 304.9 201.2 306.0 200.7 307.0C200.2 308.0 199.8 308.8 199.8 310.0C199.9 311.2 199.7 312.3 200.8 314.0C202.0 315.7 204.8 318.6 206.8 320.0C208.8 321.4 210.1 321.7 213.0 322.4C215.9 323.1 218.5 324.1 224.0 324.1C229.5 324.1 239.5 323.3 246.0 322.4C252.5 321.5 258.0 320.0 263.0 318.7C268.0 317.4 271.2 316.7 276.0 314.7C280.8 312.8 286.9 310.1 292.0 307.2C297.1 304.2 302.1 301.5 306.4 297.0C310.8 292.5 315.6 284.5 318.2 280.0C320.8 275.5 320.9 273.7 321.8 270.0C322.7 266.3 323.9 262.8 323.6 258.0C323.4 253.2 318.2 246.2 320.2 241.0C322.3 235.8 331.5 231.3 335.9 227.0C340.2 222.7 342.5 219.8 346.3 215.0C350.0 210.2 355.0 203.7 358.4 198.0C361.9 192.3 364.9 186.8 367.1 181.0C369.3 175.2 371.0 169.0 371.8 163.0C372.6 157.0 372.4 150.0 371.8 145.0C371.2 140.0 370.1 137.3 368.2 133.0C366.4 128.7 364.0 123.3 360.8 119.0C357.6 114.7 352.8 110.4 349.0 107.3C345.2 104.3 342.3 102.7 338.0 100.7C333.7 98.6 328.3 96.5 323.0 95.2C317.7 93.9 311.5 93.2 306.0 92.9Z",
  "M273.5 222.0C279.0 221.2 281.7 221.5 286.0 222.1C290.3 222.6 296.0 224.3 299.0 225.3C302.0 226.2 303.5 226.7 303.7 228.0C304.0 229.3 304.6 228.8 300.8 233.0C297.0 237.2 286.0 248.4 281.0 253.0C276.0 257.6 276.7 257.3 271.0 260.6C265.3 263.8 254.3 269.8 247.0 272.5C239.7 275.3 232.7 276.3 226.9 277.0C221.1 277.7 216.2 277.5 212.0 277.0C207.8 276.6 204.5 275.4 202.0 274.4C199.5 273.4 197.1 272.4 196.8 271.0C196.4 269.6 196.1 270.0 199.7 266.0C203.2 262.0 212.3 252.2 218.0 247.2C223.7 242.2 228.3 239.6 234.0 236.2C239.7 232.9 245.9 229.4 252.5 227.0C259.1 224.6 267.9 222.8 273.5 222.0Z",
];

// Each contour is stroked on as a thin outline (pathLength 1 makes the
// dash maths trivial). Replays every time About opens.
const logoSvg = () =>
  `<svg class="about-logo" viewBox="58 86 384 328" aria-label="${esc(SITE.name)} logo" role="img">${LOGO_PATHS.map(
    (d) => `<path d="${d}" pathLength="1"/>`
  ).join("")}</svg>`;

function renderAbout() {
  const el = document.createElement("div");
  el.className = "about";
  el.id = "about";
  el.setAttribute("aria-hidden", "true");
  const rows = (list) => list.map(([a, b]) => `<li><span>${esc(a)}</span><span>${esc(b)}</span></li>`).join("");
  el.innerHTML = `
    <div class="about-inner">
      <div class="about-col">
        ${logoSvg()}
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
    el.getBoundingClientRect(); // commit the closed state so the logo draw always plays
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
    // Pictures and video (project previews, images, films) get the label;
    // any clickable text gets the small inverting square.
    const media = e.target.closest?.(".item, .s-tile, img[data-cursor], video[data-cursor]");
    const target = media && media.dataset.cursor ? media : null;
    const link = !target && e.target.closest?.("a, button, [role=button]");
    c.classList.toggle("is-label", !!target);
    c.classList.toggle("is-title", !!link);
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
    count.textContent = `${pad(current + 1)} of ${pad(imgs.length)}`;
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
    target = clamp(target + delta / 280, 0, 1);
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
        <span class="next-name">${projectNumber(p)}&emsp;${esc(p.title)}</span>
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
