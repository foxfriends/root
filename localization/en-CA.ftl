please-enter-your-name = Please enter your name

create-new-game = Create New Game
options = Options
create = Create
available-factions = Available factions
faction-assignment = Faction assignment
random = Random
choose = Choose

join-existing-game = Join Existing Game
join = Join
game-name = Game name

back = Back
leave = Leave
enter = Enter
cancel = Cancel
ready = Ready
select = Select
loading = Loading...
connecting = Connecting...

players = Players

map = Map
forest = Forest
winter = Winter

factions = Factions
marquise = { $form ->
  [long] Marquise de Cat
  *[short] Marquise
}
eyrie = { $form ->
  [long] Eyrie Dynasties
  *[short] Eyrie
}
alliance = { $form ->
  [long] Woodland Alliance
  *[short] Alliance
}
vagabond = { $form ->
  [long] Vagabond
  *[short] Vagabond
}
vagabond2 = { $form ->
  [long] Second Vagabond
  *[short] Vagabond 2
}
cult = { $form ->
  [long] Lizard Cult
  *[short] Cult
}
waterfolk = { $form ->
  [long] Waterfolk Company
  *[short] Waterfolk
}
marquise_bot = { $form ->
  [long] Mechanical Marquise
  *[short] Mechanical Marquise
}

rejection-game-already-exists = A game named { $name } already exists.
rejection-game-does-not-exist = No game named { $name } exists.
rejection-game-is-full = The game named { $name } is already full.
rejection-player-already-joined = The game named { $gameName } already has a player named { $playerName }.
rejection-game-already-started = The game { $gameName } has already started.
rejection-invalid-player = The game named { $gameName } does not contain a player named { $playerName }.
rejection-illegal-faction = The { REF($faction, form: "long") } is not part of this game.
rejection-faction-taken = The { REF($faction, form: "long") } has already been taken by { $playerName }.
