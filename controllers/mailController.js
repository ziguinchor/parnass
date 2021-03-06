const nodeMailer = require("nodemailer");
const config = require("config");
const catchAsync = require("../utils/catchAsync");

exports.mail = catchAsync(async (param) => {
  const transporter = nodeMailer.createTransport({
    service: "server-smtp",
    host: config.get("mail.server"),
    port: config.get("mail.port"),
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.get("mail.user"),
      pass: config.get("mail.pass"),
    },
  });
  const options = {
    from: config.get("mail.from"),
    to: param.to,
    subject: param.subject,
    // text: "",
    html: param.body,
  };
  await transporter.sendMail(options, (err, info) => {
    if (err) throw new Error(err);
  });
});
