<script>
import loc from '../../localization';

export let text;

$: translation = loc(text);
</script>

{#await translation then translated}
  { translated }
{/await}
