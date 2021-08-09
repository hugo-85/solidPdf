import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import PdfItem from "./PdfItem";

const PdfWrapper = (props) => {
  const { pdfItems } = props;
  const [pdf, setPdf] = useState();

  const useStyles = makeStyles((theme) => ({
    pdfStyle: {
      width: "555px",
      border: "1px transparent",
      height: "842px",
      /* z-index: 100; */
      position: "absolute",
    },
  }));
  const classesPdf = useStyles();

  const initalicePdf = async (e) => {
    // Fetch an existing PDF document
    //const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
    const existingPdfBytes = e.target.result;

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    setPdf(pdfDoc);
    // Embed the Helvetica font
    //const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Get the first page of the document
    //const pages = pdfDoc.getPages();
    //const firstPage = pages[0];

    // Get the width and height of the first page
    //const { width, height } = firstPage.getSize();

    // Draw a string of text diagonally across the first page
    /*firstPage.drawText("This text was added with JavaScript!", {
      x: 5,
      y: height / 2 + 300,
      size: 50,
      font: helveticaFont,
      color: rgb(0.95, 0.1, 0.1),
      rotate: degrees(-45),
    });*/

    // Serialize the PDFDocument to bytes (a Uint8Array)
    //const pdfBytes = await pdfDoc.save();

    // Trigger the browser to download the PDF document
    //download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
    // var fileDownload = require("js-file-download");
    //fileDownload(pdfBytes, "fnewPdf.pdf");
  };

  const { file } = props;
  if (!pdf) {
    if (!file) return <h2>Load a PDF</h2>;
    const reader = new FileReader();
    reader.onloadend = initalicePdf;
    reader.readAsArrayBuffer(file);
  }
  console.log("wraper", pdfItems);

  return (
    <div className={classesPdf.pdfStyle}>
      {pdfItems &&
        pdfItems.map((item) => <PdfItem item={item} key={item.id} />)}
    </div>
  );
};

export default PdfWrapper;
