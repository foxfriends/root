<script>
  export let disabled = false;
</script>

<button class='button' {disabled} on:click>
  <slot />
</button>

<style>
  .button {
    box-sizing: border-box;
    padding: 8px;
    border: none;
    background-color: transparent;
    color: var(--color--accent);
    font-family: var(--font-family--display);
    font-size: var(--Button--font-size, 16px);
    cursor: pointer;
  }

  .button:hover {
    color: var(--color--accent__hover);
  }

  .button:disabled {
    color: var(--color--text);
    opacity: 0.6;
    cursor: default;
  }
</style>
