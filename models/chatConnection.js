const mongoose = require("mongoose");
//Define a schema
const Schema = mongoose.Schema;
const chatConnectionSchema = new Schema({
  chatId: {
    type: String,
    trim: true,
  },
  requesterId: {
    type: String,
    trim: true,
    required: true
  },
  accepterId: {
    type: String,
    trim: true,
    required: true
  },
});
//hash user password before saving into database
chatConnectionSchema.pre("save", function(next) {
  next();
});
module.exports = mongoose.model("chatconnection", chatConnectionSchema);
