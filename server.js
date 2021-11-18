const express = require("express");
const app = express();

app.use(express.static("./public"));

app.use(express.json()); // this middleware helps us parse JSON format request bodies

const db = require("./db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    if (req.file) {
        const { username, title, description } = req.body;
        const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;
        db.addImages({ username, title, description, url })
            .then(({ rows }) => res.json(rows[0]))
            .catch((err) => console.log("error on addImages:", err));
    } else {
        res.json({
            success: false,
        });
    }
});

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

app.get("/image/:id", (req, res) => {
    const { id } = req.params;
    db.getImageById(id)
        .then(({ rows }) => {
            return res.json(rows[0]);
        })
        .catch((err) => {
            console.log("error sending current image to client", err);
            return res.sendStatus(500);
        });
});

app.get("/getmore/:id", (req, res) => {
    const { id } = req.params;
    db.getMoreImgs(id)
        .then(({ rows }) => {
            return res.json(rows);
        })
        .catch((err) => {
            console.log("error sending images to client: ", err);
            return res.sendStatus(500);
        });
});

app.get("/comments/:id", (req, res) => {
    const { id } = req.params;
    db.getComments(id)
        .then(({ rows }) => {
            return res.json(rows[0]);
        })
        .catch((err) => {
            console.log("error sending comments to client: ", err);
            return res.sendStatus(500);
        });
});

app.post("/comments.json", (req, res) => {
    const { commentText, username, imageId } = req.body;

    db.addComments({ commentText, username, imageId })
        .then(({ rows }) => res.json(rows[0]))
        .catch((err) => console.log("error on addComments:", err));
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
}); // sends over index.html

app.listen(8080, () => console.log(`I'm listening.`));
