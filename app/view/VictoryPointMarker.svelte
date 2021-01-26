<script>
import image from '../image/piece/vp';
import { useScale } from '../context';

const scale = useScale();

export let factions;
export let x;
export let y;

$: boxShadow = new Array(factions.length)
  .fill(0)
  .map((_, i) => `0 ${8 * i + 3}px 0 rgb(179, 174, 166), 0 ${8 * i + 7}px 0 rgb(198, 185, 165), 0 ${8 * i + 8}px 0 rgb(113, 107, 97)`)
  .join(',');
</script>

<div
  class='marker'
  style={`
    background-image: url(${image(factions[0])});
    left: ${x}px;
    top: ${y}px;
    transform: translate(-50%, -50%) translateY(-${8 * factions.length * $scale}px) scale(${$scale});
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.6) inset, ${boxShadow};
  `}
  />

<style>
.marker {
  position: absolute;
  pointer-events: none;
  user-select: none;
  transform-origin: center;
  width: 141px;
  height: 141px;
  border-radius: 20px;
  transition: top 0.2s, left 0.2s;
}
</style>
