import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../utils/ItemTypes";
import { makeStyles } from "@material-ui/core/styles";
import PdfItem from "./PdfItem";

const PdfLayer = (props) => {
  const { handleDropItem, pdfItems, setPdfItems } = props;

  const useStyles = makeStyles((theme) => ({
    pdfLayer: {
      position: "absolute",
      border: "1px transparent",
      width: "555px",
      height: "842px",
      zIndex: "100",
    },
  }));
  const classPdfLayer = useStyles();

  const useLocalDrop = (onDrop) => {
    const ref = useRef();

    const [, dropTarget] = useDrop({
      accept: ItemTypes.ITEM,
      drop(item, monitor) {
        const offset = monitor.getSourceClientOffset();
        if (offset && ref.current) {
          const dropTargetXy = ref.current.getBoundingClientRect();
          console.log("current", ref.current);
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
  };

  const dropItemsZone = useLocalDrop(handleDropItem);

  const updateItem = (id, width, height) => {
    var newPdfItems = pdfItems;
    newPdfItems = newPdfItems.map((itemPdf) => {
      if (itemPdf.id === id) {
        itemPdf.width = width;
        itemPdf.height = height;
      }
      return itemPdf;
    });
    setPdfItems(newPdfItems);
  };

  return (
    <div ref={dropItemsZone} className={classPdfLayer.pdfLayer}>
      {pdfItems &&
        pdfItems.map((item) => (
          <PdfItem item={item} key={item.id} updateItem={updateItem} />
        ))}
    </div>
  );
};

export default PdfLayer;
