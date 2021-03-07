<script>
  import { __, compose, complement, find, prop, propEq, unary } from 'ramda';
  import { memberOf } from '../../util/ramda';
  import context from '../../context';
  import Action from '../component/Action.svelte';
  import Token from '../Token.svelte';
  import Warrior from '../Warrior.svelte';
  import Scale from '../Scale.svelte';
  import Factions from '../../types/Faction';
  import Tokens from '../../types/Token';
  import Suits from '../../types/Suit';

  const { state } = context();

  let width;
  let height;
  $: scale = Math.min(width / 2252, height / 1749);
  $: payments = { x: 1015 * scale, y: 502 * scale, w: 514, h: 279 };
  $: funds = { x: 1015 * scale, y: 851 * scale, w: 514, h: 474 };
  $: commitments = { x: 1015 * scale, y: 1400 * scale, w: 514, h: 277 };

  $: services = { x: 1800 * scale, y: 630 * scale, dx: 105 * scale, dy: 110 * scale };
  $: tradePost = { x: 2093 * scale, y: 1280 * scale, dx: 165 * scale, dy: 160 * scale };
  $: craftedItems = { x: 1528 * scale, y: 280 * scale, width: 555 };

  $: placedIds = $state.placed_tokens.map(prop('token'));
  $: placed = compose(memberOf(placedIds), prop('id'));

  $: tradePosts = $state
    .tokens
    .filter(propEq('faction', Factions.RIVERFOLK))
    .filter(complement(placed))
    .filter(propEq('token', Tokens.TRADE_POST));

  $: mousePosts = tradePosts.filter(propEq('suit', Suits.MOUSE));
  $: rabbitPosts = tradePosts.filter(propEq('suit', Suits.RABBIT));
  $: foxPosts = tradePosts.filter(propEq('suit', Suits.FOX));

  $: paymentWarriors = $state
    .payments
    .map(prop('warrior'))
    .map(unary(compose(find(__, $state.warriors), propEq('id'))));
  $: fundWarriors = $state
    .funds
    .map(prop('warrior'))
    .map(unary(compose(find(__, $state.warriors), propEq('id'))));
  $: commitmentWarriors = $state
    .commitments
    .filter(propEq('craft_suit', null))
    .map(prop('warrior'))
    .map(unary(compose(find(__, $state.warriors), propEq('id'))));
  $: foxWarriors = $state
    .commitments
    .filter(propEq('craft_suit', Suits.FOX))
    .map(prop('warrior'))
    .map(unary(compose(find(__, $state.warriors), propEq('id'))));
  $: mouseWarriors = $state
    .commitments
    .filter(propEq('craft_suit', Suits.MOUSE))
    .map(prop('warrior'))
    .map(unary(compose(find(__, $state.warriors), propEq('id'))));
  $: rabbitWarriors = $state
    .commitments
    .filter(propEq('craft_suit', Suits.RABBIT))
    .map(prop('warrior'))
    .map(unary(compose(find(__, $state.warriors), propEq('id'))));
</script>

<Scale {scale}>
  <div class='container' bind:clientWidth={width} bind:clientHeight={height}>
    <div class='board' style={`width: ${2252 * scale}px; height: ${1749 * scale}px`}>
      {#each foxPosts as token, i}
        <Token tokens={[token]} x={tradePost.x - i * tradePost.dx} y={tradePost.y} />
      {/each}
      {#each rabbitPosts as token, i}
        <Token tokens={[token]} x={tradePost.x - i * tradePost.dx} y={tradePost.y + tradePost.dy} />
      {/each}
      {#each mousePosts as token, i}
        <Token tokens={[token]} x={tradePost.x - i * tradePost.dx} y={tradePost.y + tradePost.dy * 2} />
      {/each}

      <Scale scale={scale * 0.7}>
        <div class='funds' style={`
          left: ${payments.x}px;
          top: ${payments.y}px;
          width: ${payments.w}px;
          height: ${payments.h}px;
          transform: scale(${scale});
        `}>
          {#each paymentWarriors as warrior}
            <div class='fund'>
              <Warrior {warrior} />
            </div>
          {/each}
        </div>
        <div class='funds' style={`
          left: ${funds.x}px;
          top: ${funds.y}px;
          width: ${funds.w}px;
          height: ${funds.h}px;
          transform: scale(${scale});
        `}>
          {#each fundWarriors as warrior}
            <div class='fund'>
              <Warrior {warrior} />
            </div>
          {/each}
        </div>
        <div class='funds' style={`
          left: ${commitments.x}px;
          top: ${commitments.y}px;
          width: ${commitments.w}px;
          height: ${commitments.h}px;
          transform: scale(${scale});
        `}>
          {#each commitmentWarriors as warrior}
            <div class='fund'>
              <Warrior {warrior} />
            </div>
          {/each}
        </div>

        {#each foxWarriors as warrior, i}
          <Warrior {warrior} x={tradePost.x - i * tradePost.dx} y={tradePost.y - 24} />
        {/each}
        {#each rabbitWarriors as warrior, i}
          <Warrior {warrior} x={tradePost.x - i * tradePost.dx} y={tradePost.y + tradePost.dy - 24} />
        {/each}
        {#each mouseWarriors as warrior, i}
          <Warrior {warrior} x={tradePost.x - i * tradePost.dx} y={tradePost.y + tradePost.dy * 2 - 24} />
        {/each}
      </Scale>

      <Action action='riverfolk_set_price[Service, Price]' let:binding let:perform>
        {#if binding.Service === 'hand_card'}
          <div
            class='price-option'
            style={`
              transform: translate(
                ${services.x + services.dx * (+binding.Price - 1)}px,
                ${services.y}px
              ) scale(${scale}) translate(-50%, -50%)
            `}
            on:click={perform} />
        {:else if binding.Service === 'riverboats'}
          <div
            class='price-option'
            style={`
              transform: translate(
                ${services.x + services.dx * (+binding.Price - 1)}px,
                ${services.y + services.dy}px
              ) scale(${scale}) translate(-50%, -50%)
            `}
            on:click={perform} />
        {:else if binding.Service === 'mercenaries'}
          <div
            class='price-option'
            style={`
              transform: translate(
                ${services.x + services.dx * (+binding.Price - 1)}px,
                ${services.y + services.dy * 2}px
              ) scale(${scale}) translate(-50%, -50%)
            `}
            on:click={perform} />
        {/if}
      </Action>

      <div
        class='price-marker'
        style={`
          transform: translate(
            ${services.x + services.dx * ($state.riverfolk.hand_card - 1)}px,
            ${services.y}px
          ) translateY(-${24 * scale}px) scale(${scale}) translate(-50%, -50%)
        `} />
      <div
        class='price-marker'
        style={`
          transform: translate(
            ${services.x + services.dx * ($state.riverfolk.riverboats - 1)}px,
            ${services.y + services.dy}px
          ) translateY(-${24 * scale}px) scale(${scale}) translate(-50%, -50%)
        `} />
      <div
        class='price-marker'
        style={`
          transform: translate(
            ${services.x + services.dx * ($state.riverfolk.mercenaries - 1)}px,
            ${services.y + services.dy * 2}px
          ) translateY(-${24 * scale}px) scale(${scale}) translate(-50%, -50%)
        `} />

      <!--CraftedItems {...craftedItems} {scale} items={$game.factionData.riverfolk.craftedItems} /-->
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

  .board {
    position: relative;
    background-image: url('./image/board/board.riverfolk-front.jpg');
    background-size: contain;
    background-attachment: top left;
    background-repeat: no-repeat;
  }

  .price-marker,
  .price-option {
    position: absolute;
    top: 0;
    left: 0;
    width: 93px;
    height: 93px;
    border-radius: 100%;
    transform-origin: top left;
  }

  .price-marker {
    background-color: rgb(96, 210, 207);
    box-shadow: 0 24px 0 rgb(91, 180, 177);
    transition: transform 0.2s;
    z-index: 1;
  }

  .price-option {
    background-color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    z-index: 0;
  }

  .button-prompt {
    position: absolute;
    bottom: 50px;
    left: 50%;
    z-index: 10;
  }

  .button {
    cursor: pointer;
    font-family: var(--font-family--display);
    color: var(--color--accent);
    font-size: 16px;
    box-sizing: border-box;
    padding: 8px;
    border: none;
    background-color: transparent;
  }

  .button:hover {
    color: var(--color--accent__hover);
  }

  .funds {
    display: flex;
    position: absolute;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    transform-origin: top left;
    padding: 20px;
  }

  .fund {
    margin: -50px 0 0 -50px;
  }

  .fund:first-child {
    margin: -50px 0 0 0;
  }
</style>
