CREATE TABLE tokens (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    id          SMALLINT NOT NULL,
    token       enum_token NOT NULL,
    faction     enum_faction NOT NULL,
    PRIMARY KEY (game, id),
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);
