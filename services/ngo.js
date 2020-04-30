const mailer = require("../helpers/mailer");
const { accountVerification, welcomeEmail } = require("../utils/emailTemplate")
const { saveUser } = require("../services/user")

const bcrypt = require("bcrypt");
const { complexId } = require("uq-id");

async function sendVerMail({toList, name, token}) {
  const {subject, content} = accountVerification(name, token)
  const mailOpts = {
    to: toList,
    subject: subject,
    html: content
  };

  await mailer.send(mailOpts);
}

async function createNgoUser(ngo) {
  if (ngo && ngo.email_verified == true && ngo.status == 'verified') {
    const pwd = complexId()
    // console.log(pwd)
    const gPwdHash = await bcrypt.hashSync(pwd, 10);
    const userOpt = {
      firstName: ngo.name,
      lastName: ngo.name,
      email: ngo.email,
      password: gPwdHash,
      role: 'ngo',
    }
    var user = await saveUser(userOpt)
    if (user) {
      const {subject, content} = welcomeEmail(user.firstName, user.email, pwd)
      const mailOpts = {
        to: user.email,
        subject: subject,
        html: content
      };

      await mailer.send(mailOpts);
    }
  }
}

module.exports = {
  sendVerMail,
  createNgoUser,
};
