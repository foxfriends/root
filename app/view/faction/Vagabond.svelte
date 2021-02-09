<script>
import { game } from '../../store';
import characterImages from '../../image/card/card-vagabond_character-front.*.jpg';
import tokenImages from '../../image/token/token.*.png';
import { Item } from '../../model/Item';
import Token from '../Token.svelte';
import Deck from '../Deck.svelte';
import { getFactionIconPath } from '../../util/image';

export let faction;

export let width, height;
$: scale = Math.min(width / 2252, height / 1749);
$: card = { x: 1643 * scale, y: 976 * scale };
$: relationships = { x: 1452 * scale, y: 396 * scale, dx: 165 * scale };
$: hostile = { x: 948 * scale, y: 634 * scale };
$: satchel = {
  x: 950 * scale,
  y: 1080 * scale,
  damaged: { x: 968 * scale, y: 1481 * scale },
  tea: { x: 528 * scale, y: 525 * scale, dx: 130 * scale },
  coin: { x: 522 * scale, y: 1432 * scale, dx: 135 * scale },
  bag: { x: 522 * scale, y: 1587 * scale, dx: 135 * scale },
};

const tracked = [Item.tea, Item.bag, Item.coin];
$: satchelItems = [
  ...$game.factionData[faction].items
    .refreshed
    .filter((item) => !tracked.includes(item.name))
    .map((item) => ({ state: 'refreshed', item })),
  ...$game.factionData[faction].items.exhausted
    .map((item) => ({ state: 'exhausted', item })),
];
$: damagedItems = $game.factionData[faction].items.damaged;
$: tea = $game.factionData[faction].items.refreshed.filter((item) => item.name === Item.tea).length;
$: coin = $game.factionData[faction].items.refreshed.filter((item) => item.name === Item.coin).length;
$: bag = $game.factionData[faction].items.refreshed.filter((item) => item.name === Item.bag).length;
$: relationshipFactions = Object
  .entries($game.factionData[faction].relations)
  .filter(([faction]) => faction in $game.factionData)
  .filter(([, l]) => l !== null)
  .reduce((factions, [faction, l]) => ({ ...factions, [l]: [...(factions[l] || []), faction] }), {});
$: hostileFactions = Object.entries($game.factionData[faction].relations)
  .filter(([faction]) => faction in $game.factionData)
  .filter(([, l]) => l === null)
  .map(([faction]) => faction);
</script>

<div class='container'>
  <div class={`board ${faction}`} style={`width: ${2252 * scale}px; height: ${1749 * scale}px`}>
    {#if $game.factionData[faction].character}
      <div class='character' style={`transform: translate(${card.x}px, ${card.y}px); width: ${517 * scale}px; height: ${702 * scale}px`}>
        <Deck cardImage={characterImages[$game.factionData[faction].character]} cardCount={1} />
      </div>
    {/if}
    {#each Object.entries(relationshipFactions) as [level, factions]}
      <div
        class='relationships friendly'
        style={`
          left: ${relationships.x + relationships.dx * (level - 1)}px;
          top: ${relationships.y}px;
          transform: scale(${scale});
        `}>
        {#each factions as faction, i}
          <div style={i === 0 ? '' : `margin-top: ${Math.min(5, (394 - (factions.length * 146)) / (factions.length - 1))}px;`}>
            <Token square block image={getFactionIconPath(faction.faction)} />
          </div>
        {/each}
      </div>
    {/each}
    <div
      class='relationships hostile'
      style={`
        left: ${hostile.x}px;
        top: ${hostile.y}px;
        transform: scale(${scale});
      `}>
      {#each hostileFactions as faction, i}
        <div style={i === 0 ? '' : `margin-left: ${Math.min(5, (439 - (hostileFactions.length * 146)) / (hostileFactions.length - 1))}px;`}>
          <Token square block image={getFactionIconPath(faction.faction)} />
        </div>
      {/each}
    </div>
    <div class='items refreshed' style={`left: ${satchel.x}px; top: ${satchel.y}px; transform: scale(${scale * 0.88})`}>
      {#each satchelItems as itemInfo}
        <div class={`item ${itemInfo.state}`}>
          <Token square block image={tokenImages[itemInfo.item.key]} radius={31} />
        </div>
      {/each}
    </div>
    <div class='items damaged' style={`left: ${satchel.damaged.x}px; top: ${satchel.damaged.y}px; transform: scale(${scale * 0.88})`}>
      {#each damagedItems as item, i}
        <div
          class='item exhausted'
          style={i === 0 ? '' : `margin-left: ${Math.min(5, (586 - (damagedItems.length * 146)) / (damagedItems.length - 1))}px;`}>
          <Token square block image={tokenImages[item.key]} radius={31} />
        </div>
      {/each}
    </div>
    {#each new Array(tea).fill(0) as _, i}
      <Token square
        x={satchel.tea.x + satchel.tea.dx * i}
        y={satchel.tea.y}
        scale={scale * 0.88}
        image={tokenImages[`item-${Item.tea}`]}
        radius={31} />
    {/each}
    {#each new Array(coin).fill(0) as _, i}
      <Token square
        x={satchel.coin.x + satchel.coin.dx * i}
        y={satchel.coin.y}
        scale={scale * 0.88}
        image={tokenImages[`item-${Item.coin}`]}
        radius={31} />
    {/each}
    {#each new Array(bag).fill(0) as _, i}
      <Token square
        x={satchel.bag.x + satchel.bag.dx * i}
        y={satchel.bag.y}
        scale={scale * 0.88}
        image={tokenImages[`item-${Item.bag}`]}
        radius={31} />
    {/each}
  </div>
</div>

<style>
.container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.vagabond {
  background-image: url('../../image/card-vagabond-front.jpg');
}

.vagabond2 {
  background-image: url('../../image/card-vagabond2-front.jpg');
}

.board {
  position: relative;
  background-size: contain;
  background-attachment: top left;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}

.character {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: top left;
}

.relationships,
.items {
  box-sizing: border-box;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transform-origin: top left;
}

.relationships.friendly {
  flex-direction: column;
  height: 404px;
  width: 165px;
  padding-top: 20px;
}

.relationships.hostile {
  width: 439px;
  height: 163px;
}

.relationships.hostile,
.items.damaged {
  flex-direction: row;
  padding-top: 0;
  padding-left: 20px;
}

.items.refreshed {
  flex-wrap: wrap;
  width: 620px;
  height: 370px;
  padding-left: 20px;
}

.items.damaged {
  flex-direction: row;
  padding-left: 20px;
  padding-top: 20px;
  width: 586px;
  height: 150px;
}

.item {
  margin-left: 5px;
  margin-bottom: 5px;
}

.item.exhausted {
  opacity: 0.7;
}
</style>
