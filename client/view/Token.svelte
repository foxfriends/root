<script>
export let image;
export let x;
export let y;
export let radius = 20;
export let scale = 1;
export let square = false;
export let round = false;
export let stack = 1;

$: boxShadow = new Array(stack)
  .fill(0)
  .map((_, i) => `0 ${8 * i + 3}px 0 rgb(179, 174, 166), 0 ${8 * i + 7}px 0 rgb(198, 185, 165), 0 ${8 * i + 8}px 0 rgb(113, 107, 97)`)
  .join(',');

</script>

{#if square}
  <div class='token square'
    style={`
      background-image: url(${image});
      left: ${x}px;
      top: ${y}px;
      border-radius: ${radius}px;
      transform: translate(-50%, -50%) translateY(-${8 * stack * scale}px) scale(${scale});
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.6) inset, ${boxShadow};
    `} />
{:else if round}
  <div class='token round'
    style={`
      background-image: url(${image});
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%) translateY(-${8 * stack * scale}px) scale(${scale});
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.6) inset, ${boxShadow};
    `} />
{/if}

<style>
.token {
  position: absolute;
  pointer-events: none;
  user-select: none;
}

.square {
  width: 141px;
  height: 141px;
}

.round {
  border-radius: 50%;
  width: 135px;
  height: 135px;
}
</style>
