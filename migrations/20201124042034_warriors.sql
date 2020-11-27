CREATE TABLE warriors (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    id          SMALLINT NOT NULL,
    faction     enum_faction NOT NULL CHECK (faction <> 'vagabond' AND faction <> 'vagabond2'),
    PRIMARY KEY (game, id),
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE officers (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    warrior     SMALLINT NOT NULL,
    PRIMARY KEY (game, warrior),
    FOREIGN KEY (game, warrior) REFERENCES warriors (game, id)
);

CREATE TABLE acolytes (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    warrior     SMALLINT NOT NULL,
    PRIMARY KEY (game, warrior),
    FOREIGN KEY (game, warrior) REFERENCES warriors (game, id)
);

CREATE TABLE payments (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    warrior     SMALLINT NOT NULL,
    PRIMARY KEY (game, warrior),
    FOREIGN KEY (game, warrior) REFERENCES warriors (game, id)
);

CREATE TABLE funds (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    warrior     SMALLINT NOT NULL,
    PRIMARY KEY (game, warrior),
    FOREIGN KEY (game, warrior) REFERENCES warriors (game, id)
);

CREATE TABLE commitments (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    warrior     SMALLINT NOT NULL,
    craft_suit  enum_suit, -- warriors committed for crafting get placed separately
    PRIMARY KEY (game, warrior),
    FOREIGN KEY (game, warrior) REFERENCES warriors (game, id)
);

CREATE TABLE burrow (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    warrior     SMALLINT NOT NULL,
    PRIMARY KEY (game, warrior),
    FOREIGN KEY (game, warrior) REFERENCES warriors (game, id)
);

CREATE TABLE placed_warriors (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    warrior     SMALLINT NOT NULL,
    position    SMALLINT NOT NULL,
    PRIMARY KEY (game, warrior),
    FOREIGN KEY (game, warrior) REFERENCES warriors (game, id),
    FOREIGN KEY (game, position) REFERENCES positions (game, id)
);
