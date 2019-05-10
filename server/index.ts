import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import compress from 'koa-compress';
import upgrade from 'koa-upgrade';
import uuid from 'uuid/v4';

import Client from './model/Client';
import clients from './store/clients';
import game from './game';

const server = new Koa();

upgrade(server);

server
  .use(mount('/play', async ctx => {
    const connection = await ctx.upgrade();
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
    console.log(`Client ${client.username ? `${client.username} (${client.id})` : client.id} disconnecting`);
  }))
  .use(mount('/', serve('dist')))
  .use(compress());

const PORT = process.env.PORT || 3000;
console.log(`\nServer is listening on port ${PORT}\n`)
server.listen(PORT);
