-- Up

ALTER TABLE users RENAME TO users_old;
CREATE TABLE users(
    id INTEGER PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL DEFAULT '',
    token VARCHAR(255) UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users (id, username, password, created_at, updated_at) SELECT id, username, password, created_at, updated_at FROM users_old;

-- Down

ALTER TABLE users RENAME TO users_old;
CREATE TABLE users(
                      id INTEGER PRIMARY KEY,
                      username VARCHAR(255) NOT NULL UNIQUE,
                      password VARCHAR(255) NOT NULL DEFAULT '',
                      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users (id, username, password, created_at, updated_at) SELECT id, username, password, token, created_at, updated_at FROM users_old;