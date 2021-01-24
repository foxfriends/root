<script>
import buildingImage from '../image/piece/building';
import { useScale } from '../context';

export let building;
export let x;
export let y;
export let radius = 20;
export let stack = 1;

const scale = useScale();
$: boxShadow = new Array(stack)
  .fill(0)
  .map((_, i) => `0 ${8 * i + 3}px 0 rgb(179, 174, 166), 0 ${8 * i + 7}px 0 rgb(198, 185, 165), 0 ${8 * i + 8}px 0 rgb(113, 107, 97)`)
  .join(',');
</script>

<div
  class='building'
  style={`
    background-image: url(${buildingImage(building)});
    left: ${x}px;
    top: ${y}px;
    border-radius: ${radius}px;
    transform: translate(-50%, -50%) translateY(-${8 * stack * $scale}px) scale(${$scale});
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.6) inset, ${boxShadow};
  `}
  />

<style>
.building {
  position: absolute;
  pointer-events: none;
  user-select: none;
  transform-origin: center;
  width: 141px;
  height: 141px;
  transition: top 0.2s, left 0.2s;
}
</style>
