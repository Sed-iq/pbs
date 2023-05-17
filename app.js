const express = require("express"),
  app = express(),
  dotenv = require("dotenv").config(),
  path = require("path"),
  cookie = require("cookie-parser"),
  mongoose = require("mongoose"),
  router = require(path.join(__dirname, "./modules/router"));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(cookie(process.env.SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + `/views`));
app.use(router);
app.get("/", (req, res) => res.send("running"));

mongoose
  .connect(process.env.DB)
  .then(() => {
    app.listen(process.env.PORT, console.log("running"));
  })
  .catch((err) => {
    throw err;
  });
