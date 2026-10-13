// Home: the entry screen (once per visit) and the endless project column.

// Preview shown in the column (falls back to the cover).
const thumbOf = (p) => p.thumb || p.cover;

/* ── Intro ──────────────────────────────────────────────── */
// On first visit and on refresh (~7 s, a click skips ahead):
// a white page with a mosaic of small black-and-white portraits. Every so
// often a single image slowly fades to white and comes back; the cursor
// pushes images aside and they spring back into place. A thin bar fills
// while the site "enters".

const INTRO_MS = 7000;
const FADE_EVERY = 900; // ms between one image fading out and the next

// Tracing paper: a few large milky clouds (the uneven translucency of the
// sheet) and many faint short fibres, drawn once; CSS blurs and drifts it.
function paperTexture(canvas) {
  const w = (canvas.width = Math.round(innerWidth * 0.56));
  const h = (canvas.height = Math.round(innerHeight * 0.56));
  const ctx = canvas.getContext("2d");
  const rnd = (a, b) => a + Math.random() * (b - a);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) {
    const x = rnd(0, w), y = rnd(0, h), r = rnd(0.12, 0.38) * Math.max(w, h);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const a = rnd(0.025, 0.06);
    g.addColorStop(0, `rgba(150,156,162,${a})`);
    g.addColorStop(1, "rgba(150,156,162,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.lineCap = "round";
  for (let i = 0; i < (w * h) / 260; i++) {
    const x = rnd(0, w), y = rnd(0, h), len = rnd(4, 26), ang = rnd(0, Math.PI);
    const dx = Math.cos(ang) * len, dy = Math.sin(ang) * len;
    ctx.strokeStyle = Math.random() < 0.7 ? `rgba(120,126,132,${rnd(0.02, 0.06)})` : `rgba(255,255,255,${rnd(0.3, 0.6)})`;
    ctx.lineWidth = rnd(0.3, 0.9);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + dx / 2 + rnd(-4, 4), y + dy / 2 + rnd(-4, 4), x + dx, y + dy);
    ctx.stroke();
  }
}

// Intro sound: a calm, futuristic hum built live with Web Audio. Two low
// tones a hair apart beat slowly against each other (the vibration), a
// soft fifth and a faint shimmering overtone sit on top, with a breath of
// filtered air. Browsers only allow sound after a click or key press on
// the site, so it starts then if it can't start straight away.
function introSound(onPlaying = () => {}) {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC || reducedMotion) return { stop() {} };
  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = 0;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 900;
  lowpass.connect(master).connect(ctx.destination);

  const lfo = (freq, depth, param) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = freq;
    g.gain.value = depth;
    o.connect(g).connect(param);
    o.start();
  };
  lfo(0.06, 320, lowpass.frequency); // the tone slowly opens and closes

  const tone = (freq, type, level, tremolo) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = level;
    if (tremolo) lfo(tremolo, level * 0.6, g.gain);
    o.connect(g).connect(lowpass);
    o.start();
  };
  tone(55, "sine", 0.5);
  tone(55.4, "sine", 0.5); // beats against 55 Hz: a slow pulse
  tone(82.4, "triangle", 0.09);
  tone(110.3, "sine", 0.16);
  tone(329.6, "sine", 0.025, 4.2); // faint shimmer

  // Air: soft noise through a narrow band.
  const noise = ctx.createBufferSource();
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noise.buffer = buf;
  noise.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 1400;
  band.Q.value = 1.4;
  const air = ctx.createGain();
  air.gain.value = 0.012;
  noise.connect(band).connect(air).connect(master);
  noise.start();

  let stopped = false;
  const fadeIn = () => {
    if (stopped || ctx.state !== "running") return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0.22, now + 1.8);
    onPlaying();
  };
  const unlock = () => ctx.resume().then(fadeIn).catch(() => {});
  const events = ["pointerdown", "pointerup", "keydown", "touchend"];
  events.forEach((ev) => addEventListener(ev, unlock, { passive: true }));
  unlock();

  // Entering: a soft airy whoosh that ends on a tiny raindrop. It plays
  // outside the hum's fade so it stays clear while the hum dies away.
  const enter = () => {
    if (ctx.state !== "running") return;
    const now = ctx.currentTime;
    const whoosh = ctx.createBufferSource();
    whoosh.buffer = buf;
    const sweep = ctx.createBiquadFilter();
    sweep.type = "bandpass";
    sweep.Q.value = 2.2;
    sweep.frequency.setValueAtTime(380, now);
    sweep.frequency.exponentialRampToValueAtTime(2600, now + 0.75);
    const wg = ctx.createGain();
    wg.gain.setValueAtTime(0, now);
    wg.gain.linearRampToValueAtTime(0.09, now + 0.45);
    wg.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
    whoosh.connect(sweep).connect(wg).connect(ctx.destination);
    whoosh.start(now);
    whoosh.stop(now + 1.2);

    // The drop: a high tone that falls fast and fades, with a faint echo.
    const drop = (t, level) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(1500, t);
      o.frequency.exponentialRampToValueAtTime(620, t + 0.09);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(level, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.35);
    };
    drop(now + 0.78, 0.09);
    drop(now + 1.02, 0.025);
  };

  return {
    enter,
    stop(seconds = 1.5) {
      if (stopped) return;
      stopped = true;
      events.forEach((ev) => removeEventListener(ev, unlock));
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + seconds);
      setTimeout(() => ctx.close().catch(() => {}), Math.max(seconds, 1.4) * 1000 + 200);
    },
  };
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

  // Every image appears exactly once. Previews whose photo is already in
  // INTRO can set thumb.inIntro = false to avoid showing it twice.
  const pool = [...new Set([
    ...INTRO.map((i) => i.src),
    ...PROJECTS.filter((p) => thumbOf(p).inIntro !== false).map((p) => thumbOf(p).src),
  ])];

  // Grid of 2:3 tiles with every row complete: try each column count,
  // use as many images as fill whole rows (dropping at most a few from the
  // end of the pool), and keep the layout with the biggest tiles.
  const availW = innerWidth * 0.86, availH = innerHeight * 0.66;
  let best = { tw: 0, cols: 1, rows: 1 };
  for (let c = 2; c <= pool.length; c++) {
    const r = Math.floor(pool.length / c);
    if (!r || c * r < pool.length * 0.85) continue;
    const w = Math.min(availW / (c + (c - 1) * 0.4), availH / (r * 1.5 + (r - 1) * 0.4));
    if (w > best.tw) best = { tw: w, cols: c, rows: r };
  }
  const { cols, rows } = best;
  const n = cols * rows;
  const tw = Math.floor(best.tw);
  const th = tw * 1.5;
  const gap = Math.round(tw * 0.4);
  const gridW = cols * tw + (cols - 1) * gap;
  const gridH = rows * th + (rows - 1) * gap;
  const ox = (innerWidth - gridW) / 2;
  const oy = (innerHeight - gridH) / 2 - th * 0.3;
  const cx = innerWidth / 2, cy = oy + gridH / 2;
  el.innerHTML = `
    <canvas class="paper" aria-hidden="true"></canvas>
    <div class="mosaic" aria-hidden="true"></div>
    <div class="entry-load ui" aria-hidden="true" style="top:${oy + gridH + th * 0.9}px">
      <span>Entering</span><span class="entry-line"><span></span></span><span class="entry-pct">000</span>
      <span class="entry-sound muted">Click for sound</span>
    </div>`;

  const mosaic = $(".mosaic", el);
  paperTexture($(".paper", el));
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    // A shorter last row is centred.
    const inRow = Math.min(cols, n - r * cols);
    const rowX = ox + ((cols - inRow) * (tw + gap)) / 2;
    for (let c = 0; c < inRow; c++) {
      const i = r * cols + c;
      const x = rowX + c * (tw + gap), y = oy + r * (th + gap);
      const node = document.createElement("div");
      node.className = "m-tile on"; // already visible: no entrance animation
      node.style.cssText = `left:${x}px;top:${y}px;width:${tw}px;height:${th}px`;
      node.innerHTML = `<img src="${esc(pool[i])}" alt="">`;
      mosaic.appendChild(node);
      tiles.push({
        node, x: x + tw / 2, y: y + th / 2,
        dx: 0, dy: 0, vx: 0, vy: 0,
        on: true, offUntil: 0,
      });
    }
  }

  // Preload the intro images and every preview so the projects open instantly.
  let loaded = 0;
  pool.forEach((src) => {
    const img = new Image();
    img.onload = img.onerror = () => loaded++;
    img.src = src;
  });

  let mx = -9999, my = -9999;
  const onMove = (e) => {
    mx = e.clientX;
    my = e.clientY;
  };
  addEventListener("pointermove", onMove, { passive: true });

  const line = $(".entry-line span", el);
  const pct = $(".entry-pct", el);

  return new Promise((resolve) => {
    const sound = introSound(() => el.classList.add("sound-on"));
    const start = performance.now();
    const exitAt = reducedMotion ? 600 : INTRO_MS;
    let leaving = 0, done = false, shown = 0, nextFade = 0;

    const finish = () => {
      done = true;
      sound.stop(0.6);
      el.classList.add("done");
      document.documentElement.classList.remove("entry-active");
      resolve();
      setTimeout(() => {
        removeEventListener("pointermove", onMove);
        el.remove();
      }, 900);
    };

    const loop = (now) => {
      if (done) return;
      const t = now - start;
      const allLoaded = loaded >= pool.length || t > 10000;
      if (!leaving && t >= exitAt && allLoaded) {
        leaving = t;
        el.classList.add("leaving");
        sound.enter();
        sound.stop(1.6); // gone by the time the projects appear
        setTimeout(finish, reducedMotion ? 0 : 1600);
      }

      // Every FADE_EVERY ms, one random image fades out, rests, comes back.
      if (!leaving && t > 900 && t >= nextFade) {
        const it = tiles[(Math.random() * tiles.length) | 0];
        it.offUntil = t + 2000; // ~1.8 s fade out, then fades back in
        nextFade = t + FADE_EVERY + Math.random() * 500;
      }

      for (const it of tiles) {
        const d = Math.hypot(it.x - cx, it.y - cy);
        let on;
        if (leaving) {
          // Exit: fade out from the centre outwards.
          on = t - leaving < d * 1.4;
        } else {
          // Shown, unless it's this tile's turn to rest on white for a moment.
          on = t > it.offUntil;
        }
        if (on !== it.on) {
          it.on = on;
          it.node.classList.toggle("on", on);
        }

        // Cursor pushes tiles away; a spring brings them back.
        let fx = 0, fy = 0;
        const ex = it.x - mx, ey = it.y - my;
        const dist = Math.hypot(ex, ey);
        const reach = 170;
        if (dist < reach && !reducedMotion) {
          const push = (1 - dist / reach) ** 2 * 70;
          fx = (ex / (dist || 1)) * push;
          fy = (ey / (dist || 1)) * push;
        }
        it.vx = (it.vx + (fx - it.dx) * 0.09) * 0.78;
        it.vy = (it.vy + (fy - it.dy) * 0.09) * 0.78;
        it.dx += it.vx;
        it.dy += it.vy;
        it.node.style.transform = `translate3d(${it.dx.toFixed(2)}px, ${it.dy.toFixed(2)}px, 0)`;
      }

      // The bar moves on its own, but never finishes before the images are in.
      const goal = Math.min(allLoaded ? 1 : 0.9, t / exitAt);
      shown += (goal - shown) * 0.08;
      line.style.transform = `scaleX(${shown})`;
      pct.textContent = String(Math.round(shown * 100)).padStart(3, "0");
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
  let total = 0, current = 0, target = 0, active = -1, gap = 0;
  let indexButtons = [];

  $("#site-footer").innerHTML = `
    <span class="ui footer-left"><span class="disciplines">${SITE.disciplines.map(esc).join(", ")}</span>
      <span class="active-label" id="active-label"></span></span>
    <a class="ui" href="mailto:${esc(SITE.email)}">Contact</a>`;
  const label = $("#active-label");
  // Small caption under the preview in focus.
  const caption = document.createElement("p");
  caption.className = "focus-caption ui";
  caption.setAttribute("aria-hidden", "true");
  stage.after(caption);

  // Each project has its own frame (width in vw, ratio) so the column
  // alternates tall, square and wide previews; images are cropped to fit.
  // Same two frames as cathydolle.com: portrait 16vw × 24vw (2:3) and
  // landscape 24.25vw × 13.9vw (≈ 7:4). Each project keeps one shape
  // (thumb.shape), chosen so the column alternates; images are cropped
  // to fit around thumb.focus.
  const FRAMES = { P: [16, 24], L: [24.25, 13.9] };
  function sizeFor(shape) {
    const [w, h] = FRAMES[shape];
    const unit = (innerWidth / 100) * (isMobile() ? 3.1 : 1.25); // larger on phones
    return [w * unit, h * unit];
  }

  function renderIndex() {
    const half = Math.ceil(list.length / 2);
    const row = (p, i) =>
      `<li><button data-i="${i}"><span class="num">${projectNumber(p)}</span><span class="title">${esc(p.title)}</span></button></li>`;
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
    gap = innerHeight * 0.05; // breathing room between previews
    const maxH = sizes.P[1];

    // Repeat the set until it's long enough to loop seamlessly.
    for (let rep = 0; rep === 0 || (total < innerHeight + maxH * 2 && rep < 30); rep++) {
      list.forEach((p, pi) => {
        const shape = thumbOf(p).shape || "P";
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
        const focus = t.focus || "50% 50%";
        a.innerHTML = `<img src="${esc(t.src)}" alt="${esc(p.title)}" draggable="false" style="object-position:${focus}">${
          p.template === "film" ? '<span class="badge ui">Film</span>' : ""
        }`;
        a.addEventListener("click", () => {
          markHero($("img", a));
          session.set("last", p.slug);
        });
        stage.appendChild(a);
        els.push({ el: a, pi, size: h, offset: total });
        total += h + gap;
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
    label.textContent = pi >= 0 ? `${projectNumber(list[pi])}\u2003${list[pi].title}` : "";
    if (caption && pi >= 0) {
      const p = list[pi];
      const type = (p.meta.find(([k]) => k === "Type") || [])[1];
      caption.textContent = [CATEGORIES[p.category], type].filter(Boolean).join("\u2003");
    }
  }

  // Focus reel: the preview nearest the centre is full size, sharp and in
  // colour; the further one is from the centre, the smaller, paler and
  // more black-and-white it becomes. Everything follows the scroll.
  function render(once) {
    current += (target - current) * (reducedMotion ? 1 : 0.085);
    if (Math.abs(target - current) < 0.05) current = target;
    const center = innerHeight / 2;
    const margin = (total - innerHeight) / 2;
    let found = -1, best = Infinity, focusEl = null;
    for (const it of els) {
      const pos = mod(it.offset - current + margin, total) - margin;
      const mid = pos + it.size / 2;
      const dist = Math.abs(mid - center) / innerHeight;
      const k = 1 - clamp(dist * 1.9, 0, 1);
      const e = k * k * (3 - 2 * k); // smoothstep
      it.el.style.transform = `translate3d(-50%, ${pos}px, 0) scale(${(0.58 + 0.42 * e).toFixed(4)})`;
      it.el.style.opacity = (0.28 + 0.72 * e).toFixed(3);
      it.el.style.setProperty("--g", (1 - e).toFixed(3));
      // The picture drifts inside its frame as it travels up the screen.
      it.el.style.setProperty("--py", clamp((mid - center) / (center + it.size / 2), -1, 1).toFixed(3));
      if (Math.abs(mid - center) < best) {
        best = Math.abs(mid - center);
        found = it.pi;
        focusEl = { pos, size: it.size };
      }
    }
    setActive(found);
    if (focusEl && caption) {
      caption.style.transform = `translate3d(-50%, ${focusEl.pos + focusEl.size + 12}px, 0)`;
      caption.style.opacity = clamp(1 - best / (focusEl.size * 0.35), 0, 1).toFixed(3);
    }
    if (once !== true) requestAnimationFrame(render);
  }

  // First build: always open on the first project (Nothing Changed),
  // except when coming back from a project: then centre that one.
  renderIndex();
  const back = document.referrer.includes("project.html");
  const lastIndex = back ? list.findIndex((p) => p.slug === session.get("last")) : -1;
  build(Math.max(lastIndex, 0));
  if (lastIndex >= 0) {
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
