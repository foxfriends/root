<script>
import { game, username, prompts, acceptor } from '../store';
import Message from '../model/Message';
import ClearingPrompt from './ClearingPrompt.svelte';

export let client;

function notify(clearing) {
  client.notify(Message.direct('Prompts:clearing', { clearing }));
}
</script>

{#if $prompts && $acceptor}
  {#if $prompts.clearings}
    {#each $prompts.clearings as clearing}
      <ClearingPrompt
        {...clearing}
        on:click={() => notify(clearing)} />
    {/each}
  {/if}
{/if}

<style>
.text {
  position: absolute;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
