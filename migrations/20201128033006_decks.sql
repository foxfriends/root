CREATE TYPE enum_deck AS ENUM('standard', 'exiles_and_partisans');
ALTER TABLE games ADD COLUMN deck enum_deck NOT NULL DEFAULT 'standard';
