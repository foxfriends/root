import { always, cond, whereEq } from 'ramda';
import Items from '../../types/Item';

import BAG from './token.item-bag.png';
import BOOT from './token.item-boot.png';
import COIN from './token.item-coin.png';
import CROSSBOW from './token.item-crossbow.png';
import DAGGER from './token.item-sword.png';
import HAMMER from './token.item-hammer.png';
import TEA from './token.item-tea.png';
import TORCH from './token.item-torch.png';
import RUIN_BAG from './token.item-ruin_bag.png';
import RUIN_BOOT from './token.item-ruin_boot.png';
import RUIN_HAMMER from './token.item-ruin_hammer.png';
import RUIN_DAGGER from './token.item-ruin_sword.png';

export { BAG, BOOT, COIN, CROSSBOW, DAGGER, HAMMER, TEA, TORCH, RUIN_BAG, RUIN_BOOT, RUIN_HAMMER, RUIN_DAGGER };

export default cond([
  [whereEq({ item: Items.BAG }), always(BAG)],
  [whereEq({ item: Items.BOOT }), always(BOOT)],
  [whereEq({ item: Items.COIN }), always(COIN)],
  [whereEq({ item: Items.CROSSBOW }), always(CROSSBOW)],
  [whereEq({ item: Items.DAGGER }), always(DAGGER)],
  [whereEq({ item: Items.HAMMER }), always(HAMMER)],
  [whereEq({ item: Items.TEA }), always(TEA)],
  [whereEq({ item: Items.TORCH }), always(TORCH)],
]);

export const ruin = cond([
  [whereEq({ item: Items.BAG }), always(RUIN_BAG)],
  [whereEq({ item: Items.BOOT }), always(RUIN_BOOT)],
  [whereEq({ item: Items.DAGGER }), always(RUIN_DAGGER)],
  [whereEq({ item: Items.HAMMER }), always(RUIN_HAMMER)],
]);
