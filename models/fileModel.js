const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
  {
    name: {
      type: String, 
      required: true
    },
    type: {
      type: Boolean,
      default: false,
    },
    time: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Files", fileSchema);