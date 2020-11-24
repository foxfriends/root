CREATE TABLE items (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    id          SMALLINT NOT NULL,
    item        enum_item NOT NULL,
    PRIMARY KEY (game, id)
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
    FOREIGN KEY (game, clearing) REFERENCES clearings (game, position),
    PRIMARY KEY (game, item)
);

CREATE TABLE vagabond_items (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    item        SMALLINT NOT NULL,
    faction     enum_faction NOT NULL CHECK (faction = 'vagabond' OR faction = 'vagabond2'),
    exhausted   BOOLEAN NOT NULL DEFAULT false,
    damaged     BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (game, item, faction) REFERENCES owned_items (game, item, faction),
    PRIMARY KEY (game, item, faction)
);
