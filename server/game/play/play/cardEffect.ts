import Clearing from '../../../model/board/Clearing';
import Faction from '../../../model/Faction';
import Client from '../../../model/Client';
import Suit from '../../../model/Suit';
import Leader from '../../../model/Leader';
import Rejection from '../../../model/Rejection';
import { Item } from '../../../model/Item';
import { Card } from '../../../model/Card';
import returnPiece from './returnPiece';

class NotEnoughItems extends Rejection {
  constructor(threadId: string, item: string) {
    super(threadId, {
      key: 'rejection-not-enough-items',
      params: {
        item: `item-${item}`,
      },
    });
  }
}

class DuplicatePermanentEffect extends Rejection {
  constructor(threadId: string, item: string) {
    super(threadId, {
      key: 'rejection-duplicate-permanent-effect',
      params: {
        card: `card-${item}`,
      },
    });
  }
}

async function * craftItem (this: Client, card: Card, faction: Faction, itemName: string, points: number, threadId: string): AsyncIterableIterator<void> {
  if (faction === Faction.marquise_bot) { throw new Error('unreachable'); }

  const itemIndex = this.game.items.findIndex(item => item.name === itemName);
  if (itemIndex === -1) {
    throw new NotEnoughItems(threadId, Item.bag);
  }
  if (faction === Faction.eyrie && this.game.factionData.eyrie!.leader !== Leader.builder) {
    ++this.game.factionData[faction]!.victoryPoints;
  } else {
    this.game.factionData[faction]!.victoryPoints += points;
  }
  const [bag] = this.game.items.splice(itemIndex, 1);
  this.game.factionData[faction]!.addItem(bag);
  this.game.discard(card);
}

async function * favor (this: Client, faction: Faction, suit: Suit): AsyncIterableIterator<void> {
  for (const clearing of this.game.board.clearings.filter(clearing => clearing.suit === suit)) {
    for (let i = clearing.pieces.length; i >= 0; --i) {
      if (clearing.pieces[i].faction && clearing.pieces[i].faction !== faction) {
        const piece = clearing.removePiece(i);
        returnPiece.call(this, piece, clearing, faction);
      }
    }
  }
}

// TODO: where does this get used?
async function * royalClaim (this: Client, faction: Faction): AsyncIterableIterator<void> {
  const count = this.game.board.clearings
    .map(clearing => Clearing.ruler(this.game, faction, clearing))
    .filter(ruler => ruler === faction)
    .length;
  this.game.factionData[faction]!.victoryPoints += count;
}

export default async function * cardEffect (this: Client, card: Card, faction: Faction, threadId: string): AsyncIterableIterator<void> {
    if (faction === Faction.marquise_bot) { throw new Error('unreachable'); }

    switch (card.name) {
    case Card.birdy_bindle:
    case Card.gently_used_knapsack:
    case Card.smugglers_trail:
    case Card.mouse_in_a_sack:
      yield * craftItem.call(this, card, faction, Item.bag, 1, threadId);
      break;
    case Card.woodland_runners:
    case Card.travel_gear:
    case Card.a_visit_to_friends:
      yield * craftItem.call(this, card, faction, Item.boot, 1, threadId);
      break;
    case Card.arms_trader:
    case Card.foxfolk_steel:
    case Card.sword:
      yield * craftItem.call(this, card, faction, Item.sword, 2, threadId);
      break;
    case Card.crossbow:
      yield * craftItem.call(this, card, faction, Item.crossbow, 1, threadId);
      break;
    case Card.root_tea:
      yield * craftItem.call(this, card, faction, Item.tea, 2, threadId);
      break;
    case Card.protection_racket:
    case Card.bake_sale:
    case Card.investments:
      yield * craftItem.call(this, card, faction, Item.coin, 3, threadId);
      break;
    case Card.anvil:
      yield * craftItem.call(this, card, faction, Item.hammer, 2, threadId);
      break;
    case Card.armorers:
    case Card.sappers:
    case Card.brutal_tactics:
    case Card.stand_and_deliver:
    case Card.tax_collector:
    case Card.command_warren:
    case Card.better_burrow_bank:
    case Card.cobbler:
    case Card.scouting_party:
    case Card.codebreakers:
    case Card.royal_claim:
      if (this.game.factionData[faction]!.craftedEffects.some(c => c.name === card.name)) {
        throw new DuplicatePermanentEffect(threadId, card.name);
      }
      this.game.factionData[faction]!.craftedEffects.push(card);
      this.game.notify();
      break;
    case Card.favor_of_the_foxes:
      yield * favor.call(this, faction, Suit.fox);
      break;
    case Card.favor_of_the_rabbits:
      yield * favor.call(this, faction, Suit.fox);
      break;
    case Card.favor_of_the_mice:
      yield * favor.call(this, faction, Suit.fox);
      break;
    default:
      throw new Error('unimplemented');
    }
  }
