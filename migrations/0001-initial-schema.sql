-- Up

CREATE TABLE users (
                       id INTEGER PRIMARY KEY,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL DEFAULT '',
                       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (
                            id INTEGER PRIMARY KEY,
                            user_id INTEGER NOT NULL,
                            repetitions INTEGER NOT NULL,
                            timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO users(username, password) VALUES('danny', '$2b$10$MA89pFh3ej6ZjA35muLjvejuDgF9XwVJcj2k/31GagDw4DNp/28yi');
INSERT INTO users(username, password) VALUES('johndoe', '$2b$10$MA89pFh3ej6ZjA35muLjvejuDgF9XwVJcj2k/31GagDw4DNp/28yi');

INSERT INTO activities(user_id, repetitions, timestamp) VALUES (1, 3, datetime('now', '-50 days')),
                                                               (1, 5, datetime('now', '-50 days')),
                                                               (1, 7, datetime('now', '-50 days')),
                                                               (1, 3, datetime('now', '-45 days')),
                                                               (1, 2, datetime('now', '-45 days')),
                                                               (1, 1, datetime('now', '-45 days')),
                                                               (1, 3, datetime('now', '-41 days')),
                                                               (1, 3, datetime('now', '-41 days')),
                                                               (1, 4, datetime('now', '-41 days')),
                                                               (1, 5, datetime('now', '-41 days')),
                                                               (1, 7, datetime('now', '-36 days')),
                                                               (1, 7, datetime('now', '-36 days')),
                                                               (1, 4, datetime('now', '-32 days')),
                                                               (1, 4, datetime('now', '-32 days')),
                                                               (1, 4, datetime('now', '-31 days')),
                                                               (1, 4, datetime('now', '-31 days')),
                                                               (1, 4, datetime('now', '-31 days')),
                                                               (1, 3, datetime('now', '-31 days')),
                                                               (1, 4, datetime('now', '-30 days')),
                                                               (1, 4, datetime('now', '-30 days')),
                                                               (1, 4, datetime('now', '-30 days')),
                                                               (1, 4, datetime('now', '-30 days')),
                                                               (1, 2, datetime('now', '-25 days')),
                                                               (1, 8, datetime('now', '-20 days')),
                                                               (1, 9, datetime('now', '-20 days')),
                                                               (1, 3, datetime('now', '-15 days')),
                                                               (1, 3, datetime('now', '-15 days')),
                                                               (1, 12, datetime('now', '-10 days')),
                                                               (1, 10, datetime('now', '-10 days')),
                                                               (1, 10, datetime('now', '-8 days')),
                                                               (1, 3, datetime('now', '-7 day')),
                                                               (1, 4, datetime('now', '-2 days')),
                                                               (1, 5, datetime('now', '-2 days')),
                                                               (1, 5, datetime('now', '-2 days')),
                                                               (1, 5, datetime('now', '-1 day')),
                                                               (1, 5, datetime('now', '-1 day')),
                                                               (1, 6, datetime('now', '-3 minutes')),
                                                               (1, 6, datetime('now', '-2 minutes')),
                                                               (1, 6, datetime('now', '-1 minute'));

-- Down
DROP TABLE users;
DROP TABLE activities;
