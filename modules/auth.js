const schema = require("./schema");
const bcrypt = require("bcryptjs");
const error = require("./error");
const transporter = require("./transporter");
const jwt = require("jsonwebtoken");
const time = 5 * 1000 * 60;
const cookieOpt = {
  maxAge: 10 * 6 * 1000 * 90 * 2,
  httpOnly: true,
  sameSite: "lax",
};
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) res.redirect("/login");
  else {
    schema.user
      .findOne({ email: email })
      .then((data) => {
        if (!data) res.redirect("/login");
        else {
          bcrypt
            .compare(password, data.password)
            .then((result) => {
              if (!result) res.redirect("/login");
              else {
                const token = jwt.sign({ id: data._id }, process.env.SECRET, {
                  expiresIn: 10 * 6 * 1000 * 90 * 2,
                });
                res.cookie("user-data", token, cookieOpt);
                res.redirect("/dashboard");
              }
            })
            .catch((err) => res.redirect("/login"));
        }
      })
      .catch((err) => res.redirect("/login"));
  }
};
module.exports.register = (req, res) => {
  const { email, fullname, password } = req.body;
  if (!email || !fullname || !password) {
    console.log(req.body);
    res.status(400).redirect("/login");
  } else {
    schema.user
      .findOne({ email: email })
      .then(async (data) => {
        if (data) res.redirect("/dashboard"); // User already exist
        else {
          try {
            const _password = await bcrypt.hash(password, 10);
            const User = {
              fullname,
              password: _password,
              email,
            };
            const token = jwt.sign(User, process.env.SECRET, {
              expiresIn: time,
            });
            res.cookie("user-data", JSON.stringify(User), {
              maxAge: time,
              httpOnly: true,
              sameSite: "lax",
            });
            res.send(
              "An email has been sent to you, click the link to join us"
            );
            transporter
              .verify(email, token)
              .then((data) => {
                console.log(`http://localhost:5000/verify/${token}`);
                res.send(
                  "An email was sent to you!. Click the link on it to continue"
                );
              })
              .catch((err) => {
                res.redirect("/login");
              });
          } catch (err) {
            console.log(err);
            res.redirect("/login");
          }
        }
      })
      .catch((err) => {
        res.redirect("/");
      });
  }
};
module.exports.verify = (req, res) => {
  const { token } = req.params;
  if (token) {
    try {
      const User = jwt.verify(token, process.env.SECRET);
      const cookie = JSON.parse(req.cookies["user-data"]);
      if (cookie.email === User.email) {
        const user = new schema.user({
          email: User.email,
          fullname: User.fullname,
          password: User.password,
        });
        user
          .save()
          .then((d) => {
            // Log em in
            const token = jwt.sign({ id: d._id }, process.env.SECRET, {
              expiresIn: "18hrs",
            });
            res.cookie("user-data", token, {
              maxAge: 10 * 6 * 1000 * 90 * 2,
              httpOnly: true,
              sameSite: "lax",
            });
            res.redirect("/");
          })
          .catch((err) => {
            throw err;
          });
      } else {
        console.log("Token has gone bad");
        res.redirect("/login");
      }
    } catch (err) {
      console.log("Token has gone bad");
      res.redirect("/login");
    }
  }
};
module.exports.isLogin = (req, res, next) => {
  // Middleware
  try {
    const userId = req.cookies["user-data"];
    const id = jwt.verify(userId, process.env.SECRET).id;
    req.headers["x-user-id"] = id;
    if (req.url == "/login" || req.url == "/signup") {
      req.flash("message", "You are already logged in");
      res.redirect("/");
    } else next();
  } catch (err) {
    if (req.url == "/login" || req.url == "/signup") next();
    else if (req.url == "/") next();
    else {
      req.flash("message");
      res.redirect("/login");
    }
  }
};
