import { always, cond, propEq } from 'ramda';
import Factions from '../../../types/Faction';

// TODO: add factions warrior icons
import ALLIANCE from './token.alliance-warrior.png';
import CULT from './token.cult-warrior.png';
import EYRIE from './token.eyrie-warrior.png';
import MARQUISE from './token.marquise-warrior.png';
import RIVERFOLK from './token.riverfolk-warrior.png';
import VAGABOND from './token.vagabond-warrior.png';
import VAGABOND2 from './token.vagabond2-warrior.png';
import DUCHY from './token.duchy-warrior.png';
import CONSPIRACY from './token.conspiracy-warrior.png';

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
