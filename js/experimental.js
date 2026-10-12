// The experimental zone: dark page, a dot field that reacts to the cursor
// (a nod to the creative-coding work), and the pieces in a staggered grid.

function dotField(canvas) {
  const ctx = canvas.getContext("2d");
  const gap = 26;
  let w, h, dpr, mx = -999, my = -999;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
  };
  resize();
  addEventListener("resize", resize);
  addEventListener("pointermove", (e) => { mx = e.clientX * dpr; my = e.clientY * dpr; }, { passive: true });
  const color = getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#fff";

  const draw = (t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    const g = gap * dpr, reach = 160 * dpr;
    for (let y = g / 2; y < h; y += g) {
      for (let x = g / 2; x < w; x += g) {
        const dx = x - mx, dy = y - my;
        const d = Math.hypot(dx, dy);
        const f = d < reach ? 1 - d / reach : 0;
        const wave = reducedMotion ? 0 : Math.sin(t * 0.001 + x * 0.004 + y * 0.003) * 0.5 + 0.5;
        ctx.globalAlpha = 0.1 + f * 0.6 + wave * 0.05;
        const r = (0.8 + f * 1.6) * dpr;
        ctx.fillRect(x + (dx / (d || 1)) * f * 14 * dpr - r / 2, y + (dy / (d || 1)) * f * 14 * dpr - r / 2, r, r);
      }
    }
    if (!reducedMotion) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}

(function initExperimental() {
  bootSite(null);
  const root = $("#lab");
  root.innerHTML = `
    <canvas class="lab-field" aria-hidden="true"></canvas>
    <header class="lab-head">
      <p class="ui muted">TouchDesigner — creative coding — graphic software</p>
      <h1 class="display">Experimental<br>zone</h1>
      <div class="text">${EXPERIMENTAL.text.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
    </header>
    <div class="lab-grid">
      ${EXPERIMENTAL.pieces
        .map((piece, i) => {
          const media = piece.video
            ? `<video data-autoplay src="${esc(piece.video)}" muted loop playsinline preload="metadata" style="aspect-ratio:${piece.w}/${piece.h}"></video>`
            : `<img src="${esc(piece.image.src)}" alt="${esc(piece.title)}" width="${piece.image.w}" height="${piece.image.h}" loading="lazy" data-lightbox>`;
          return `
            <figure class="piece" data-reveal style="--r:${((piece.w || piece.image.w) / (piece.h || piece.image.h)).toFixed(4)}">
              ${media}
              <figcaption class="ui"><span class="muted">EXP ${pad(i + 1)}</span><span>${esc(piece.title)}</span></figcaption>
            </figure>`;
        })
        .join("")}
    </div>`;

  $("#site-footer").innerHTML = `<a class="ui" href="index.html">← Index</a><a class="ui" href="mailto:${esc(SITE.email)}">Contact</a>`;

  dotField($(".lab-field", root));
  initReveal(root);
  initLightbox(root);

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => (e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause())),
    { threshold: 0.2 }
  );
  $$("video[data-autoplay]", root).forEach((v) => io.observe(v));
})();
