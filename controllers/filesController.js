const fileModel = require("../models/fileModel");
const messageModel = require("../models/messageModel");

module.exports.addFile = async (req, res, next) => {
    try {
        const name = req.file.originalname;
        const file = await fileModel.create({
            name: name,
            type: true,
            time: Date.now()
        });

        if (file) {
            messageModel.findById(req.body.id, function (err, msg) {
                if (err) {
                    return res.status(500).send({ error: "file save error" })
                }
                else {
                    console.log("File pushing", file._id);
                    msg.file.push(file._id);
                    msg.save();
                    return res.status(200).send({});
                }
            })
        }
    } catch (err) {
        next(err);
    }
};

module.exports.removeFile = async (req, res, next) => {
};
