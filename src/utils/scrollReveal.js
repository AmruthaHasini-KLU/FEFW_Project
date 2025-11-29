// Simple scroll reveal utility using IntersectionObserver
export default function initScrollReveal(options = {}) {
  const selector = options.selector || '[data-reveal]';
  const rootMargin = options.rootMargin || '0px 0px -8% 0px';
  const threshold = options.threshold || 0.05;

  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (options.once) io.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin, threshold });

  document.querySelectorAll(selector).forEach((el) => io.observe(el));

  return io;
}
// Simple scroll reveal utility using IntersectionObserver
export default function initScrollReveal(options = {}) {
  const selector = options.selector || '[data-reveal]';
  const rootMargin = options.rootMargin || '0px 0px -8% 0px';
  const threshold = options.threshold || 0.05;

  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (!options.once) return; // leave if not one-shot
        io.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin, threshold });

  document.querySelectorAll(selector).forEach((el) => io.observe(el));

  return io;
}
