<script>
import { prompts, acceptor } from '../store';
import Box from './component/Box.svelte';
import Text from './component/Text.svelte';
import CardPicker from './CardPicker.svelte';

export let client;
</script>

{#if $prompts && $acceptor}
  {#if $prompts.cards}
    <div class='overlay'>
      <Box grow>
        <CardPicker cards={$prompts.cards} {client} />
      </Box>
    </div>
  {/if}
  {#if $prompts.text}
    <div class='text'>
      <Box small>
        {#if typeof $prompts.text === 'string'}
          <Text text={$prompts.text} />
        {:else}
          <Text text={$prompts.text.key} params={$prompts.text.params} />
        {/if}
      </Box>
    </div>
  {/if}
{/if}

<style>
.text {
  pointer-events: none;
  position: absolute;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
}

.overlay {
  pointer-events: auto;
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 64px 128px;
}
</style>
