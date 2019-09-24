const debug = process.env.NODE_ENV !== "production";
const express = require("express");
const sqlite = require('sqlite');
const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const randomstring = require("randomstring");
const morgan = require('morgan')

const app = express();

app.set("port", process.env.PORT || 3001);
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(session({
    store: new SQLiteStore,
    secret: process.env.SESSION_SECRET || "de kat krabt de krullen van de trap",
    cookie: {
        maxAge: 3600000 * 24 * 90,
        secure: !debug
    },
    resave: false,
    saveUninitialized: true,
}));

const catcher = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(err => next(err));
};

const dbPromise = Promise.resolve()
    .then(() => sqlite.open('./database.sqlite', { Promise }))
    .then(db => db.migrate());

app.use(function(req, res, next) {
    if(debug) {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header('Access-Control-Allow-Credentials', true);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }

    next()
});

if (!debug) {
    // static files (otherwise served by livereload)
    app.use(express.static(path.join(__dirname, 'web/build')))
} else {
    // convenient request logger
    app.use(morgan('dev'));
}

app.get('/api/session', (req, res) => {
    res.json(req.session.user || false)
});

app.post('/api/login', catcher(async(req, res) => {
    const db = await dbPromise;
    let user = await db.get('SELECT * FROM users WHERE LOWER(username) = ? LIMIT 1', [req.body.username.toLowerCase()]);
    if (!user) {
        return res.json(false)
    }

    let passwordMatches = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatches) {
        return res.json(false)
    }

    // create auth token
    if (!user.token) {
        user.token = randomstring.generate(255);
        await db.run('UPDATE users SET token = ? WHERE id = ?', [user.token, user.id]);
    }

    delete user.password;
    req.session.user = user;
    res.json(user)
}));

app.post('/api/register', catcher(async(req, res) => {
    const db = await dbPromise;

    // "email" is name of honeypot field.
    if (req.body.email) {
        return res.json({ error: "You seem to be a bot. Request denied, sorry."});
    }

    const username = req.body.username.trim();
    let exists = await db.get('SELECT * FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1', username);
    if (exists) {
        return res.json({ error: "That username is taken, sorry."})
    }

    let passwordHash = await bcrypt.hash(req.body.password, 10);
    let result = await db.run('INSERT INTO users(username, password, token) VALUES(?, ?, ?)', [username, passwordHash, randomstring.generate(255)]);
    let user = await db.get('SELECT * FROM users WHERE id = ?', result.lastID);
    delete user.password;
    req.session.user = user;
    res.json(user)
}));

app.get("/api/users/:id", catcher(async (req, res) => {
    const db = await dbPromise;
    let user_id = parseInt(req.params.id);
    let data = await db.get('SELECT u.id, u.username, u.created_at, u.updated_at FROM users u WHERE u.id = ?', [ user_id ]);
    res.json({ user: data });
}));

app.get("/api/activities", catcher(async (req, res) => {
    const db = await dbPromise;
    let data;
    const user_id = parseInt(req.query.user_id);
    const limit = parseInt(req.query.limit) || 50;
    if (req.query.user_id > 0) {
		data = await db.all(`SELECT a.*, u.username FROM activities a LEFT JOIN users u ON a.user_id = u.id WHERE user_id = ? AND a.timestamp > date('now', '-7 days') ORDER BY a.id DESC LIMIT ${limit}`, [ user_id ])
	} else {
		data = await db.all(`SELECT a.*, u.username FROM activities a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.id DESC LIMIT ${limit}`, [])
    }
    res.json(data)
}));

app.post("/api/activities", catcher(async (req, res) => {
    const db = await dbPromise;
    const user_id = req.body.user_id ? parseInt(req.body.user_id) : parseInt(req.session.user.id);
    const repetitions = parseInt(req.body.repetitions);
    const result = await db.run('INSERT INTO activities(user_id, repetitions) VALUES(?, ?)', [user_id, repetitions]);
    const data = await db.get('SELECT * FROM activities WHERE id = ?', result.lastID);
    res.json(data)
}));

app.delete("/api/activities/:id", catcher(async (req, res) => {
    const db = await dbPromise;
    const id = parseInt(req.params.id);
    await db.run('DELETE FROM activities WHERE id = ?', [id]);
    res.json(true)
}));

app.get('/api/v1/stats/:id', catcher(async (req, res) => {
    const db = await dbPromise;
    const id = parseInt(req.params.id);
    let data = await db.all('SELECT SUM(a.repetitions) AS `total`, COUNT(*) as `sets`, MAX(a.repetitions) AS `max`, date(a.timestamp) AS `date` FROM activities a WHERE a.user_id = ? GROUP by date(a.timestamp)', [id]);
    res.json(data)
}));

app.get('/api/stats/:id', catcher(async (req, res) => {
    const createSql = (dateModifier) => `SELECT SUM(a.repetitions) AS total, ROUND(AVG(a.repetitions)) AS average, MAX(a.repetitions) AS biggest FROM activities a WHERE timestamp > date("now", "${dateModifier}") AND a.user_id = ?`;
    const db = await dbPromise;
    let week = await db.get(createSql('-7 days'), req.params.id);
    let month = await db.get(createSql('-30 days'), req.params.id);
    let year = await db.get(createSql('-365 days'), req.params.id);
    let perDay = await db.all('SELECT SUM(a.repetitions) AS total, ROUND(AVG(a.repetitions)) AS average, MAX(a.repetitions) AS biggest, date(a.timestamp) AS `date` FROM activities a WHERE timestamp > date("now", "-365 days") AND a.user_id = ? GROUP by date(a.timestamp)', req.params.id);
    res.json({week, month, year, perDay})
}));

app.get('/api/leaderboard', catcher(async (req, res) => {
    const db = await dbPromise;
    let sortBy = req.query.sortBy === 'max' ? 'max' : 'total';
    let start = parseInt(req.query.after);
    let end = parseInt(req.query.before || +new Date());
    let data = await db.all(`SELECT u.id, u.username, SUM(a.repetitions) AS total, ROUND(AVG(a.repetitions)) AS average, MAX(a.repetitions) AS max FROM users u LEFT JOIN activities a ON a.user_id = u.id AND a.timestamp > datetime(?, 'unixepoch') AND a.timestamp < datetime(?, 'unixepoch') GROUP BY u.id ORDER BY ${sortBy} DESC`, [start, end])
    res.json(data);
}));

if (!debug) {
    app.get('*', (req,res) =>{
        res.sendFile(path.join(__dirname+'/web/build/index.html'));
    });
}

app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
