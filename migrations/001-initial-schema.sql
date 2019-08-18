-- Up

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    repetitions INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO users(username, password) VALUES('danny', '$2b$10$MA89pFh3ej6ZjA35muLjvejuDgF9XwVJcj2k/31GagDw4DNp/28yi');
INSERT INTO users(username, password) VALUES('johndoe', '$2b$10$MA89pFh3ej6ZjA35muLjvejuDgF9XwVJcj2k/31GagDw4DNp/28yi');


-- Down
DROP TABLE users;
DROP TABLE activities;
