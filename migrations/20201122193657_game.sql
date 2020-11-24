CREATE TABLE games (
    name        VARCHAR(32) PRIMARY KEY,
    assignment  enum_assignment NOT NULL DEFAULT 'random',
    map         enum_game_map NOT NULL DEFAULT 'autumn',
    phase       enum_phase NOT NULL DEFAULT 'lobby',
    created     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE players (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    name        VARCHAR(32) NOT NULL,
    ready       BOOLEAN DEFAULT false,
    PRIMARY KEY (game, name)
);
