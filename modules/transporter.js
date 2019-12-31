const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.verify = (email, link) => {
  const mailOptions = {
    from: `Universal Skill Academy <${process.env.EMAIL}>`,
    to: email,
    subject: "Email Verification.",
    html: `
    <div style="background-color: #f1f1f1; padding: 1em; text-align: center">
  <h1>Verify Email</h1>
  <p style="margin-bottom: 1em">
    Welcome to Univerisal Skill Academy, please click the link to Verify your
    email address <br />
    <a href="https://universalskillacademy.com/verify/${link}">Click me to verify</a>
  </p>
  <small>Copyright© Univerisal Skill Academy 2023 </small>
</div>
    `,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve("Email Sent!");
      }
    });
  });
};
