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
                ORDER BY id DESC`;
    return db.query(q);
};

exports.addImages = ({ description, username, title, url }) => {
    const q = `INSERT INTO images (description, username, title, url)
                VALUES($1, $2, $3, $4)
                RETURNING *`;
    const params = [description, username, title, url];
    return db.query(q, params);
};
