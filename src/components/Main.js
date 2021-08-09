import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import SideBar from "./SideBar";
import { Document, Page } from "react-pdf";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../utils/ItemTypes";
import PdfLayer from "./PdfLayer";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import PdfItem from "./PdfItem";

const Main = () => {
  const useStyles = makeStyles((theme) => ({
    main: {
      position: "absolute",
      border: "1px transparent",
      width: "555px",
      height: "842px",
      zIndex: "100",
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
  }));
  const classes = useStyles();

  const [file, setFile] = useState(null);
  const [pdf, setPdf] = useState();
  const [pdfItems, setPdfItems] = useState([]);

  const handleDropItem = (dropItem, offset) => {
    const { item } = dropItem;
    console.log("drop", item);
    console.log("offset", offset);

    var newPdfItems = pdfItems;

    //var exists = newPdfItems.some((itemPdf) => itemPdf.id === item.id);

    if (item.operation === "same") {
      newPdfItems = newPdfItems.map((itemPdf) => {
        if (itemPdf.id === item.id) {
          itemPdf.x = offset.x;
          itemPdf.y = offset.y;
        }
        return itemPdf;
      });
    } else {
      var id = newPdfItems.length + 1;

      newPdfItems.push({
        id,
        imgSrc: item.imgSrc,
        title: item.title,
        x: offset.x,
        y: offset.y,
        width: "50",
        height: "50",
      });
    }
    setPdfItems([]);
    setPdfItems(newPdfItems);
  };

  const initalicePdf = async (e) => {
    // Fetch an existing PDF document
    //const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
    const existingPdfBytes = e.target.result;

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    setPdf(pdfDoc);
  };

  const loadPDF = (file) => {
    const reader = new FileReader();
    reader.onloadend = initalicePdf;
    reader.readAsArrayBuffer(file);
  };

  const readFile = (e) => {
    setFile(e.target.files[0]);
    loadPDF(e.target.files[0]);
  };

  const savePdf = async () => {
    // Get the first page of the document
    const pages = pdf.getPages();
    const firstPage = pages[0];

    // Embed the Helvetica font
    const helveticaFont = await pdf.embedFont(StandardFonts.Helvetica);

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize();

    for (let i = 0; i < pdfItems.length; i++) {
      const pdfItem = pdfItems[i];
      console.log("item", pdfItem);
      // Draw a string of text diagonally across the first page
      /*firstPage.drawText("This text was added with JavaScript!", {
        x: pdfItem.x,
        y: height - pdfItem.y,
        size: 10,
        font: helveticaFont,
        color: rgb(0.95, 0.1, 0.1),
      });*/

      const jpgImage = await pdf.embedJpg(pdfItem.imgSrc);

      const imgWidth = jpgImage.width;
      const imgHeight = jpgImage.height;

      console.log("width", imgWidth);
      console.log("height", imgHeight);

      const factor = (pdfItem.height * 100) / imgHeight / 100;

      // Get the width/height of the JPG image scaled down to 25% of its original size
      const jpgDims = jpgImage.scale(factor);

      // Draw the JPG image in the center of the page
      firstPage.drawImage(jpgImage, {
        x: pdfItem.x + 10,
        y: height - pdfItem.y - pdfItem.height - 10,
        width: jpgDims.width,
        height: jpgDims.height,
      });
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdf.save();

    // Trigger the browser to download the PDF document
    var fileDownload = require("js-file-download");
    fileDownload(pdfBytes, "fnewPdf.pdf");

    loadPDF(file);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Paper className={classes.paper}>
          <SideBar readFile={readFile} savePdf={savePdf} />
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <Paper className={classes.paper}>
          <PdfLayer
            handleDropItem={handleDropItem}
            pdfItems={pdfItems}
            setPdfItems={setPdfItems}
          />
          {file ? (
            <Document file={file}>
              <Page pageNumber={1} />
            </Document>
          ) : (
            <h2>Load a PDF</h2>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Main;
