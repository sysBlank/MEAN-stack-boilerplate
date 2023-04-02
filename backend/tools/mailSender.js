const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d1c1edad28d9d6",
    pass: "10f3fcf1cf7688"
  }
});

exports.sendRegistrationEmail = (user, validationToken) => {
  sendMail({
    from: "sender@server.com",
    to: user.email,
    subject: "Registration",
    text: "Plaintext version of the message",
    html: `Welcome ${user.username}! Please confirm your email ${validationToken}`
  });
}

exports.sendValidationEmail = (user, validationToken) => {
  sendMail({
    from: "sender@server.com",
    to: user.email,
    subject: "Email Validation",
    text: "Plaintext version of the message",
    html: `Hello ${user.username}! Please confirm your email ${validationToken}`
  });
}

exports.sendPasswordResetEmail = (user, passwordResetToken) => {
  sendMail({
    from: "sender@server.com",
    to: user.email,
    subject: "Password Reset",
    text: "Plaintext version of the message",
    html: `Hello ${user.username}! This is password reset token ${passwordResetToken}`
  });
}

exports.sendPasswordResetSuccessEmail = (user) => {
  sendMail({
    from: "sender@server.com",
    to: user.email,
    subject: "Password has been reset",
    text: "Plaintext version of the message",
    html: `Hello ${user.username}! Your password has been reset.`
  });
}

function sendMail(emailOptions) {
  transport.sendMail(emailOptions, function (err, data) {
    if (err) {
      return new Error('Registration email could not be sent')
    }
  });
}