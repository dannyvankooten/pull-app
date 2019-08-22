const debug = process.env.NODE_ENV !== "production";
const express = require("express");
const sqlite = require('sqlite');
const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
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
    app.use(express.static(path.join(__dirname, 'client/build')))
}

app.get('/api/session', (req, res) => {
    res.json(req.session.user || false)
});

app.post('/api/login', catcher(async(req, res) => {
    const db = await dbPromise;
    let user = await db.get('SELECT * FROM users WHERE username = ?', [req.body.username]);
    if (!user) {
        return res.json(false)
    }

    let passwordMatches = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatches) {
        return res.json(false)
    }

    delete user.password;
    req.session.user = user;
    res.json(user)
}));

app.post('/api/register', catcher(async(req, res) => {
    const db = await dbPromise;
    let exists = await db.get('SELECT * FROM users WHERE username = ?', req.body.username.toLowerCase());
    if (exists) {
        return res.json({ error: "That username is taken, sorry."})
    }

    let passwordHash = await bcrypt.hash(req.body.password, 10);
    let result = await db.run('INSERT INTO users(username, password) VALUES(?, ?)', [req.body.username, passwordHash]);
    let user = await db.get('SELECT * FROM users WHERE id = ?', result.lastID);
    delete user.password;
    req.session.user = user;
    res.json(user)
}));

app.get("/api/users/:id", catcher(async (req, res) => {
    const db = await dbPromise;
    let data = await db.get('SELECT u.id, u.username, u.created_at, u.updated_at FROM users u WHERE u.id = ?', [ req.params.id ]);
    res.json({ user: data });
}));

app.get("/api/activities", catcher(async (req, res) => {
    const db = await dbPromise;
    let data;
    if (req.query.feed) {
        data = await db.all('SELECT a.*, u.username FROM activities a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.id DESC', [])
    } else {
        data = await db.all('SELECT a.*, u.username FROM activities a LEFT JOIN users u ON a.user_id = u.id WHERE user_id = ? ORDER BY a.id DESC', [ req.session.user.id ])
    }
    res.json(data.splice(0, req.query.limit || data.length))
}));

app.post("/api/activities", catcher(async (req, res) => {
    const db = await dbPromise;
    const result = await db.run('INSERT INTO activities(user_id, repetitions) VALUES(?, ?)', [req.session.user.id, req.body.repetitions]);
    const data = await db.get('SELECT * FROM activities WHERE id = ?', result.lastID);
    res.json(data)
}));

app.delete("/api/activities/:id", catcher(async (req, res) => {
    const db = await dbPromise;
    await db.run('DELETE FROM activities WHERE user_id = ? AND id = ?', [req.session.user.id, req.params.id]);
    res.json(true)
}));

app.get('/api/stats/:id', catcher(async (req, res) => {
	const createSql = (dateModifier) => `SELECT SUM(a.repetitions) AS total, ROUND(AVG(a.repetitions)) AS average, MAX(a.repetitions) AS biggest FROM activities a WHERE timestamp > date("now", "${dateModifier}") AND a.user_id = ?`;
	const db = await dbPromise;
	let week = await db.get(createSql('-7 days'), req.params.id);
	let month = await db.get(createSql('-30 days'), req.params.id);
	let year = await db.get(createSql('-365 days'), req.params.id);
	let perDay = await db.all('SELECT SUM(a.repetitions) AS total, ROUND(AVG(a.repetitions)) AS average, MAX(a.repetitions) AS biggest, date(a.timestamp) AS `date` FROM activities a WHERE timestamp > date("now", "-365 days") AND a.user_id = ? GROUP by date(a.timestamp)', req.params.id)
	res.json({week, month, year, perDay})
}));

app.get('/api/leaderboard', catcher(async (req, res) => {
    const db = await dbPromise;
    let data = await db.all('SELECT u.id, u.username, SUM(a.repetitions) AS total, ROUND(AVG(a.repetitions)) AS average, MAX(a.repetitions) AS biggest FROM users u LEFT JOIN activities a ON a.user_id = u.id AND a.timestamp > datetime(?, \'unixepoch\') GROUP BY u.id ORDER BY total DESC', req.query.after)
    res.json(data);
}));

if (!debug) {
    app.get('*', (req,res) =>{
        res.sendFile(path.join(__dirname+'/client/build/index.html'));
    });
}

app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
