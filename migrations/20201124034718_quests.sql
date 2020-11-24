CREATE TABLE quests (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    id          SMALLINT NOT NULL,
    quest       enum_quest NOT NULL,
    suit        enum_suit NOT NULL,
    PRIMARY KEY (game, id)
);

CREATE TABLE active_quests (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    quest       SMALLINT NOT NULL,
    PRIMARY KEY (game, quest),
    FOREIGN KEY (game, quest) REFERENCES quests (game, id)
);

CREATE TABLE completed_quests (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    quest       SMALLINT NOT NULL,
    faction     enum_faction NOT NULL,
    PRIMARY KEY (game, quest),
    FOREIGN KEY (game, faction) REFERENCES vagabond (game, faction),
    FOREIGN KEY (game, quest) REFERENCES quests (game, id)
);
