CREATE TABLE buildings (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    id          SMALLINT NOT NULL,
    building    enum_building NOT NULL,
    faction     enum_faction NOT NULL GENERATED ALWAYS AS (CASE
        WHEN building = 'base' THEN 'alliance'::enum_faction
        WHEN building = 'roost' THEN 'eyrie'::enum_faction
        WHEN building IN ('sawmill', 'workshop', 'recruiter') THEN 'marquise'::enum_faction
        WHEN building = 'garden' THEN 'cult'::enum_faction
        WHEN building IN ('citadel', 'market') THEN 'duchy'::enum_faction
    END) STORED,
    PRIMARY KEY (game, id),
    FOREIGN KEY (game, faction) REFERENCES factions (game, faction)
);

CREATE TABLE built_buildings (
    game        VARCHAR(32) NOT NULL REFERENCES games (name) ON DELETE CASCADE,
    building    SMALLINT NOT NULL,
    position    SMALLINT NOT NULL,
    PRIMARY KEY (game, building),
    FOREIGN KEY (game, building) REFERENCES buildings (game, id),
    FOREIGN KEY (game, position) REFERENCES clearings (game, position)
);

CREATE FUNCTION buildings_limited_by_slots_fn() RETURNS TRIGGER AS $$
DECLARE
    position INT;
    slots INT;
    buildings INT;
BEGIN
    SELECT c.position, c.slots, count(b.building) INTO position, slots, buildings
        FROM clearings c
        INNER JOIN built_buildings b ON c.game = b.game AND c.position = b.position
        WHERE c.game = NEW.game AND c.position = NEW.position
        GROUP BY c.game, c.position;
    IF slots < buildings THEN 
        RAISE EXCEPTION 'clearing % is full', position;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER buildings_limited_by_slots
    AFTER INSERT OR UPDATE
    ON built_buildings 
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
    EXECUTE PROCEDURE buildings_limited_by_slots_fn();
