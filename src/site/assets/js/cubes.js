function handleScroll() {
  const cubes = document.querySelector('.cubes');

  if (!cubes || getComputedStyle(cubes).display === 'none') return;

  const parentElement = cubes.parentElement;
  const parentRect = parentElement.getBoundingClientRect();

  const windowHeight = window.innerHeight;
  const parentHeight = parentRect.height;

  const animationStart = windowHeight;
  const animationEnd = -parentHeight * 0.5;

  let progress = (animationStart - parentRect.top) / (animationStart - animationEnd);
  progress = Math.max(0, Math.min(1, progress));

  for (let i = 0; i < cubes.children.length; i++) {
    const cube = cubes.children[i];

    const topValue = cube.style.getPropertyValue('--top');
    const originalTop = parseFloat(topValue.replace('px', '')) || 0;

    const easedProgress = progress * progress * (3 - 2 * progress);

    let currentTop = originalTop * (1 - easedProgress);

    if (progress >= 0.99) {
      currentTop = 0;
    }

    cube.style.transform = `translateY(${currentTop}px)`;
    cube.style.opacity = Math.max(0.4, easedProgress);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return;

  // Throttle scroll events for better performance
  let ticking = false;

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick);
  handleScroll();
});
