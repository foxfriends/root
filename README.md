# Root

This is a digital port of the board game "Root" by Cole Wehrle, with art by Kyle Ferrin.

> Work in progress.

## Development

This is a [NodeJS](https://nodejs.org/en/) and [Rust](https://rustup.rs/) project, so both must be installed.
Though the server is written in Rust, the goal is to build the game logic using [Lumber](https://github.com/foxfriends/lumber).
Lumber is very work in progress, so things are likely to change often.

To compile the client code, use `npm`. We are using [Rollup](https://rollupjs.org/) for bundling, 
and [Svelte](https://svelte.dev/) as the framework.

```sh
npm install # install dependencies
npm run dev # run builder
```

To compile and start the server, use Cargo. Dependencies are installed automatically with Cargo.

```sh
cargo run
# To run and print the logs:
RUST_LOG=root=debug cargo run
# If you have installed cargo-watch, watch just the Rust project:
cargo watch -x run -w src -w game -w Cargo.toml -w Cargo.lock
```

With both of those running, the app should be available on `localhost:3000`.
