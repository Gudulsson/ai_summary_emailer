const nodemailer = require('nodemailer');

async function sendEmail(subject, htmlBody) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject,
    html: htmlBody,
  };

  await transporter.sendMail(mailOptions);
  console.log('✅ E-post skickat!');
}

module.exports = sendEmail;
