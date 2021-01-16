const mongoose = require("mongoose");
const express = require("express");
const app = express();
var morgan = require("morgan");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routs/userRoutes");
const taskRoutes = require("./routs/taskRoutes");
const { auth } = require("./control/auth")

require("dotenv").config({
  path: `${__dirname}/config/dev.env`,
});
mongoose.connect(
  "mongodb://localhost:27017/taskApp",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  console.log("Database Has Been Connected")
);
app.use(express.static("public"));
console.log(process.env.USER);
app.set("view engine", "pug");
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(userRoutes);
app.use(taskRoutes);

app.get("/home", async (req, res) => {
  res.status(200).render("home");
});
app.use( auth )
app.get("/login",async (req, res) => {
  res.status(200).render("login");
});
const port = 3000;

const server = app.listen(port, () => {
  console.log("listining");
});
