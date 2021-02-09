<script>
  import context from '../context';
  import Action from './component/Action.svelte';
  import Dialog from './component/Dialog.svelte';
  import Picker from './component/Picker.svelte';
  import Button from './component/Button.svelte';
  import Box from './component/Box.svelte';
  import Text from './component/Text.svelte';
  import { getFactionBoardPath } from '../util/image';

  const { state } = context();

let flipped = {};
</script>

<Dialog backed>
  <Box>
    <div class='content'>
      <Picker options={$state.factions}>
        <div slot='option' let:isCurrent let:option={faction} class='option'  class:current={isCurrent}>
          <div class='faction' class:taken={!!faction.player}>
            <div
              class='card'
              class:show-back={!!flipped[faction.faction]}
              on:click={() => { flipped[faction.faction] = !flipped[faction.faction]; }}>
              <div class='front' style={`background-image: url(${getFactionBoardPath(faction.faction)});`} />
              <div class='back' style={`background-image: url(${getFactionBoardPath(faction.faction, true)});`} />
            </div>
          </div>
        </div>
        <div slot='select' let:current>
          <Action action='choose_faction(choose({current.faction}))' let:perform>
            <Button on:click={perform}>
              <Text text='select' />
            </Button>
          </Action>
        </div>
      </Picker>
    </div>
  </Box>
</Dialog>

<style>
.content {
  width: 80vw;
  height: 80vh;
}

.option {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  perspective: 2000px;
}

.faction {
  width: 100%;
  height: 100%;
}

.faction.taken::after {
  content: 'Taken'; /* TODO [l10n]: this is not localized */
  pointer-events: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.6);
  color: var(--color--text);
  font-family: var(--font-family--display);
  font-size: 20px;
}

.option:not(.current) {
  display: none;
}

.card {
  cursor: pointer;
  position: relative;
  width: 100%;
  height: 100%;
  backface-visibility: visible;
  perspective-origin: center;
  transform-origin: center;
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.back,
.front {
  backface-visibility: hidden;
  transform-style: preserve-3d;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  pointer-events: none;
}

.show-back,
.back { transform: rotateY(180deg); }
</style>
