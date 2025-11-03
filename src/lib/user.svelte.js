import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { starsAPIhost, authHost } from "$lib/stores.svelte.js";
import fetchJSON from "$lib/fetch.js";
import { postJson } from "$lib/fetch.js";

export let user = $state({});

export const redirectToAuth = () => {
  // Use resolve to get the correct path with base path prefix
  // This will be '/' for local dev and '/HackathonTemplate/' for GitHub Pages
  const path = resolve("/");

  let authURL =
    "https://compucore.itcarlow.ie/auth/sign_in?redirect=" +
    window.location.origin +
    path;
  authURL += "&auth_provider=google_microsoft";
  console.log("Client side going to Auth service: authURL:", authURL);
  window.location.href = authURL;
};

function getUserFromLocalStorage() {
  /** @type {import('./$types').LayoutLoad} */
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function ensureUserLoggedIn(url) {
  if (browser) {
    if (url) {
      //check

      const token = url.searchParams.get("token");
      if (token) {
        console.log("Token found in URL search params:", token);

        user.id = url.searchParams.get("user_id");
        user.email = url.searchParams.get("email");
        user.username = url.searchParams.get("display_name");
        user.forename = url.searchParams.get("forename");
        user.surname = url.searchParams.get("surname");
        user.avatar_url = url.searchParams.get("avatar_url");
        user.auth_provider = url.searchParams.get("auth_provider");
        user.auth_provider_id = url.searchParams.get("auth_provider_id");
        user.token = token;

        localStorage.setItem("user", JSON.stringify(user));

        console.log("clearing URL of token and user data");
        await goto(window.location.pathname, { replaceState: true });
        return;
      }
    }

    // if (!user) user = getUserFromContext();
    // console.log('User from context:', user);

    if (!user.id) {
      const storedUser = await getUserFromLocalStorage();
      Object.assign(user, storedUser);
      console.log("User from localStorage:", storedUser);
    }

    if (!user.id) {
      console.log(
        "No user found in localStorage, going to auth service to login"
      );
      console.log(
        "We will be redirected back with a token & user data in the URL"
      );
      await redirectToAuth();
      return;
    }

    if (!user.role) {
      await fetchJSON("/stars/user").then((userData) => {
        console.log("userData:", userData);
        user.role = userData.role;
        localStorage.setItem("user", JSON.stringify(user));
      });
      console.log("Fetched userData from server...");
    }

    if (!user.signedConsent) {
      let url = "/skills/sign-consent";
      //add username and email to url as query params
      url += `?username=${user.username}&email=${user.email}`;
      //encode it so special characters are handled
      url = encodeURI(url);
      await postJson(url).then((consentData) => {
        console.log("consentData:", consentData);
        user.signedConsent = consentData.signedConsent;
        localStorage.setItem("user", JSON.stringify(user));
      });
      console.log("Fetched consentData from server...");
    }
  }
  console.log("Returning user:", $state.snapshot(user));
  return user;
}

export const logout = () => {
  localStorage.removeItem("user");
  Object.keys(user).forEach((k) => (user[k] = null));

  // Each URL contains the next URL as an encoded parameter
  // Each app "unwraps" one layer by decoding its next parameter
  // The browser follows the chain until it reaches the innermost URL (logout-complete)
  // each api clears its session before redirecting to "next"

  const appsToLogOutOf = [starsAPIhost(), authHost]; // called in order, make sure authHost is last

  let redirectUrl = window.location.href; //end up here after logout chain

  // Work backwards through the apps
  for (let i = appsToLogOutOf.length - 1; i >= 0; i--) {
    // Each iteration wraps the previous URL
    redirectUrl = `${appsToLogOutOf[i]}/logout?next=${encodeURIComponent(redirectUrl)}`;
    console.log(`Step ${appsToLogOutOf.length - i}:`, redirectUrl);
  }
  console.log("Final logout URL:", redirectUrl);

  if (browser) {
    window.location.href = redirectUrl;
  }
};
