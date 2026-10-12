// Home: the entry screen (once per visit) and the endless project column.

// Preview shown in the column (falls back to the cover).
const thumbOf = (p) => p.thumb || { ...p.cover, frame: [20, p.cover.w / p.cover.h] };

/* ── Intro ──────────────────────────────────────────────── */
// A white, self-running intro (~4.5 s, once per visit): images appear one
// by one around the centre while a loading line fills, then they gather
// into a single stack and the page fades into the projects.
// Clicking anywhere skips ahead.

const INTRO_MS = 4600;

function runEntry() {
  const el = $("#entry");
  const skip = session.get("entered") || document.body.dataset.about === "open";
  if (skip) {
    el.remove();
    return Promise.resolve();
  }
  session.set("entered", "1");
  document.documentElement.classList.add("entry-active");
  el.innerHTML = `
    <div class="entry-top ui"><span>${esc(SITE.name)}</span><span class="muted">Portfolio ${new Date().getFullYear()}</span></div>
    <div class="entry-cloud" aria-hidden="true"></div>
    <div class="entry-load ui" aria-hidden="true"><span class="entry-line"><span></span></span><span class="entry-pct">00</span></div>
    <div class="entry-bottom ui"><span class="muted">${SITE.disciplines.map(esc).join(" — ")}</span><span class="muted">${esc(SITE.location)}</span></div>`;

  // Preload the intro images and every cover so the projects open instantly.
  const urls = [...new Set([...INTRO.map((i) => i.src), ...PROJECTS.map((p) => thumbOf(p).src)])];
  let loaded = 0;
  urls.forEach((src) => {
    const img = new Image();
    img.onload = img.onerror = () => loaded++;
    img.src = src;
  });

  const cloud = $(".entry-cloud", el);
  const line = $(".entry-line span", el);
  const pct = $(".entry-pct", el);
  const n = INTRO.length;
  const items = INTRO.map((img, i) => {
    // Golden-angle spiral: an organic but even spread around the centre.
    const rand = Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1);
    const depth = 0.4 + rand * 0.8;
    const node = document.createElement("div");
    node.className = "cloud-item";
    node.style.zIndex = Math.round(depth * 100);
    const w = 64 + depth * 78;
    node.innerHTML = `<img src="${esc(img.src)}" alt="" style="width:${w}px;height:${(w * img.h) / img.w}px">`;
    cloud.appendChild(node);
    return { node, depth, r: Math.sqrt((i + 0.5) / n), a: i * 2.39996, phase: i * 1.7, x: 0, y: 0, at: 250 + (i * 2700) / n };
  });

  let mx = 0, my = 0;
  const onMove = (e) => {
    mx = (e.clientX / innerWidth) * 2 - 1;
    my = (e.clientY / innerHeight) * 2 - 1;
  };
  addEventListener("pointermove", onMove, { passive: true });

  return new Promise((resolve) => {
    const start = performance.now();
    let gatherAt = reducedMotion ? 0 : 3500; // images start gathering
    let shown = 0, finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      el.classList.add("done");
      document.documentElement.classList.remove("entry-active");
      resolve();
      setTimeout(() => {
        removeEventListener("pointermove", onMove);
        el.remove();
      }, 1000);
    };
    // Click to skip straight to the gathering.
    el.addEventListener("click", () => {
      gatherAt = Math.min(gatherAt, performance.now() - start);
    });

    const loop = (now) => {
      if (finished) return;
      const t = now - start;
      const allLoaded = loaded >= urls.length || t > 9000;
      const gathering = t >= gatherAt && allLoaded;
      if (gathering && !el.classList.contains("gather")) {
        el.classList.add("gather");
        gatherAt = t;
        setTimeout(finish, reducedMotion ? 0 : 1000);
      }

      // The line moves on its own, but never finishes before the images are in.
      const timeP = Math.min(1, t / INTRO_MS);
      const goal = allLoaded ? timeP : Math.min(timeP, 0.9);
      shown += ((gathering ? 1 : goal) - shown) * 0.1;
      line.style.transform = `scaleX(${shown})`;
      pct.textContent = pad(Math.min(100, Math.round(shown * 100)));

      const R = Math.min(innerWidth, innerHeight) * (isMobile() ? 0.36 : 0.32);
      for (const it of items) {
        if (!it.in && t >= it.at) {
          it.in = true;
          it.node.classList.add("in");
        }
        let tx = Math.cos(it.a) * it.r * R * 1.3 + Math.sin(now * 0.0005 + it.phase) * 8 - mx * it.depth * 24;
        let ty = Math.sin(it.a) * it.r * R + Math.cos(now * 0.0004 + it.phase) * 8 - my * it.depth * 18;
        if (gathering) tx = ty = 0;
        it.x += (tx - it.x) * (gathering ? 0.09 : 0.06);
        it.y += (ty - it.y) * (gathering ? 0.09 : 0.06);
        it.node.style.transform = `translate3d(${it.x}px, ${it.y}px, 0)`;
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
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
  function sizeFor(p) {
    const [vwShare, ratio] = thumbOf(p).frame;
    const vw = innerWidth;
    const w = isMobile()
      ? vw * clamp(vwShare * 2.4, 46, 92) / 100
      : Math.max((vw * vwShare) / 100, vwShare * 9);
    return [Math.min(w, vw - 32), Math.min(w, vw - 32) / ratio];
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
    const sizes = list.map(sizeFor);
    const maxH = Math.max(...sizes.map(([, h]) => h));

    // Repeat the set until it's long enough to loop seamlessly.
    for (let rep = 0; rep === 0 || (total < innerHeight + maxH * 2 && rep < 30); rep++) {
      list.forEach((p, pi) => {
        const [w, h] = sizes[pi];
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
        a.innerHTML = `<img src="${esc(t.src)}" alt="${esc(p.title)}" draggable="false" style="object-position:${t.focus || "50% 50%"}">${
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
