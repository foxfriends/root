<script>
import { game, prompts } from '../../store';
import Message from '../../model/Message';
import Pieces from '../../model/Piece';
import Box from '../component/Box.svelte';
import Text from '../component/Text.svelte';
import Piece from '../Piece.svelte';
import CraftedItems from './CraftedItems.svelte';

export let width, height;
$: scale = Math.min(width / 2252, height / 1749);
$: payments = { x: 1015 * scale, y: 502 * scale, w: 514, h: 279 };
$: funds = { x: 1015 * scale, y: 851 * scale, w: 514, h: 474 };
$: commitments = { x: 1015 * scale, y: 1400 * scale, w: 514, h: 277 };

$: services = { x: 1800 * scale, y: 630 * scale, dx: 105 * scale, dy: 110 * scale };
$: tradePosts = { x: 2093 * scale, y: 1280 * scale, dx: 165 * scale, dy: 160 * scale };
$: craftedItems = { x: 1528 * scale, y: 280 * scale, width: 555 };

export let client;

let inputPrices = $game.factionData.riverfolk.services;
$: prices = $prompts && $prompts.prices ? inputPrices : $game.factionData.riverfolk.services;

function notifyPrices() {
  client.notify(Message.direct('Prompts:prices', inputPrices));
}
</script>

<div class='container'>
  <div class='board' style={`width: ${2252 * scale}px; height: ${1749 * scale}px`}>
    {#each new Array($game.factionData.riverfolk.trade_post_fox).fill(0) as _, i}
      <Piece
        piece={Pieces.riverfolk.trade_post_fox}
        x={tradePosts.x - i * tradePosts.dx}
        y={tradePosts.y}
        {scale} />
    {/each}
    {#each new Array($game.factionData.riverfolk.trade_post_rabbit).fill(0) as _, i}
      <Piece
        piece={Pieces.riverfolk.trade_post_rabbit}
        x={tradePosts.x - i * tradePosts.dx}
        y={tradePosts.y + tradePosts.dy}
        {scale} />
    {/each}
    {#each new Array($game.factionData.riverfolk.trade_post_mouse).fill(0) as _, i}
      <Piece
        piece={Pieces.riverfolk.trade_post_mouse}
        x={tradePosts.x - i * tradePosts.dx}
        y={tradePosts.y + 2 * tradePosts.dy}
        {scale} />
    {/each}
    <CraftedItems {...craftedItems} {scale} items={$game.factionData.riverfolk.craftedItems} />

    <div class='funds' style={`left: ${payments.x}px; top: ${payments.y}px; width: ${payments.w}px; height: ${payments.h}px; transform: scale(${scale})`}>
      {#each $game.factionData.riverfolk.funds.payments as piece}
        <div class='fund'>
          <Piece block {piece} scale={0.88} />
        </div>
      {/each}
    </div>
    <div class='funds' style={`left: ${funds.x}px; top: ${funds.y}px; width: ${funds.w}px; height: ${funds.h}px; transform: scale(${scale})`}>
      {#each $game.factionData.riverfolk.funds.funds as piece}
        <div class='fund'>
          <Piece block {piece} scale={0.88} />
        </div>
      {/each}
    </div>
    <div class='funds' style={`left: ${commitments.x}px; top: ${commitments.y}px; width: ${commitments.w}px; height: ${commitments.h}px; transform: scale(${scale})`}>
      {#each $game.factionData.riverfolk.funds.commitments as piece}
        <div class='fund'>
          <Piece block {piece} scale={0.88} />
        </div>
      {/each}
    </div>

    {#each $game.factionData.riverfolk.funds.crafted.fox as piece, i}
      <Piece
        {piece}
        x={tradePosts.x - i * tradePosts.dx}
        y={tradePosts.y}
        scale={scale * 0.88} />
    {/each}
    {#each $game.factionData.riverfolk.funds.crafted.rabbit as piece, i}
      <Piece
        {piece}
        x={tradePosts.x - i * tradePosts.dx}
        y={tradePosts.y + tradePosts.dy}
        scale={scale * 0.88} />
    {/each}
    {#each $game.factionData.riverfolk.funds.crafted.mouse as piece, i}
      <Piece
        {piece}
        x={tradePosts.x - i * tradePosts.dx}
        y={tradePosts.y + 2 * tradePosts.dy}
        scale={scale * 0.88} />
    {/each}

    {#if $prompts && $prompts.prices}
      {#each ['handCard', 'riverboats', 'mercenaries'] as service, y}
        {#each [1, 2, 3, 4] as i, x}
          {#if prices[service] !== i}
            <div
              class='price-option'
              style={`
                transform: translate(
                  ${services.x + services.dx * x}px,
                  ${services.y + services.dy * y}px
                ) scale(${scale}) translate(-50%, -50%)
              `}
              on:click={() => inputPrices = { ...inputPrices, [service]: i }} />
          {/if}
        {/each}
      {/each}
      <div class='button-prompt'>
        <Box small>
          <button class='button' on:click={() => notifyPrices()}>
            <Text text='done' />
          </button>
        </Box>
      </div>
    {/if}
    <div
      class='price-marker'
      style={`
        transform: translate(
          ${services.x + services.dx * (prices.handCard - 1)}px,
          ${services.y}px
        ) translateY(-${24 * scale}px) scale(${scale}) translate(-50%, -50%)
      `} />
    <div
      class='price-marker'
      style={`
        transform: translate(
          ${services.x + services.dx * (prices.riverboats - 1)}px,
          ${services.y + services.dy}px
        ) translateY(-${24 * scale}px) scale(${scale}) translate(-50%, -50%)
      `} />
    <div
      class='price-marker'
      style={`
        transform: translate(
          ${services.x + services.dx * (prices.mercenaries - 1)}px,
          ${services.y + services.dy * 2}px
        ) translateY(-${24 * scale}px) scale(${scale}) translate(-50%, -50%)
      `} />
  </div>
</div>

<style>
.container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.board {
  position: relative;
  background-image: url('../../image/card-riverfolk-front.jpg');
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
