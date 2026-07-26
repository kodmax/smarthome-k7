ALTER TABLE documents
  ADD COLUMN source_hash varchar(64) NULL AFTER hash;
