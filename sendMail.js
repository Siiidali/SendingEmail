const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);
OAuth2_client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// sending email function :
const sendEmail = (name, recipient) => {
  const accessToken = OAuth2_client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mail_options = {
    from: `Micro Club <${process.env.USER}>`,
    to: recipient,
    subject: "Micro club inscreption",
    html: templateHtml(name),
  };
  transport.sendMail(mail_options, function (error, result) {
    if (error) {
      console.log(`Erreur : ${error}`);
    } else {
      console.log(`Success : ${result}`);
    }
    transport.close();
  });
};

//function that return an html template for the email :
const templateHtml = (name) => {
  const body = fs.readFileSync("public/emailTemplate.html").toString();
  const content = body.replace("##UserName##", name);
  return content;
};
