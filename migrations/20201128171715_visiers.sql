ALTER TABLE eyrie_decree ALTER COLUMN card DROP NOT NULL;

CREATE FUNCTION two_eyrie_visiers_fn() RETURNS TRIGGER AS $$
DECLARE
    visiers INT;
BEGIN
    SELECT count(*) INTO visiers 
        FROM eyrie_decree d
        WHERE game = NEW.game
        AND card IS NULL;

    IF visiers > 2 THEN 
        RAISE EXCEPTION 'decree can only contain two visiers';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER two_eyrie_visiers
    AFTER INSERT OR UPDATE
    ON eyrie_decree 
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
    WHEN (NEW.card IS NULL)
    EXECUTE PROCEDURE two_eyrie_visiers_fn();
