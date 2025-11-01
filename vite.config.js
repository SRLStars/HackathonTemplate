import { sveltekit } from '@sveltejs/kit/vite';

import { defineConfig } from 'vitest/config';
import { svelteTesting } from '@testing-library/svelte/vite'; // Add this

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	test: {
		include: ['**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		globals: true,
		setupFiles: './tests/setupTests.js'
	},
	server: {
		host: true,
		port: 5002, //what is this for?
		allowedHosts: ['host.docker.internal'],

		//route local api calls to the backend
		//to avoid CORS issues
		proxy: {
			'/stars/api': {
				target: 'http://localhost:8062/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/stars\/api/, '')
			}
		}
	}
});
