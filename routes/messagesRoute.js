const { addMessage, checkMessage, removeMessage, getAllMessage, recommendMessage, updateMessage } = require("../controllers/messagesController");


const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.delete("/removemsg/:id", removeMessage);
router.post("/recommend/:id", recommendMessage);
router.post("/update/:id", updateMessage);
router.post("/getmsg/", getAllMessage);
router.post("/checkmsg/:id", checkMessage);



module.exports = router;
