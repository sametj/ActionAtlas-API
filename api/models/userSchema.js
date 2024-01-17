const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
  id: Number,
  email: String,
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

//hasing password
userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

//validating password
userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

module.exports = mongoose.model("User", userSchema);
