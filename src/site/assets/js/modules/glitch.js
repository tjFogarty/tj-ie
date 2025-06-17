export function glitchText() {
  const glitchText = document.querySelectorAll('.glitch-text');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!glitchText || prefersReducedMotion) return;

  glitchText.forEach((element) => {
    const originalText = element.textContent;
    // fixes the width of the element to prevent layout shifts
    element.style.width = `${originalText.length}ch`;

    function intensiveGlitch() {
      const glitchChars = ['▓', '░', '▒', '█', '▄', '▀', '▌', '▐', '■', '□', '◊', '◦', '▫', '▪'];

      let iterations = 0;
      const maxIterations = 5;

      const corruptInterval = setInterval(() => {
        let result = '';

        for (let i = 0; i < originalText.length; i++) {
          if (iterations < maxIterations && Math.random() < 0.4) {
            result += `<span class="glitch-char">${glitchChars[Math.floor(Math.random() * glitchChars.length)]}</span>`;
          } else {
            result += originalText[i];
          }
        }

        element.innerHTML = result;
        iterations++;

        if (iterations >= maxIterations * 2) {
          clearInterval(corruptInterval);
          element.textContent = originalText;
        }
      }, 50);

      // Schedule next intensive glitch
      setTimeout(intensiveGlitch, Math.random() * 8000 + 4000);
    }

    // Start the glitch cycle
    setTimeout(intensiveGlitch, 1000);
  });
}
