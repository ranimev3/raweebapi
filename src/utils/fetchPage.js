import axios from "axios";

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Mobile Safari/537.36",
];

const getRandomUserAgent = () => {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

// Dynamic headers based on target domain
const getHeaders = (url) => {
  const isKomikstation = url.includes('komikstation.org');
  
  return {
    "User-Agent": getRandomUserAgent(),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
    "Referer": isKomikstation ? "https://komikstation.org/" : "https://kiryuu02.com/",
    "Origin": isKomikstation ? "https://komikstation.org" : "https://kiryuu02.com",
    "X-Requested-With": "XMLHttpRequest",
    "Upgrade-Insecure-Requests": "1",
  };
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchPage = async (url, config = {}) => {
  try {
    const response = await axios.get(url, {
      headers: {
        ...getHeaders(url),
        ...config.headers,
      },
      ...config,
    });

    await delay(1000);
    return response.data;
  } catch (error) {
    console.error(`Error fetching URL: ${url}`, error.message);
    console.error("Error details:", {
      status: error.response?.status,
      headers: error.response?.headers,
      data: error.response?.data
    });
    throw error;
  }
};

// ... (fetchWithRetry dan getFinalUrl tetap sama, tapi gunakan getHeaders(url))
