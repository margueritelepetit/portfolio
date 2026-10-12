// Home: the entry screen (once per visit) and the endless project column.

const ratioOf = (p) => p.cover.w / p.cover.h;

/* ── Entry screen ───────────────────────────────────────── */
// 1. a loading line with a percentage while images preload,
// 2. a cloud of images that drifts with the cursor,
// 3. click / Enter → the cloud collapses and the site opens.

function runEntry() {
  const el = $("#entry");
  const skip = session.get("entered") || document.body.dataset.about === "open";
  if (skip) {
    el.remove();
    return Promise.resolve();
  }
  document.documentElement.classList.add("entry-active");
  el.innerHTML = `
    <div class="entry-top ui"><span>${esc(SITE.name)}</span><span class="entry-clock"></span></div>
    <div class="entry-load ui" aria-live="polite">
      <span>Loading</span><span class="entry-line"><span></span></span><span class="entry-pct">00%</span>
    </div>
    <div class="entry-cloud" aria-hidden="true"></div>
    <button class="entry-enter ui" data-cursor="Enter">Enter</button>
    <div class="entry-bottom ui">
      <span>Portfolio ${new Date().getFullYear()}</span>
      <span>${SITE.disciplines.map(esc).join(" — ")}</span>
    </div>`;
  startClock($(".entry-clock", el));

  // Preload the entry images and every cover so the site opens instantly.
  const urls = [...new Set([...INTRO.map((i) => i.src), ...PROJECTS.map((p) => p.cover.src)])];
  const line = $(".entry-line span", el);
  const pct = $(".entry-pct", el);
  let loaded = 0, shown = 0;
  const loads = urls.map(
    (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => { loaded++; resolve(); };
        img.src = src;
      })
  );
  const progressLoop = () => {
    shown += (loaded / urls.length - shown) * 0.12;
    line.style.transform = `scaleX(${shown})`;
    pct.textContent = `${pad(Math.min(99, Math.round(shown * 100)))}%`;
    if (shown < 0.995) requestAnimationFrame(progressLoop);
  };
  progressLoop();
  const minTime = new Promise((r) => setTimeout(r, reducedMotion ? 0 : 1400));
  const timeout = new Promise((r) => setTimeout(r, 12000));

  return Promise.race([Promise.all([...loads, minTime]), timeout]).then(() => {
    shown = 1;
    pct.textContent = "100%";
    line.style.transform = "scaleX(1)";
    return new Promise((resolve) => setTimeout(() => showCloud(el, resolve), 350));
  });
}

function showCloud(el, resolve) {
  el.classList.add("loaded");
  const cloud = $(".entry-cloud", el);
  const n = INTRO.length;
  // Golden-angle spiral gives an organic but even spread.
  const items = INTRO.map((img, i) => {
    const rand = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const depth = 0.35 + Math.abs(rand) * 0.9;
    const r = Math.sqrt((i + 0.5) / n);
    const a = i * 2.39996;
    const node = document.createElement("div");
    node.className = "cloud-item";
    node.style.setProperty("--d", `${i * 45}ms`);
    node.style.zIndex = Math.round(depth * 100);
    const w = 52 + depth * 70;
    node.innerHTML = `<img src="${esc(img.src)}" alt="" style="width:${w}px;height:${(w * img.h) / img.w}px">`;
    cloud.appendChild(node);
    return { node, depth, r, a, phase: i * 1.7, x: 0, y: 0 };
  });

  let mx = 0, my = 0, px = -9999, py = -9999;
  const onMove = (e) => {
    px = e.clientX;
    py = e.clientY;
    mx = (e.clientX / innerWidth) * 2 - 1;
    my = (e.clientY / innerHeight) * 2 - 1;
  };
  addEventListener("pointermove", onMove, { passive: true });

  let running = true, leaving = false;
  const loop = (t) => {
    if (!running) return;
    const R = Math.min(innerWidth, innerHeight) * (isMobile() ? 0.36 : 0.3);
    const cx = innerWidth / 2, cy = innerHeight / 2;
    for (const it of items) {
      let tx = Math.cos(it.a) * it.r * R * 1.25 - mx * it.depth * 46 + Math.sin(t * 0.0005 + it.phase) * 7;
      let ty = Math.sin(it.a) * it.r * R - my * it.depth * 36 + Math.cos(t * 0.0004 + it.phase) * 7;
      // Images gently move out of the cursor's way.
      const dx = cx + tx - px, dy = cy + ty - py;
      const dist = Math.hypot(dx, dy);
      if (dist < 150) {
        const push = (1 - dist / 150) * 38 * it.depth;
        tx += (dx / (dist || 1)) * push;
        ty += (dy / (dist || 1)) * push;
      }
      if (leaving) tx = ty = 0;
      it.x += (tx - it.x) * (leaving ? 0.06 : 0.08);
      it.y += (ty - it.y) * 0.08;
      it.node.style.transform = `translate3d(${it.x}px, ${it.y}px, 0)`;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  requestAnimationFrame(() => el.classList.add("cloud-in"));

  const onKey = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    enter();
  };
  const enter = () => {
    if (el.classList.contains("leaving")) return;
    el.classList.add("leaving");
    leaving = true;
    document.removeEventListener("keydown", onKey);
    session.set("entered", "1");
    setTimeout(() => {
      el.classList.add("done");
      document.documentElement.classList.remove("entry-active");
      resolve();
      setTimeout(() => {
        running = false;
        removeEventListener("pointermove", onMove);
        el.remove();
      }, 800);
    }, reducedMotion ? 0 : 900);
  };
  el.addEventListener("click", enter);
  document.addEventListener("keydown", onKey);
  $(".entry-enter", el).focus({ preventScroll: true });
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

  // Every image gets roughly the same area: portraits narrow, landscapes wide.
  function sizeFor(ar) {
    const vw = innerWidth;
    const portraitW = isMobile() ? vw * 0.6 : Math.max(vw * 0.16, 170);
    const w = Math.min(Math.sqrt(((portraitW * portraitW) / (2 / 3)) * ar), vw - 32);
    return [w, w / ar];
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
    const sizes = list.map((p) => sizeFor(ratioOf(p)));
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
        a.innerHTML = `<img src="${esc(p.cover.src)}" alt="${esc(p.title)}" draggable="false">${
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
