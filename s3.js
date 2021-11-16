const aws = require("aws-sdk");
const { AWS_KEY, AWS_SECRET } = require("./secrets");

const fs = require("fs");

const s3 = new aws.S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
}); // is an instance of an AWS user _> it's yet another object, eith methods on it. and it will alow us to communicate with AWS S3

exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("no file on server");
        // no file on request, means sth went wrong with multer, and since there is nothing to upload we should let the client side know and end the function
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;
    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            console.log("image is in the cloud ☁");
            // once the image is in the cloud I don't need to store it in uploads anymore
            next();
            fs.unlink(path, () => {
                console.log("file removed");
            });
        })
        .catch((err) => {
            console.log("error with cloud upload:", err);
            return res.sendStatus(500);
        });
};
