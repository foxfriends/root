import { get } from 'svelte/store';
import { game, prompts } from '../../store';
import { accept } from '../../model/Acceptor';
import locate from '../../util/locate';
import Leader from '../../model/Leader';
import Piece from '../../model/Piece';
import Leaders from '../../model/Leader';
import Client from '../../model/Client';
import Clearing from '../../model/board/Clearing';
import leaderImages from '../../image/card/card-eyrie_leader-front.*.jpg';
import back from '../../image/card/card-eyrie_leader-back.jpg';

export default async function * setupMarquise(this: Client) {
  if (!this.game.factionData.eyrie!.leader) {
    const availableLeaders = get(game)!.factionData.eyrie!.leaders;
    prompts.set({
      text: 'prompt-choose-leader',
      cards: Object.values(Leaders)
        .map(leader => availableLeaders.includes(leader)
          ? { value: leader, image: leaderImages[leader] }
          : { available: false, image: back })
    });
    game.set(yield * accept.call(this,
      { type: 'Prompts:card', async * handler ({ value }: { value: Leader }) {
        return this.send('chooseLeader', { leader: value });
      }},
    ));
  }
  const keepClearing = locate.call(get(game)!.board, Piece.marquise.keep);
  if (!keepClearing) {
    prompts.set({
      text: 'prompt-choose-starting-clearing',
      clearings: get(game)!.board.clearings
        .filter(clearing => clearing.isCorner)
    });
    game.set(yield * accept.call(this,
      { type: 'Prompts:clearing', async * handler ({ clearing }: { clearing: Clearing }) {
        return this.send('eyrieClearing', { clearing: clearing.index });
      }},
    ));
  }
  prompts.set(null);
}
