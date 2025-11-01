<script>
  import NavBar from "$components/NavBar.svelte";
  import { page } from "$app/stores";
  import { onNavigate } from "$app/navigation";
  import { setContext } from "svelte";
  import {
    ensureUserLoggedIn,
    logout,
    user,
    redirectToAuth,
  } from "$lib/user.svelte";

  /** @type {{data: any, children?: import('svelte').Snippet}} */
  let { data, children } = $props();

  let showNavBarExceptForSigninPage = $derived(
    $page.route.id?.includes("signin") ? false : true
  );

  //setContext('user', user);

  console.log("layout.svelte: page", $page);
</script>

<div class="container">
  <div class="main_content">
    {@render children?.()}
  </div>
</div>

<style>
  .container {
    max-width: var(--screen-width);
    height: 100%;
    margin: 0 auto;
  }

  .main_content {
    view-transition-name: main_content;
  }

  @keyframes fade-out {
    to {
      opacity: 0;
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slide-from-right {
    from {
      transform: translateX(100%);
    }
  }

  @keyframes slide-from-bottom {
    from {
      transform: translateY(+100%);
    }
  }

  @keyframes zoom {
    from {
      transform: scale(0);
    }
  }
  @keyframes zoom-and-fade-out {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(5);
      opacity: 0;
    }
  }
  :root::view-transition-old(main_content) {
    /* animation to apply to old element */
    animation: 500ms ease-out both zoom-and-fade-out;
  }
  :root::view-transition-new(main_content) {
    /* animation to apply to new element */
    animation: 500ms ease-out both zoom;
  }

  footer {
    min-height: 6em;
  }
</style>
