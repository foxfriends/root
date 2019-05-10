import Suit from './Suit';
import { Item } from './Item';

export class Quest {
  constructor(
    public suit: Suit,
    public name: string,
    public requirements: string[],
  ) {}

  get key() {
    return `${this.suit}-${this.name}`;
  }
}

const Quests = [
  new Quest(Suit.fox, 'errand', [Item.tea, Item.boot]),
  new Quest(Suit.fox, 'fundraising', [Item.tea, Item.coin]),
  new Quest(Suit.fox, 'give_a_speech', [Item.torch, Item.tea]),
  new Quest(Suit.fox, 'logistics_help', [Item.boot, Item.bag]),
  new Quest(Suit.fox, 'repair_a_shed', [Item.torch, Item.hammer]),
  new Quest(Suit.mouse, 'escort', [Item.boot, Item.boot]),
  new Quest(Suit.mouse, 'expel_bandits', [Item.sword, Item.sword]),
  new Quest(Suit.mouse, 'fend_off_a_bear', [Item.torch, Item.crossbow]),
  new Quest(Suit.mouse, 'guard_duty', [Item.torch, Item.sword]),
  new Quest(Suit.mouse, 'logistics_help', [Item.boot, Item.bag]),
  new Quest(Suit.rabbit, 'errand', [Item.tea, Item.boot]),
  new Quest(Suit.rabbit, 'expel_bandits', [Item.sword, Item.sword]),
  new Quest(Suit.rabbit, 'fend_off_a_bear', [Item.torch, Item.crossbow]),
  new Quest(Suit.rabbit, 'give_a_speech', [Item.torch, Item.tea]),
  new Quest(Suit.rabbit, 'guard_duty', [Item.torch, Item.sword]),
];

export default Quests;
