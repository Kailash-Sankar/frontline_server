exports.accountVerification = function(name, token) {
  let content = `Hi ${name},<br/><br/>
  Welcome to Sankalpa.<br/>
  Click the <a href='http://localhost:3080/verify-email-link/${token}'>verification link</a> to activate your account.`

  return {
    'subject' : 'Sankalpa: Email Verification',
    'content' : content,
    }
}
