const PDFDocument = require('pdfkit');
const fs = require('fs');
const sendEmail = require('./mail');


 function generateInvoice(userEmail, productName, productPrice) {
  // Create a document
  const doc = new PDFDocument();

  // Get the current date and time
  const currentDate = new Date().toLocaleString();

  // Pipe its output to a file with a dynamic name
  const fileName = `invoice_${userEmail}.pdf`;
  doc.pipe(fs.createWriteStream(fileName));

  // Embed a font, set the font size, and render some text
  doc
    .fontSize(20)
    .text(`Invoice`, { align: 'center' })
    .moveDown();

  doc
    .fontSize(15)
    .text(`Customer Name: ${userEmail}`, { align: 'left' })
    .moveDown();

  doc
    .text(`Product: ${productName}`, { align: 'left' })
    .moveDown();

  doc
    .text(`Price: $${productPrice}`, { align: 'left' })
    .moveDown();

  doc
    .text(`Date: ${currentDate}`, { align: 'left' })
    .moveDown(2);

  doc.text(`Thank you for your purchase!`, { align: 'center' });

  // Finalize PDF file
  doc.end();
  sendEmail(userEmail,`<p>Your Billing PDF is attached Below</p>`,`./invoice_${userEmail}.pdf`);
  console.log(`PDF Sent Sucessfully`);

}

module.exports= {generateInvoice};

