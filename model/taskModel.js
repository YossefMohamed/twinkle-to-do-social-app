const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  title: {
    required: true,
    type: String,
    trim: true,
    minlength: 2,
  },
  description: {
    type: String,
    trim: true,
    minlength: 15,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

taskSchema.pre(/^find/, function (next) {
  this.find().select("-__v");

  next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
