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
    // If nothing went wrong the file is already in the uploads directory
    // once it's successfully in the cloud, we want to add a new image to the database.
    // you will want to store the url an image can be accassed at. plus the other three input field values
    // url we'll need to compose
    // username, title and description we'll get form the req.body
    // once we've added all info to the database, we want to send back the newly uploaded image
    if (req.file) {
        res.json({
            success: true,
        });
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

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
}); // sends over index.html

app.listen(8080, () => console.log(`I'm listening.`));
