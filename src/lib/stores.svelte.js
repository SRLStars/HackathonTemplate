export const basePath = "stars";
export const basePathAPI = "artefactsAPI";
export const appState = $state({ currentBrief: null, briefs: [] });

export const authHost = "https://compucore.itcarlow.ie/auth";

export function APIhost() {
  let url = `/${basePath}/api`; // for local development

  // send api requests to vite server
  // which will proxy them to the backend
  // to avoid CORS issues, see vite.config.js

  if (window.location.hostname.includes("compucore")) url = `/${basePathAPI}`;

  //deliberately don't add trailing slash, force consumers to prefix path with / so they are easy to search for
  return "http://localhost:8062";
  //return `https://compucore.itcarlow.ie/STARSAPI`;
  return window.origin + url;
}

export function WebAppRoot() {
  return window.origin + `/${basePath}/`;
}

export function APIhostStatic() {
  return APIhost(); // +"static/";
}
