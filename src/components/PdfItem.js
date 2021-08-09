import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../utils/ItemTypes";
import ReactResizeDetector from "react-resize-detector";

const PdfItem = (props) => {
  console.log("props", props);
  const {
    item: { id, imgSrc, title, x, y, width, height },
    updateItem,
  } = props;

  const [{ isDragging }, dragPdfItem] = useDrag({
    item: {
      type: ItemTypes.ITEM,
      item: {
        id,
        imgSrc,
        title,
        operation: "same",
      },
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const useStyles = makeStyles((theme) => ({
    pdfItem: {
      position: "absolute",
      display: "flex",
      flexWrap: "wrap",
      padding: "10px",
      left: `${x}px`,
      top: `${y}px`,
      zIndex: "200",
      resize: "both",
      overflow: "auto",
      width: `${width}px`,
      height: `${height}px`,
    },
    pdfImg: {
      maxWidth: "100%",
      height: "auto",
    },
  }));

  const pdfItemClass = useStyles();

  const onResize = (x, y) => {
    updateItem(id, x, x);
  };

  return (
    <Paper ref={dragPdfItem} className={pdfItemClass.pdfItem}>
      <img src={imgSrc} alt={title} className={pdfItemClass.pdfImg} />
      <ReactResizeDetector handleWidth handleHeight onResize={onResize} />
    </Paper>
  );
};

export default PdfItem;
