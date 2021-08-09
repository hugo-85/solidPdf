import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../utils/ItemTypes";

const Item = (props) => {
  const {
    item: { id, imgSrc, title },
  } = props;

  const [{ isDragging }, dragItem] = useDrag({
    item: {
      type: ItemTypes.ITEM,
      item: {
        id,
        imgSrc,
        title,
        operation: "new",
      },
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end(item, monitor) {
      const dropResult = monitor.getDropResult();
    },
  });

  const useStyles = makeStyles((theme) => ({
    imgContainter: {
      display: "flex",
    },
    image: {
      objectFit: "cover",
      width: "20%",
    },
  }));

  const itemClass = useStyles();

  return (
    <div className={itemClass.imgContainter} ref={dragItem}>
      <img src={imgSrc} alt={title} className={itemClass.image} />
    </div>
  );
};

export default Item;
