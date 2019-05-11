<script>
import { game, username, prompts, acceptor } from '../store';
import Message from '../model/Message';
import ClearingPrompt from './ClearingPrompt.svelte';

export let client;

function notifyClearing(clearing) {
  client.notify(Message.direct('Prompts:clearing', { clearing }));
}

function notifyForest(forest) {
  client.notify(Message.direct('Prompts:forest', { forest }));
}
</script>

{#if $prompts && $acceptor}
  {#if $prompts.clearings}
    {#each $prompts.clearings as clearing}
      <ClearingPrompt
        {...clearing}
        on:click={() => notifyClearing(clearing)} />
    {/each}
  {/if}
  {#if $prompts.forests}
    {#each $prompts.forests as forest}
      <ClearingPrompt
        {...forest}
        on:click={() => notifyForest(forest)} />
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
