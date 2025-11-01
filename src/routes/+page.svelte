<script lang="ts">
  import DemoComponent from "$lib/components/DemoComponent.svelte";

  /** @type {{briefs: any[]}} */
  let { briefs } = $props();
</script>

<DemoComponent {briefs} />
