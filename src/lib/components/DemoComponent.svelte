<script>
  const { briefs } = $props();
</script>

<main>
  <h1>Briefs</h1>
  <pre>{JSON.stringify(briefs, null, 2)}</pre>
</main>
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

<style>
  :global(body) {
    font-family: "Arial", sans-serif;
    background-color: #f3f4f6;
    margin: 0;
    color: #1f2937;
  }
</style>
