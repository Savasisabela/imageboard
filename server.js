const express = require("express");
const app = express();
const db = require("./db.js");

app.use(express.static("./public"));

app.use(express.json()); // this middleware helps us parse JSON format request bodies

app.get("/images.json", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            return res.json(rows);
        })
        .catch((err) => {
            console.log("error sending images to client: ", err);
            return res.sendStatus(500);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
}); // sends over index.html

app.listen(8080, () => console.log(`I'm listening.`));
