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

const fitHeadline = (headline) => {
  const lines = [...headline.children];
  let fit = 1;
  let lastWidth = 0;

  const naturalWidth = (line) => {
    const indent = parseFloat(getComputedStyle(line).paddingLeft);
    return { indent, text: (line.offsetWidth - indent) / fit };
  };

  const apply = () => {
    const available = headline.clientWidth;
    fit = Math.min(1, ...lines.map(naturalWidth).map(({ indent, text }) => (available - indent) / text));
    headline.style.setProperty('--fit', fit.toFixed(4));
  };

  new ResizeObserver(([entry]) => {
    if (entry.contentRect.width === lastWidth) return;
    lastWidth = entry.contentRect.width;
    apply();
  }).observe(headline);

  document.fonts.ready.then(apply);
};

document.querySelectorAll('a[data-u][data-d]').forEach(revealMailto);
document.querySelectorAll('[data-contents="split-headline"]').forEach(fitHeadline);
lockViewportHeight();
