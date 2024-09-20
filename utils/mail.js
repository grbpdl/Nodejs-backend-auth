const nodemailer = require('nodemailer');
require('dotenv').config()


const sendEmail = async (email,html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      //service: process.env.SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: 'noreply@gmail.com',
      to: email,
      //subject: subject,
      html,
    });
    console.log('email sent sucessfully');
  } catch (error) {
    console.log('email not sent');
    console.log(error);
  }
};

module.exports = sendEmail;