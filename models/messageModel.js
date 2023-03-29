const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, default: '' },
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    }, 
    reply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages"
    },
    recommend: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    file: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Files'
      }
    ],
    time: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", messageSchema);