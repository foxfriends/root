import { Item } from './Item';

export class Character {
  constructor(
    public name: string,
    public startingItems: Item[]
  ) {}
}

const Characters = {
  arbiter: new Character('arbiter', [
    new Item(Item.boot, false, true),
    new Item(Item.torch, false, true),
    new Item(Item.sword, false, true),
    new Item(Item.sword, false, true),
  ]),
  ranger: new Character('ranger', [
    new Item(Item.boot, false, true),
    new Item(Item.torch, false, true),
    new Item(Item.crossbow, false, true),
    new Item(Item.sword, false, true),
  ]),
  scoundrel: new Character('scoundrel', [
    new Item(Item.boot, false, true),
    new Item(Item.boot, false, true),
    new Item(Item.torch, false, true),
    new Item(Item.crossbow, false, true),
  ]),
  thief: new Character('thief', [
    new Item(Item.boot, false, true),
    new Item(Item.torch, false, true),
    new Item(Item.tea, false, true),
    new Item(Item.sword, false, true),
  ]),
  tinker: new Character('tinker', [
    new Item(Item.boot, false, true),
    new Item(Item.torch, false, true),
    new Item(Item.bag, false, true),
    new Item(Item.hammer, false, true),
  ]),
  vagrant: new Character('vagrant', [
    new Item(Item.coin, false, true),
    new Item(Item.torch, false, true),
    new Item(Item.boot, false, true),
  ]),
};

export default Characters;
