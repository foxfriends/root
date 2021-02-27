<script>
  import { evolve, complement, pathEq, pathSatisfies, prop, propEq,  } from 'ramda';
  import { memberOf } from '../../util/ramda';
  import context from '../../context';
  import Item from '../Item.svelte';
  import Scale from '../Scale.svelte';
  import Deck, { front } from '../Deck.svelte';
  import Factions from '../../types/Faction';
  import Buildings from '../../types/Building';
  import Items from '../../types/Item';
  import { getFactionIconPath, getVagabondCharacterPath } from '../../util/image';

  export let faction;

  const { state } = context();

  let width;
  let height;
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

  const tracked = [Items.TEA, Items.BAG, Items.COIN];
  $: owned = $state
    .vagabond_items
    .filter(propEq('faction', faction))
    .map(evolve({ item: (item) => $state.items.find(propEq('id', item)) }));
  $: satchelItems = owned
    .filter(pathSatisfies(complement(memberOf(tracked)), ['item', 'item']));
  $: teas = owned
    .filter(pathEq(['item', 'item'], Items.TEA))
    .filter(complement(prop('damaged')));
  $: coins = owned
    .filter(pathEq(['item', 'item'], Items.COIN))
    .filter(complement(prop('damaged')));
  $: bags = owned
    .filter(pathEq(['item', 'item'], Items.BAG))
    .filter(complement(prop('damaged')));
  $: damagedItems = owned.filter(prop('damaged'));

  $: character = $state[faction].vagabond;

  // $: relationshipFactions = Object
  //   .entries($game.factionData[faction].relations)
  //   .filter(([faction]) => faction in $game.factionData)
  //   .filter(([, l]) => l !== null)
  //   .reduce((factions, [faction, l]) => ({ ...factions, [l]: [...(factions[l] || []), faction] }), {});
  // $: hostileFactions = Object.entries($game.factionData[faction].relations)
  //   .filter(([faction]) => faction in $game.factionData)
  //   .filter(([, l]) => l === null)
  //   .map(([faction]) => faction);
</script>

<Scale {scale}>
  <div class='container' bind:clientWidth={width} bind:clientHeight={height}>
    <div class={`board ${faction}`} style={`width: ${2252 * scale}px; height: ${1749 * scale}px`}>
      {#if character}
        <div class='character' style={`transform: translate(${card.x}px, ${card.y}px); width: ${517 * scale}px; height: ${702 * scale}px`}>
          <Deck expandable vagabonds cards={[front(character)]} />
        </div>
      {/if}

      <!--
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
      -->

      <Scale scale={scale * 0.88}>
        <div class='items refreshed' style={`left: ${satchel.x}px; top: ${satchel.y}px;`}>
          {#each satchelItems as { item, exhausted } (item.id)}
            <div class='item' class:exhausted>
              <Item {item} />
            </div>
          {/each}
        </div>

        <div class='items damaged' style={`left: ${satchel.damaged.x}px; top: ${satchel.damaged.y}px;`}>
          {#each damagedItems as { item }, i (item.id)}
            <div
              class='item exhausted'
              style={i === 0 ? '' : `margin-left: ${Math.min(5, (586 - (damagedItems.length * 146)) / (damagedItems.length - 1))}px;`}>
              <Item {item} />
            </div>
          {/each}
        </div>

        {#each teas as { item },  i (item.id)}
          <Item
            x={satchel.tea.x + satchel.tea.dx * i}
            y={satchel.tea.y}
            {item} />
        {/each}
        {#each coins as { item },  i (item.id)}
          <Item
            x={satchel.coin.x + satchel.coin.dx * i}
            y={satchel.coin.y}
            {item} />
        {/each}
        {#each bags as { item },  i (item.id)}
          <Item
            x={satchel.bag.x + satchel.bag.dx * i}
            y={satchel.bag.y}
            {item} />
        {/each}
      </Scale>
    </div>
  </div>
</Scale>

<style>
  .container {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .vagabond {
    background-image: url('./image/board/board.vagabond-front.jpg');
  }

  .vagabond2 {
    background-image: url('./image/board/board.vagabond2-front.jpg');
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
