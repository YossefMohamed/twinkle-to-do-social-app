const sgMail = require("@sendgrid/mail");
const sendgridAPI =
  "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";

sgMail.setApiKey(sendgridAPI);
exports.varMail = (email, name, code, hostName, r) => {
  sgMail.send({
    to: email,
    from: "yossefmohamed112233@gmail.com",
    subject: "Welcome",
    html:
      "<p>Hello mr." +
      name +
      " ,</p> </br> <br> Click here to verify your account <a href=" +
      `${r}://${hostName}/user/${code}>Here</a>`,
  });
};
