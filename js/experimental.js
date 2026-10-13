// The experimental zone: a white page with a short line of text and every
// piece (images and videos) laid out on a 3D sphere. Drag to turn it,
// scroll or pinch to zoom, click a piece to see it large. While there are
// only a few pieces, they repeat to cover the sphere.

const TILE_COUNT = 56;

// Each unique video plays once, hidden; the tiles paint its frames onto
// their own canvas, so repeats cost almost nothing.
function videoSource(src) {
  const v = document.createElement("video");
  Object.assign(v, { src, muted: true, loop: true, playsInline: true, autoplay: true, preload: "auto" });
  v.defaultMuted = true;
  v.className = "s-source";
  document.body.appendChild(v);
  v.play().catch(() => {});
  return v;
}

function initSphere(stage, pieces) {
  const sphere = $(".sphere", stage);
  const sources = new Map();
  pieces.filter((p) => p.video).forEach((p) => sources.set(p.video, videoSource(p.video)));

  let R, tiles = [];
  const build = () => {
    R = Math.min(innerWidth * (isMobile() ? 0.4 : 0.3), innerHeight * 0.36);
    sphere.innerHTML = "";
    tiles = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < TILE_COUNT; i++) {
      const piece = pieces[i % pieces.length];
      const ratio = piece.video ? piece.w / piece.h : piece.image.w / piece.image.h;
      const h = R * 0.3, w = Math.min(h * ratio, R * 0.44);
      // Fibonacci points: an even spread over the sphere.
      const y = 1 - (2 * (i + 0.5)) / TILE_COUNT;
      const r = Math.sqrt(1 - y * y);
      const x = Math.cos(i * golden) * r, z = Math.sin(i * golden) * r;
      const lon = Math.atan2(x, z), lat = -Math.asin(y);

      const el = document.createElement("div");
      el.className = "s-tile";
      el.dataset.cursor = "Open";
      el.dataset.piece = pieces.indexOf(piece);
      el.style.cssText = `width:${w}px;height:${h}px;margin:${-h / 2}px 0 0 ${-w / 2}px;transform:rotateY(${lon}rad) rotateX(${lat}rad) translateZ(${R}px)`;
      let canvas = null;
      if (piece.video) {
        canvas = document.createElement("canvas");
        const dpr = Math.min(devicePixelRatio || 1, 2);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        el.appendChild(canvas);
      } else {
        el.innerHTML = `<img src="${esc(piece.image.src)}" alt="${esc(piece.title)}" draggable="false">`;
      }
      sphere.appendChild(el);
      tiles.push({ el, canvas, ctx: canvas?.getContext("2d"), video: piece.video && sources.get(piece.video), n: [x, -y, z] });
    }
  };
  build();
  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });

  // Rotation (degrees) with inertia; zoom moves the sphere toward the viewer.
  const P = 1400;
  let rx = -12, ry = 0, vx = 0, vy = reducedMotion ? 0 : 0.08;
  let zoom = 0, zoomTarget = 0;
  const zoomRange = () => [-R * 1.4, P * 0.66 - R];
  let tiltX = 0, tiltY = 0, tx = 0, ty = 0;

  let drag = null, moved = 0;
  stage.addEventListener("pointerdown", (e) => {
    drag = { x: e.clientX, y: e.clientY, id: e.pointerId };
    moved = 0;
    stage.classList.add("dragging");
  });
  addEventListener("pointermove", (e) => {
    if (finePointer) {
      tx = (e.clientX / innerWidth - 0.5) * 2;
      ty = (e.clientY / innerHeight - 0.5) * 2;
    }
    if (!drag || e.pointerId !== drag.id || pinch) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    moved += Math.abs(dx) + Math.abs(dy);
    vy = dx * 0.18;
    vx = -dy * 0.18;
    ry += vy;
    rx = clamp(rx + vx, -70, 70);
    drag.x = e.clientX;
    drag.y = e.clientY;
  });
  const endDrag = () => {
    drag = null;
    stage.classList.remove("dragging");
  };
  addEventListener("pointerup", endDrag);
  addEventListener("pointercancel", endDrag);

  stage.addEventListener("wheel", (e) => {
    e.preventDefault();
    const [lo, hi] = zoomRange();
    zoomTarget = clamp(zoomTarget - e.deltaY * (e.deltaMode === 1 ? 30 : 1) * 0.9, lo, hi);
  }, { passive: false });

  // Pinch to zoom on touch screens.
  let pinch = null;
  const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  stage.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) pinch = { d: dist(e.touches), z: zoomTarget };
  }, { passive: true });
  stage.addEventListener("touchmove", (e) => {
    if (!pinch || e.touches.length !== 2) return;
    const [lo, hi] = zoomRange();
    zoomTarget = clamp(pinch.z + (dist(e.touches) - pinch.d) * 2.2, lo, hi);
  }, { passive: true });
  stage.addEventListener("touchend", (e) => e.touches.length < 2 && (pinch = null), { passive: true });

  // Click (not drag) opens the piece.
  stage.addEventListener("click", (e) => {
    const tile = e.target.closest(".s-tile");
    if (tile && moved < 6) openPiece(pieces[tile.dataset.piece]);
  });

  const rad = Math.PI / 180;
  let frame = 0;
  const tick = () => {
    if (!drag) {
      vx *= 0.94;
      vy = vy * 0.96 + (reducedMotion ? 0 : 0.08) * 0.04; // ease back to a slow spin
      ry += vy;
      rx = clamp(rx + vx, -70, 70);
    }
    tiltX += (tx * 6 - tiltX) * 0.05;
    tiltY += (ty * -6 - tiltY) * 0.05;
    zoom += (zoomTarget - zoom) * 0.12;
    const ax = (rx + tiltY) * rad, ay = (ry + tiltX) * rad;
    sphere.style.transform = `translateZ(${zoom}px) rotateX(${rx + tiltY}deg) rotateY(${ry + tiltX}deg)`;

    // How much each tile faces the viewer: front ones are crisp, the far
    // side shows through faintly. Far-side videos repaint less often.
    const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
    frame++;
    for (const t of tiles) {
      const [x, y, z] = t.n;
      const z1 = -x * sy + z * cy;
      const facing = y * sx + z1 * cx;
      t.el.style.opacity = facing > 0 ? 0.35 + facing * 0.65 : Math.max(0.06, 0.2 + facing * 0.2);
      if (t.ctx && frame % (facing > -0.1 ? 2 : 8) === 0 && t.video.readyState >= 2) {
        const v = t.video, cw = t.canvas.width, ch = t.canvas.height;
        const s = Math.max(cw / v.videoWidth, ch / v.videoHeight);
        const w = v.videoWidth * s, h = v.videoHeight * s;
        t.ctx.drawImage(v, (cw - w) / 2, (ch - h) / 2, w, h);
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // Hidden sources can be paused by the browser; keep them going.
  const replay = () => sources.forEach((v) => v.paused && v.play().catch(() => {}));
  ["pointerdown", "touchstart"].forEach((ev) => addEventListener(ev, replay, { passive: true }));
  document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && replay());
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

(function initExperimental() {
  bootSite();
  const root = $("#lab");
  root.innerHTML = `
    <p class="lab-text ui">${EXPERIMENTAL.text.map(esc).join(" ")}</p>
    <div class="sphere-stage"><div class="sphere"></div></div>`;
  $("#site-footer").innerHTML = `<span class="ui muted">Drag to turn, scroll to zoom</span><a class="ui" href="mailto:${esc(SITE.email)}">Contact</a>`;
  initSphere($(".sphere-stage", root), EXPERIMENTAL.pieces);
})();
