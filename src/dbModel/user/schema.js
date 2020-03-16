const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true
    }
  },
  // TODO: find out what these 2 options do
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    },
    timestamps: true
  }
);

userSchema.index({
  userId: 1
});

module.exports = mongoose.model("User", userSchema);
