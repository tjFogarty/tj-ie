export function glitchText() {
  const glitchText = document.querySelectorAll('.glitch-text');

  if (!glitchText) return;

  glitchText.forEach((element) => {
    const originalText = element.textContent;

    function intensiveGlitch() {
      const glitchChars = ['▓', '░', '▒', '█', '▄', '▀', '▌', '▐', '■', '□', '◊', '◦', '▫', '▪'];

      element.classList.add('glitching');

      let iterations = 0;
      const maxIterations = 5;

      const corruptInterval = setInterval(() => {
        let result = '';

        for (let i = 0; i < originalText.length; i++) {
          if (iterations < maxIterations && Math.random() < 0.4) {
            result += glitchChars[Math.floor(Math.random() * glitchChars.length)];
          } else {
            result += originalText[i];
          }
        }

        element.textContent = result;
        iterations++;

        if (iterations >= maxIterations * 2) {
          clearInterval(corruptInterval);
          element.textContent = originalText;
          element.classList.remove('glitching');
        }
      }, 50);

      // Schedule next intensive glitch
      setTimeout(intensiveGlitch, Math.random() * 8000 + 4000);
    }

    // Start the glitch cycle
    setTimeout(intensiveGlitch, 1000);
  });
}
