#!/usr/bin/env node

/**
 * Simple static server with SPA fallback support
 * Serves static files and falls back to index.html for unknown routes
 * Handles SvelteKit base path configuration (/artefacts)
 * Usage: node spa-server.cjs [port] [directory]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.argv[2] || 8000;
const BUILD_DIR = process.argv[3] || './build';
const BASE_PATH = '/artefacts'; // Should match svelte.config.js paths.base

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function serveFile(res, filePath) {
  const mimeType = getMimeType(filePath);
  const content = fs.readFileSync(filePath);
  
  res.writeHead(200, { 'Content-Type': mimeType });
  res.end(content);
}

function serveFallback(res, fallbackPath) {
  console.log(`Serving fallback: ${fallbackPath}`);
  serveFile(res, fallbackPath);
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let requestPath = decodeURIComponent(url.pathname);
    
    console.log(`${req.method} ${req.url}`);
    
    // Handle root redirect to base path
    if (requestPath === '/') {
      console.log(`Redirecting / to ${BASE_PATH}/`);
      res.writeHead(302, { 'Location': BASE_PATH + '/' });
      res.end();
      return;
    }
    
    // Check if the request is for the base path or its subdirectories
    if (requestPath.startsWith(BASE_PATH)) {
      // Remove base path prefix for file lookup
      requestPath = requestPath.slice(BASE_PATH.length);
    } else {
      // Request doesn't match base path - return 404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found - Invalid base path');
      return;
    }
    
    // Remove leading slash for path.join
    if (requestPath.startsWith('/')) {
      requestPath = requestPath.slice(1);
    }
    
    // Default to index.html for root of base path
    if (requestPath === '' || requestPath === '/') {
      requestPath = 'index.html';
    }
    
    const filePath = path.join(BUILD_DIR, requestPath);
    console.log(`  -> Looking for file: ${filePath}`);
    
    // Check if file exists
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      serveFile(res, filePath);
    } else {
      // SPA fallback - serve index.html for unknown routes within base path
      const fallbackPath = path.join(BUILD_DIR, 'index.html');
      if (fs.existsSync(fallbackPath)) {
        serveFallback(res, fallbackPath);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found - No fallback available');
      }
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`SPA Server running at http://localhost:${PORT}/`);
  console.log(`App available at: http://localhost:${PORT}${BASE_PATH}/`);
  console.log(`Serving files from: ${path.resolve(BUILD_DIR)}`);
  console.log(`Base path: ${BASE_PATH}`);
  console.log(`SPA fallback enabled - unknown routes will serve index.html`);
});