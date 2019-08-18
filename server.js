const express = require("express");
const sqlite = require('sqlite');
const bcrypt = require('bcrypt')
const Promise = require('bluebird');
const app = express();
const bodyParser = require('body-parser')
const debug = process.env.NODE_ENV !== "production";
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');

app.set("port", process.env.PORT || 3001);
app.set('trust proxy', 1)
app.use(bodyParser.json())
app.use(session({
    store: new SQLiteStore,
    secret: process.env.SESSION_SECRET || "de kat krabt de krullen van de trap",
    cookie: {
        maxAge: 3600000 * 24 * 90,
        secure: false, //!debug TODO: setup HTTPS then uncomment this
    },
    resave: false,
    saveUninitialized: true,
}))
app.use(function(req, res, next) {
    if(debug) {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000")
        res.header('Access-Control-Allow-Credentials', true)
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }

    next()
})

if (!debug) {
    app.use(express.static(path.join(__dirname, 'client/build')))
}

const dbPromise = Promise.resolve()
    .then(() => sqlite.open('./database.sqlite', { Promise }))
    .then(db => db.migrate({
        force: debug ? 'last' : false,
    }))

app.get('/session', (req, res) => {
    res.json(req.session.user || false)
})

app.post('/login', async(req, res) => {
    const db = await dbPromise;
    let user = await db.get('SELECT * FROM users WHERE username = ?', [req.body.username])
    if (!user) {
        return res.json(false)
    }

    let passwordMatches = await bcrypt.compare(req.body.password, user.password)
    if (!passwordMatches) {
        return res.json(false)
    }

    delete user.password
    req.session.user = user
    res.json(user)
});

app.post('/register', async(req, res) => {
    const db = await dbPromise;
    let passwordHash = await bcrypt.hash(req.body.password, 10)
    let result = await db.run('INSERT INTO users(username, password) VALUES(?, ?)', [req.body.username, passwordHash])
    let user = await db.get('SELECT * FROM users WHERE id = ?', result.lastID)
    delete user.password
    req.session.user = user
    res.json(user)
});

app.get("/activities", async (req, res) => {
    const db = await dbPromise

    let data;
    if (req.query.feed) {
        data = await db.all('SELECT a.*, u.username FROM activities a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.id DESC', [])
    } else {
        data = await db.all('SELECT a.*, u.username FROM activities a LEFT JOIN users u ON a.user_id = u.id WHERE user_id = ? ORDER BY a.id DESC', [ req.session.user.id ])
    }
    res.json(data)
});

app.post("/activities", async (req, res) => {
    const db = await dbPromise;
    const result = await db.run('INSERT INTO activities(user_id, repetitions) VALUES(?, ?)', [req.session.user.id, req.body.repetitions])
    const data = await db.get('SELECT * FROM activities WHERE id = ?', result.lastID)
    res.json(data)
});

app.get('/stats', async (req, res) => {
	const db = await dbPromise;
	let week = await db.get('SELECT SUM(a.repetitions) AS total, ROUND(AVG(a.repetitions)) AS average, MAX(a.repetitions) AS biggest FROM activities a WHERE timestamp > date("now", "-7 days") AND a.user_id = ?', req.session.user.id)
	let month = await db.get('SELECT SUM(a.repetitions) AS total, ROUND(AVG(a.repetitions)) AS average, MAX(a.repetitions) AS biggest FROM activities a WHERE timestamp > date("now", "-30 days") AND a.user_id = ?', req.session.user.id)
	let year = await db.get('SELECT SUM(a.repetitions) AS total, ROUND(AVG(a.repetitions)) AS average, MAX(a.repetitions) AS biggest FROM activities a WHERE timestamp > date("now", "-365 days") AND a.user_id = ?', req.session.user.id)

	res.json({
		week, month, year
	})
});

if (!debug) {
    app.get('*', (req,res) =>{
        res.sendFile(path.join(__dirname+'/client/build/index.html'));
    });
}

app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
