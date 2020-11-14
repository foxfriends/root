<script>
  import { thunkify } from 'ramda';
  import { createEventDispatcher } from 'svelte';
  import Box from './component/Box.svelte';
  import Button from './component/Button.svelte';
  import Text from './component/Text.svelte';

  const dispatch = thunkify(createEventDispatcher());
</script>

<Box flex>
  <Button on:click={dispatch('back', undefined)}>
    <Text text='back' />
  </Button>
  <div class='button'>
    <Button on:click={dispatch('next', 'create')}>
      <Text text='create-new-game' />
    </Button>
  </div>
  <div class='button'>
    <Button on:click={dispatch('next', 'join')}>
      <Text text='join-existing-game' />
    </Button>
  </div>
</Box>

<style>
  .button {
    --Button--font-size: 20px;

    margin: 20px;
  }
</style>
