const mailer = require("nodemailer");
const env = require("dotenv").config();

const transporter = mailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "login",
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = (email, subject, code) => {
  transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: `<h1>${code}</h1>`,
  });
};

module.exports = sendEmail;
