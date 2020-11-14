<script>
  export let flow;

  class Abort extends Error {}

  let state;
  let driver;

  $: {
    async function* drive(...args) {
      const inner = await flow(...args);
      let step = inner.next();
      for (;;) {
        const { value, done } = await step;
        if (done) { return value; }
        state = value;
        try {
          step = inner.next(yield);
        } catch (error) {
          step = inner.throw(error);
        }
      }
    }

    driver = drive();
    driver.next();
  }
</script>

<slot
  {state}
  next={(value) => driver.next(value)}
  abort={(error) => driver.throw(error ?? new Abort)}
  />
