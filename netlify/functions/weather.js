// In-memory cache
let cache = { data: null, timestamp: 0 };
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=600', // 10 minutes browser/CDN cache
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Check cache first
  const now = Date.now();
  if (cache.data && (now - cache.timestamp) < CACHE_DURATION) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(cache.data),
    };
  }

  try {
    // Configuration - easy to modify selectors for experimentation
    const config = {
      url: 'https://www.waterfordcityweather.com',
      source: 'Waterford City Weather',
      location: 'Waterford, Ireland',
      selectors: {
        temperature: [
          /id="ajaxtemp"[^>]*lastobs="([^"&]+)/i,
          /id="ajaxtemp"[^>]*>([^<]+)/i
        ],
        description: [
          /id="ajaxcurrentcond"[^>]*>([^<]+)/i
        ],
        humidity: [
          /id="ajaxhumidity"[^>]*>([^<]*\d+)/i
        ],
        windSpeed: [
          /id="ajaxwind"[^>]*>([^<]*\d+)/i
        ]
      }
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(config.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WeatherBot/1.0)'
      }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Helper function to try multiple selectors
    const extractValue = (selectors, html) => {
      for (const selector of selectors) {
        const match = html.match(selector);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
      return null;
    };

    // Extract weather data using the selectors
    const tempText = extractValue(config.selectors.temperature, html);
    const temperature = Math.round(parseFloat(tempText?.replace(/[°C]/g, '') || '0'));

    const description = extractValue(config.selectors.description, html) || 'Unknown';

    const humidityText = extractValue(config.selectors.humidity, html);
    const humidity = parseInt(humidityText?.match(/\d+/)?.[0] || '0');

    const windText = extractValue(config.selectors.windSpeed, html);
    const windSpeed = parseInt(windText?.match(/\d+/)?.[0] || '0');

    const feelsLikeText = null; // Removed since feelsLike selector was removed
    const feelsLike = feelsLikeText ?
      Math.round(parseFloat(feelsLikeText.replace(/[°C]/g, ''))) :
      temperature; // Fallback to actual temp

    const weather = {
      location: config.location,
      temperature,
      description,
      feelsLike,
      humidity,
      windSpeed,
      source: config.source
    };

    // Update cache
    cache = { data: weather, timestamp: now };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(weather),
    };

  } catch (error) {
    console.error('Weather scraping error:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Error fetching weather data',
        error: error.message
      }),
    };
  }
};
