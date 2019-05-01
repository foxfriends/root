<script>
export let small = false;
</script>

<div class='box' class:small>
  <div class='content'>
    <slot />
  </div>
</div>

<style>
.content {
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

.small {
  border-width: 16px;
  border-image-width: 16px;
}
</style>
