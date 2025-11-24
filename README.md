# SvelteKit Starter Template

A minimal SvelteKit starter template for building modern web applications.

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

Your app will open automatically in the browser at `http://localhost:5173`

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run all tests
- `npm run lint` - Check code quality
- `npm run format` - Format code with Prettier

## What's Included

- **SvelteKit** - Modern web framework
- **Vite** - Fast build tool
- **Playwright** - End-to-end testing
- **Vitest** - Unit testing
- **ESLint & Prettier** - Code quality tools
- **FontAwesome** - Icon library
- **Chart.js** - Data visualization
- **Marked** - Markdown parser
- **Authentication System** - Built-in support for authenticated API access

## Project Structure

```
src/
├── lib/          # Reusable components and utilities
├── routes/       # Pages and API endpoints
└── app.html      # HTML template

static/           # Static assets (images, fonts, etc.)
```

## Authentication & API Access

This template includes a pre-configured authentication system that allows you to make authenticated API calls to the hackathon backend.

### How It Works

1. **Automatic Login Flow**: Users are redirected to the authentication service when needed
2. **Token Management**: Authentication tokens are automatically stored and included in API requests
3. **User Data**: Access user information via the `user` object in your components

### Making API Calls

```javascript
import fetchJSON, { postJson, putJson, deleteJson } from '$lib/fetch.svelte.js';

// GET request
const data = await fetchJSON('/stars/endpoint');

// POST request
const result = await postJson('/stars/endpoint', { key: 'value' });
```

The fetch helpers automatically:
- Add authentication headers
- Handle 401 unauthorized responses
- Redirect to login when needed

### User Information

```javascript
import { user } from '$lib/user.svelte.js';

// Access user data in your components
console.log(user.email, user.username, user.role);
```

## Learn More

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte Tutorial](https://learn.svelte.dev/)

## Testing

Run integration tests:
```bash
npm run test:integration
```

Run unit tests:
```bash
npm run test:unit
```
