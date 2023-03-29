const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");

module.exports.addMessage = async (req, res, next) => {
    try {
        const { sender, message, receiver, reply } = req.body;

        const data = await messageModel.create({
            message: {
                text: message
            },
            sender: sender,
            receiver: receiver,
            reply: reply ? reply._id : null,
            time: Date.now()
        });
        console.log('ADD_MESSAGE :>> ', data);
        if (data) return res.json({ status: true, _id: data._id });
        return res.json({ status: false });

    } catch (err) {
        next(err);
    }
};

module.exports.removeMessage = async (req, res, next) => {
    if (req.params.id == 'all') {
        let result = await messageModel.remove();
        return res.json({ status: true });
    } else {
        messageModel.findByIdAndDelete(req.params.id, (err, docs) => {
            if (err) {
                return res.status(500).send({ error: "delete error " })
            }
            return res.status(200).send({ msg: true });
        })
    }
};

module.exports.recommendMessage = async (req, res, next) => {
    messageModel.findByIdAndUpdate(req.params.id, { recommend: true }, (err, docs) => {
        if (err) {
            return res.status(500).send({ error: "delete error " })
        }
        return res.status(200).send({ msg: true });
    })
};

module.exports.checkMessage = async (req, res, next) => {
    messageModel.findByIdAndUpdate(req.params.id, { checked: true }, (err, docs) => {
        if (err) {
            return res.status(500).send({ error: "delete error " })
        }
        return res.status(200).send({ msg: true });
    })
};

module.exports.updateMessage = async (req, res, next) => {
    const { message } = req.body;
    messageModel.findByIdAndUpdate(req.params.id, { message: { text: message } }, (err, docs) => {
        if (err) {
            return res.json({ status: false });
        }
        return res.json({ status: true });
    })
}

module.exports.getAllMessage = async (req, res, next) => {
    try {
        const { sender, receiver } = req.body;
        const messages = await messageModel.find({
            $or: [
                { $and: [{ 'sender': sender }, { 'receiver': receiver }] },
                { $and: [{ 'sender': receiver }, { 'receiver': sender }] }
            ]
        }).populate('reply').populate('file').limit(100).sort({ time: 1 });

        // const messages = await messageModel.find().limit(100).sort({ updatedAt: -1 });

        // const projectMessages = await Promise.all(messages.sort((a,b) => {
        //     return a.updatedAt.getTime() - b.updatedAt.getTime()
        // }).map(async(msg)=>{
        //     const user = await userModel.findOne({ '_id' : msg.sender})
        //     return{
        //         message: msg.message.text,
        //         sender: user,
        //         updatedAt: msg.updatedAt
        //     };
        // }));
        let options = { multi: true, upsert: true };

        await messageModel.updateMany({
            sender: sender, receiver: receiver
        }, { $set: { "checked": true } }, { multi: true });

        res.json(messages);
    } catch (error) {
        next(error);
    }
};

