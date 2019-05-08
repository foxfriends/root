<script>
import { prompts, acceptor } from '../store';
import Box from './component/Box.svelte';
import Text from './component/Text.svelte';
</script>

{#if $prompts && $acceptor}
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
  position: absolute;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
