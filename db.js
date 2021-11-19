const spicedPg = require("spiced-pg");
const dbUsername = "postgres";
const dbUserPassword = "postgres";
const database = "imgboard";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${dbUsername}:${dbUserPassword}@localhost:5432/${database}`
);

console.log("[db] connecting to:", database);

exports.getImages = () => {
    const q = `SELECT * FROM images
                ORDER BY id DESC
                LIMIT 3`;
    return db.query(q);
};

exports.addImages = ({ description, username, title, url }) => {
    const q = `INSERT INTO images (description, username, title, url)
                VALUES($1, $2, $3, $4)
                RETURNING *`;
    const params = [description, username, title, url];
    return db.query(q, params);
};

exports.addComments = ({ commentText, username, imageId }) => {
    const q = `INSERT INTO comments (comment_text, username, image_id)
                VALUES($1, $2, $3)
                RETURNING *`;
    const params = [commentText, username, imageId];
    return db.query(q, params);
};

exports.getImageById = (id) => {
    const q = `SELECT url, username, title, description,
                TO_CHAR(created_at, 'DD.MM.YY, HH24:MI') created_at 
                FROM images
                WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};

exports.getMoreImgs = (id) => {
    const q = `SELECT url, title, id, (
                    SELECT id FROM images
                    ORDER BY id ASC
                    LIMIT 1) AS "lowestId"
                FROM images
                WHERE id < $1
                ORDER BY id DESC
                LIMIT 3`;
    const params = [id];
    return db.query(q, params);
};

exports.getComments = (id) => {
    const q = `SELECT comment_text, username,
                TO_CHAR(created_at, 'DD.MM.YY, HH24:MI') created_at
                FROM comments
                WHERE image_id = $1`;
    const params = [id];
    return db.query(q, params);
};

exports.getAllImgIds = () => {
    const q = `SELECT id FROM images`;
    return db.query(q);
};
