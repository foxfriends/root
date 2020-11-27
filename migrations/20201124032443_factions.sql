CREATE TABLE factions (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    faction     enum_faction NOT NULL,
    player      VARCHAR(32),
    points      SMALLINT NOT NULL DEFAULT 0 CHECK (points BETWEEN 0 AND 30),
    PRIMARY KEY (game, faction), -- only one player can play each faction
    FOREIGN KEY (game, player) REFERENCES players (game, name)
);

CREATE TABLE marquise (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction NOT NULL GENERATED ALWAYS AS ('marquise') STORED,
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE eyrie (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction NOT NULL GENERATED ALWAYS AS ('eyrie') STORED,
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE eyrie_leaders (
    game            VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    leader          enum_eyrie_leader NOT NULL,
    used            BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (game, leader)
);

CREATE TABLE eyrie_current_leader (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    leader          enum_eyrie_leader,
    FOREIGN KEY (game, leader) REFERENCES eyrie_leaders (game, leader)
);

CREATE TABLE alliance (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction NOT NULL GENERATED ALWAYS AS ('alliance') STORED,
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE vagabond (
    game            VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction NOT NULL CHECK (faction = 'vagabond' OR faction = 'vagabond2'),
    vagabond        enum_vagabond NOT NULL,
    position        SMALLINT NOT NULL,
    UNIQUE (vagabond, game), -- only one player can be each vagaband in a game
    PRIMARY KEY (game, faction),
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction),
    FOREIGN KEY (game, position) REFERENCES positions (game, id)
);

CREATE TABLE vagabond_relationships (
    game            VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    vagabond        enum_faction NOT NULL,
    faction         enum_faction NOT NULL CHECK (faction <> 'vagabond' AND faction <> 'vagabond2'),
    relationship    enum_relationship NOT NULL DEFAULT 'indifferent',
    PRIMARY KEY (game, vagabond, faction),
    FOREIGN KEY (game, vagabond) REFERENCES vagabond (game, faction),
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE cult (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction NOT NULL GENERATED ALWAYS AS ('cult') STORED,
    outcast         enum_suit NOT NULL CHECK (outcast <> 'bird'),
    hated_outcast   BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE riverfolk (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction NOT NULL GENERATED ALWAYS AS ('riverfolk') STORED,
    hand_card       SMALLINT NOT NULL DEFAULT 1 CHECK (hand_card BETWEEN 1 AND 4),
    riverboats      SMALLINT NOT NULL DEFAULT 1 CHECK (riverboats BETWEEN 1 AND 4),
    mercenaries     SMALLINT NOT NULL DEFAULT 1 CHECK (mercenaries BETWEEN 1 AND 4),
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE duchy (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction NOT NULL GENERATED ALWAYS AS ('duchy') STORED,
    lord_crown      SMALLINT NOT NULL DEFAULT 3,
    noble_crown     SMALLINT NOT NULL DEFAULT 3,
    squire_crown    SMALLINT NOT NULL DEFAULT 3,
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE ministers (
    game            VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    minister        enum_minister NOT NULL,
    rank            enum_minister_rank NOT NULL GENERATED ALWAYS AS (CASE
        WHEN minister IN ('foremole', 'captain', 'marshal') THEN 'squire'::enum_minister_rank
        WHEN minister IN ('banker', 'brigadier', 'mayor') THEN 'noble'::enum_minister_rank
        WHEN minister IN ('earl_of_stone', 'baron_of_dirt', 'duchess_of_mud') THEN 'lord'::enum_minister_rank
    END) STORED,
    swayed          BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (game, minister)
);

CREATE TABLE conspiracy (
    game            VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    faction         enum_faction NOT NULL GENERATED ALWAYS AS ('conspiracy') STORED,
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);
