// NOTE: not all of this functions are tested
// since gameplay is not ready yet

export function getBuildingImagePath(building) {
  const faction = building.faction ? building.faction + '-' : '';
  const suit = building.suit ? '_' + building.suit : '';

  return `/image/piece/token.${faction}${building.building}${suit}.png`;
}

export function getTokenImagePath(token) {
  let faction = token.faction ? token.faction + '-' : '';
  let suit = token.suit ? '_' + token.suit : '';

  return `/image/piece/token.${faction}${token.token}${suit}.png`;
}

export function getVictoryPointImagePath(faction) {
  return `/image/piece/victory-points/token.${faction}-vp.png`;
}

export function getMapImagePath(map) {
  return `/image/map/map-${map}.jpg`;
}

export function getFactionIconPath(faction) {
  return `/image/piece/icons/token.${faction}-icon.png`;
}

export function getItemImagePath(item, ruin) {
  let ruinPath = ruin ? 'ruin_' : '';

  return `/image/piece/item/token.item-${ruinPath}${item}.png`;
}

export function getEyrieLeaderPath(leader) {
  let path = leader ? 'front.' + leader : 'back';

  return `/image/card/eyrie/card-eyrie_leader-${path}.jpg`;
}

export function getVagabondCharacterPath(character) {
  let path = character ? 'front.' + character : 'back';

  return `/image/card/vagabond-character/card-vagabond_character-${path}.jpg`;
}

export function getFactionBoardPath(faction, back) {
  let side = back ? 'back' : 'front';

  return `/image/board/board-${faction}-${side}.jpg`;
}
