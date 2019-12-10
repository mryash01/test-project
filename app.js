const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const app = express();
const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });



aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: 'us-east-1'
});

let s3 = new aws.S3();

app.use(bodyParser.json());

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});

//open in browser to see upload form
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/indexS3.html');//indexS3.html is inside node-cheat
});

//use by upload form
app.post('/upload', upload.array('upl', 1), function (req, res, next) {
    res.send("Uploaded!");
});

app.get('/listS3', function (req, res) {
    var params = {
        Bucket: process.env.BUCKET_NAME2,
        Delimiter: '/',
        Prefix: process.env.BUCKET_PREFIX
    }

    s3.listObjects(params, function (err, data) {
        if (err) throw err;
        res.status(200).json({
            status: 'success',
            data: {
                data
            }
        })
    });

})







var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        // callback(null, file.fieldname + '-' + Date.now());
        callback(null, file.originalname);
    }
});
var upload = multer({ storage: storage }).single('userFile');

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post('/api/file', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

app.get('/systemfiles', function (req, res) {

    const directoryPath = path.join(__dirname, 'uploads');

    fs.readdir(directoryPath, function (err, files) {
        if (err)
            throw err;
        let filelist = [];
        let filelist2 = [];
        for (var index in files) {
            filelist.push(files[index])

        }
        filelist.forEach(function (file) {
            var stats = fs.statSync(directoryPath + `/${file}`)
            // console.log(file, stats.ctime)
            filelist2.push(file + "  Created Time:-  " + stats.ctime + "  Modified Time:-  " + stats.mtime)
        })
        // console.log(filelist2)
        res.status(200).json({
            status: 'success',
            filelist2
        })


    });


})



module.exports = app;