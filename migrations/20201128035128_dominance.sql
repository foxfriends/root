CREATE TABLE dominance (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    card        SMALLINT NOT NULL,
    faction     enum_faction,
    PRIMARY KEY (game, card),
    UNIQUE (game, faction),
    FOREIGN KEY (game, card) REFERENCES cards (game, id),
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE coalition (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    vagabond    enum_faction NOT NULL,
    faction     enum_faction NOT NULL,
    PRIMARY KEY (game, vagabond),
    FOREIGN KEY (game, vagabond) REFERENCES dominance (game, faction),
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);
