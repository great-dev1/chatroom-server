const multer  = require('multer')
var storage = multer.diskStorage(
    {
        destination: './public/uploads',
        filename: function (req, file, cb ) {
            cb( null, file.originalname);
        }
    }
);
const upload = multer({ storage: storage });
const router = require("express").Router();
const { addFile } = require("../controllers/filesController");

router.post("/upload", upload.single('myFile'), addFile);

module.exports = router;
