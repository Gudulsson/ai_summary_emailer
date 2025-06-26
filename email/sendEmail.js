const nodemailer = require('nodemailer');

async function sendEmail(subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
