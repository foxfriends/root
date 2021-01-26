import { cond, propEq, always } from 'ramda';
import Factions from '../../types/Faction';

import ALLIANCE from './token.alliance-victory_points.png';
import CULT from './token.cult-victory_points.png';
import EYRIE from './token.eyrie-victory_points.png';
import MARQUISE from './token.marquise-victory_points.png';
import RIVERFOLK from './token.riverfolk-victory_points.png';
import VAGABOND from './token.vagabond-victory_points.png';
import VAGABOND2 from './token.vagabond2-victory_points.png';
// TODO
import DUCHY from './token.vagabond2-victory_points.png';
import CONSPIRACY from './token.vagabond2-victory_points.png';

export { ALLIANCE, CULT, EYRIE, MARQUISE, RIVERFOLK, VAGABOND, VAGABOND2, DUCHY, CONSPIRACY };

export default cond([
  [propEq('faction', Factions.ALLIANCE), always(ALLIANCE)],
  [propEq('faction', Factions.CULT), always(CULT)],
  [propEq('faction', Factions.EYRIE), always(EYRIE)],
  [propEq('faction', Factions.MARQUISE), always(MARQUISE)],
  [propEq('faction', Factions.RIVERFOLK), always(RIVERFOLK)],
  [propEq('faction', Factions.VAGABOND), always(VAGABOND)],
  [propEq('faction', Factions.VAGABOND2), always(VAGABOND2)],
  [propEq('faction', Factions.DUCHY), always(DUCHY)],
  [propEq('faction', Factions.CONSPIRACY), always(CONSPIRACY)],
]);
