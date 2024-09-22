const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

const sendEmail = async (email, html, pdfFilePath = null) => {
  console.log(fs.existsSync(pdfFilePath))
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    // Email options
    let mailOptions = {
      from: 'noreply@gmail.com',
      to: email,
      html,
    };

    // If a PDF file path is provided, attach the file
    if (pdfFilePath && fs.existsSync(pdfFilePath)) {
      mailOptions.attachments = [
        {
          filename: 'document.pdf', // You can customize the attachment filename
          path: pdfFilePath,        // Path to the PDF file
          contentType: 'application/pdf',
        },
      ];
    }

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    if (pdfFilePath && fs.existsSync(pdfFilePath)) {
      fs.unlink(pdfFilePath, (err) => {
        if (err) throw err;
        console.log(`PDF file ${pdfFilePath} deleted successfully`);
      });
    }
  } catch (error) {
    console.log('Email not sent');
    console.log(error);
  }
};

module.exports = sendEmail;
