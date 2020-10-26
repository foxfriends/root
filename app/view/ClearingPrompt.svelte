<script>
export let x;
export let y;
export let scale;
</script>

<div class='circle' style={`left: ${x * scale}px; top: ${y * scale}px; transform: translate(-50%, -50%) scale(${scale})`} on:click />

<style>
.circle {
  position: absolute;
  width: 650px;
  height: 650px;
  border-radius: 100%;
  transform-origin: center;
  background-image: radial-gradient(transparent 25%, rgba(255, 255, 255, 0.6) 75%, transparent 100%);
  cursor: pointer;
}

.circle:hover {
  background-image: radial-gradient(rgba(255, 255, 255, 0.2) 25%, rgba(255, 255, 255, 0.8) 75%, transparent 100%);
}
</style>
