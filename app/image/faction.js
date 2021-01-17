import Faction from '../types/Faction';

import ALLIANCE_FRONT from '../image/card-alliance-front.jpg';
import ALLIANCE_BACK from '../image/card-alliance-back.jpg';
import CULT_FRONT from '../image/card-cult-front.jpg';
import CULT_BACK from '../image/card-cult-back.jpg';
import EYRIE_FRONT from '../image/card-eyrie-front.jpg';
import EYRIE_BACK from '../image/card-eyrie-back.jpg';
import MARQUISE_FRONT from '../image/card-marquise-front.jpg';
import MARQUISE_BACK from '../image/card-marquise-back.jpg';
import RIVERFOLK_FRONT from '../image/card-riverfolk-front.jpg';
import RIVERFOLK_BACK from '../image/card-riverfolk-back.jpg';
import VAGABOND_FRONT from '../image/card-vagabond-front.jpg';
import VAGABOND_BACK from '../image/card-vagabond-back.jpg';
import VAGABOND2_FRONT from '../image/card-vagabond2-front.jpg';
import VAGABOND2_BACK from '../image/card-vagabond2-back.jpg';
// TODO: locate the images for the moles and crows.

export default {
  [Faction.MARQUISE]: { front: MARQUISE_FRONT, back: MARQUISE_BACK },
  [Faction.EYRIE]: { front: EYRIE_FRONT, back: EYRIE_BACK },
  [Faction.ALLIANCE]: { front: ALLIANCE_FRONT, back: ALLIANCE_BACK },
  [Faction.VAGABOND]: { front: VAGABOND_FRONT, back: VAGABOND_BACK },
  [Faction.VAGABOND2]: { front: VAGABOND2_FRONT, back: VAGABOND2_BACK },
  [Faction.RIVERFOLK]: { front: RIVERFOLK_FRONT, back: RIVERFOLK_BACK },
  [Faction.CULT]: { front: CULT_FRONT, back: CULT_BACK },
  // TODO: these two are just using the wrong image for now
  [Faction.DUCHY]: { front: CULT_FRONT, back: CULT_BACK },
  [Faction.CONSPIRACY]: { front: CULT_FRONT, back: CULT_BACK },
};
