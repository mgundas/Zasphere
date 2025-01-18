const mailgun = require("mailgun-js");
const config = require("../config");

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const sendVerificationEmail = (to, verificationCode) => {
  const data = {
    from: `Development Services <${process.env.MAILGUN_FROM_EMAIL}>`,
    to,
    subject: "Email Verification",
    text: `Your verification code is: ${verificationCode}`,
  };

  return mg.messages().send(data);
};

const sendVerificationSuccessEmail = (to) => {
  const data = {
    from: `Authentication Services <${process.env.MAILGUN_FROM_EMAIL}>`,
    to,
    subject: "Verification Success",
    text: `Your email has been verified successfully. You may start using our services.`,
  };

  return mg.messages().send(data);
};

module.exports = {
  sendVerificationEmail,
  sendVerificationSuccessEmail
};
