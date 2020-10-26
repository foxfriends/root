<script>
export let small = false;
export let grow = false;
</script>

<div class='box' class:small class:grow>
  <div class='content'>
    <slot />
  </div>
</div>

<style>
.content {
  width: 100%;
  height: 100%;
  background-color: var(--color--background);
}

.box {
  display: inline-block;
  border: 55px solid transparent;
  border-image-source: url('../../image/box.png');
  border-image-slice: 55 fill;
  border-image-width: 55px;
  border-image-repeat: round;
}

.grow {
  flex-grow: 1;
}

.small {
  border-width: 16px;
  border-image-width: 16px;
}
</style>
