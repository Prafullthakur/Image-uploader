const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const path = require('path');

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(res, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only');
    }
}

//Init path
const app = express();

const port = 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// Template engine
app.set('view engine', 'ejs');

// Public folder
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.render('index');
});

app.post('/uploads', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', { msg: err });
        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No File selected',
                })
            } else {
                res.render('index', {
                    msg: 'File uploaded',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    })
})