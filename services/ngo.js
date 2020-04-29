const mailer = require("../helpers/mailer");
const { accountVerification } = require("../utils/emailTemplate")

async function sendVerMail({toList, name, token}) {
  const {subject, content} = accountVerification(name, token)
  const mailOpts = {
    to: toList,
    subject: subject,
    html: content
  };

  await mailer.send(mailOpts);
}

module.exports = {
  sendVerMail,
};
