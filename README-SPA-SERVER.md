# Static SPA Server

This directory contains a simple static server with SPA (Single Page Application) fallback support for testing the built application locally.

## Problem

When you build a SvelteKit static application with dynamic routes (like `/artefact/[id]`) and a base path (like `/artefacts`), simple HTTP servers like Python's `python3 -m http.server` can't handle:

1. **Base path routing**: The app expects to be served from `/artefacts/` but simple servers serve from root `/`
2. **SPA fallback routing**: Dynamic routes like `/artefacts/artefact/12` should serve the `index.html` fallback, but simple servers return 404 for unknown paths

## Solution

The `spa-server.cjs` script provides:
- Base path handling: serves the app at `/artefacts/` to match SvelteKit configuration
- Static file serving for all built assets with correct MIME types  
- SPA fallback routing: unknown paths serve `index.html` for client-side routing
- Root redirect: `/` redirects to `/artefacts/` automatically
- Simple logging for debugging

## Usage

### Option 1: Using npm scripts (recommended)
```bash
npm run build
npm run serve:spa
```

This will start the server at `http://localhost:8000/` with the app available at `http://localhost:8000/artefacts/`.

### Option 2: Direct Node.js execution
```bash
# From the web directory:
npm run build
node spa-server.cjs [port] [build-directory]

# Examples:
node spa-server.cjs 8000          # Uses ./build directory
node spa-server.cjs 3000 ./dist   # Custom port and directory
```

## Testing URLs

After starting the server, test these URLs:
- `http://localhost:8000/` - Redirects to `/artefacts/`
- `http://localhost:8000/artefacts/` - Home page (prerendered)
- `http://localhost:8000/artefacts/all-briefs` - Briefs list (prerendered)  
- `http://localhost:8000/artefacts/artefact/12` - Dynamic artefact page (SPA fallback)
- `http://localhost:8000/artefacts/artefact/999` - Non-existent artefact (SPA fallback)

All should load the SvelteKit application correctly, with dynamic routes handled client-side.

## Why not `python3 -m http.server`?

Python's simple HTTP server doesn't support:
- SPA fallback routing (serves 404 for unknown paths)
- Base path configuration (can't serve from `/artefacts/` when files are in root)
- Proper redirects or route handling

This is why you see "File not found" errors when using Python's server directly.

## Production Deployment

For production deployment on platforms like:

### Netlify
Create `_redirects` file in the build directory:
```
/*    /index.html   200
```

### Vercel  
The platform automatically handles SPA fallback for static deployments.

### GitHub Pages
Use the SPA adapter configuration already set in `svelte.config.js`.

### Apache
Create `.htaccess` file in the build directory:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Nginx
Add to your nginx configuration:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```