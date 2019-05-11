import { accept } from '../../../model/Acceptor';
import shuffle from '../../../util/shuffle';
import Client from '../../../model/Client';
import Faction from '../../../model/Faction';
import Characters from '../../../model/Character';
import Piece from '../../../model/Piece';

export default async function * setupVagabond(this: Client, faction: Faction.vagabond | Faction.vagabond2) {
  yield * accept.call(this,
    { type: 'chooseCharacter', async * handler (this: Client, { character }: { character: keyof typeof Characters }, threadId: string): AsyncIterableIterator<void> {
      if (!Characters[character]) {
        throw new Error(`There is no character called ${character}`);
      }
      this.game.factionData[faction]!.setCharacter(this.game, Characters[character], threadId);
      this.respond(threadId, 'update', this.game);
    } },
  );
  yield * accept.call(this,
    { type: 'chooseForest', async * handler (this: Client, { forest }: { forest: number }, threadId: string): AsyncIterableIterator<void> {
      this.game.board.forests[forest].addPiece(this.game, Piece[faction].warrior);
      this.respond(threadId, 'update', this.game);
    } },
  );
  const ruinItems = shuffle(this.game.factionData[faction]!.ruinItems);
  this.game.factionData[faction]!.ruinItems = [];
  for (const clearing of this.game.board.clearings) {
    if (clearing.hasRuins) {
      clearing.addRuinItem(ruinItems.shift()!);
    }
  }
}
