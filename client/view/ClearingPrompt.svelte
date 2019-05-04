<script>
export let x;
export let y;
</script>

<div class='circle' style={`left: ${x}px; top: ${y}px`} on:click/>

<style>
.circle {
  position: absolute;
  transform: translate(-50%, -50%);
  border-radius: 100%;
  width: 650px;
  height: 650px;
  background-image: radial-gradient(transparent 25%, rgba(255, 255, 255, 0.6) 75%, transparent 100%);
  cursor: pointer;
}

.circle:hover {
  background-image: radial-gradient(rgba(255, 255, 255, 0.2) 25%, rgba(255, 255, 255, 0.8) 75%, transparent 100%);
}
</style>
