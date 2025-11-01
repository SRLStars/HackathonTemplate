<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Welcome from '$lib/components/Welcome.svelte';

	let isMounted = false;

	onMount(() => {
		isMounted = true;
		return () => {
			isMounted = false;
		};
	});
</script>

<Welcome {isMounted} />
