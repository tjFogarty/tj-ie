function handleScroll() {
  const cubes = document.querySelector('.cubes');

  if (!cubes || getComputedStyle(cubes).display === 'none') return;

  const parentElement = cubes.parentElement;
  const parentRect = parentElement.getBoundingClientRect();

  // Calculate progress based on parent element scroll position
  // Start animation when parent enters viewport, finish when it's mostly scrolled past
  const windowHeight = window.innerHeight;
  const parentHeight = parentRect.height;

  // Adjust animation range to complete later in the scroll
  const animationStart = windowHeight; // Start when parent enters viewport
  const animationEnd = -parentHeight * 0.8; // End when parent is almost fully scrolled past

  // Calculate progress based on parent position (not cubes position since it's sticky)
  let progress = (animationStart - parentRect.top) / (animationStart - animationEnd);
  progress = Math.max(0, Math.min(1, progress));

  for (let i = 0; i < cubes.children.length; i++) {
    const cube = cubes.children[i];

    // Extract original top value from the --top CSS variable
    const topValue = cube.style.getPropertyValue('--top');
    const originalTop = parseFloat(topValue.replace('px', '')) || 0;

    // Apply smooth easing
    const easedProgress = progress * progress * (3 - 2 * progress); // smoothstep

    // Interpolate from originalTop to 0 based on eased progress
    let currentTop = originalTop * (1 - easedProgress);

    // Ensure we reach exactly 0 when progress is 1
    if (progress >= 0.99) {
      currentTop = 0;
    }

    // Update the transform
    cube.style.transform = `translateY(${currentTop}px)`;

    // Add opacity fade-in
    cube.style.opacity = Math.max(0.4, easedProgress);
  }
}

document.addEventListener('DOMContentLoaded', () => {
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
