const express = require('express');
const app = express();
const cors = require('cors');
const data = require('./db');
const path = require('path');
const PORT = 5001;

//middlewear
app.use(express.static(path.resolve(__dirname, "../")));
app.use('/highscore', express.json());
app.use('/highscore', cors());

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../", "index.html"));
})

//get global highscore
app.get('/highscore/:name', async (req, res) => {
    try {
        const {name} = req.params
        const highscore = await data.query("SELECT * FROM highscores h WHERE h.game_title = $1", [name]);
        res.json(highscore.rows);
        console.log(highscore)
    } catch (err) {
        console.log(err.message);
        res.json(err.message);
    }
})

//set new game highscore
app.post('/highscore/:name', async (req, res) => {
    try {
        const {name} = req.params;
        const {value} = req.body;
        const newHighscore = await data.query("INSERT INTO highscores (highscore_value, game_name) VALUES($1, $2) RETURNING *", [value, name]);
        res.json(newHighscore.rows);
    } catch (err) {
        console.log(err.message);
        res.json(err.message);
    }
})
//update global highscore
app.put('/highscore/:name', async (req, res) => {
    try {
        const {name} = req.params;
        const {value} = req.body;
        const newHighscore = await data.query("UPDATE highscores SET highscore_value = $1 WHERE game_title=$2 RETURNING *", [value, name]);
        res.json(newHighscore.rows);
    } catch (err) {
        console.log(err.message);
        res.json(err.message);
    }
})

app.listen(PORT, () => {
    console.log("listening on port " + PORT);
})