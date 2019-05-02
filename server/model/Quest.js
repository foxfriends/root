import Suit from './Suit.js';

class Quest {
  constructor(suit, name) {
    this.suit = suit;
    this.name = name;
  }

  get key() {
    return `${this.suit}-${this.name}`;
  }
}

const Quests = [
  new Quest(Suit.fox, 'errand'),
  new Quest(Suit.fox, 'fundraising'),
  new Quest(Suit.fox, 'give_a_speech'),
  new Quest(Suit.fox, 'logistics_help'),
  new Quest(Suit.fox, 'repair_a_shed'),
  new Quest(Suit.mouse, 'escort'),
  new Quest(Suit.mouse, 'expel_bandits'),
  new Quest(Suit.mouse, 'fend_off_a_bear'),
  new Quest(Suit.mouse, 'guard_duty'),
  new Quest(Suit.mouse, 'logistics_help'),
  new Quest(Suit.rabbit, 'errand'),
  new Quest(Suit.rabbit, 'expel_bandits'),
  new Quest(Suit.rabbit, 'fend_off_a_bear'),
  new Quest(Suit.rabbit, 'give_a_speech'),
  new Quest(Suit.rabbit, 'guard_duty'),
];

export default Quests;
