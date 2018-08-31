const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.post('/upload', (req, res) => {
    console.log(req.files);
    const uploadedFile = req.files.file;
    uploadedFile.mv(`${__dirname}/uploadedfiles/${req.body.filename}.${req.body.format}`, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("true");
    });
});
app.get('/', function () {
    console.log("hi")
});
app.listen(8000, () => {
    console.log('8000');
});