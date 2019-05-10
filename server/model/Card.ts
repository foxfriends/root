import Suit from './Suit';

export class Card {
  constructor(
    public suit: string,
    public cost: string[] | null,
    public name: string,
    public isDominance = false,
    public isSpy = false,
  ) {}

  get key() {
    return `${this.suit}-${this.name}`;
  }

  toJSON() {
    return { ...this, key: this.key };
  }
}

const Cards = [
  new Card(Suit.bird, null, 'ambush'),
  new Card(Suit.bird, null, 'ambush'),
  new Card(Suit.bird, [Suit.mouse], 'birdy_bindle'),
  new Card(Suit.bird, [Suit.fox], 'armorers'),
  new Card(Suit.bird, [Suit.fox], 'armorers'),
  new Card(Suit.bird, [Suit.rabbit], 'woodland_runners'),
  new Card(Suit.bird, [Suit.fox, Suit.fox], 'arms_trader'),
  new Card(Suit.bird, [Suit.fox], 'crossbow'),
  new Card(Suit.bird, [Suit.mouse], 'sappers'),
  new Card(Suit.bird, [Suit.mouse], 'sappers'),
  new Card(Suit.bird, [Suit.fox, Suit.fox], 'brutal_tactics'),
  new Card(Suit.bird, [Suit.bird, Suit.bird, Suit.bird, Suit.bird], 'royal_claim'),

  new Card(Suit.fox, null, 'ambush'),
  new Card(Suit.fox, [Suit.mouse], 'gently_used_knapsack'),
  new Card(Suit.fox, [Suit.mouse], 'root_tea'),
  new Card(Suit.fox, [Suit.rabbit], 'travel_gear'),
  new Card(Suit.fox, [Suit.rabbit, Suit.rabbit], 'protection_racket'),
  new Card(Suit.fox, [Suit.fox, Suit.fox], 'foxfolk_steel'),
  new Card(Suit.fox, [Suit.fox], 'anvil'),
  new Card(Suit.fox, [Suit.mouse, Suit.mouse, Suit.mouse], 'stand_and_deliver'),
  new Card(Suit.fox, [Suit.mouse, Suit.mouse, Suit.mouse], 'stand_and_deliver'),
  new Card(Suit.fox, [Suit.fox, Suit.rabbit, Suit.mouse], 'tax_collector'),
  new Card(Suit.fox, [Suit.fox, Suit.rabbit, Suit.mouse], 'tax_collector'),
  new Card(Suit.fox, [Suit.fox, Suit.rabbit, Suit.mouse], 'tax_collector'),
  new Card(Suit.fox, [Suit.fox, Suit.fox, Suit.fox], 'favor_of_the_foxes'),

  new Card(Suit.rabbit, null, 'ambush'),
  new Card(Suit.rabbit, [Suit.mouse], 'smugglers_trail'),
  new Card(Suit.rabbit, [Suit.mouse], 'root_tea'),
  new Card(Suit.rabbit, [Suit.rabbit], 'a_visit_to_friends'),
  new Card(Suit.rabbit, [Suit.rabbit, Suit.rabbit], 'bake_sale'),
  new Card(Suit.rabbit, [Suit.rabbit, Suit.rabbit], 'command_warren'),
  new Card(Suit.rabbit, [Suit.rabbit, Suit.rabbit], 'command_warren'),
  new Card(Suit.rabbit, [Suit.rabbit, Suit.rabbit], 'better_burrow_bank'),
  new Card(Suit.rabbit, [Suit.rabbit, Suit.rabbit], 'better_burrow_bank'),
  new Card(Suit.rabbit, [Suit.rabbit, Suit.rabbit], 'cobbler'),
  new Card(Suit.rabbit, [Suit.rabbit, Suit.rabbit], 'cobbler'),
  new Card(Suit.rabbit, [Suit.rabbit, Suit.rabbit, Suit.rabbit], 'favor_of_the_rabbits'),

  new Card(Suit.mouse, null, 'ambush'),
  new Card(Suit.mouse, [Suit.mouse], 'mouse_in_a_sack'),
  new Card(Suit.mouse, [Suit.mouse], 'root_tea'),
  new Card(Suit.mouse, [Suit.rabbit], 'travel_gear'),
  new Card(Suit.mouse, [Suit.rabbit, Suit.rabbit], 'investments'),
  new Card(Suit.mouse, [Suit.fox, Suit.fox], 'sword'),
  new Card(Suit.mouse, [Suit.fox], 'crossbow'),
  new Card(Suit.mouse, [Suit.mouse, Suit.mouse], 'scouting_party'),
  new Card(Suit.mouse, [Suit.mouse, Suit.mouse], 'scouting_party'),
  new Card(Suit.mouse, [Suit.mouse], 'codebreakers'),
  new Card(Suit.mouse, [Suit.mouse], 'codebreakers'),
  new Card(Suit.mouse, [Suit.mouse, Suit.mouse, Suit.mouse], 'favor_of_the_mice'),

  new Card(Suit.fox, null, 'dominance', true),
  new Card(Suit.rabbit, null, 'dominance', true),
  new Card(Suit.mouse, null, 'dominance', true),
  new Card(Suit.bird, null, 'dominance', true),
  new Card(Suit.fox, null, 'spy', false, true),
  new Card(Suit.rabbit, null, 'spy', false, true),
  new Card(Suit.mouse, null, 'spy', false, true),
  new Card(Suit.bird, null, 'spy', false, true),
];

export default Cards;
