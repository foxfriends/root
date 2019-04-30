<script>
import { createEventDispatcher } from 'svelte';
import Message from '../model/Message';
import Faction from '../model/Faction';

const dispatch = createEventDispatcher();

let name = '';
let factions = [Faction.Marquise, Faction.Eyrie, Faction.Alliance, Faction.Vagabond];
let assignment = 'auto';
$: settings = { factions, assignment };

export let client;

function create() {
  client.notify(Message.direct('CreateGameForm:create', { name, settings }))
}
</script>

<button
  class='button back'
  on:click={() => dispatch('back')}>
  Back
</button>
<h1 class='heading'>Game name</h1>
<input
  class='input'
  placeholder='Name'
  autofocus
  bind:value={name} />
<h1 class='heading'>Options</h1>
<div class='options'>
  <fieldset>
    <legend>Available factions</legend>
    {#each Object.values(Faction) as faction}
      <label>
        <input
          type='checkbox'
          bind:group={factions}
          value={faction} />
        { faction }
      </label>
    {/each}
  </fieldset>
  <fieldset>
    <legend>Faction assignment</legend>
    <label><input type='radio' bind:group={assignment} value='auto' /> Random</label>
    <label><input type='radio' bind:group={assignment} value='choose' /> Choose</label>
  </fieldset>
</div>
<button
  class='button'
  on:click={create}>
  Create
</button>

<style>
.heading {
  font-family: var(--font-family--display);
  font-size: 20px;
  font-weight: 400;
}

.input, .button {
  box-sizing: border-box;
  padding: 8px;
  border: none;
  background-color: transparent;
}

.button {
  align-self: flex-end;
  cursor: pointer;
  font-family: var(--font-family--display);
  color: var(--color--accent);
  font-size: 16px;
}

.button:hover {
  color: var(--color--accent__hover);
}

.button.main {
  font-size: 20px;
  width: 100%;
  height: 100px;
}

.button.back {
  align-self: flex-start;
}

.input {
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
