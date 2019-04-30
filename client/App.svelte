<script>
import { screen } from './store';
import Client from './model/Client';
import Cover from './view/Cover.svelte';

export let client;
</script>

{#if $screen === 'cover'}
  <Cover {client}/>
{/if}
