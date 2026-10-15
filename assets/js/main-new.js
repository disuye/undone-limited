const revealMailto = (link) => {
  const set = () => { link.href = `mailto:${link.dataset.u}@${link.dataset.d}`; };
  ['mouseover', 'touchstart', 'focus'].forEach((type) =>
    link.addEventListener(type, set, { once: true, passive: true }));
};

const lockViewportHeight = () => {
  const root = document.documentElement.style;
  const portrait = matchMedia('(orientation: portrait)');
  let height;

  const set = (name, px) => root.setProperty(name, `${px}px`);

  const measure = () => {
    height = innerHeight;
    set('--vh-static', height);
    set('--vh-lock', height);
  };

  const grow = () => {
    if (innerHeight <= height) return;
    height = innerHeight;
    set('--vh-lock', height);
  };

  portrait.addEventListener('change', () => {
    measure();
    addEventListener('resize', measure, { once: true });
  });
  addEventListener('resize', grow, { passive: true });
  measure();
};

document.querySelectorAll('a[data-u][data-d]').forEach(revealMailto);
lockViewportHeight();
