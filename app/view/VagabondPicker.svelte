<script>
  import context from '../context';
  import Action from './component/Action.svelte';
  import Dialog from './component/Dialog.svelte';
  import Button from './component/Button.svelte';
  import Box from './component/Box.svelte';
  import { getVagabondCharacterPath } from '../util/image';

  const { state } = context();
</script>

<Dialog backed>
  <Box>
    <div class='content'>
      <Action action='vagabond_choose_character(C)' let:binding let:perform>
        <div class='character'>
          <img class='image' src={getVagabondCharacterPath(binding.C)} />
          <div class='select-button' on:click={perform} />
        </div>
      </Action>
    </div>
  </Box>
</Dialog>

<style>
.content {
  display: flex;
  flex-wrap: wrap;
  align-items: space-around;
  width: 80vw;
  height: 80vh;
}

.character {
  position: relative;
  flex-basis: 15%;
  flex-grow: 0;
  flex-shrink: 0;
  border-radius: 8px;
  margin: 40px;
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
