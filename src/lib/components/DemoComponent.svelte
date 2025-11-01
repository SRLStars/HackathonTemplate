<script>
  const { briefs } = $props();

  console.log("Briefs:", briefs);
</script>

<main>
  <h1>Briefs</h1>
  <pre>{JSON.stringify(briefs, null, 2)}</pre>
</main>

<style>
  :global(body) {
    font-family: "Arial", sans-serif;
    background-color: #f3f4f6;
    margin: 0;
    color: #1f2937;
  }
</style>
