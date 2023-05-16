const mongoose = require("mongoose"),
  User = mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
      },
      fullname: {
        type: String,
        required: true,
      },

      password: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );

module.exports.user = mongoose.model("user", User);
