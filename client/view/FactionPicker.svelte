<script>
import { game, username, errorMessage } from '../store';
import Box from './component/Box.svelte';
import Text from './component/Text.svelte';
import Picker from './component/Picker.svelte';
import images from '../image/card-*-{front,back}.jpg';
import Message from '../model/Message';

let flips = $game.factions.map(() => false);
$: factions = $game.factions.map((name, i) => ({
  flip: flips[i],
  name,
  player: Object.values($game.players).find(player => player.faction === name),
}));

export let client;

function selection({ detail: { selection } }) {
  client.notify(Message.direct('FactionPicker:chooseFaction', { faction: $game.factions[selection] }));
}
</script>

<div class='overlay'>
  <Box grow>
    <Picker let:current options={factions.length} on:select={selection}>
      {#each factions as faction, i}
        <div class='faction' class:taken={!!faction.player} class:current={current === i}>
          <div
            class='card'
            class:show-front={!faction.flip}
            class:show-back={faction.flip}
            on:click={() => {
              flips[i] = !flips[i];
              flips = [...flips];
            }} >
            <div class='front' style='background-image: url({images[faction.name].front})' />
            <div class='back' style='background-image: url({images[faction.name].back})' />
          </div>
        </div>
      {/each}
    </Picker>
  </Box>
  {#if $errorMessage}
    <div class='error'>
      <Box small>
        { $errorMessage }
      </Box>
    </div>
  {/if}
</div>

<style>
.overlay {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 64px 128px;
  width: 100%;
  height: 100%;
}

.error {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  bottom: 0;
  right: 0;
  height: 128px;
}

.faction {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  perspective: 2000px;
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
  background-color: rgba(255, 255, 255, 0.3);
  color: var(--color--text);
  font-family: var(--font-family--display);
  font-size: 20px;
}

.faction:not(.current) {
  opacity: 0;
  pointer-events: none;
}

.heading {
  text-align: center;
  font-family: var(--font-family--display);
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

.back, .front {
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

.show-back, .back { transform: rotateY(180deg); }
</style>
