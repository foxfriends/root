<script>
import { game, username, prompts } from '../store';
import Message from '../model/Message';
import ClearingPrompt from './ClearingPrompt.svelte';

export let client;

function notify(clearing) {
  client.notify(Message.direct('Prompts:clearing', { clearing }));
}
</script>

{#if $prompts}
  {#if $prompts.clearings}
    {#each $prompts.clearings as prompted}
      <ClearingPrompt
        {...$game.board.clearings[prompted]}
        on:click={() => notify(prompted)} />
    {/each}
  {/if}
{/if}
