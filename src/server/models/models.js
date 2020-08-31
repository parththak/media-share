const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const bcrypt = require("mongoose-bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    first_name: String,
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      bcrypt: true,
    },
    last_name: String,
    friends: [String],
  },
  { collection: "users" }
);

const lobbySchema = new Schema(
  {
    host_id: { type: String, required: [true, "Lobby host ID is required"] },
    host_username: {
      type: String,
      required: [true, "Lobby host name is required"],
    },
    name: { type: String, required: [true, "Lobby name is required"] },
    others_usernames: [String],
    others_sockets: [String],
    limit: { type: Number, required: [true, "Limit is required"] },
    categories: [String],
    url: {
      type: String,
      unique: true,
      required: [true, "Lobby url is required"],
    },
    access: { type: String, required: [true, "Lobby url is required"] },
    playlist: [String],
  },
  { collection: "lobbies", strict: true }
);

userSchema.plugin(timestamps); // creates timestamps for each field
userSchema.plugin(bcrypt);
lobbySchema.plugin(timestamps);

const User = mongoose.model("user", userSchema);

const Lobby = mongoose.model("lobby", lobbySchema);

module.exports = {
  User,
  Lobby,
};
