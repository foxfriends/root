declare module "koa-upgrade" {
  import * as Koa from 'koa';
  function upgrade(koa: Koa): void;
  export = upgrade;
}
