const mailgun = require("mailgun-js");
const config = require("../config");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path")

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const sendVerificationEmail = (userData) => {
  try {
    const templatePath = path.join(
      __dirname,
      "./emailTemplates/verificationEmail.html"
    );
    const template = fs.readFileSync(templatePath, "utf8");

    // Construct a props object to pass information down to the template.
    const props = {
      verificationCode: userData.verificationCode,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,
      link: "https://example.com"
    }

    const html = ejs.render(template, props);
    const data = {
      from: `Development Services <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: userData.email,
      subject: "Email Verification",
      html,
    };

    return mg.messages().send(data);
  } catch (error) {
    console.log(error);
  }
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
  sendVerificationSuccessEmail,
};
