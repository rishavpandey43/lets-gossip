const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 6,
      maxlength: 50,
    },
    firstName: { type: String, required: true, minlength: 4 },
    lastName: { type: String, required: true, minlength: 4 },
    title: { type: String },
    aboutMe: { type: String },
    dob: { type: Date },
    phone: { type: Number },
    address: { type: String },
    verified: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(passportLocalMongoose);

const chatAppDB = mongoose.connection.useDb('chat_app_db');

const User = chatAppDB.model('User', userSchema);

module.exports = User;
