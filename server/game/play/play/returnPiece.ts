import Clearing from '../../../model/board/Clearing';
import Faction from '../../../model/Faction';
import Client from '../../../model/Client';
import Suit from '../../../model/Suit';
import Pieces, { Piece } from '../../../model/Piece';

export default async function * returnPiece (this: Client, piece: Piece, clearing: Clearing, remover: Faction): AsyncIterableIterator<void> {
  if (piece.faction) {
    if (Piece.equals(piece, Pieces.riverfolk.trade_post_fox)
     || Piece.equals(piece, Pieces.riverfolk.trade_post_rabbit)
     || Piece.equals(piece, Pieces.riverfolk.trade_post_mouse)
     || Piece.equals(piece, Pieces.marquise.keep)
    ) {
      // these ones get discarded
      return;
    }
    if (piece.shape === 'round' || piece.shape === 'square') {
      // 1 point for destroying buildings and tokens
      ++this.game.factionData[remover]!.victoryPoints;
    }
    // field hospitals
    if (Piece.equals(piece, Pieces.marquise.warrior)) {
      if (this.game.factionData.marquise!.hand.some(card => card.suit === clearing.suit || card.suit === Suit.bird)) {
        const keepClearing = this.game.board.locate(Pieces.marquise.keep);
        if (keepClearing) {
          const marquisePlayer = Object.values(this.game.players).find(player => player.faction === Faction.marquise)!;
          // @ts-ignore
          const { card: index } = await clients
            .get(this.game._clients[marquisePlayer.username])!
            .send('fieldHospital', { suit: clearing.suit });
          const card = this.game.factionData.marquise!.hand[index];
          if (card && (card.suit === clearing.suit || card.suit === Suit.bird)) {
            keepClearing.addPiece(Pieces.marquise.warrior);
            return;
          }
        }
      }
    }
    // TODO: some special things for certain buildings
    // some sketchy casting, but it was designed to work this way
    ++(<number> (<any> this.game.factionData[piece.faction]!)[piece.name]);
  }
}
