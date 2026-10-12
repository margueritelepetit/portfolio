// Home: the entry screen (once per visit) and the endless project column.

// Preview shown in the column (falls back to the cover).
const thumbOf = (p) => p.thumb || p.cover;

/* ── Intro ──────────────────────────────────────────────── */
// Once per visit, ~5 s, runs by itself (a click skips ahead):
//   black screen → hairline grid draws in → photos flicker in and out of
//   the cells, with the odd glitch → the name decodes in huge type →
//   the cells turn white in a diagonal wave, straight into the projects.
// Moving the mouse draws crosshairs with coordinates and lights up the
// cell underneath.

const INTRO_MS = 5000;
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/_—";

// Decode text from random glyphs, left to right.
function scramble(el, text, duration = 900) {
  if (reducedMotion) {
    el.textContent = text;
    return;
  }
  const start = performance.now();
  const step = () => {
    const p = Math.min(1, (performance.now() - start) / duration);
    const fixed = Math.floor(p * text.length);
    el.textContent = [...text]
      .map((ch, i) => (i < fixed || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
      .join("");
    if (p < 1) setTimeout(step, 40);
  };
  step();
}

function runEntry() {
  const el = $("#entry");
  const reloaded = performance.getEntriesByType("navigation")[0]?.type === "reload";
  const skip = (session.get("entered") && !reloaded) || document.body.dataset.about === "open";
  if (skip) {
    el.remove();
    return Promise.resolve();
  }
  session.set("entered", "1");
  document.documentElement.classList.add("entry-active");

  const cols = isMobile() ? 4 : 8;
  const cw = innerWidth / cols;
  const rows = Math.max(3, Math.round(innerHeight / (cw * 0.78)));
  const ch = innerHeight / rows;
  const pool = [...new Set([...INTRO.map((i) => i.src), ...PROJECTS.map((p) => thumbOf(p).src)])];
  const [first, ...rest] = SITE.name.split(" ");

  el.innerHTML = `
    <div class="mosaic" style="grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${rows},1fr)">
      ${Array.from({ length: cols * rows }, (_, i) => `<div class="tile" style="--w:${(i % cols) + Math.floor(i / cols)}"><img alt=""></div>`).join("")}
    </div>
    <div class="lines" aria-hidden="true">
      ${Array.from({ length: cols - 1 }, (_, i) => `<span class="vline" style="left:${((i + 1) * 100) / cols}%;--i:${i}"></span>`).join("")}
      ${Array.from({ length: rows - 1 }, (_, i) => `<span class="hline" style="top:${((i + 1) * 100) / rows}%;--i:${i}"></span>`).join("")}
    </div>
    <div class="cross" aria-hidden="true"><span class="cx"></span><span class="cy"></span><span class="cpos ui"></span></div>
    <h1 class="entry-name"><span></span><span></span></h1>
    <div class="entry-top ui"><span class="e-a"></span><span class="e-pct">000%</span></div>
    <div class="entry-bottom ui"><span class="e-b"></span><span class="e-c"></span></div>
    <div class="entry-bar" aria-hidden="true"><span></span></div>`;

  const tiles = $$(".tile", el).map((node) => ({ node, img: $("img", node), on: false }));
  const nameParts = $$(".entry-name span", el);
  const bar = $(".entry-bar span", el);
  const pctEl = $(".e-pct", el);

  // Preload the intro images and every preview so the projects open instantly.
  let loaded = 0;
  pool.forEach((src) => {
    const img = new Image();
    img.onload = img.onerror = () => loaded++;
    img.src = src;
  });

  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const randomTile = () => tiles[(Math.random() * tiles.length) | 0];
  const show = (t, glitch) => {
    t.img.src = pool[(Math.random() * pool.length) | 0];
    t.node.classList.add("on");
    t.on = true;
    if (glitch) {
      t.node.classList.add("glitch");
      setTimeout(() => t.node.classList.remove("glitch"), 260);
    }
  };
  const hide = (t) => {
    t.node.classList.remove("on");
    t.on = false;
  };

  // Text: decode in sequence once the grid lines are drawn.
  later(() => scramble($(".e-a", el), `Portfolio ${new Date().getFullYear()}`, 700), 300);
  later(() => scramble(nameParts[0], first, 1100), 700);
  later(() => scramble(nameParts[1], rest.join(" "), 1100), 950);
  later(() => scramble($(".e-b", el), SITE.disciplines.join(" — "), 1300), 1100);
  later(() => scramble($(".e-c", el), SITE.location, 600), 1300);

  // Cursor: crosshairs + coordinates, and the cell under it lights up.
  const cross = $(".cross", el);
  let lastCell = -1;
  const onMove = (e) => {
    cross.classList.add("live");
    cross.style.setProperty("--x", `${e.clientX}px`);
    cross.style.setProperty("--y", `${e.clientY}px`);
    $(".cpos", el).textContent = `X ${String(Math.round(e.clientX)).padStart(4, "0")}  Y ${String(Math.round(e.clientY)).padStart(4, "0")}`;
    const cell = Math.floor(e.clientY / ch) * cols + Math.floor(e.clientX / cw);
    if (cell !== lastCell && tiles[cell] && !el.classList.contains("out")) {
      tiles[lastCell]?.node.classList.remove("hot");
      lastCell = cell;
      show(tiles[cell], true);
      tiles[cell].node.classList.add("hot");
    }
  };
  addEventListener("pointermove", onMove, { passive: true });

  return new Promise((resolve) => {
    const start = performance.now();
    let exitAt = reducedMotion ? 400 : INTRO_MS;
    let exiting = false;

    // Flicker: photos fade in and out of random cells; density builds up.
    const flicker = setInterval(() => {
      const t = performance.now() - start;
      if (t < 700 || exiting) return;
      const density = Math.min(0.55, (t - 700) / 5000);
      const onCount = tiles.filter((x) => x.on).length;
      const target = randomTile();
      if (onCount / tiles.length < density || !target.on) show(target, Math.random() < 0.18);
      else hide(target);
      if (Math.random() < 0.35) {
        const off = tiles.filter((x) => x.on && !x.node.classList.contains("hot"));
        if (off.length > tiles.length * 0.2) hide(off[(Math.random() * off.length) | 0]);
      }
    }, reducedMotion ? 1000 : 75);

    // Occasional bigger glitch across a few cells and the name.
    const glitches = setInterval(() => {
      if (exiting || reducedMotion) return;
      el.classList.add("glitching");
      for (let i = 0; i < 3; i++) {
        const t = randomTile();
        if (t.on) {
          t.node.classList.add("glitch");
          setTimeout(() => t.node.classList.remove("glitch"), 260);
        }
      }
      setTimeout(() => el.classList.remove("glitching"), 180);
    }, 1100);

    const exit = () => {
      if (exiting) return;
      exiting = true;
      clearInterval(flicker);
      clearInterval(glitches);
      // Cells turn white in a diagonal wave, revealing the white projects page.
      el.classList.add("out");
      const wave = (cols + rows) * 45 + 500;
      setTimeout(() => {
        el.classList.add("done");
        document.documentElement.classList.remove("entry-active");
        resolve();
        setTimeout(() => {
          removeEventListener("pointermove", onMove);
          timers.forEach(clearTimeout);
          el.remove();
        }, 700);
      }, reducedMotion ? 0 : wave);
    };
    el.addEventListener("click", () => (exitAt = Math.min(exitAt, performance.now() - start + 200)));

    let shown = 0;
    const loop = () => {
      if (exiting) return;
      const t = performance.now() - start;
      const allLoaded = loaded >= pool.length || t > 10000;
      const goal = allLoaded ? Math.min(1, t / exitAt) : Math.min(t / exitAt, 0.9);
      shown += (goal - shown) * 0.12;
      bar.style.transform = `scaleX(${shown})`;
      pctEl.textContent = `${String(Math.round(shown * 100)).padStart(3, "0")}%`;
      if (t >= exitAt && allLoaded) exit();
      else setTimeout(loop, 30);
    };
    loop();
  });
}

/* ── Gallery: endless vertical column + two-column index ── */

function initGallery() {
  const stage = $("#stage");
  const index = $("#index");
  const list = PROJECTS;
  let els = [];
  let total = 0, current = 0, target = 0, active = -1;
  let indexButtons = [];

  $("#site-footer").innerHTML = `
    <span class="ui footer-left"><span class="disciplines">${SITE.disciplines.map(esc).join(" — ")}</span>
      <span class="active-label" id="active-label"></span></span>
    <a class="ui" href="mailto:${esc(SITE.email)}">Contact</a>`;
  const label = $("#active-label");

  // Each project has its own frame (width in vw, ratio) so the column
  // alternates tall, square and wide previews; images are cropped to fit.
  // Same two frames as cathydolle.com, alternating down the column:
  // portrait 16vw × 24vw (2:3) and landscape 24.25vw × 13.9vw (≈ 7:4).
  // Images are cropped to fit; each project can set a crop point per shape.
  const FRAMES = { P: [16, 24], L: [24.25, 13.9] };
  function sizeFor(shape) {
    const [w, h] = FRAMES[shape];
    const unit = (innerWidth / 100) * (isMobile() ? 3.1 : 1); // larger on phones
    return [w * unit, h * unit];
  }

  function renderIndex() {
    const half = Math.ceil(list.length / 2);
    const row = (p, i) =>
      `<li><button data-i="${i}"><span class="num">${projectNumber(p)}/</span><span class="title">${esc(p.title)}</span></button></li>`;
    index.innerHTML = `
      <ol class="index-col left">${list.slice(0, half).map((p, i) => row(p, i)).join("")}</ol>
      <ol class="index-col right">${list.slice(half).map((p, i) => row(p, i + half)).join("")}</ol>`;
    index.style.setProperty("--rows", half);
    indexButtons = $$("button", index);
  }

  function build(focus = 0) {
    stage.innerHTML = "";
    els = [];
    total = 0;
    const sizes = { P: sizeFor("P"), L: sizeFor("L") };
    const maxH = sizes.P[1];

    // Repeat the set until it's long enough to loop seamlessly. The shape
    // alternates by position, so the item count must be even for the
    // alternation to carry on across the loop's seam.
    for (let rep = 0; rep === 0 || ((total < innerHeight + maxH * 2 || els.length % 2) && rep < 30); rep++) {
      list.forEach((p, pi) => {
        const shape = els.length % 2 ? "L" : "P";
        const [w, h] = sizes[shape];
        const a = document.createElement("a");
        a.className = "item";
        a.href = projectUrl(p);
        a.dataset.cursor = "Open";
        a.style.width = `${w}px`;
        a.style.height = `${h}px`;
        a.style.setProperty("--d", `${Math.min(els.length * 0.06, 0.9)}s`);
        if (rep > 0) {
          a.tabIndex = -1;
          a.setAttribute("aria-hidden", "true");
        }
        const t = thumbOf(p);
        const focus = (shape === "P" ? t.focusP : t.focusL) || t.focus || "50% 50%";
        a.innerHTML = `<img src="${esc(t.src)}" alt="${esc(p.title)}" draggable="false" style="object-position:${focus}">${
          p.template === "film" ? '<span class="badge ui">Film</span>' : ""
        }`;
        a.addEventListener("click", () => {
          markHero($("img", a));
          session.set("last", p.slug);
        });
        stage.appendChild(a);
        els.push({ el: a, pi, size: h, offset: total });
        total += h;
      });
    }
    current = target = centerOf(focus);
    active = -1;
    render(true);
  }

  // Scroll position that centres the copy of project `pi` nearest to where we are now.
  function centerOf(pi) {
    const it = els.find((e) => e.pi === pi);
    let s = it.offset + it.size / 2 - innerHeight / 2;
    if (total) s += Math.round((current - s) / total) * total;
    return s;
  }

  function setActive(pi) {
    if (pi === active) return;
    active = pi;
    indexButtons.forEach((b, i) => b.classList.toggle("is-active", i === pi));
    label.textContent = pi >= 0 ? `${projectNumber(list[pi])}/ ${list[pi].title}` : "";
  }

  function render(once) {
    current += (target - current) * (reducedMotion ? 1 : 0.085);
    if (Math.abs(target - current) < 0.05) current = target;
    const center = innerHeight / 2;
    const margin = (total - innerHeight) / 2;
    let found = -1;
    for (const it of els) {
      const pos = mod(it.offset - current + margin, total) - margin;
      it.el.style.transform = `translate3d(-50%, ${pos}px, 0)`;
      // The picture drifts inside its frame as it travels up the screen.
      it.el.style.setProperty("--py", clamp((pos + it.size / 2 - center) / (center + it.size / 2), -1, 1).toFixed(3));
      if (pos <= center && pos + it.size > center) found = it.pi;
    }
    setActive(found);
    if (once !== true) requestAnimationFrame(render);
  }

  // First build: centre the project we came back from, if any.
  renderIndex();
  const last = session.get("last");
  const lastIndex = list.findIndex((p) => p.slug === last);
  build(Math.max(lastIndex, 0));
  if (lastIndex >= 0 && document.referrer.includes("project.html")) {
    const it = els.find((e) => e.pi === lastIndex);
    markHero($("img", it.el));
  }
  requestAnimationFrame(render);

  /* Input */

  const blocked = () =>
    document.documentElement.classList.contains("entry-active") || document.body.classList.contains("about-open");

  addEventListener("wheel", (e) => {
    if (blocked()) return;
    e.preventDefault();
    target += (e.deltaY + e.deltaX) * (e.deltaMode === 1 ? 40 : 1);
  }, { passive: false });

  let touch = null, velocity = 0, dragged = false;
  stage.addEventListener("touchstart", (e) => {
    touch = { x0: e.touches[0].clientX, y0: e.touches[0].clientY, last: e.touches[0].clientY };
    velocity = 0;
    dragged = false;
  }, { passive: true });
  stage.addEventListener("touchmove", (e) => {
    if (!touch) return;
    e.preventDefault();
    const t = e.touches[0];
    const delta = touch.last - t.clientY;
    touch.last = t.clientY;
    velocity = delta;
    target += delta * 1.3;
    if (Math.abs(t.clientX - touch.x0) + Math.abs(t.clientY - touch.y0) > 8) dragged = true;
  }, { passive: false });
  stage.addEventListener("touchend", () => {
    target += velocity * 14;
    touch = null;
  });
  // A swipe shouldn't count as a tap on a project.
  stage.addEventListener("click", (e) => {
    if (dragged) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);

  document.addEventListener("keydown", (e) => {
    if (blocked()) return;
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    target = centerOf(mod((active < 0 ? 0 : active) + step, list.length));
  });

  index.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const i = Number(btn.dataset.i);
    // Clicking the project already in the centre opens it.
    if (i === active) els.find((it) => it.pi === i && Math.abs(it.el.getBoundingClientRect().top + it.size / 2 - innerHeight / 2) < it.size)?.el.click();
    else target = centerOf(i);
  });

  // Already on the projects: the header link just closes the About panel.
  $(".projects-link").addEventListener("click", (e) => {
    e.preventDefault();
    if (document.body.classList.contains("about-open")) $(".about-toggle").click();
  });

  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => build(Math.max(active, 0)), 150);
  });
}

/* ── Boot ───────────────────────────────────────────────── */

bootSite();
initGallery();
runEntry().then(() => {
  // Timer, not rAF: rAF doesn't fire in background tabs, which would leave images hidden.
  setTimeout(() => document.body.classList.add("ready"), 30);
});
