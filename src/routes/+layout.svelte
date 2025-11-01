<script>
  import { page } from "$app/stores";

  /** @type {{data: any, children?: import('svelte').Snippet}} */
  let { data, children } = $props();

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
</style>
