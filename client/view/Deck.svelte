<script>
export let cardBack;
export let cardCount;

const color = [
  'rgb(148, 142, 118)',
  'rgb(182, 176, 150)'
];

$: boxShadow = new Array(Math.floor(cardCount / 2)).fill(0)
  .map((_, i) => `0 ${i + 1}px 0 ${color[i % 2]}`)
  .join(',');
</script>

<div class='card' style={`background-image: url(${cardBack}); box-shadow: ${boxShadow}; transform: translateY(-${cardCount / 2}px)`} />

<style>
.card {
  background-size: cover;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
</style>
