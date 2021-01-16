const express = require("express");
const Task = require("./../model/taskModel");
const route = express.Router();
const { auth } = require("./../control/auth");
route.post("/task", auth, async (req, res) => {
  try {
    if (!req.body.user) {
      req.body.user = req.user._id;
    }
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (e) {
    res.status(500).send({ Error: e });
  }
});

route.get("/home", async (req, res) => {
  try {
    const tasks = await Task.find({
      user: "5f81fb20d224c748704af7c0",
    }).populate({
      path: "user",
      select: "name email",
    });
    res.status(200).render("home", { tasks });
  } catch (e) {
    res.status(500).send({ Error: e });
  }
});

route.patch("/tasks/:id", auth, async (req, res) => {
  try {
    console.log(req.params.id, "\t", req.user._id, req.body);
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) {
      throw "Unable to Find !";
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(404).json({ Error: e });
  }
});

route.delete("/tasks/:id", auth, async (req, res) => {
  try {
    console.log(req.params.id, "\t", req.user._id, req.body);
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) {
      throw "Unable to Find !";
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(404).json({ Error: e });
  }
});

module.exports = route;
