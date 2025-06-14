---
title: "Injecting Personality"
description: "A couple of minor tweaks to add some personality to this website."
date: 2025-06-14T14:30:00.000+01:00
permalink: "/injecting-personality/"
coverPreview: personality.png
cover: "https://tj.ie/assets/images/personality.png"
tags:
  - javascript
  - css
  - html
layout: layouts/post.njk
---

Just because I may lack personality doesn’t mean my poor website has to suffer the same fate.

I’ve always been fond of worn-looking technology aesthetics, and I just so happen to be replaying Cyberpunk 2077. I’ve been enjoying its look and feel. Technology built on top of technology built on top of technology. What’s old is new again, but it retains some spirit of what came before.

There are elements of modernity, but you can’t quite erase the foundation. Maybe it’s a palimpsest, if that’s the word’s proper usage.

From the flicker of the footer icons, desperately holding on to the power they once held in commercial website design, to the scan-line appearance of the images, reminiscent of CRT monitors, hovering brings us back to the modern age of clean, sharply rendered images.

Looking at individual posts, we see the ghostly apparition of the cover image assembling itself as we scroll. It’s out of scale and proportion, as if it is a forgotten remnant of a previous system left to do its own thing, fighting to maintain relevance and function.

Little <span class="glitch-text" data-text="ghosts">ghosts</span>, toiling away, giving spirit to plain text.

<style>
  .glitch-text {
    position: relative;
    color: var(--colour-text);
    font-weight: bold;
    display: inline-block;
    font-family: var(--font-mono);
  }

  .glitch-text.glitching {
    animation: rgb-split 0.2s ease-in-out;
  }

  @keyframes rgb-split {
    0% {
      text-shadow:
        -1px 0 #ff0040,
        1px 0 #00ff88,
        0 0 var(--colour-accent);
    }
    25% {
      text-shadow:
        -2px -1px #ff0040,
        2px 1px #00ff88,
        0 0 var(--colour-accent);
      transform: translate(1px, -1px);
    }
    50% {
      text-shadow:
        -1px 1px #ff0040,
        1px -1px #00ff88,
        0 0 var(--colour-accent);
      transform: translate(-1px, 1px);
    }
    75% {
      text-shadow:
        -2px 0 #ff0040,
        2px 0 #00ff88,
        0 0 var(--colour-accent);
      transform: translate(1px, 0);
    }
    100% {
      text-shadow: none;
      transform: translate(0);
    }
  }
</style>

<script>
(function() {
  const glitchText = document.querySelector('.glitch-text');
  const originalText = glitchText.textContent;

  function intensiveGlitch() {
    const glitchChars = ['▓', '░', '▒', '█', '▄', '▀', '▌', '▐', '■', '□', '◊', '◦', '▫', '▪'];

    glitchText.classList.add('glitching');

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

      glitchText.textContent = result;
      iterations++;

      if (iterations >= maxIterations * 2) {
        clearInterval(corruptInterval);
        glitchText.textContent = originalText;
        glitchText.classList.remove('glitching');
      }
    }, 50);

    // Schedule next intensive glitch
    setTimeout(intensiveGlitch, Math.random() * 8000 + 4000);
  }

  // Start the glitch cycle
  setTimeout(intensiveGlitch, 1000);
})();
</script>
