const express = require('express');
const path = require('path');
const PORT = 5001;
const app = express();

app.use(express.static(path.resolve(__dirname, "../")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../", "index.html"));
})

app.listen(PORT, () => {
    console.log("listening on port " + PORT);
})