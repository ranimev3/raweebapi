import axios from "axios";

// Enhanced User-Agent pool with updated versions
const USER_AGENTS = {
  desktop: [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0"
  ],
  mobile: [
    "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36"
  ]
};

// Domain configuration with default values
const DOMAIN_CONFIG = {
  'komikstation.org': {
    origin: 'https://komikstation.org',
    referer: 'https://komikstation.org/',
    default: true
  },
  'kiryuu02.com': {
    origin: 'https://kiryuu02.com',
    referer: 'https://kiryuu02.com/'
  },
  'default': {
    origin: 'https://google.com',
    referer: 'https://google.com/'
  }
};

// Cache configuration
const CACHE_CONFIG = {
  ttl: 1000 * 60 * 30, // 30 minutes
  maxSize: 100
};

// Request statistics
const requestStats = {
  total: 0,
  success: 0,
  failed: 0,
  byDomain: {}
};

// Helper functions
const getRandomUserAgent = (type = 'desktop') => {
  const agents = USER_AGENTS[type] || USER_AGENTS.desktop;
  return agents[Math.floor(Math.random() * agents.length)];
};

const getDomainConfig = (url) => {
  const domain = Object.keys(DOMAIN_CONFIG).find(d => 
    d !== 'default' && url.includes(d)
  ) || 'default';
  
  // Initialize stats if not exists
  if (!requestStats.byDomain[domain]) {
    requestStats.byDomain[domain] = { total: 0, success: 0, failed: 0 };
  }
  
  return DOMAIN_CONFIG[domain];
};

const getHeaders = (url, options = {}) => {
  const { origin, referer } = getDomainConfig(url);
  
  return {
    "User-Agent": getRandomUserAgent(options.agentType),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": referer,
    "Origin": origin,
    "X-Requested-With": "XMLHttpRequest",
    "Upgrade-Insecure-Requests": "1",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    ...options.customHeaders
  };
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Response cache
const responseCache = new Map();

const cacheResponse = (key, data) => {
  if (responseCache.size >= CACHE_CONFIG.maxSize) {
    const oldestKey = responseCache.keys().next().value;
    responseCache.delete(oldestKey);
  }
  responseCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const getCachedResponse = (key) => {
  const cached = responseCache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_CONFIG.ttl)) {
    return cached.data;
  }
  return null;
};

// Main functions
export const fetchPage = async (url, config = {}) => {
  const cacheKey = `fetch:${url}`;
  const cached = config.cache ? getCachedResponse(cacheKey) : null;
  if (cached) return cached;

  requestStats.total++;
  const domain = Object.keys(DOMAIN_CONFIG).find(d => url.includes(d)) || 'unknown';
  requestStats.byDomain[domain].total++;

  try {
    const startTime = Date.now();
    const response = await axios.get(url, {
      headers: getHeaders(url, {
        agentType: config.agentType,
        customHeaders: config.headers
      }),
      timeout: config.timeout || 15000,
      responseType: config.responseType || 'text',
      ...config.axiosConfig
    });

    const processingTime = Date.now() - startTime;
    await delay(config.delay || (500 + Math.random() * 1000)); // Random delay 500-1500ms

    if (config.cache) {
      cacheResponse(cacheKey, response.data);
    }

    requestStats.success++;
    requestStats.byDomain[domain].success++;
    
    return {
      data: response.data,
      headers: response.headers,
      status: response.status,
      processingTime
    };
  } catch (error) {
    requestStats.failed++;
    requestStats.byDomain[domain].failed++;

    const errorInfo = {
      url,
      status: error.response?.status,
      message: error.message,
      headers: error.response?.headers,
      data: error.response?.data,
      config: error.config
    };

    console.error('Fetch Error:', errorInfo);
    throw new EnhancedError(`Failed to fetch ${url}`, errorInfo);
  }
};

export const fetchWithRetry = async (url, config = {}, retryConfig = {}) => {
  const { 
    retries = 3, 
    baseDelay = 1000,
    maxDelay = 30000,
    retryOn = [408, 429, 500, 502, 503, 504]
  } = retryConfig;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetchPage(url, config);
    } catch (error) {
      if (attempt === retries) throw error;
      
      const status = error.info?.status;
      if (status && !retryOn.includes(status)) throw error;

      const delayTime = Math.min(
        baseDelay * Math.pow(2, attempt - 1),
        maxDelay
      );
      
      console.warn(`Attempt ${attempt}/${retries} failed. Retrying in ${Math.round(delayTime/1000)}s...`);
      await delay(delayTime);
    }
  }
};

export const getFinalUrl = async (url, config = {}) => {
  const cacheKey = `final-url:${url}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.head(url, {
      headers: getHeaders(url, {
        customHeaders: config.headers
      }),
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
      timeout: config.timeout || 8000
    });

    const finalUrl = response.headers.location || url;
    cacheResponse(cacheKey, finalUrl);
    return finalUrl;
  } catch (error) {
    console.error(`URL Resolution Error: ${url}`, error.message);
    cacheResponse(cacheKey, url); // Cache original as fallback
    return url;
  }
};

// Additional utilities
export const clearCache = () => responseCache.clear();

export const getStats = () => ({ ...requestStats });

export const getConfig = () => ({
  userAgents: USER_AGENTS,
  domains: DOMAIN_CONFIG,
  cache: CACHE_CONFIG
});

// Custom error class
class EnhancedError extends Error {
  constructor(message, info) {
    super(message);
    this.name = 'EnhancedError';
    this.info = info;
  }
      }
