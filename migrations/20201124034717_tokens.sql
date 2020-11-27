CREATE TABLE tokens (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    id          SMALLINT NOT NULL,
    token       enum_token NOT NULL,
    faction     enum_faction NOT NULL GENERATED ALWAYS AS (CASE
        WHEN token = 'sympathy' THEN 'alliance'::enum_faction
        WHEN token IN ('wood', 'keep') THEN 'marquise'::enum_faction
        WHEN token = 'trade_post' THEN 'riverfolk'::enum_faction
        WHEN token IN ('bomb', 'snare', 'extortion', 'raid') THEN 'conspiracy'::enum_faction
        WHEN token = 'tunnel' THEN 'duchy'::enum_faction
    END) STORED,
    PRIMARY KEY (game, id),
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE placed_tokens (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    token       SMALLINT NOT NULL,
    position    SMALLINT NOT NULL,
    PRIMARY KEY (game, token),
    FOREIGN KEY (game, token) REFERENCES tokens (game, id),
    FOREIGN KEY (game, position) REFERENCES clearings (game, position)
);
