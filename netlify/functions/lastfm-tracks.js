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
    const LASTFM_USERNAME = 'tjfogarty';

    if (!LASTFM_USERNAME) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Last.fm username not configured',
          setup: 'Add LASTFM_USERNAME to environment variables'
        }),
      };
    }

    // Scrape Last.fm profile page for recent tracks
    const lastfmUrl = `https://www.last.fm/user/${LASTFM_USERNAME}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(lastfmUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MusicBot/1.0)'
      }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Extract all data in one pass using optimized patterns
    const isPlaying = html.includes('now-scrobbling');
    const nameMatch = html.match(/chartlist-name"[^>]*>\s*<a[^>]*>([^<]+)/);
    const artistMatch = html.match(/chartlist-artist"[^>]*>\s*<a[^>]*>([^<]+)/);
    const albumMatch = html.match(/chartlist-album"[^>]*>\s*<a[^>]*>([^<]+)/);
    const imageMatch = html.match(/chartlist-image"[^>]*>[\s\S]{0,200}?src="([^"]+)"/);
    const urlMatch = html.match(/chartlist-name"[^>]*>\s*<a[^>]*href="([^"]+)"/);

    const name = nameMatch ? nameMatch[1].trim() : 'Unknown Track';
    const artist = artistMatch ? artistMatch[1].trim() : 'Unknown Artist';
    const album = albumMatch ? albumMatch[1].trim() : 'Unknown Album';
    const albumImage = imageMatch ? imageMatch[1] : null;
    const url = urlMatch ? `https://www.last.fm${urlMatch[1]}` : null;

    // Parse timestamp if available (for non-playing tracks)
    let timestamp = null;
    if (!isPlaying) {
      const timeMatch = html.match(/class="chartlist-timestamp"[^>]*>\s*<abbr[^>]*title="([^"]+)"/i) ||
                       html.match(/(\d+)\s+(minute|hour)s?\s+ago/i);

      if (timeMatch) {
        const now = new Date();
        const timeText = timeMatch[0] || timeMatch[1];

        if (timeText.includes('minute')) {
          const minutes = parseInt(timeText.match(/\d+/)?.[0] || '0');
          timestamp = new Date(now.getTime() - minutes * 60 * 1000).toISOString();
        } else if (timeText.includes('hour')) {
          const hours = parseInt(timeText.match(/\d+/)?.[0] || '0');
          timestamp = new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
        }
      }
    }

    const musicData = {
      isPlaying,
      name,
      artist,
      album,
      albumImage,
      url,
      timestamp,
      source: 'Last.fm (scraped)'
    };

    // Update cache
    cache = { data: musicData, timestamp: now };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(musicData),
    };

  } catch (error) {
    console.error('Last.fm scraping error:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Error fetching music data',
        error: error.message
      }),
    };
  }
};
