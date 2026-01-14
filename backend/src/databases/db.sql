CREATE DATABASE homework_38;

\c homework_38;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(1024)
);

CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(522) NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    avatar_url VARCHAR(1024) NOT NULL
);

ALTER TABLE users DROP COLUMN email;
ALTER TABLE users ADD COLUMN username VARCHAR(255) NOT NULL UNIQUE;
ALTER TABLE users DROP COLUMN created_at;
ALTER TABLE users ADD COLUMN created_at DATE DEFAULT CURRENT_DATE;
ALTER TABLE users DROP COLUMN full_name;
ALTER TABLE users ADD COLUMN full_name VARCHAR(255) NOT NULL UNIQUE;
-- ERROR:  column "full_name" of relation "users" contains null values

UPDATE users SET full_name = username WHERE full_name IS NULL;

-- LINE 1: UPDATE users SET full_name = username WHERE full_name IS NULL...

ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;

-- ERROR:  column "full_name" of relation "users" does not exist

-- I'm DROPED COLUMN full_name adn I will ADD it again

ALTER TABLE users ADD COLUMN full_name VARCHAR(255) NOT NULL UNIQUE;

-- ERROR:  column "full_name" of relation "users" contains null values

-- I will clean users TABLE

DELETE FROM users;

UPDATE users SET full_name = username WHERE full_name IS NULL;