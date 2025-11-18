import fetchJson from "$lib/fetch.svelte.js";
import { postJson } from "$lib/fetch.svelte.js";

export const ssr = false;

export async function load({ url }) {
  const briefs = await fetchJson("/stars/briefs/all");
  const userInfo = await postJson("/skills/get-user-information");

  console.log("Loaded briefs:", briefs);
  console.log("Loaded userInfo:", userInfo);
  return { briefs, userInfo };
}
