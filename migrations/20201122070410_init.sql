ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES TO rootgame;
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO rootgame;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO rootgame;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO rootgame;

BEGIN;

CREATE TYPE enum_game_phase AS ENUM ('lobby', 'chooseFaction', 'setup', 'game', 'complete');
CREATE TYPE enum_assignment AS ENUM ('random', 'choose');
CREATE TYPE enum_faction AS ENUM ('marquise', 'eyrie', 'alliance', 'vagabond', 'vagabond2', 'cult', 'riverfolk', 'duchy', 'conspiracy', 'marquiseBot');
CREATE TYPE enum_game_map AS ENUM ('forest', 'winter', 'caves', 'lake');

CREATE TABLE games (
    name       VARCHAR(32) PRIMARY KEY,
    map        enum_game_map NOT NULL,
    assignment enum_assignment NOT NULL DEFAULT 'random',
    factions   enum_faction[] NOT NULL,
    phase      enum_game_phase NOT NULL DEFAULT 'lobby',
    created    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE players (
    game     VARCHAR(32) NOT NULL REFERENCES games (name),
    name     VARCHAR(32) NOT NULL,
    ready    BOOLEAN DEFAULT false,
    PRIMARY KEY (game, name)
);

CREATE TABLE marquise (
    game     VARCHAR(32) NOT NULL REFERENCES games (name),
    player   VARCHAR(32) NOT NULL,
    FOREIGN KEY (game, player) REFERENCES players (game, name)
);

COMMIT;
