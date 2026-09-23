/* ============================================================
   NAV — collapses only when JS is present (see .js rules in CSS)
   ============================================================ */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', function () {
    setOpen(nav.classList.toggle('is-open') === false ? false : true);
  });

  // Recompute on click since classList.toggle returned nothing useful above
  toggle.addEventListener('click', function () {
    setOpen(nav.classList.contains('is-open'));
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Close after tapping a link
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setOpen(false);
  });

  // If the viewport grows past the breakpoint, reset state
  var mq = window.matchMedia('(min-width: 621px)');
  var onChange = function () { if (mq.matches) setOpen(false); };
  mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
})();


/* ============================================================
   CONWAY'S GAME OF LIFE
   ============================================================ */
(function () {
  var canvas = document.getElementById('life');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var CELL = 14;        // css px per cell — also the lattice spacing
  var STEP_MS = 110;    // ~9 generations per second
  var DENSITY = 0.28;

  var cols = 0, rows = 0;
  var cssW = 0, cssH = 0;
  var grid, next;
  var colors = {};
  var rafId = null;
  var lastStep = 0;

  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    colors.alive = cs.getPropertyValue('--sim1-bright').trim() || '#5b9cf5';
    colors.grid = cs.getPropertyValue('--grid').trim() || 'rgba(255,255,255,0.045)';
  }

  function seed() {
    grid = new Uint8Array(cols * rows);
    next = new Uint8Array(cols * rows);
    for (var i = 0; i < grid.length; i++) {
      grid[i] = Math.random() < DENSITY ? 1 : 0;
    }
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    cssW = rect.width;
    cssH = rect.height;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var c = Math.max(8, Math.floor(cssW / CELL));
    var r = Math.max(6, Math.floor(cssH / CELL));

    if (c !== cols || r !== rows) {
      cols = c;
      rows = r;
      seed();
    }
    draw();
  }

  function step() {
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var n = 0;
        for (var dy = -1; dy <= 1; dy++) {
          for (var dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            var nx = (x + dx + cols) % cols;
            var ny = (y + dy + rows) % rows;
            n += grid[ny * cols + nx];
          }
        }
        var alive = grid[y * cols + x];
        next[y * cols + x] =
          (alive && (n === 2 || n === 3)) || (!alive && n === 3) ? 1 : 0;
      }
    }
    var t = grid; grid = next; next = t;
  }

  function draw() {
    ctx.clearRect(0, 0, cssW, cssH);

    // Lattice
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var x = 0; x <= cols; x++) {
      ctx.moveTo(x * CELL + 0.5, 0);
      ctx.lineTo(x * CELL + 0.5, rows * CELL);
    }
    for (var y = 0; y <= rows; y++) {
      ctx.moveTo(0, y * CELL + 0.5);
      ctx.lineTo(cols * CELL, y * CELL + 0.5);
    }
    ctx.stroke();

    // Live cells
    ctx.fillStyle = colors.alive;
    for (var yy = 0; yy < rows; yy++) {
      for (var xx = 0; xx < cols; xx++) {
        if (grid[yy * cols + xx]) {
          ctx.fillRect(xx * CELL + 1, yy * CELL + 1, CELL - 2, CELL - 2);
        }
      }
    }
  }

  function tick(now) {
    rafId = requestAnimationFrame(tick);
    if (now - lastStep < STEP_MS) return;
    lastStep = now;
    step();
    draw();
  }

  function start() {
    if (reduceMotion || rafId !== null) return;
    lastStep = 0;
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Click / tap to toggle a cell
  canvas.addEventListener('pointerdown', function (e) {
    var rect = canvas.getBoundingClientRect();
    var x = Math.floor((e.clientX - rect.left) / CELL);
    var y = Math.floor((e.clientY - rect.top) / CELL);
    if (x < 0 || y < 0 || x >= cols || y >= rows) return;
    grid[y * cols + x] ^= 1;
    draw();
  });

  // Don't burn battery when scrolled away
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries[0].isIntersecting ? start() : stop();
    }, { threshold: 0 }).observe(canvas);
  }

  // Re-read colors when the OS theme flips
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var onTheme = function () { readColors(); draw(); };
  mq.addEventListener ? mq.addEventListener('change', onTheme) : mq.addListener(onTheme);

  // Rebuild on resize
  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(canvas);
  } else {
    window.addEventListener('resize', resize);
  }

  readColors();
  resize();
  start();
})();
