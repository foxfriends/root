export class Item {
  static get tea() { return 'tea'; }
  static get bag() { return 'bag'; }
  static get coin() { return 'coin'; }
  static get sword() { return 'sword'; }
  static get crossbow() { return 'crossbow'; }
  static get torch() { return 'torch'; }
  static get boot() { return 'boot'; }
  static get hammer() { return 'hammer'; }

  constructor(name, ruin = false, starting = false) {
    this.name = name;
    this.ruin = ruin;
    this.starting = starting;
  }
}

const Items = [
  new Item(Item.tea),
  new Item(Item.tea),
  new Item(Item.bag),
  new Item(Item.bag),
  new Item(Item.coin),
  new Item(Item.coin),
  new Item(Item.torch),
  new Item(Item.torch),
  new Item(Item.knife),
  new Item(Item.knife),
  new Item(Item.boot),
  new Item(Item.boot),
  new Item(Item.hammer),
  new Item(Item.crossbow),
];

export default Items;
