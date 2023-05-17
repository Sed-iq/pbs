const express = require("express"),
  flash = require("express-flash"),
  session = require("express-session"),
  app = express(),
  auth = require("./auth"),
  home = require("./home");
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.get("/", (req, res) => res.send("running"));
app.use(flash());
app.get("/", auth.isLogin, home);
app.get("/login", auth.isLogin, (req, res) => {
  const error = req.flash("message");
  res.render("accounts", { error });
});
app.get("/verify/:token", auth.verify);
app.post("/login", auth.isLogin, auth.login);
app.post("/signup", auth.isLogin, auth.register);
// Adding new post
app.use((req, res) => {
  res.redirect("/");
});
module.exports = app;
