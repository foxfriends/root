<script>
  import context from '../context';
  import Action from './component/Action.svelte';
  import Dialog from './component/Dialog.svelte';
  import Button from './component/Button.svelte';
  import Box from './component/Box.svelte';
  import Text from './component/Text.svelte';
  import { getEyrieLeaderPath } from '../util/image';
  import { l } from '../util/localization';

  const { state } = context();
</script>

<Dialog backed>
  <Box>
    <div class='content'>
      {#each $state.eyrie_leaders as { leader, used } (leader)}
        <div class='leader' class:used>
          <img class='image' src={getEyrieLeaderPath(leader)} />
          <Action action='eyrie_choose_leader({leader})' let:perform>
            <div class='select-button' on:click={perform} />
          </Action>
        </div>
      {/each}
    </div>
  </Box>
</Dialog>

<style>
.content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 80vw;
  height: 80vh;
}

.leader {
  position: relative;
  flex-basis: 20%;
  flex-grow: 0;
  flex-shrink: 0;
  border-radius: 8px;
}

.leader.used {
  filter: grayscale(100%);
}

.image {
  width: 100%;
}

.select-button {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
