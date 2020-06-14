exports.accountVerification = function(name, email, token) {
  const url = process.env.CLIENT_EMAIL_VERIFY_URL
  const email_base64 = Buffer.from(email).toString('base64');
  let content = `Hi ${name},<br/><br/>
  Click the <a href='${url}/${email_base64}/${token}'>verification link</a> to activate your account.`

  return {
    'subject' : 'Sankalpa: Email Verification',
    'content' : content,
    }
}

exports.welcomeEmail = function(name, username, password) {
  let content = `Hi ${name},<br/><br/>
  Welcome to Sankalpa.<br/><br/>
  Your credentials are<br/>
  username: ${username}<br/>
  password: ${password}<br/>`

  return {
    'subject' : 'Welcome to Sankalpa',
    'content' : content,
    }
}
