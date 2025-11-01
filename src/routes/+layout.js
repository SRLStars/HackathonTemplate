export const prerender = true;
export const ssr = false;
export const trailingSlash = 'always';
import { ensureUserLoggedIn } from '$lib/user.svelte.js';

export async function load({ params, url, route }) {

	let user = await ensureUserLoggedIn(url);

	if (!user) {
		console.error('No user found ');
		//What to do now?
	}

	return { user };
}
