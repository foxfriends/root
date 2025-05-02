import { accept } from "../../../model/Acceptor.js";
import Faction from "../../../model/Faction.js";
import Client from "../../../model/Client.js";
import setupAlliance from "./alliance.js";
import setupEyrie from "./eyrie.js";
import setupMarquise from "./marquise.js";
import setupVagabond from "./vagabond.js";
import setupRiverfolk from "./riverfolk.js";
import setupCult from "./cult.js";

async function* setupFaction(this: Client, faction: Faction) {
  switch (faction) {
    case Faction.marquise:
      yield* setupMarquise.call(this);
      break;
    case Faction.eyrie:
      yield* setupEyrie.call(this);
      break;
    case Faction.alliance:
      yield* setupAlliance.call(this);
      break;
    case Faction.vagabond:
    case Faction.vagabond2:
      yield* setupVagabond.call(this, faction);
      break;
    case Faction.riverfolk:
      yield* setupRiverfolk.call(this);
      break;
    case Faction.cult:
      yield* setupCult.call(this);
      break;
    default:
      throw new Error("unimplemented");
  }
}

export default async function* setup(this: Client) {
  while (this.game.turn! < 0) {
    const myFaction = this.game.players[this.username].faction;
    const currentFaction =
      this.game.factions[this.game.turn! + this.game.factions.length];
    if (myFaction === currentFaction) {
      yield* setupFaction.call(this, currentFaction);
      this.game.nextTurn();
    } else {
      yield* accept.call(this, "gameUpdated");
    }
    this.send("update", this.game);
  }
}
