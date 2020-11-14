<script>
  import { fly } from 'svelte/transition';
  import { flip, cond, equals } from 'ramda';
  import context from '../context';
  import logo from 'url:../image/logo.png';
  import Dialog from './component/Dialog.svelte';
  import IdentificationForm from './IdentificationForm.svelte';
  import ChooseGameForm from './ChooseGameForm.svelte';
  import CreateGameForm from './CreateGameForm.svelte';
  import JoinGameForm from './JoinGameForm.svelte';
  import Lobby from './Lobby.svelte';
  import Flow from './component/Flow.svelte';
  import { toast } from './component/Toast.svelte';
  import _ from '../util/lens';
  import value from '../util/event';

  const { state, socket } = context();
  const username = _.user.name(state);
  const lobby = _.lobby(state);

  async function * cover() {
    $username = value(yield 'identification');
    await socket.setName($username);
    yield* chooseGame();
  }

  async function * chooseGame() {
    try {
      const next = value(yield 'choose-game');
      yield * cond([
        [equals('create'), createGame],
        [equals('join'), joinGame],
      ])(next);
    } catch {
      yield * cover();
    }
  }

  async function * createGame() {
    try {
      const { name, settings } = value(yield 'create-game');
      await socket.createGame({ name, ...settings });
      yield * gameLobby(name, settings);
    } catch {
      yield * chooseGame();
    }
  }

  async function * joinGame() {
    try {
      let game;
      while (!game) {
        const name = value(yield 'join-game');
        try {
          game =await socket.joinGame(name);
        } catch (error) {
          toast(error.message);
        }
      }
      yield * gameLobby(game);
    } catch {
      yield * chooseGame();
    }
  }

  async function * gameLobby(name, settings) {
    if (settings) {
      $lobby = {
        name,
        ...settings,
        players: [{ ...$state.user }],
      };
      // TODO: Create game
    } else {
      $lobby = { name };
      // TODO: Join game
    }
    try {
      yield 'lobby';
    } catch {
      yield * chooseGame();
    }
  }
</script>

<div class='cover'>
  <img src={logo} />
</div>

<Flow flow={cover} let:state let:next let:abort>
  {#if state === 'identification'}
    <Dialog>
      <IdentificationForm on:next={next} />
    </Dialog>
  {:else if state === 'choose-game'}
    <Dialog>
      <ChooseGameForm on:next={next} on:back={abort} />
    </Dialog>
  {:else if state === 'create-game'}
    <Dialog>
      <CreateGameForm on:next={next} on:back={abort} />
    </Dialog>
  {:else if state === 'join-game'}
    <Dialog>
      <JoinGameForm on:next={next} on:back={abort} />
    </Dialog>
  {:else if state === 'lobby'}
    <Dialog>
      <Lobby on:next={next} on:back={abort} />
    </Dialog>
  {/if}
</Flow>

<style>
  .cover {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-image: url('../image/cover.jpg');
    background-size: cover;
    background-position: center;
    font-family: var(--font-family--body);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
</style>
