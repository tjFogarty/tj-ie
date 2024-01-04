(() => {
  function addTextSelection() {
    const heading = document.querySelector("h1");
    const textToReplace = "Particle Effects";

    heading.innerHTML = heading.innerHTML.replace(
      textToReplace,
      `<span class="selection ">${textToReplace}<span class="selection-bg"></span></span>`,
    );

    if (ResizeObserver && document.body.animate) {
      const selectionBg = document.querySelector(".selection-bg");
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { x, y } = entry.target.getBoundingClientRect();
          const { width, height } = entry.contentRect;

          createParticle(x + width, y + height);
        }
      });

      function createParticle(x, y) {
        const particle = document.createElement("particle");

        document.body.appendChild(particle);

        const size = Math.floor(Math.random() * 10 + 25);

        particle.style.width = `${size}px`;
        particle.style.height = `${size / 5}px`;

        const destinationX = x;
        const destinationY = y + 10;

        const animation = particle.animate(
          [
            {
              transform: `translate(${x - size / 2}px, ${
                y - size / 2
              }px) rotate(0deg)`,
              opacity: 1,
            },
            {
              transform: `translate(${destinationX}px, ${destinationY}px) rotate(-10deg)`,
              opacity: 0,
            },
          ],
          {
            duration: 500 + Math.random() * 1000,
            easing: "cubic-bezier(0, .9, .57, 1)",
            delay: Math.random() * 100,
          },
        );

        animation.addEventListener(
          "finish",
          () => {
            particle.remove();
          },
          { once: true },
        );
      }

      setTimeout(() => {
        resizeObserver.observe(selectionBg);
        selectionBg.classList.add("ready");
      }, 500);
    }
  }

  addTextSelection();
})();
