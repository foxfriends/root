import { always, cond, equals } from 'ramda';
import GameMaps from '../types/GameMap';
import WINTER from './map-winter.jpg';
import AUTUMN from './map-autumn.jpg';

export { AUTUMN, WINTER };
export default cond([
  [equals(GameMaps.AUTUMN), always(AUTUMN)],
  [equals(GameMaps.WINTER), always(WINTER)],
  // TODO:
  [equals(GameMaps.LAKE), always(AUTUMN)],
  [equals(GameMaps.CAVE), always(AUTUMN)],
]);
