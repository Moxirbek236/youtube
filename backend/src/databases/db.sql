CREATE DATABASE homework_38;

\c homework_38;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL UNIQUE,
    avatar_url VARCHAR(1024) NOT NULL,
    socket_id VARCHAR(255) NOT NULL
);

CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(522) NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    avatar_url VARCHAR(1024) NOT NULL
);

CREATE TABLE message (
    id SERIAL PRIMARY KEY,
    user_id_from INT REFERENCES users(id) ON DELETE CASCADE,
    user_id_to INT REFERENCES users(id) ON DELETE CASCADE,
    message VARCHAR(1024) NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE,
    is_read BOOLEAN DEFAULT FALSE
);

UPDATE users SET socket_id = '1234567890' WHERE id = 1;
ALTER TABLE message ADD COLUMN type DEFAULT "plan/text";
ALTER TABLE videos ADD COLUMN created_at DATE DEFAULT CURRENT_DATE;