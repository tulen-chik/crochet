CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT,
  author TEXT,
  text TEXT,
  time TEXT,
  votes INTEGER,
  comments INTEGER
);

CREATE TABLE IF NOT EXISTS communities (
  name TEXT PRIMARY KEY,
  members TEXT,
  online INTEGER
);

CREATE TABLE IF NOT EXISTS embroidery_schemes (
  id SERIAL PRIMARY KEY,
  title TEXT,
  tags TEXT,
  image TEXT,
  difficulty TEXT,
  description TEXT,
  materials JSONB,
  instructions JSONB
);

CREATE TABLE IF NOT EXISTS crochet_schemes (
  id SERIAL PRIMARY KEY,
  title TEXT,
  colors TEXT,
  image TEXT,
  description TEXT,
  instructions JSONB
);
