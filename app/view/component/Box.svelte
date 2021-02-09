<script>
  export let flex = false;
  export let grow = false;
</script>

<div class='box' class:grow>
  <div class='content' class:flex>
    <slot />
  </div>
</div>

<style>
  .content {
    width: 100%;
    height: 100%;
    background-color: var(--color--background);
  }

  .flex {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .box {
    --border-width: var(--Box--border-width, 55px);

    display: inline-block;
    border: var(--border-width) solid transparent;
    border-image-source: url('./image/box.png');
    border-image-slice: 55 fill;
    border-image-width: var(--border-width);
    border-image-repeat: round;
  }

  .grow {
    flex-grow: 1;
  }
</style>
