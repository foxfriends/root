<script>
  import loc from '../../util/localization';

  export let text;
  export let params = {};

  $: translation = loc(text, params);
</script>

{#await translation then translated}
  {translated}
{/await}
