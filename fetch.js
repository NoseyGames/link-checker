// fetch.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

/**
 * A wrapper for node-fetch to provide a consistent interface 
 * across all filtering modules.
 */
async function fetchURL(url, options = {}) {
    // Default headers to mimic a browser, which helps avoid some basic bot detection
    const defaultHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
    };

    const mergedOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, mergedOptions);
        return response;
    } catch (error) {
        console.error(`Fetch Error for ${url}:`, error.message);
        throw error;
    }
}

module.exports = { fetchURL };
