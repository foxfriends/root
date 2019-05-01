<script>
import { fade } from 'svelte/transition';
import Text from './Text.svelte';
export let text;
</script>

<div class='loading' transition:fade='{{ duration: 200 }}'>
  <Text {text} />
</div>

<style>
.loading {
  font-family: var(--font-family--display);
  color: white;
  font-size: 36px;
  position: absolute;
  right: 16px;
  bottom: 16px;
}
</style>
