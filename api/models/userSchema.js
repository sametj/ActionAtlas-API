const mongoose = require("mongoose");
const todoSchema = require("./todoSchema");

const userSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String,
  todos: [
    new mongoose.Schema({
      id: Number,
      task: String,
      completed: Boolean,
      day: String,
      tag: String,
      dayAdded: Number,
    }),
  ],
});

module.exports = mongoose.model("User", userSchema);
