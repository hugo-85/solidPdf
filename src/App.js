import React from "react";
import Main from "./components/Main";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

function App() {
  return (
    <div className="App">
      <DndProvider backend={Backend}>
        <Main />
      </DndProvider>
    </div>
  );
}

export default App;
