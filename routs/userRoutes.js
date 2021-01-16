const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../model/userModel");
const { auth } = require("./../control/auth");
const route = express.Router();
const sgMail = require("./../utiles/email");
const multer = require("multer");
const sharp = require("sharp");
// const storage = multer.diskStorage({
//   destination: (req, file, cd) => {
//     cd(null, "public/images");
//   },
//
// });


const upload = multer({
  fileFilter:  (req, file, cd) => {
    if (file.mimetype.startsWith("image")) {
      cd(null, true);
    } else {
      cd("Upload A Image !!");
    }
  },
  
});
route.get("/me", auth, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).populate({
      path: "tasks",
      select: "-__v",
    });
    if (!user) throw "Invalide Id";
    console.log(req.protocol);
    res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(404).json({ e });
  }
});
route.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    user.tasks = undefined;
    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(404).send("no");
    }
    console.log(user);
    const token = jwt.sign(user.id, "ThisIsMyKey");
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      //   secure : true ,
      //   httpOnly : true
    });
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(404).send({
      Error: e,
    });
  }
});
route.post("/user/signup", async (req, res) => {
  try {
    console.log(req.headers.host);
    const code = await crypto.randomBytes(32).toString("hex");
    req.body.code = code;
    const user = await User.create(req.body);
    sgMail.varMail(
      user.email,
      user.name,
      user.code,
      req.headers.host,
      req.protocol
    );
    const token = jwt.sign(user.id, "ThisIsMyKey");
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      //   secure : true ,
      //   httpOnly : true
    });
    user.password = undefined;
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

route.get("/user/:code", async (req, res) => {
  try {
    console.log(req.params);
    const user = await User.findOne({ code: req.params.code });
    if (!user) throw "not found !";
    user.verified = true;
    await user.save();
    res.status(200).send("verified");
  } catch (e) {
    res.status(404).send("not found");
  }
});
route.patch("/user", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    if (!user) throw "Anta 3abit Yasta ??";
    res.status(200).send(user);
  } catch (e) {
    res.status(404).send({ e });
  }
});
route.delete("/user", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) throw "Anta 3abit Yasta ??";
    res.status(200).send(user);
  } catch (e) {
    res.status(404).send({ e });
  }
});

route.post("/upload", auth, upload.single("image"), async (req, res, next) => {
  try {
    console.log(req.file);
    console.log(__dirname);
    if (!req.file) res.status(400).send("PLease upload an image !!");
    req.file.filename = `user-${req.user.id}.jpeg`;
    sharp(req.file.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 52 })
      .toFile(`public/images/${req.file.filename}`);
    req.user.image = req.file.filename;
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(404).send({ e });
  }
});

module.exports = route;
