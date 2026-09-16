(() => {
  const hero = document.getElementById('principal');
  const scene = document.querySelector('.time-scene');
  const arm = document.getElementById('scene-arm');
  const minute = document.getElementById('scene-minute-hand');
  const hour = document.getElementById('scene-hour-hand');
  const toggle = document.querySelector('.scene-toggle');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let visible = true;
  let elapsed = 0;
  let previous = null;
  let frame = null;

  const ease = value => value * value * (3 - 2 * value);
  const clamp = value => Math.max(0, Math.min(1, value));
  function render() {
    // One shared timeline: the clock advances during the outward hand gesture,
    // then holds its new time while the arm returns. A cycle lasts eight seconds.
    const cycle = elapsed / 8000;
    const phase = cycle % 1;
    const sweep = ease(clamp((phase - 0.12) / 0.43));
    const returnSweep = ease(clamp((phase - 0.65) / 0.35));
    const angle = 12 - 30 * sweep + 30 * returnSweep;
    const turns = Math.floor(cycle) + sweep;
    arm.setAttribute('transform', `rotate(${angle} 1018 829)`);
    minute.setAttribute('transform', `rotate(${turns * 360})`);
    hour.setAttribute('transform', `rotate(${-30 + turns * 30})`);
  }
  function tick(now) {
    if (previous !== null) elapsed += now - previous;
    previous = now;
    render();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previous = null;
    toggle.textContent = paused ? 'Reproduzir animação' : 'Pausar animação';
    toggle.setAttribute('aria-pressed', String(paused));
    if (!paused && visible && !document.hidden && !scene.hidden) {
      frame = requestAnimationFrame(tick);
    }
  }
  toggle.addEventListener('click', () => { paused = !paused; sync(); });
  reducedMotion.addEventListener('change', event => { paused = event.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(hero);

  // Keep the original background if either animation image fails to load.
  Promise.all(['image/principal-clean.png', 'image/principal.jpg'].map(src =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = reject;
      image.src = src;
    })
  )).then(() => {
    render();
    scene.hidden = false;
    hero.classList.add('scene-ready');
    sync();
  }).catch(() => {});
})();
