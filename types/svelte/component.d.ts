declare module "*.svelte" {
  class Component {
    constructor(options: { target: HTMLElement });
    $set(props: { [key: string]: any }): void;
  }

  export default Component;
}
