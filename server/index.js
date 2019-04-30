import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import compress from 'koa-compress';
import upgrade from 'koa-upgrade';
import uuid from 'uuid/v4.js';

import Client from './model/Client.js';
import clients from './store/clients.js';
import game from './game/index.js';

const server = new Koa();

upgrade(server);

server
  .use(mount('/play', async ctx => {
    const connection = await ctx.upgrade();
    const client = new Client(uuid(), connection);
    console.log(`New client ${client.id}`);
    clients.set(client.clientId, client);
    await game(client);
    if (client.game) {
      if (client.game.started) {
        client.game.removeClient(client);
      } else {
        client.game.removePlayer(client);
      }
    }

    clients.delete(client.clientId);
    console.log(`Client ${client.username ? `${client.username} (${client.id})` : client.id} disconnecting`);
  }))
  .use(mount('/', serve('dist')))
  .use(compress());

const PORT = process.env.PORT || 3000;
console.log(`\nServer is listening on port ${PORT}\n`)
server.listen(PORT);
