import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// Use an empty string for dev, /HackathonTemplate for production
const dev = process.env.NODE_ENV !== 'production';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // Static adapter with fallback for SPA behavior
      pages: "build",
      assets: "build",
      fallback: "index.html", // serve index.html for unknown paths
    }),

    paths: {
      base: dev ? '' : '/HackathonTemplate', // base path of your app
    },

    alias: {
      $lib: "src/lib",
      $components: "src/lib/components",
    },

    // additional configurations...
  },
  vitePlugin: {
    inspector: true,
  },
};

export default config;

// export default {
// 	kit: {
// 		adapter: adapter({
// 			// default options are shown. On some platforms
// 			// these options are set automatically — see below
// 			pages: 'build',
// 			assets: 'build',
// 			fallback: undefined,
// 			precompress: false,
// 			strict: true
// 		})
// 	}
// };
