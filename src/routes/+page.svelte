<script lang="ts">
  import DemoComponent from "$lib/components/DemoComponent.svelte";

  /** @type {{briefs: any[]}} */
  let { data } = $props();
  const { briefs } = data;
  console.log("Page data:", data);
</script>

<DemoComponent {briefs} />
<hr />
<footer>
  <div>
    <p>
      Developed in partnership with SETU, An Cosán, Malmö University, LUT
      Finland, and University of Tartu.
    </p>
    <p style="margin-top: 0.5rem;">
      © 2025 Self-Regulated Learning Tool. All rights reserved.
    </p>
  </div>
</footer>
