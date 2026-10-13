// The experimental zone. The text stays at the top. It opens on an index
// scan of black and white project pictures; after about five seconds (or a
// click) they give way to the experimental pieces, laid out with lots of
// air like a magazine spread.

const INDEX_MS = 4800;

// The collage: a fixed, airy layout in the spirit of magazine spreads.
// Each slot gives a piece's left edge and width (% of the page width) and
// its top (in vw, so the whole layout scales with the window). Pieces fill
// the slots in order and repeat while there are fewer pieces than slots.
// Some slots run off the page edge on purpose.
const SLOTS = [
  { x: 14, y: 6, w: 21, cap: "right" },
  { x: 57, y: 0, w: 13, cap: "left" },
  { x: 76, y: 24, w: 27, cap: "below" },
  { x: 5, y: 58, w: 31, cap: "below" },
  { x: 47, y: 50, w: 15, cap: "right" },
  { x: 73, y: 72, w: 16, cap: "left" },
  { x: 30, y: 96, w: 13, cap: "right" },
  { x: 54, y: 112, w: 30, cap: "below" },
];
// Where the short notes sit (desktop only), in the same units as SLOTS.
const NOTE_SLOTS = [
  { x: 40, y: 30 },
  { x: 67, y: 52 },
  { x: 9, y: 100 },
];
const SLOTS_MOBILE = [
  { x: 8, y: 0, w: 58, cap: "below" },
  { x: 44, y: 58, w: 50, cap: "below" },
  { x: 4, y: 104, w: 62, cap: "below" },
  { x: 52, y: 150, w: 44, cap: "below" },
  { x: 12, y: 196, w: 52, cap: "below" },
  { x: 40, y: 250, w: 56, cap: "below" },
  { x: 6, y: 300, w: 46, cap: "below" },
  { x: 36, y: 350, w: 60, cap: "below" },
];

/* ── Opening: index scan ────────────────────────────────── */
// A hairline sweeps down the white page and reveals a precise grid of
// black and white project pictures, with small plus marks at the grid
// corners. The pictures then quietly swap places, as if an archive were
// being indexed, while a counter runs; finally they dissolve one by one.

function runIndex(stage) {
  const pics = SPHERE;
  const mobile = isMobile();
  const padX = innerWidth * (mobile ? 0.05 : 0.07);
  const top = mobile ? 150 : 140, bottom = 64;
  const areaW = innerWidth - padX * 2, areaH = innerHeight - top - bottom;
  // Columns and rows of 3:4 cells, complete rows only (a few pictures
  // may be left out), with the largest cells that fit.
  let best = { cell: 0 };
  for (let cols = 4; cols <= 30; cols++) {
    const rows = Math.floor(pics.length / cols);
    if (!rows || cols * rows < pics.length * 0.85) continue;
    const gap = 0.18;
    const cw = Math.min(areaW / (cols + (cols - 1) * gap), areaH / (rows * 4 / 3 + (rows - 1) * gap * 4 / 3) * 1);
    if (cw > best.cell) best = { cell: cw, cols, rows };
  }
  const { cols, rows } = best;
  const cw = Math.floor(best.cell), ch = Math.round(cw * 4 / 3), gx = Math.round(cw * 0.18);
  const gridW = cols * cw + (cols - 1) * gx, gridH = rows * ch + (rows - 1) * gx;
  const ox = (innerWidth - gridW) / 2, oy = top + (areaH - gridH) / 2;

  const cells = [], marks = [];
  let html = "";
  for (let i = 0; i < rows * cols; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    html += `<div class="ix-cell" style="left:${ox + c * (cw + gx)}px;top:${oy + r * (ch + gx)}px;width:${cw}px;height:${ch}px"><img src="${esc(pics[i].src)}" alt=""></div>`;
  }
  // Plus marks where the gutters cross.
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const x = ox + c * (cw + gx) - gx / 2, y = oy + r * (ch + gx) - gx / 2;
      html += `<span class="ix-mark" style="left:${x}px;top:${y}px"></span>`;
    }
  }
  stage.innerHTML = `${html}<span class="ix-scan"></span>
    <p class="ix-read ui"><span>Indexing</span><span class="ix-count">000 / ${String(rows * cols).padStart(3, "0")}</span></p>`;
  cells.push(...$$(".ix-cell", stage));
  marks.push(...$$(".ix-mark", stage));
  const scan = $(".ix-scan", stage), count = $(".ix-count", stage);
  const total = String(cells.length).padStart(3, "0");
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  // 1. Sweep: each row appears as the line passes it.
  const SWEEP = 1500;
  later(() => stage.classList.add("scanning"), 30);
  cells.forEach((cell, i) => {
    const r = Math.floor(i / cols);
    later(() => cell.classList.add("on"), 120 + ((oy + r * (ch + gx)) / innerHeight) * SWEEP);
  });
  marks.forEach((m, i) => later(() => m.classList.add("on"), 60 + (i / marks.length) * SWEEP));

  // 2. Indexing: pictures swap places, the counter runs.
  let n = 0;
  const swap = () => {
    for (let k = 0; k < 3; k++) {
      const cell = cells[(Math.random() * cells.length) | 0];
      const img = $("img", cell);
      cell.classList.add("blink");
      setTimeout(() => {
        img.src = pics[(Math.random() * pics.length) | 0].src;
        cell.classList.remove("blink");
      }, 90);
    }
  };
  const counter = setInterval(() => {
    n = Math.min(cells.length, n + Math.ceil(cells.length / 70));
    count.textContent = `${String(n).padStart(3, "0")} / ${total}`;
  }, 40);
  let swapper;
  later(() => (swapper = setInterval(swap, 120)), SWEEP);

  return {
    // 3. Dissolve, one picture at a time in random order.
    leave(ms) {
      clearInterval(swapper);
      clearInterval(counter);
      count.textContent = `${total} / ${total}`;
      stage.classList.add("leaving");
      [...cells].sort(() => Math.random() - 0.5).forEach((cell, i) =>
        setTimeout(() => cell.classList.remove("on"), (i / cells.length) * ms * 0.8));
    },
    stop() {
      timers.forEach(clearTimeout);
      clearInterval(swapper);
      clearInterval(counter);
    },
  };
}

/* ── Collage ────────────────────────────────────────────── */

function collageHtml(pieces) {
  const slots = isMobile() ? SLOTS_MOBILE : SLOTS;
  const top = isMobile() ? 52 : 17; // vw below the top of the page, under the text
  const firstVideo = new Set();
  let bottom = 0;

  const html = slots.map((slot, i) => {
    const piece = pieces[i % pieces.length];
    const ratio = piece.video ? piece.w / piece.h : piece.image.w / piece.image.h;
    const y = top + slot.y;
    bottom = Math.max(bottom, y + slot.w / ratio);

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
    return `<figure class="c-item cap-${slot.cap}" data-cursor="Open" data-piece="${pieces.indexOf(piece)}"
      style="left:${slot.x}vw;top:${y}vw;width:${slot.w}vw;aspect-ratio:${ratio.toFixed(4)};--d:${i * 140}ms">
      ${media}<figcaption class="ui"><span class="muted">${pad(i + 1)}</span> ${esc(piece.title)}</figcaption></figure>`;
  });
  const notes = isMobile() ? [] : (EXPERIMENTAL.notes || []).slice(0, NOTE_SLOTS.length).map((text, i) =>
    `<p class="c-note" style="left:${NOTE_SLOTS[i].x}vw;top:${top + NOTE_SLOTS[i].y}vw;--d:${600 + i * 300}ms">${esc(text).replace(/\n/g, "<br>")}</p>`);
  return { html: html.join("") + notes.join(""), height: `${bottom + 14}vw` };
}

function initCollage(root, pieces) {
  const box = $(".collage", root);
  const build = () => {
    const { html, height } = collageHtml(pieces);
    box.innerHTML = html;
    box.style.height = height;
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
    <div class="ix-stage" aria-hidden="true"></div>`;
  $("#site-footer").innerHTML = "";
  initCollage(root, EXPERIMENTAL.pieces);

  const stage = $(".ix-stage", root);
  const showCollage = () => $(".collage", root).classList.add("in");
  if (reducedMotion) {
    stage.remove();
    showCollage();
    return;
  }
  document.documentElement.classList.add("ix-active");
  const index = runIndex(stage);
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    index.leave(1100);
    setTimeout(() => {
      document.documentElement.classList.remove("ix-active");
      stage.classList.add("gone");
      showCollage();
    }, 1000);
    setTimeout(() => {
      index.stop();
      stage.remove();
    }, 2000);
  };
  setTimeout(finish, INDEX_MS);
  stage.addEventListener("click", finish);
})();
