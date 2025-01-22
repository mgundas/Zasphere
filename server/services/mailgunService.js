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
      link: "https://example.com",
      appName: config.db.username
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

const sendVerificationSuccessEmail = (userData) => {
  try {
    const templatePath = path.join(
      __dirname,
      "./emailTemplates/verificationSucceeded.html"
    );
    const template = fs.readFileSync(templatePath, "utf8");

    // Construct a props object to pass information down to the template.
    const props = {
      email: userData.email,
      firstName: userData.firstName,
      appName: config.db.username
    }

    const html = ejs.render(template, props);
    const data = {
      from: `Development Services <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: userData.email,
      subject: "Email Verification Succeeded",
      html,
    };

    return mg.messages().send(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendVerificationEmail,
  sendVerificationSuccessEmail,
};
