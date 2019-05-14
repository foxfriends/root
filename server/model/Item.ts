export class Item {
  static get tea() { return 'tea'; }
  static get bag() { return 'bag'; }
  static get coin() { return 'coin'; }
  static get sword() { return 'sword'; }
  static get crossbow() { return 'crossbow'; }
  static get torch() { return 'torch'; }
  static get boot() { return 'boot'; }
  static get hammer() { return 'hammer'; }

  static equals(item: Item, other: Item) {
    return item.key === other.key;
  }

  constructor(
    public name: string,
    public isRuin = false,
    public isStarting = false,
  ) {}

  get key() {
    if (this.isRuin) {
      return `item-ruin_${this.name}`;
    }
    // TODO: starting items do not have the separate image marked with S?
    return `item-${this.name}`;
  }

  toJSON() {
    return { ...this, key: this.key };
  }
}

const Items = [
  new Item(Item.tea),
  new Item(Item.tea),
  new Item(Item.bag),
  new Item(Item.bag),
  new Item(Item.coin),
  new Item(Item.coin),
  new Item(Item.sword),
  new Item(Item.sword),
  new Item(Item.boot),
  new Item(Item.boot),
  new Item(Item.hammer),
  new Item(Item.crossbow),
];

export default Items;
