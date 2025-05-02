import Client from "../../model/Client.js";
import Faction from "../../model/Faction.js";

export default async function* chooseFaction(
  this: Client,
  { faction }: { faction: Faction },
  threadId: string,
): AsyncIterableIterator<void> {
  this.game.setFaction(this, faction, threadId);
  this.respond(threadId, "update", this.game);
}
