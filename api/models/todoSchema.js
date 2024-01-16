const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  id: Number,
  task: String,
  completed: Boolean,
  day: String,
  tag: String,
  dayAdded: Number,
});

module.exports = mongoose.model("Todo", todoSchema);
