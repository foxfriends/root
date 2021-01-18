import { always, cond, whereEq } from 'ramda';
import Buildings from '../../types/Building';
import Suits from '../../types/Suit';

import BASE_FOX from './token.alliance-base_fox.png';
import BASE_MOUSE from './token.alliance-base_mouse.png';
import BASE_RABBIT from './token.alliance-base_rabbit.png';
import ROOST from './token.eyrie-roost.png';
import SAWMILL from './token.marquise-sawmill.png';
import WORKSHOP from './token.marquise-workshop.png';
import RECRUITER from './token.marquise-recruiter.png';
import GARDEN_FOX from './token.cult-garden_fox.png';
import GARDEN_MOUSE from './token.cult-garden_mouse.png';
import GARDEN_RABBIT from './token.cult-garden_rabbit.png';
import CITADEL from './token.cult-garden_rabbit.png';
import MARKET from './token.cult-garden_rabbit.png';
import RUIN from './token.ruin.png';

export { BASE_FOX, BASE_MOUSE, BASE_RABBIT, ROOST, SAWMILL, WORKSHOP, RECRUITER, GARDEN_FOX, GARDEN_MOUSE, GARDEN_RABBIT, CITADEL, MARKET };

export default cond([
  [whereEq({ building: Buildings.BASE, suit: Suits.FOX }), always(BASE_FOX)],
  [whereEq({ building: Buildings.BASE, suit: Suits.MOUSE }), always(BASE_MOUSE)],
  [whereEq({ building: Buildings.BASE, suit: Suits.RABBIT }), always(BASE_RABBIT)],
  [whereEq({ building: Buildings.ROOST }), always(ROOST)],
  [whereEq({ building: Buildings.SAWMILL }), always(SAWMILL)],
  [whereEq({ building: Buildings.WORKSHOP }), always(WORKSHOP)],
  [whereEq({ building: Buildings.RECRUITER }), always(RECRUITER)],
  [whereEq({ building: Buildings.GARDEN, suit: Suits.FOX }), always(GARDEN_FOX)],
  [whereEq({ building: Buildings.GARDEN, suit: Suits.MOUSE }), always(GARDEN_MOUSE)],
  [whereEq({ building: Buildings.GARDEN, suit: Suits.RABBIT }), always(GARDEN_RABBIT)],
  [whereEq({ building: Buildings.CITADEL }), always(CITADEL)],
  [whereEq({ building: Buildings.MARKET }), always(MARKET)],
  [whereEq({ building: Buildings.RUIN }), always(RUIN)],
]);
