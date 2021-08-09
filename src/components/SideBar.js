import React, { useState } from "react";
import Item from "./Item";
import { Button } from "@material-ui/core";

const SideBar = (props) => {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState();
  const loadImg = (e) => {
    const file = e.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      var items2 = items;
      setItems(
        items2.concat({
          id: file.name,
          imgSrc: reader.result,
          title: file.name,
        })
      );
    };
  };

  return (
    <div>
      <input type="file" id="file" name="file" onChange={props.readFile} />
      <hr />
      <label>Load a image</label>
      <input type="file" id="image" name="image" onChange={loadImg} />
      <hr />
      {items && items.map((item) => <Item item={item} key={item.title} />)}
      <hr />
      <Button variant="contained" color="primary" onClick={props.savePdf}>
        Save
      </Button>
    </div>
  );
};

export default SideBar;
