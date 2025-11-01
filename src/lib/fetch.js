import { error } from "@sveltejs/kit";
import { basePath, basePathAPI } from "$lib/stores.svelte.js";
import { user } from "$lib/user.svelte.js";
import { redirect } from "@sveltejs/kit";
import { APIhost, WebAppRoot, APIhostStatic } from "$lib/stores.svelte.js";

export { APIhost, WebAppRoot, APIhostStatic };

export function UUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper function to add authorization headers
function addAuthHeaders(headers = {}) {
  if (user.token) {
    headers["Authorization"] = `Bearer ${user.token}`;
  }
  return headers;
}

// Helper function to normalize redirect URLs with base path
function normalizeRedirectUrl(redirectUrl) {
  if (
    redirectUrl &&
    redirectUrl.startsWith("/") &&
    !redirectUrl.startsWith("/" + basePath)
  ) {
    const normalized = "/" + basePath + redirectUrl;
    console.log("Added base path to redirect URL:", normalized);
    return normalized;
  }
  return redirectUrl;
}

// Helper function to handle 401 unauthorized responses
function handle401Redirect() {
  const authURL =
    "https://compucore.itcarlow.ie/auth/sign_in?redirect=" +
    APIhost() +
    "/auth_callback" +
    "&origin_url=" +
    window.location.href +
    "&auth_provider=google_microsoft";

  console.log("401 Unauthorized - Redirecting to sign in:", authURL);
  //alert("401 Unauthorized - Redirecting to sign in:" + authURL);

  if (typeof window === "undefined") {
    console.log("Server side redirect");
    throw redirect(302, authURL);
  } else {
    console.log("Client side redirect");
    window.location.href = authURL;
  }
}

// Unified fetch helper with common logic
async function performFetch(api, options = {}) {
  const {
    method = "GET",
    body = null,
    headers = {},
    handleRedirects = false,
    throw404 = false,
    showAlert = false,
  } = options;

  const url = APIhost() + api;
  console.log(`${method}:`, url);

  const finalHeaders = addAuthHeaders(headers);
  const fetchOptions = {
    method,
    credentials: "include",
    headers: finalHeaders,
  };

  if (method === "GET") {
    fetchOptions.redirect = "manual";
  }

  if (body !== null) {
    fetchOptions.body = body;
  }

  try {
    //alert("Fetching: " + url);
    const response = await fetch(url, fetchOptions);
    console.log("Response:", response);

    // Handle HTTP redirects (GET only)
    if (
      handleRedirects &&
      (response.status === 302 || response.status === 301)
    ) {
      const redirectUrl = normalizeRedirectUrl(
        response.headers.get("Location")
      );
      console.log("Redirecting to:", redirectUrl);
      window.location.href = redirectUrl;
      return;
    }

    // Parse JSON response
    let data = {};
    try {
      data = await response.json();
    } catch (e) {
      console.error("Error parsing JSON:", e);
    }

    // Handle redirect_url in JSON response
    if (handleRedirects && data.redirect_url) {
      const redirectUrl = normalizeRedirectUrl(data.redirect_url);
      console.log("redirect_url found:", redirectUrl);
      window.location.href = redirectUrl;
    }

    // Handle error responses
    if (!response.ok) {
      if (response.status === 401) {
        //alert("Unauthorized - Redirecting to sign in");
        handle401Redirect();
      }
      if (response.status === 404) {
        if (throw404) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return null;
      }

      console.error("Fetch Error:", response);

      if (method !== "GET") {
        error(response.status, {
          message: "API error: " + url + " " + response.statusText,
        });
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (e) {
    console.error("Fetch Error:", url, e);

    if (showAlert) {
      alert("Error: " + e.message);
      return null;
    }

    return Promise.reject("Failed fetching data: " + url + " " + e.message);
  }
}

export default async function fetchJson(api, headers = {}) {
  return performFetch(api, {
    method: "GET",
    headers,
    handleRedirects: true,
    throw404: false,
  });
}

export async function postJson(api, data = {}) {
  return sendJson(api, data, "POST");
}

export async function putJson(api, data = {}) {
  return sendJson(api, data, "PUT");
}

export async function deleteJson(api, data = {}) {
  return sendJson(api, data, "DELETE");
}

async function sendJson(api, data = {}, method = "POST") {
  return performFetch(api, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    throw404: true,
  });
}

export async function postForm(api, form = {}) {
  return performFetch(api, {
    method: "POST",
    body: form,
    showAlert: true,
    throw404: true,
  });
}
