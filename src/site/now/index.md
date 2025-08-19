---
layout: layouts/post.njk
title: Now
eleventyNavigation:
  key: Now
  order: 3
script: now.js
---

## 🎵 Currently Playing

<div id="now-playing" class="now-playing-widget">
  <div class="loading">Loading current track...</div>
</div>

## 📍 Location

Currently based in **Waterford, Ireland** 🇮🇪

<div id="current-weather" class="weather-widget">
  <div class="loading">Loading weather...</div>
</div>

<script>
// Immediately load cached data before main script loads
(function() {
  const CACHE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

  function getCache(key) {
    try {
      const cached = localStorage.getItem(`nowPage_${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  function renderNowPlaying(track) {
    return `
      <div class="track-info">
        ${track.albumImage ? `<img src="${track.albumImage}" alt="${track.album}" class="album-art">` : ''}
        <div class="track-details">
          <div class="track-name">${track.name}</div>
          <div class="track-artist">${track.artist}</div>
        </div>
      </div>
    `;
  }

  function renderWeather(weather) {
    return `
      <div class="weather-info">
        <div class="weather-details">
          <div class="temperature">${weather.temperature}°C</div>
          <div class="description">${weather.description}</div>
        </div>
      </div>
    `;
  }

  // Load cached music data
  const nowPlayingContainer = document.getElementById('now-playing');
  if (nowPlayingContainer) {
    const cachedMusic = getCache('nowPlaying');
    if (cachedMusic && cachedMusic.data && (Date.now() - cachedMusic.timestamp) < CACHE_TIMEOUT) {
      if (cachedMusic.data.name && cachedMusic.data.artist) {
        nowPlayingContainer.innerHTML = renderNowPlaying(cachedMusic.data);
        nowPlayingContainer.classList.add('playing');
      }
    }
  }

  // Load cached weather data
  const weatherContainer = document.getElementById('current-weather');
  if (weatherContainer) {
    const cachedWeather = getCache('weather');
    if (cachedWeather && cachedWeather.data && (Date.now() - cachedWeather.timestamp) < CACHE_TIMEOUT) {
      if (cachedWeather.data.temperature !== undefined) {
        weatherContainer.innerHTML = renderWeather(cachedWeather.data);
        weatherContainer.classList.add('loaded');
      }
    }
  }
})();
</script>

## 🔭 Working On

- **ServisBOT**: Building conversational AI solutions as Senior Fullstack Engineer
- **Personal projects**: Maintaining [Swatcher](https://swatcher.ie) and exploring new ideas. Also building [Served](https://servedapp.ie) for managing recipes found online.

## 📚 Currently Reading

Documentation. I need to get back into books.

## 🌱 Learning

- Laravel
- Google Firebase
- Vue stores and caching
- How to be better at guitar

## 🎯 Current Focus

- Getting in shape
- Building more creative side projects
- Getting back into playing guitar

## 💭 On My Mind

Getting [Swatcher](https://swatcher.ie) out there more. Sharing, contacting paint brands.

---

*Want to create your own "now" page? Check out [nownownow.com](https://nownownow.com/).*
