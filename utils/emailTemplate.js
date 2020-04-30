exports.accountVerification = function(name, token) {
  let content = `Hi ${name},<br/><br/>
  Click the <a href='http://localhost:3080/api/ngo/verify/email/${token}'>verification link</a> to activate your account.`

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
