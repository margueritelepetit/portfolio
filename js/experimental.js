// The experimental zone. The text stays at the top. It opens on a slowly
// turning sphere of black and white project pictures; after about five
// seconds (or a click) the sphere gives way to a loose collage of the
// experimental pieces, scattered and overlapping. While there are only a
// few pieces, they repeat so the collage feels full.

const SPHERE_MS = 5200;
const MIN_PIECES = 12;

// Seeded random numbers: the collage looks scattered but is laid out the
// same way on every visit (change COLLAGE_SEED for another arrangement).
const COLLAGE_SEED = 21;
function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Opening sphere ─────────────────────────────────────── */

function runSphere(stage) {
  const sphere = $(".sphere", stage);
  const R = Math.min(innerWidth * (isMobile() ? 0.46 : 0.4), innerHeight * 0.4);
  const pics = [...SPHERE].sort(() => Math.random() - 0.5);
  const n = pics.length;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const tiles = pics.map((m, i) => {
    const h = R * 0.25, w = Math.min(h * (m.w / m.h), R * 0.36);
    // Fibonacci points: an even spread over the sphere.
    const y = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(1 - y * y);
    const x = Math.cos(i * golden) * r, z = Math.sin(i * golden) * r;
    const el = document.createElement("div");
    el.className = "s-tile";
    el.style.cssText = `width:${w}px;height:${h}px;margin:${-h / 2}px 0 0 ${-w / 2}px;transform:rotateY(${Math.atan2(x, z)}rad) rotateX(${-Math.asin(y)}rad) translateZ(${R}px)`;
    el.innerHTML = `<img src="${esc(m.src)}" alt="" draggable="false">`;
    sphere.appendChild(el);
    return { el, n: [x, -y, z] };
  });

  // A slow spin; moving the mouse pushes the sphere (the faster the
  // movement, the stronger the push), then it eases back to its own pace.
  const BASE = 0.15; // degrees per frame
  let ry = 0, rx = -10, vy = BASE, vx = 0, running = true, last = null;
  const onMove = (e) => {
    if (last) {
      vy = clamp(vy + (e.clientX - last.x) * 0.06, -9, 9);
      vx = clamp(vx - (e.clientY - last.y) * 0.04, -6, 6);
    }
    last = { x: e.clientX, y: e.clientY };
  };
  addEventListener("pointermove", onMove, { passive: true });

  const start = performance.now();
  const rad = Math.PI / 180;
  const tick = (now) => {
    if (!running) return;
    const t = (now - start) / 1000;
    vy += (BASE - vy) * 0.03;
    vx *= 0.94;
    ry += vy;
    rx = clamp(rx + vx, -60, 60);
    rx += (-10 + Math.sin(t * 0.6) * 5 - rx) * 0.01; // gentle sway back to level
    sphere.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    const cy = Math.cos(ry * rad), sy = Math.sin(ry * rad), cx = Math.cos(rx * rad), sx = Math.sin(rx * rad);
    for (const tile of tiles) {
      const [x, y, z] = tile.n;
      const facing = y * sx + (-x * sy + z * cy) * cx;
      tile.el.style.opacity = facing > 0 ? 0.4 + facing * 0.6 : Math.max(0.05, 0.18 + facing * 0.18);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  return () => {
    running = false;
    removeEventListener("pointermove", onMove);
  };
}

/* ── Collage ────────────────────────────────────────────── */
// Pieces are dropped into a loose grid of cells, then pushed off-centre with
// varied sizes, so they scatter and overlap. Sizes and positions scale with
// the window, so the arrangement keeps its shape at any width.

function collageHtml(pieces) {
  const count = Math.max(MIN_PIECES, pieces.length);
  const list = [];
  while (list.length < count) list.push(...pieces);
  const random = seeded(COLLAGE_SEED);
  const rand = (a, b) => a + random() * (b - a);
  // A fixed shuffle that avoids the same piece twice in a row.
  const items = list.slice(0, count).map((p) => [random(), p]).sort((a, b) => a[0] - b[0]).map(([, p]) => p);
  for (let i = 1; i < items.length; i++) {
    if (items[i] === items[i - 1]) {
      const j = items.findIndex((p, k) => k > i && p !== items[i]);
      if (j > 0) [items[i], items[j]] = [items[j], items[i]];
    }
  }

  const mobile = isMobile();
  const W = innerWidth, cols = mobile ? 2 : 4;
  const cellW = W / cols, cellH = W * (mobile ? 0.55 : 0.2);
  const top = mobile ? 200 : 220;
  const firstVideo = new Set();
  let bottom = 0;

  const html = items.map((piece, i) => {
    const ratio = piece.video ? piece.w / piece.h : piece.image.w / piece.image.h;
    const col = i % cols, row = Math.floor(i / cols);
    let w = W * (mobile ? rand(0.42, 0.62) : rand(0.16, 0.3));
    if (ratio < 1) w *= 0.75; // portraits a little narrower
    const h = w / ratio;
    const x = clamp(col * cellW + rand(-0.45, 0.75) * (cellW - w * 0.4), 12, W - w - 12);
    const y = top + row * cellH + rand(-0.3, 0.55) * cellH;
    bottom = Math.max(bottom, y + h);

    // One real <video> per film; repeats paint its frames onto a canvas.
    let media;
    if (piece.video && !firstVideo.has(piece.video)) {
      firstVideo.add(piece.video);
      media = `<video src="${esc(piece.video)}" muted loop playsinline autoplay preload="metadata"></video>`;
    } else if (piece.video) {
      media = `<canvas data-mirror="${esc(piece.video)}"></canvas>`;
    } else {
      media = `<img src="${esc(piece.image.src)}" alt="${esc(piece.title)}" draggable="false">`;
    }
    return `<figure class="c-item" data-cursor="Open" data-piece="${pieces.indexOf(piece)}"
      style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${1 + Math.floor(rand(0, count))};--d:${i * 110}ms">${media}</figure>`;
  });
  return { html: html.join(""), height: bottom + 140 };
}

function initCollage(root, pieces) {
  const box = $(".collage", root);
  const build = () => {
    const { html, height } = collageHtml(pieces);
    box.innerHTML = html;
    box.style.height = `${height}px`;
  };
  build();

  // Repeated films: paint the visible copies from the original video.
  const videos = () => new Map($$("video", box).map((v) => [v.getAttribute("src"), v]));
  let sources = videos();
  const paint = () => {
    for (const c of $$("canvas[data-mirror]", box)) {
      const v = sources.get(c.dataset.mirror);
      if (!v || v.readyState < 2) continue;
      const r = c.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      if (c.width !== Math.round(r.width)) {
        c.width = Math.round(r.width);
        c.height = Math.round(r.height);
      }
      c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
    }
    setTimeout(paint, 40);
  };
  paint();
  const play = () => sources.forEach((v) => v.paused && v.play().catch(() => {}));
  play();
  ["pointerdown", "touchstart"].forEach((ev) => addEventListener(ev, play, { passive: true }));
  document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && play());

  box.addEventListener("click", (e) => {
    const item = e.target.closest(".c-item");
    if (item) openPiece(pieces[item.dataset.piece]);
  });
  // The hovered piece comes to the front.
  let topZ = 100;
  box.addEventListener("pointerover", (e) => {
    const item = e.target.closest(".c-item");
    if (item) item.style.zIndex = ++topZ;
  });

  let lastW = innerWidth, timer;
  addEventListener("resize", () => {
    if (Math.abs(innerWidth - lastW) < 80) return; // ignore mobile toolbar resizes
    lastW = innerWidth;
    clearTimeout(timer);
    timer = setTimeout(() => {
      build();
      sources = videos();
      play();
    }, 250);
  });
}

// A piece seen large, on white. Videos play with sound on demand.
function openPiece(piece) {
  const box = document.createElement("div");
  box.className = "s-view";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.innerHTML = `
    ${piece.video
      ? `<video src="${esc(piece.video)}" muted autoplay loop playsinline data-cursor="Sound on"></video>`
      : `<img src="${esc(piece.image.src)}" alt="${esc(piece.title)}">`}
    <p class="ui s-view-cap"><span>${esc(piece.title)}</span><button class="ui s-close">Close</button></p>`;
  document.body.appendChild(box);
  setTimeout(() => box.classList.add("open"), 20);
  const video = $("video", box);
  video?.addEventListener("click", () => {
    video.muted = !video.muted;
    video.dataset.cursor = video.muted ? "Sound on" : "Sound off";
    $(".cursor-label")?.replaceChildren(video.dataset.cursor);
  });
  const close = () => {
    box.classList.remove("open");
    video?.pause();
    setTimeout(() => box.remove(), 400);
    removeEventListener("keydown", onKey);
  };
  const onKey = (e) => e.key === "Escape" && close();
  addEventListener("keydown", onKey);
  $(".s-close", box).addEventListener("click", close);
  box.addEventListener("click", (e) => e.target === box && close());
}

/* ── Boot ───────────────────────────────────────────────── */

(function initExperimental() {
  bootSite();
  const root = $("#lab");
  root.innerHTML = `
    <p class="lab-text ui">${EXPERIMENTAL.text.map(esc).join(" ")}</p>
    <div class="collage"></div>
    <div class="sphere-stage" aria-hidden="true"><div class="sphere"></div></div>`;
  $("#site-footer").innerHTML = "";
  initCollage(root, EXPERIMENTAL.pieces);

  const stage = $(".sphere-stage", root);
  const showCollage = () => $(".collage", root).classList.add("in");
  if (reducedMotion) {
    stage.remove();
    showCollage();
    return;
  }
  document.documentElement.classList.add("sphere-active");
  const stop = runSphere(stage);
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    stage.classList.add("leaving");
    document.documentElement.classList.remove("sphere-active");
    setTimeout(showCollage, 450);
    setTimeout(() => {
      stop();
      stage.remove();
    }, 1500);
  };
  // Count the five seconds from the first painted frame.
  requestAnimationFrame(() => setTimeout(finish, SPHERE_MS));
  stage.addEventListener("click", finish);
})();
