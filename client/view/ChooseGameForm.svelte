<script>
import Box from './component/Box.svelte';
import CreateGameForm from './CreateGameForm.svelte';
import JoinGameForm from './JoinGameForm.svelte';
import { errorMessage } from '../store';

let state = null;

export let client;
</script>

<Box>
  <div class='flex'>
    {#if !state}
      <button
        class='button'
        on:click={() => state = 'create'}>
        Create New Game
      </button>
      <button
        class='button'
        on:click={() => state = 'join'}>
        Join Existing Game
      </button>
    {:else if state === 'create'}
      <CreateGameForm {client} on:back={() => state = null} />
    {:else if state === 'join'}
      <JoinGameForm {client} on:back={() => state = null} />
    {/if}
  </div>
</Box>
{#if $errorMessage}
  <Box small>
    { $errorMessage }
  </Box>
{/if}

<style>
.flex {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.button {
  align-self: flex-end;
  cursor: pointer;
  box-sizing: border-box;
  padding: 8px;
  width: 100%;
  height: 100px;
  border: none;
  font-family: var(--font-family--display);
  font-size: 20px;
  color: var(--color--accent);
  background-color: transparent;
}

.button:hover {
  color: var(--color--accent__hover);
}
</style>
