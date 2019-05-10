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
empty = Empty
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
riverfolk = { $form ->
  [long] Riverfolk Company
  *[short] Riverfolk
}
marquise_bot = { $form ->
  [long] Mechanical Marquise
  *[short] Mechanical Marquise
}

marquise-keep = { $quantity ->
  *[other] Keeps
  [one] Keep
}
marquise-wood = { $quantity ->
  *[other] Wood
  [one] Wood
}
marquise-warrior = { $quantity ->
  *[other] Warriors
  [one] Warrior
}
marquise-workshop = { $quantity ->
  *[other] Workshops
  [one] Workshop
}
marquise-sawmill = { $quantity ->
  *[other] Sawmills
  [one] Sawmill
}
marquise-recruiter = { $quantity ->
  *[other] Recruiters
  [one] Recruiter
}

eyrie-leader-despot = Despot
eyrie-leader-charismatic = Charismatic
eyrie-leader-commander = Commander
eyrie-leader-builder = Builder

prompt-place-keep = Place the keep in a corner clearing
prompt-place-building = Place a { REF($building, quantity: 1) } near the keep
prompt-choose-leader = Choose your leader

rejection-game-already-exists = A game named { $name } already exists.
rejection-game-does-not-exist = No game named { $name } exists.
rejection-game-is-full = The game named { $name } is already full.
rejection-player-already-joined = The game named { $gameName } already has a player named { $playerName }.
rejection-game-already-started = The game { $gameName } has already started.
rejection-invalid-player = The game named { $gameName } does not contain a player named { $playerName }.
rejection-illegal-faction = The { REF($faction, form: "long") } is not part of this game.
rejection-faction-taken = The { REF($faction, form: "long") } has already been taken by { $playerName }.
rejection-invalid-clearing-for-keep = The keep must go in a corner clearing.
rejection-invalid-clearing-for-starting-building = Starting buildings must be at or adjacent to the keep.
rejection-no-more-slots = There are no more slots for building in this clearing.
rejection-no-more-pieces = You have no more { REF($piece, quantity: 0) }.
rejection-leader-unavailable = The { REF($leader) } is currently unavailable.
rejection-duplicate-roost = There is already a roost in this clearing.
