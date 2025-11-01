import fetchJson from "$lib/fetch.js";

export const ssr = false;

export async function load({ url }) {
  const briefs = await fetchJson("/briefs/all");

  console.log("Loaded briefs:", briefs);
  return { briefs };
}
