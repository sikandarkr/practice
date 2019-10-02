const mongoose = require("mongoose");
const saltRounds = 10;
//Define a schema
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  userId: {
    type: String,
    trim: true,
    required: true
  },
  commentId: {
    type: String,
    trim: true,
    required: true
  },
  commenterUserId: {
    type: String,
    trim: true,
    required: true
  },
  comment: {
    type: String,
    trim: true,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
});
UserSchema.pre("save", function(next) {
  next();
});
module.exports = mongoose.model("review", UserSchema);
