<script>
import { cond, equals, identity } from 'ramda';
import { first } from 'rxjs/operators';
import context from '../context';
import Dialog from './component/Dialog.svelte';
import IdentificationForm from './IdentificationForm.svelte';
import ChooseGameForm from './ChooseGameForm.svelte';
import CreateGameForm from './CreateGameForm.svelte';
import JoinGameForm from './JoinGameForm.svelte';
import Lobby from './Lobby.svelte';
import Flow, { Abort } from './component/Flow.svelte';
import { toast } from './component/Toast.svelte';
import value from '../util/event';
import logger from '../util/logger';

const { state, socket } = context();

async function * cover() {
  const username = value(yield 'identification');
  await socket.setName(username);
  yield* chooseGame();
}

async function * chooseGame() {
  try {
    const next = value(yield 'choose-game');
    yield * cond([
      [equals('create'), createGame],
      [equals('join'), joinGame],
    ])(next);
  } catch (error) {
    if (error instanceof Abort) {
      yield * cover();
    } else {
      logger.error(error);
    }
  }
}

async function * createGame() {
  try {
    for (;;) {
      const { name, settings } = value(yield 'create-game');
      try {
        await socket.createGame({ name, ...settings });
        break;
      } catch (error) {
        toast(error.message);
      }
    }
    yield * gameLobby();
  } catch (error) {
    if (error instanceof Abort) {
      yield * chooseGame();
    } else {
      logger.error(error);
    }
  }
}

async function * joinGame() {
  try {
    for (;;) {
      const name = value(yield 'join-game');
      try {
        await socket.joinGame(name);
        break;
      } catch (error) {
        toast(error.message);
      }
    }
    yield * gameLobby();
  } catch (error) {
    if (error instanceof Abort) {
      yield * chooseGame();
    } else {
      logger.error(error);
    }
  }
}

async function * gameLobby() {
  try {
    await state.pipe(first(identity)).toPromise();
    yield 'lobby';
  } catch (error) {
    if (error instanceof Abort) {
      socket.leaveGame();
      $state = null;
      yield * chooseGame();
    } else {
      logger.error(error);
    }
  }
}
</script>

<div class='cover' />

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
