class NowPage {
  constructor() {
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
    this.init();
  }

  getCache(key) {
    try {
      const cached = localStorage.getItem(`nowPage_${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  setCache(key, data) {
    try {
      localStorage.setItem(`nowPage_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }

  init() {
    // Load cached data immediately if available
    this.loadCachedData();
    
    // Then load fresh data
    this.loadNowPlaying();
    this.loadWeather();
    
    // Refresh now playing every 30 seconds
    setInterval(() => {
      this.loadNowPlaying();
    }, 30000);
    
    // Refresh weather every 10 minutes
    setInterval(() => {
      this.loadWeather();
    }, 600000);
  }

  loadCachedData() {
    // Load cached now playing immediately
    const nowPlayingContainer = document.getElementById('now-playing');
    if (nowPlayingContainer) {
      const cachedMusic = this.getCache('nowPlaying');
      if (cachedMusic && cachedMusic.data && (Date.now() - cachedMusic.timestamp) < this.cacheTimeout) {
        this.renderNowPlayingData(nowPlayingContainer, cachedMusic.data);
      }
    }

    // Load cached weather immediately
    const weatherContainer = document.getElementById('current-weather');
    if (weatherContainer) {
      const cachedWeather = this.getCache('weather');
      if (cachedWeather && cachedWeather.data && (Date.now() - cachedWeather.timestamp) < this.cacheTimeout) {
        this.renderWeatherData(weatherContainer, cachedWeather.data);
      }
    }
  }

  async loadNowPlaying() {
    const container = document.getElementById('now-playing');
    if (!container) return;

    // Check if we need fresh data
    const now = Date.now();
    const cached = this.getCache('nowPlaying');
    if (cached && cached.data && (now - cached.timestamp) < this.cacheTimeout) {
      // Cache is still valid, no need to fetch
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/lastfm-tracks');
      const data = await response.json();

      // Update localStorage cache
      this.setCache('nowPlaying', data);
      
      this.renderNowPlayingData(container, data);
    } catch (error) {
      console.error('Error fetching now playing:', error);
      container.innerHTML = this.renderNotPlaying('Error loading music data');
      container.classList.remove('playing');
    }
  }

  renderNowPlayingData(container, data) {
    if (data.name && data.artist) {
      container.innerHTML = this.renderNowPlaying(data);
      container.classList.add('playing');
    } else {
      container.innerHTML = this.renderNotPlaying(data.message || 'No recent tracks found');
      container.classList.remove('playing');
    }
  }

  async loadWeather() {
    const container = document.getElementById('current-weather');
    if (!container) return;

    // Check if we need fresh data
    const now = Date.now();
    const cached = this.getCache('weather');
    if (cached && cached.data && (now - cached.timestamp) < this.cacheTimeout) {
      // Cache is still valid, no need to fetch
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/weather');
      const data = await response.json();

      // Update localStorage cache
      this.setCache('weather', data);
      
      this.renderWeatherData(container, data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      container.innerHTML = this.renderWeatherError('Error loading weather data');
    }
  }

  renderWeatherData(container, data) {
    if (data.temperature !== undefined) {
      container.innerHTML = this.renderWeather(data);
      container.classList.add('loaded');
    } else {
      container.innerHTML = this.renderWeatherError(data.message || 'Weather data unavailable');
    }
  }

  renderNowPlaying(track) {
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

  renderNotPlaying(message) {
    return `<div class="not-playing">${message}</div>`;
  }

  renderWeather(weather) {
    return `
      <div class="weather-info">
        <div class="weather-details">
          <div class="temperature">${weather.temperature}°C</div>
          <div class="description">${weather.description}</div>
        </div>
      </div>
    `;
  }

  renderWeatherError(message) {
    return `<div class="weather-error">${message}</div>`;
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('now-playing') || document.getElementById('current-weather')) {
      new NowPage();
    }
  });
} else {
  if (document.getElementById('now-playing') || document.getElementById('current-weather')) {
    new NowPage();
  }
}