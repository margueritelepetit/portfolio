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
  "M409.0 119.9C407.2 120.1 406.1 120.8 404.9 122.0C403.7 123.2 405.0 109.8 401.9 127.0C398.9 144.2 390.1 204.7 386.5 225.0C382.9 245.3 383.2 239.8 380.3 249.0C377.5 258.2 373.6 270.0 369.4 280.0C365.1 290.0 359.4 301.0 354.7 309.0C350.1 317.0 347.4 320.9 341.5 328.0C335.5 335.1 326.4 345.1 319.0 351.9C311.6 358.6 303.2 364.2 297.0 368.3C290.8 372.5 288.8 373.6 282.0 376.6C275.2 379.6 264.3 383.9 256.0 386.2C247.7 388.4 239.3 389.8 232.0 390.2C224.7 390.7 218.6 390.1 212.0 388.9C205.4 387.7 198.1 385.5 192.6 383.0C187.1 380.5 182.9 377.3 179.1 374.0C175.3 370.7 172.0 366.0 169.9 363.0C167.7 360.0 167.3 359.0 166.2 356.0C165.0 353.0 163.6 348.7 163.0 345.0C162.4 341.3 162.4 338.0 162.6 334.0C162.7 330.0 163.0 326.0 164.1 321.0C165.3 316.0 167.4 308.8 169.2 304.0C171.0 299.2 172.4 296.5 175.0 292.0C177.5 287.5 181.2 281.5 184.4 277.0C187.6 272.5 188.7 270.4 194.1 265.0C199.6 259.6 209.2 250.2 217.0 244.5C224.8 238.7 233.3 234.2 241.0 230.6C248.7 227.0 255.8 224.4 263.0 222.9C270.2 221.4 279.2 221.6 284.0 221.5C288.8 221.4 289.0 221.5 292.0 222.4C295.0 223.2 300.0 226.1 302.0 226.7C304.0 227.3 303.9 226.6 303.8 226.0C303.6 225.4 303.1 224.1 301.0 223.0C298.9 221.9 295.3 220.5 291.0 219.7C286.7 218.8 278.8 218.0 275.0 217.8C271.2 217.7 271.8 218.1 268.0 218.7C264.2 219.2 259.0 219.1 252.0 221.3C245.0 223.5 232.8 228.5 226.0 231.7C219.2 234.9 216.2 237.2 211.0 240.7C205.8 244.2 200.7 247.8 195.0 252.6C189.3 257.3 182.8 262.9 177.1 269.0C171.4 275.1 165.4 282.8 161.0 289.2C156.6 295.5 153.8 300.5 150.9 307.0C148.1 313.5 145.3 320.7 144.0 328.0C142.7 335.3 142.4 344.7 143.1 351.0C143.7 357.3 146.2 361.8 148.1 366.0C150.0 370.2 152.6 373.3 154.5 376.0C156.5 378.7 157.6 379.9 160.0 382.0C162.4 384.0 165.7 386.3 169.0 388.3C172.3 390.3 175.0 392.1 180.0 393.9C185.0 395.7 192.8 398.0 199.0 398.9C205.2 399.8 210.5 399.8 217.0 399.5C223.5 399.2 230.5 398.6 238.0 397.0C245.5 395.4 252.7 393.7 262.0 389.9C271.3 386.0 282.8 381.1 294.0 373.9C305.2 366.8 319.2 355.9 329.0 346.9C338.8 337.9 345.9 328.6 352.8 320.0C359.7 311.4 364.4 305.2 370.3 295.0C376.3 284.8 383.9 268.8 388.5 259.0C393.1 249.2 394.7 244.8 398.0 236.0C401.2 227.2 405.2 215.0 407.9 206.0C410.6 197.0 412.4 190.2 414.3 182.0C416.1 173.8 418.1 164.8 419.2 157.0C420.3 149.2 420.7 140.0 420.8 135.0C421.0 130.0 420.8 129.1 420.0 126.8C419.2 124.5 417.8 122.3 416.0 121.2C414.2 120.0 410.8 119.8 409.0 119.9Z",
  "M285.0 99.7C279.5 100.2 268.7 101.1 261.0 102.7C253.3 104.3 248.3 105.2 239.0 109.1C229.7 113.0 216.6 118.5 205.1 126.0C193.6 133.5 178.7 146.0 170.0 153.9C161.3 161.7 158.1 166.6 152.8 173.0C147.4 179.4 142.8 185.5 138.0 192.5C133.2 199.5 129.0 205.5 124.0 215.1C119.0 224.7 112.1 240.4 107.9 250.0C103.8 259.6 102.6 262.8 99.3 273.0C96.0 283.2 90.9 300.0 88.0 311.0C85.1 322.0 83.2 331.5 81.8 339.0C80.5 346.5 80.1 351.5 79.8 356.0C79.6 360.5 80.0 363.3 80.2 366.0C80.4 368.7 80.5 370.3 81.0 372.0C81.6 373.7 82.5 375.0 83.7 376.0C84.8 377.0 86.4 377.9 88.0 378.2C89.6 378.6 91.3 378.7 93.0 378.0C94.7 377.3 96.8 376.0 98.0 374.0C99.3 372.0 99.1 375.7 100.5 366.0C102.0 356.3 104.0 332.7 106.6 316.0C109.2 299.3 113.6 277.7 116.1 266.0C118.7 254.3 118.6 255.0 121.6 246.0C124.7 237.0 129.7 222.2 134.3 212.0C138.9 201.8 145.1 192.0 149.3 185.0C153.6 178.0 155.7 175.3 160.0 170.0C164.3 164.7 168.1 159.3 175.0 153.0C181.8 146.7 193.8 137.4 201.0 132.4C208.2 127.5 212.2 126.3 218.0 123.5C223.8 120.7 230.2 117.6 236.0 115.5C241.8 113.4 246.7 112.2 253.0 111.1C259.3 110.1 268.2 109.3 274.0 109.2C279.8 109.0 281.8 108.7 288.0 110.0C294.2 111.4 305.5 114.7 311.0 117.0C316.5 119.4 317.8 121.3 321.0 124.3C324.2 127.3 327.7 130.9 330.3 135.0C332.9 139.1 335.3 144.7 336.5 149.0C337.7 153.3 337.7 156.7 337.7 161.0C337.7 165.3 337.2 170.8 336.7 175.0C336.3 179.2 335.9 182.0 334.8 186.0C333.6 190.0 332.5 193.7 330.0 199.0C327.4 204.3 322.0 213.7 319.3 218.0C316.6 222.3 318.4 220.0 313.8 225.0C309.3 230.0 299.1 241.6 291.8 248.0C284.5 254.4 276.8 259.7 270.0 263.7C263.2 267.6 256.3 269.8 251.0 271.9C245.7 274.0 244.5 275.0 238.0 276.0C231.5 277.0 217.7 277.7 212.0 277.6C206.3 277.6 206.5 276.6 204.0 275.6C201.5 274.7 198.5 272.5 197.0 272.0C195.5 271.5 195.0 272.0 195.0 272.5C195.0 273.0 194.8 273.9 197.0 275.0C199.2 276.2 203.7 278.3 208.0 279.3C212.3 280.4 217.2 281.6 223.0 281.5C228.8 281.4 236.0 280.3 243.0 278.7C250.0 277.1 258.8 274.3 265.0 271.9C271.2 269.5 274.3 267.7 280.0 264.3C285.7 261.0 292.8 256.5 299.0 251.9C305.2 247.3 312.2 241.1 317.0 236.7C321.8 232.3 324.3 229.7 328.0 225.4C331.7 221.1 335.8 215.6 339.0 210.8C342.2 206.1 345.0 201.8 347.5 197.0C350.0 192.2 352.4 187.1 354.0 182.0C355.6 176.8 356.7 171.3 357.4 166.0C358.0 160.7 358.1 154.3 357.8 150.0C357.5 145.7 356.6 143.4 355.5 140.0C354.4 136.6 353.4 133.2 351.0 129.5C348.6 125.8 344.2 121.0 341.0 117.8C337.8 114.7 336.7 113.2 332.0 110.7C327.3 108.1 319.3 104.4 313.0 102.5C306.7 100.7 298.7 100.2 294.0 99.7C289.3 99.3 290.5 99.2 285.0 99.7Z",
  "M253.0 180.0C247.2 180.4 238.3 181.3 233.0 182.3C227.7 183.3 225.8 183.9 221.0 186.1C216.2 188.2 209.2 191.5 204.0 195.0C198.8 198.5 193.4 202.6 189.6 207.0C185.7 211.4 183.0 217.3 181.0 221.6C179.0 226.0 178.4 229.9 177.7 233.0C177.0 236.1 176.8 237.3 176.8 240.0C176.9 242.7 177.5 246.5 178.0 249.0C178.5 251.5 179.3 254.0 179.9 255.0C180.6 256.0 182.1 256.6 182.0 255.1C181.9 253.6 179.8 249.3 179.4 246.0C178.9 242.7 178.9 238.3 179.3 235.0C179.6 231.7 180.3 229.0 181.4 226.0C182.6 223.0 184.5 219.9 186.0 217.2C187.5 214.6 188.0 212.8 190.4 210.0C192.7 207.2 195.2 203.9 200.0 200.7C204.8 197.4 214.5 192.7 219.0 190.6C223.5 188.5 223.8 188.7 227.0 188.0C230.2 187.3 233.8 186.6 238.0 186.3C242.2 185.9 244.5 185.0 252.0 186.1C259.5 187.2 276.0 191.8 283.0 192.8C290.0 193.9 291.9 192.8 294.0 192.3C296.1 191.8 295.6 191.0 295.7 190.0C295.9 189.0 296.6 187.8 295.0 186.6C293.4 185.3 290.5 183.5 286.0 182.3C281.5 181.2 273.5 180.3 268.0 179.9C262.5 179.5 258.8 179.6 253.0 180.0Z",
  "M318.0 243.9C318.1 245.3 320.2 249.0 320.6 252.0C321.1 255.0 321.4 258.2 320.9 262.0C320.4 265.8 319.7 270.2 317.6 275.0C315.6 279.8 311.9 286.8 308.6 291.0C305.3 295.2 302.6 297.4 298.0 300.3C293.4 303.2 286.7 306.3 281.0 308.4C275.3 310.4 269.7 312.0 264.0 312.7C258.3 313.5 254.5 314.0 247.0 312.9C239.5 311.9 224.8 307.5 219.0 306.3C213.2 305.2 213.9 305.8 212.0 306.3C210.1 306.7 208.6 308.0 207.8 309.0C207.1 310.0 207.3 311.1 207.5 312.0C207.7 312.9 207.9 313.7 209.0 314.5C210.1 315.3 210.0 315.9 214.0 316.7C218.0 317.4 225.7 318.9 233.0 319.1C240.3 319.4 250.8 319.0 258.0 318.2C265.2 317.4 269.3 316.9 276.0 314.4C282.7 311.8 293.0 306.1 298.2 303.0C303.5 299.9 304.0 300.2 307.4 296.0C310.9 291.8 316.3 284.5 319.0 278.0C321.7 271.5 323.2 262.3 323.5 257.0C323.8 251.7 321.6 248.2 321.0 246.0C320.4 243.8 320.5 244.3 320.0 243.9C319.5 243.6 317.9 242.6 318.0 243.9Z",
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
    const media = e.target.closest?.(".item, .c-item, img[data-cursor], video[data-cursor]");
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
