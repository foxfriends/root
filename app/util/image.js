export function getBuildingImagePath(building) {
  let faction = building.faction ? building.faction + '-' : '';
  let suit = building.suit ? '_' + building.suit : '';

  return `/image/piece/token.${faction}${building.building}${suit}.png`;
}

export function getVictoryPointImagePath(faction) {
  return `/image/piece/victory-points/token.${faction}-vp.png`;
}

export function getFactionIconPath(faction) {
  return `/image/piece/icons/token.${faction}-icon.png`;
}
