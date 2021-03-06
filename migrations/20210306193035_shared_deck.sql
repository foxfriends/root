CREATE TABLE shared_deck (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    card        SMALLINT NOT NULL,
    sort        SMALLINT NOT NULL,
    PRIMARY KEY (game, card),
    UNIQUE (game, sort),
    FOREIGN KEY (game, card) REFERENCES cards (game, id)
);
