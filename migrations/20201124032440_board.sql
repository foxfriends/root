CREATE TABLE positions (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    id          SMALLINT NOT NULL,
    PRIMARY KEY (game, id)
);

CREATE TABLE clearings (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    position    SMALLINT NOT NULL,
    suit        enum_suit NOT NULL CHECK (suit <> 'bird'),
    slots       SMALLINT NOT NULL,
    FOREIGN KEY (game, position) REFERENCES positions (game, id),
    PRIMARY KEY (game, position)
);

CREATE TABLE forests (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    position    SMALLINT NOT NULL,
    FOREIGN KEY (game, position) REFERENCES positions (game, id),
    PRIMARY KEY (game, position)
);

CREATE TABLE water (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    clearing    SMALLINT NOT NULL,
    FOREIGN KEY (game, clearing) REFERENCES clearings (game, position),
    PRIMARY KEY (game, clearing)
);

CREATE TABLE ferry (
    game        VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    clearing    SMALLINT NOT NULL,
    FOREIGN KEY (game, clearing) REFERENCES water (game, clearing)
);

CREATE TABLE tower (
    game        VARCHAR(32) PRIMARY KEY REFERENCES games (name) ON DELETE CASCADE,
    clearing    SMALLINT NOT NULL,
    FOREIGN KEY (game, clearing) REFERENCES clearings (game, position)
);

CREATE TABLE connections (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    position_a  SMALLINT NOT NULL,
    position_b  SMALLINT NOT NULL,
    closed      BOOLEAN NOT NULL DEFAULT false,
    CHECK (position_a < position_b),
    FOREIGN KEY (game, position_a) REFERENCES positions (game, id),
    FOREIGN KEY (game, position_b) REFERENCES positions (game, id),
    PRIMARY KEY (game, position_a, position_b)
);

CREATE TABLE rivers (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    position_a  SMALLINT NOT NULL,
    position_b  SMALLINT NOT NULL,
    CHECK (position_a < position_b),
    FOREIGN KEY (game, position_a) REFERENCES water (game, clearing),
    FOREIGN KEY (game, position_b) REFERENCES water (game, clearing),
    PRIMARY KEY (game, position_a, position_b)
);
