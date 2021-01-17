import { always, cond, whereEq } from 'ramda';
import Tokens from '../../types/Token';
import Suits from '../../types/Suit';

import SYMPATHY from './token.alliance-sympathy.png';
import WOOD from './token.marquise-wood.png';
import KEEP from './token.marquise-keep.png';
import TRADE_POST_FOX from './token.riverfolk-trade_post_fox.png';
import TRADE_POST_MOUSE from './token.riverfolk-trade_post_mouse.png';
import TRADE_POST_RABBIT from './token.riverfolk-trade_post_rabbit.png';
// TODO
import BOMB from './token.marquise-wood.png';
import SNARE from './token.marquise-wood.png';
import EXTORTION from './token.marquise-wood.png';
import RAID from './token.marquise-wood.png';
import TUNNEL from './token.marquise-wood.png';

export { SYMPATHY, WOOD, KEEP, TRADE_POST_FOX, TRADE_POST_MOUSE, TRADE_POST_RABBIT, BOMB, SNARE, EXTORTION, RAID, TUNNEL };

export default cond([
  [whereEq({ token: Tokens.SYMPATHY }), always(SYMPATHY)],
  [whereEq({ token: Tokens.WOOD }), always(WOOD)],
  [whereEq({ token: Tokens.KEEP }), always(KEEP)],
  [whereEq({ token: Tokens.TRADE_POST, suit: Suits.FOX }), always(TRADE_POST_FOX)],
  [whereEq({ token: Tokens.TRADE_POST, suit: Suits.MOUSE }), always(TRADE_POST_MOUSE)],
  [whereEq({ token: Tokens.TRADE_POST, suit: Suits.RABBIT }), always(TRADE_POST_RABBIT)],
  [whereEq({ token: Tokens.BOMB }), always(BOMB)],
  [whereEq({ token: Tokens.SNARE }), always(SNARE)],
  [whereEq({ token: Tokens.EXTORTION }), always(EXTORTION)],
  [whereEq({ token: Tokens.RAID }), always(RAID)],
  [whereEq({ token: Tokens.TUNNEL }), always(TUNNEL)],
]);
