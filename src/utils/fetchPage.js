import axios from "axios";
import { HttpsProxyAgent } from 'https-proxy-agent'; // Optional for proxy support

// Enhanced User-Agent pool with mobile and desktop variants
const userAgents = [
  // Windows - Chrome
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  // Mac - Safari
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
  // Android - Mobile
  "Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.210 Mobile Safari/537.36",
  // iPhone - Mobile
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
];

// Domain-specific configuration
const domainConfigs = {
  'kiryuu02.com': {
    referer: 'https://kiryuu02.com/',
    origin: 'https://kiryuu02.com'
  },
  'komikstation.org': {
    referer: 'https://komikstation.org/',
    origin: 'https://komikstation.org'
  },
  'natsu.id': {
    referer: 'https://natsu.id/',
    origin: 'https://natsu.id'
  }
};

// Cache for storing final URLs
const urlCache = new Map();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

const getRandomUserAgent = () => userAgents[Math.floor(Math.random() * userAgents.length)];

const getDomainConfig = (url) => {
  const domain = Object.keys(domainConfigs).find(key => 
    key !== 'default' && url.includes(key)
  );
  return domainConfigs[domain || 'default'];
};

const getHeaders = (url) => {
  const { referer, origin } = getDomainConfig(url);
  
  return {
    "User-Agent": getRandomUserAgent(),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": referer,
    "Origin": origin,
    "X-Requested-With": "XMLHttpRequest",
    "Upgrade-Insecure-Requests": "1",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache"
  };
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Enhanced fetch with timeout and proxy support
export const fetchPage = async (url, config = {}) => {
  try {
    const response = await axios.get(url, {
      headers: {
        ...getHeaders(url),
        ...config.headers,
      },
      timeout: 10000, // 10 seconds timeout
      // proxy: false, // Uncomment to disable proxy
      // httpsAgent: new HttpsProxyAgent('http://your-proxy:port'), // Optional proxy
      ...config,
    });

    await delay(500 + Math.random() * 1000); // Random delay between 500-1500ms
    return response.data;
  } catch (error) {
    const errorDetails = {
      url,
      status: error.response?.status,
      message: error.message,
      headers: error.response?.headers,
      data: error.response?.data?.slice(0, 200) // First 200 chars of response
    };
    
    console.error('Fetch Error:', errorDetails);
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
};

// Enhanced retry mechanism with exponential backoff
export const fetchWithRetry = async (url, config = {}, retryConfig = {}) => {
  const { 
    retries = 3, 
    baseDelay = 1000,
    maxDelay = 15000,
    retryOn = [429, 500, 502, 503, 504]
  } = retryConfig;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetchPage(url, config);
    } catch (error) {
      if (attempt === retries) throw error;
      
      const status = error.response?.status;
      if (status && !retryOn.includes(status)) throw error;

      const delayTime = Math.min(
        baseDelay * Math.pow(2, attempt - 1) + Math.random() * 500,
        maxDelay
      );
      
      console.warn(`Attempt ${attempt} failed. Retrying in ${Math.round(delayTime/1000)}s...`);
      await delay(delayTime);
    }
  }
};

// Cached URL resolver with redirect handling
export const getFinalUrl = async (url, config = {}) => {
  const cacheKey = `final-url:${url}`;
  const cached = urlCache.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.url;
  }

  try {
    const response = await axios.head(url, {
      headers: getHeaders(url),
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
      timeout: 5000,
      ...config
    });

    const finalUrl = response.headers.location || url;
    urlCache.set(cacheKey, { url: finalUrl, timestamp: Date.now() });
    
    return finalUrl;
  } catch (error) {
    console.error(`URL Resolution Error: ${url}`, error.message);
    urlCache.set(cacheKey, { url, timestamp: Date.now() }); // Cache original as fallback
    return url;
  }
};

// Utility to clear cache
export const clearUrlCache = () => urlCache.clear();
