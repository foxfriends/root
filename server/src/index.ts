import Koa from "koa";
import serve from "koa-static";
import mount from "koa-mount";
import compress from "koa-compress";
import upgrade from "koa-upgrade";
import { v4 as uuid } from "uuid";

import Client from "./model/Client.js";
import clients from "./store/clients.js";
import game from "./game/index.js";

const server = new Koa();

upgrade(server);

const dist = process.env.DIST_DIR ?? "dist";

server
  .use(
    mount("/play", async (ctx) => {
      const connection: WebSocket = await ctx.upgrade();
      const client = new Client(uuid(), connection);
      console.log(`New client ${client.id}`);
      clients.set(client.id, client);
      await game(client);
      if (client.game) {
        if (client.game.turn !== null) {
          client.game.removeClient(client);
        } else {
          client.game.removePlayer(client);
        }
      }

      clients.delete(client.id);
      console.log(
        `Client ${client.username ? `${client.username} (${client.id})` : client.id} disconnecting`,
      );
    }),
  )
  .use(mount("/", serve(dist, { index: "index.html" })))
  .use(compress());

const PORT = process.env.PORT || 3000;
console.log(`\nServer is listening on port ${PORT}\n\tServing dist: ${dist}`);
server.listen(PORT);
