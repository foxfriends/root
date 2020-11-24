CREATE TABLE cards (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    id          SMALLINT NOT NULL,
    card        enum_card NOT NULL,
    suit        enum_suit NOT NULL,
    PRIMARY KEY (game, id)
);

CREATE TABLE hand (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    card        SMALLINT NOT NULL,
    PRIMARY KEY (game, card),
    FOREIGN KEY (game, card) REFERENCES cards (game, id)
);

CREATE TABLE eyrie_decree (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    card        SMALLINT NOT NULL,
    id          SMALLINT NOT NULL,
    action      enum_action NOT NULL,
    UNIQUE (game, card),
    FOREIGN KEY (game, card) REFERENCES cards (game, id),
    PRIMARY KEY (game, id)
);

CREATE TABLE alliance_supporters (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    card        SMALLINT NOT NULL,
    PRIMARY KEY (game, card),
    FOREIGN KEY (game, card) REFERENCES cards (game, id)
);

CREATE TABLE lost_souls (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    card        SMALLINT NOT NULL,
    PRIMARY KEY (game, card),
    FOREIGN KEY (game, card) REFERENCES cards (game, id)
);

CREATE TABLE discards (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    card        SMALLINT NOT NULL,
    PRIMARY KEY (game, card),
    FOREIGN KEY (game, card) REFERENCES cards (game, id)
);
