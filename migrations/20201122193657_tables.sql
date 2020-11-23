CREATE TABLE games (
    name        VARCHAR(32) PRIMARY KEY,
    assignment  enum_assignment NOT NULL DEFAULT 'random',
    phase       enum_game_phase NOT NULL DEFAULT 'lobby',
    map         enum_game_map NOT NULL DEFAULT 'autumn',
    created     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE clearings (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    id          SMALLINT NOT NULL,
    suit        enum_suit NOT NULL CHECK (suit <> 'bird'),
    slots       SMALLINT NOT NULL,
    PRIMARY KEY (game, id)
);

CREATE TABLE lakes (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    clearing    SMALLINT NOT NULL,
    FOREIGN KEY (game, clearing) REFERENCES clearings (game, id),
    PRIMARY KEY (game, clearing)
);

CREATE TABLE ferry (
    game        VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    clearing    SMALLINT NOT NULL,
    FOREIGN KEY (game, clearing) REFERENCES lakes (game, clearing)
);

CREATE TABLE paths (
    game            VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    start_clearing  SMALLINT NOT NULL,
    end_clearing    SMALLINT NOT NULL,
    closed          BOOLEAN NOT NULL DEFAULT false,
    CHECK (start_clearing < end_clearing),
    PRIMARY KEY (game, start_clearing, end_clearing)
);

CREATE TABLE cards (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    id          SMALLINT NOT NULL,
    card        enum_card NOT NULL,
    suit        enum_suit NOT NULL,
    PRIMARY KEY (game, id)
);

CREATE TABLE quests (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    id          SMALLINT NOT NULL,
    quest       enum_quest NOT NULL,
    suit        enum_suit NOT NULL,
    PRIMARY KEY (game, id)
);

CREATE TABLE items (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    id          SMALLINT NOT NULL,
    item        enum_item NOT NULL,
    ruin        BOOLEAN NOT NULL,
    PRIMARY KEY (game, id)
);

CREATE TABLE players (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    name        VARCHAR(32) NOT NULL,
    ready       BOOLEAN DEFAULT false,
    PRIMARY KEY (game, name)
);

CREATE TABLE factions (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    faction     enum_faction NOT NULL,
    player      VARCHAR(32),
    points      SMALLINT NOT NULL DEFAULT 0 CHECK (points BETWEEN 0 AND 30),
    PRIMARY KEY (game, faction), -- only one player can play each faction
    FOREIGN KEY (game, player) REFERENCES players (game, name)
);

CREATE TABLE buildings (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    id          SMALLINT NOT NULL,
    building    enum_building NOT NULL,
    faction     enum_faction NOT NULL,
    PRIMARY KEY (game, id),
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE tokens (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    id          SMALLINT NOT NULL,
    token       enum_token NOT NULL,
    faction     enum_faction NOT NULL,
    PRIMARY KEY (game, id),
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE owned_items (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    item        SMALLINT NOT NULL,
    faction     enum_faction NOT NULL,
    FOREIGN KEY (game, item) REFERENCES items (game, id),
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction),
    PRIMARY KEY (game, item),
    UNIQUE (game, item, faction)
);

CREATE TABLE ruin_items (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    clearing    SMALLINT NOT NULL,
    item        SMALLINT NOT NULL,
    FOREIGN KEY (game, item) REFERENCES items (game, id),
    FOREIGN KEY (game, clearing) REFERENCES clearings (game, id),
    PRIMARY KEY (game, item)
);

CREATE TABLE vagabond_items (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    item        SMALLINT NOT NULL,
    faction     enum_faction NOT NULL CHECK (faction = 'vagabond' OR faction = 'vagabond2'),
    used        BOOLEAN NOT NULL DEFAULT false,
    damaged     BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (game, item, faction) REFERENCES owned_items (game, item, faction),
    PRIMARY KEY (game, item, faction)
);

CREATE TABLE marquise (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction GENERATED ALWAYS AS ('marquise') STORED,
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE eyrie (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction GENERATED ALWAYS AS ('eyrie') STORED,
    used_leaders    enum_eyrie_leader[] NOT NULL DEFAULT ARRAY[]::enum_eyrie_leader[],
    leader          enum_eyrie_leader NOT NULL CHECK (leader <> ALL(used_leaders)),
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE alliance (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction GENERATED ALWAYS AS ('alliance') STORED,
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE vagabond (
    game            VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction NOT NULL CHECK (faction = 'vagabond' OR faction = 'vagabond2'),
    vagabond        enum_vagabond NOT NULL,
    UNIQUE (vagabond, game), -- only one player can be each vagaband in a game
    PRIMARY KEY (game, faction),
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE riverfolk (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction GENERATED ALWAYS AS ('riverfolk') STORED,
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE cult (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction GENERATED ALWAYS AS ('cult') STORED,
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE duchy (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction GENERATED ALWAYS AS ('duchy') STORED,
    lord_crown      SMALLINT NOT NULL DEFAULT 3,
    noble_crown     SMALLINT NOT NULL DEFAULT 3,
    squire_crown    SMALLINT NOT NULL DEFAULT 3,
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE conspiracy (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction GENERATED ALWAYS AS ('conspiracy') STORED,
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);
