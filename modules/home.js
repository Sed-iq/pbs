const schema = require("./schema");
module.exports = (req, res) => {
  const userId = req.headers["x-user-id"];
  const flash = req.flash("message");
  if (userId) {
    schema.user
      .findById(userId)
      .then((data) => {
        if (data)
          res.render("index.ejs", { name: data.fullname, message: flash });
      })
      .catch((err) => res.render("index.ejs",{name:null, message: flash }));
  } else {
    res.render("index.ejs",{name:null, message: flash });
  }
};
