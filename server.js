const express = require("express");
const sqlite = require('sqlite');
const Promise = require('bluebird');
const app = express();
const bodyParser = require('body-parser')
const debug = process.env.NODE_ENV !== "production";

app.set("port", process.env.PORT || 3001);
app.use(bodyParser.json())
app.use(function(req, res, next) {
    if(debug) {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header('Access-Control-Allow-Credentials', true);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
});

if (!debug) {
    app.use(express.static("client/build"));
}

const dbPromise = Promise.resolve()
    .then(() => sqlite.open('./database.sqlite', { Promise }))
    .then(db => db.migrate({
        force: debug ? 'last' : false,
    }));

app.get("/users", async (req, res) => {
    const db = await dbPromise;
    const data = await db.all('SELECT * FROM users');
    res.json(data)
});

app.get("/activities", async (req, res) => {
    const db = await dbPromise;
    const data = await db.all('SELECT * FROM activities ORDER BY id DESC');
    res.json(data)
});

app.post("/activities", async (req, res) => {
    const db = await dbPromise;
    const result = await db.run('INSERT INTO activities(user_id, repetitions) VALUES(?, ?)', [1, req.body.repetitions])
    const data = await db.get('SELECT * FROM activities WHERE id = ?', result.lastID)
    res.json(data)
});

app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
