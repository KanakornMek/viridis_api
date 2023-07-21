const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');

const templatePath = './template.pdf';
const outputPath = './finishedTemplate.pdf';

// Sample data for form fields
const formData = {
  cert_number:"viri",
  name: "Kanakorn Sukieam",
  amt_credit: "450"
};

async function gencert() {
  try {
    // Read the existing template PDF
    const templateBuffer = await fs.promises.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templateBuffer);

    // Get the form containing all fields in the PDF
    const form = pdfDoc.getForm();

    // Fill in the form fields
    form.getTextField('cert-number').setText(formData.cert_number);
    form.getTextField('name').setText(formData.name);
    form.getTextField('amt-credit').setText(formData.amt_credit );
    // Flatten the form to make the fields read-only
    form.flatten();

    // Save the filled PDF to a new file
    const filledPdfBytes = await pdfDoc.save();
    await fs.promises.writeFile(outputPath, filledPdfBytes);

    console.log('PDF form filled and saved successfully:', outputPath);
  } catch (err) {
    console.error('Error filling PDF form:', err);
  }
};
gencert();
module.exports = gencert;
