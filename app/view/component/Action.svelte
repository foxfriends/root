<script>
  import { thunkify } from 'ramda';
  import context from '../../context';
  import { match } from '../../util/lumber';

  const { socket, actions } = context();

  export let action;

  const perform = thunkify(::socket.perform);
</script>

{#each $actions.map(match(action)) as binding}
  {#if binding}
    <slot perform={perform(binding.toString())} source={binding.toString()} {binding} />
  {/if}
{/each}
