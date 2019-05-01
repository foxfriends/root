<script>
import { screen } from './store';
import Client from './model/Client';
import Cover from './view/Cover.svelte';
import Board from './view/Board.svelte';

export let client;
</script>

{#if $screen === 'cover'}
  <Cover {client}/>
{:else if $screen === 'board'}
  <Board {client}/>
{/if}
