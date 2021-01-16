const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(proccess.env.SGPASSWORD);
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
