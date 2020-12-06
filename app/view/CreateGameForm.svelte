<script>
import { createEventDispatcher } from 'svelte';
import Box from './component/Box.svelte';
import Button from './component/Button.svelte';
import Text from './component/Text.svelte';
import Assignment from '../types/Assignment';
import Deck from '../types/Deck';
import Faction from '../types/Faction';
import GameMap from '../types/GameMap';

let name = '';
let factions = [Faction.MARQUISE, Faction.EYRIE, Faction.ALLIANCE, Faction.VAGABOND];
let assignment = Assignment.CHOOSE;
let map = GameMap.AUTUMN;
let deck = Deck.STANDARD;
$: valid = name && factions.length >= 2;
$: settings = { factions, assignment, map, deck };

const dispatch = createEventDispatcher();
const back = () => dispatch('back');
const next = () => name && dispatch('next', { name, settings });
</script>

<Box flex>
  <Button on:click={back}>
    <Text text='back' />
  </Button>
  <h1 class='heading'><Text text='game-name' /></h1>
  <!-- TODO [l10n]: the placeholder is not localized -->
  <label>
    <input
      class='input'
      placeholder='Name'
      bind:value={name} />
  </label>
  <h1 class='heading'><Text text='options' /></h1>
  <div class='options'>
    <fieldset>
      <legend><Text text='available-factions' /></legend>
      {#each Object.values(Faction) as faction}
        <label>
          <input
            type='checkbox'
            bind:group={factions}
            value={faction} />
          <Text text={faction} params={{ form: 'long' }}/>
        </label>
      {/each}
    </fieldset>
    <div class='flex'>
      <fieldset>
        <legend><Text text='faction-assignment' /></legend>
        <label>
          <input disabled type='radio' bind:group={assignment} value='random' />
          <Text text='random' />
        </label>
        <label>
          <input type='radio' bind:group={assignment} value='choose' />
          <Text text='choose' />
        </label>
      </fieldset>
      <fieldset>
        <legend><Text text='map' /></legend>
        {#each Object.values(GameMap) as gameMap}
          <label>
            <input disabled={gameMap !== GameMap.AUTUMN} type='radio' bind:group={map} value={gameMap} />
            <Text text={gameMap} />
          </label>
        {/each}
      </fieldset>
      <fieldset>
        <legend><Text text='deck' /></legend>
        {#each Object.values(Deck) as deckName}
          <label>
            <input disabled={deckName !== Deck.STANDARD} type='radio' bind:group={deck} value={deckName} />
            <Text text={deckName} />
          </label>
        {/each}
      </fieldset>
    </div>
  </div>
  <Button
    disabled={!valid}
    on:click={next}>
    <Text text='create' />
  </Button>
</Box>

<style>
.heading {
  font-family: var(--font-family--display);
  font-size: 20px;
  font-weight: 400;
}

.input {
  box-sizing: border-box;
  padding: 8px;
  border: none;
  background-color: transparent;
  width: 100%;
  border-bottom: 1px solid var(--color--accent);
  font-family: var(--font-family--body);
  font-size: 16px;
}

.options {
  display: flex;
  align-items: flex-start;
}

label {
  display: block;
}
</style>
