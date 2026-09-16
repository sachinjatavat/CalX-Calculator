const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// --- LOAD ENV FILE NATIVELY ---
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      if (key && !process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const API_KEY = process.env.EXCHANGE_RATE_API_KEY || '';

// --- IN-MEMORY RATE CACHE ---
let ratesCache = {
  data: null,
  timestamp: 0,
  ttlMs: 10 * 60 * 1000 // 10 minutes cache TTL for 24/7 reliability
};

// Helper for HTTP/HTTPS requests
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(body));
          } else {
            reject(new Error(`Status ${res.statusCode}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 24/7 Forex Fetcher with Multi-Provider Failover
async function getCurrencyRates() {
  const now = Date.now();
  if (ratesCache.data && (now - ratesCache.timestamp < ratesCache.ttlMs)) {
    return { ...ratesCache.data, cached: true };
  }

  const providers = [];

  // Priority 1: Private API Key endpoint if key is provided in .env
  if (API_KEY) {
    providers.push(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
  }

  // Priority 2 & 3: 24/7 Open Forex Providers
  providers.push('https://open.er-api.com/v6/latest/USD');
  providers.push('https://api.exchangerate-api.com/v4/latest/USD');

  for (const providerUrl of providers) {
    try {
      const data = await fetchJson(providerUrl);
      const rates = data.rates || data.conversion_rates;
      if (rates && typeof rates === 'object') {
        const payload = {
          result: 'success',
          base: 'USD',
          rates: rates,
          timestamp: new Date().toISOString()
        };
        ratesCache.data = payload;
        ratesCache.timestamp = now;
        return payload;
      }
    } catch (err) {
      console.warn(`Forex provider failed (${providerUrl}):`, err.message);
    }
  }

  // Fallback payload if all network calls fail
  if (ratesCache.data) return ratesCache.data;
  throw new Error('All currency rate providers failed');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Secure API Proxy for Currency Rates (Hides API Key from Frontend)
  if (req.url === '/api/currency-rates') {
    try {
      const rateData = await getCurrencyRates();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(rateData));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ result: 'error', message: err.message }));
    }
    return;
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (indexErr, indexContent) => {
          if (indexErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(indexContent, 'utf-8');
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`🚀 CalcX Universal Server Running (24/7 Secure Proxy Active)`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`API Endpoint: http://localhost:${PORT}/api/currency-rates`);
  console.log(`================================================`);
});
