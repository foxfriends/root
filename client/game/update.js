import { game as gameStore } from '../store';

export default async function * update (game) {
  gameStore.set(game);
}
