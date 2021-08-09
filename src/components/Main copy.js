import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import PdfWrapper from "./PdfWrapper";
import SideBar from "./SideBar";
import { Document, Page } from "react-pdf";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../utils/ItemTypes";

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
      });
    }
    setPdfItems([]);
    setPdfItems(newPdfItems);
  };

  function LocalBox() {
    const dropItemsZone = useLocalDrop(handleDropItem);

    return <div ref={dropItemsZone} className={classes.main}></div>;
  }

  function useLocalDrop(onDrop) {
    const ref = useRef();

    const [, dropTarget] = useDrop({
      accept: ItemTypes.ITEM,
      drop(item, monitor) {
        const offset = monitor.getSourceClientOffset();
        if (offset && ref.current) {
          const dropTargetXy = ref.current.getBoundingClientRect();
          onDrop(item, {
            x: offset.x - dropTargetXy.left,
            y: offset.y - dropTargetXy.top,
          });
        }
      },
    });

    return (elem) => {
      ref.current = elem;
      dropTarget(ref);
    };
  }
  /*
  const [{ isOver, offset }, dropItem] = useDrop({
    accept: ItemTypes.ITEM,
    drop: ({ item }, monitor) =>
      handleDropItem(
        item,
        monitor.getInitialClientOffset(),
        monitor.getInitialSourceClientOffset(),
        monitor.getClientOffset(),
        monitor.getDifferenceFromInitialOffset(),
        monitor.getSourceClientOffset()
      ),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      offset: monitor.getClientOffset(),
    }),
  });
*/
  /*
drop({ item }, monitor) {
      const offset = monitor.getClientOffset();
      console.log("DROPP");
      handleDropItem(item, offset);
      //console.log("offset -->", offset);
    },
  */

  /*
collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      offset: monitor.getClientOffset(),
      dropRes: monitor.getDropResult(),
    }),
  */

  /*const setPdf = (e) => {
    console.log("result", e.target.result);
    setFile(e.target.result);
  };*/

  const readFile = (e) => {
    //console.log(e.target.files[0]);
    setFile(e.target.files[0]);
    /*const reader = new FileReader();
    reader.onloadend = setPdf;
    reader.readAsDataURL(e.target.files[0]);*/
  };
  //
  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Paper className={classes.paper}>
          <SideBar readFile={readFile} />
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <Paper className={classes.paper}>
          <LocalBox />
          <PdfWrapper file={file} pdfItems={pdfItems} />
          {file && (
            <Document file={file}>
              <Page pageNumber={1} />
            </Document>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Main;

/*
<div ref={dropItem} className={classes.main}>
            {file && (
              <Document file={file}>
                <Page pageNumber={1} />
              </Document>
            )}
            <PdfWrapper file={file} pdfItems={pdfItems} />
          </div>
*/
