const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const express = require('express');
const app = express();
const path = require('path');
const fontkit = require("@pdf-lib/fontkit");

const pdfFilePath = path.join(__dirname, 'template.pdf');
const fontpath = path.join(__dirname, 'THSarabun.ttf');
async function genCert(formData) {
  try {
    
    const templateBuffer = await fs.promises.readFile(pdfFilePath);
    const pdfDoc = await PDFDocument.load(templateBuffer);
    pdfDoc.registerFontkit(fontkit);

    const fontBytes =  await fs.promises.readFile(fontpath);
    const customFont = await pdfDoc.embedFont(fontBytes);
    const form = pdfDoc.getForm();
    const rawUpdateFieldAppearances = form.updateFieldAppearances.bind(form);
    form.updateFieldAppearances = function () {
      return rawUpdateFieldAppearances(customFont);
    };
    
    
    
    form.getTextField('cert-number').setText(formData.cert_number);
    form.getTextField('name').setText(formData.name);
    form.getTextField('amt-credit').setText(formData.amt_credit );
   
    form.flatten();

   
    const pdfBytes = await pdfDoc.save();
    
    var pdfBuffer = Buffer.from(pdfBytes.buffer, 'binary');
    
   return pdfBuffer;
  } catch (err) {
    console.error('Error filling PDF form:', err);
    res.status(500).send('Internal Server Error');
  }
};
module.exports= genCert;