import React, { useState } from "react";
import { useInputContext } from "../../../state/InputContext";

const Panel = () => {
  const { init, touchConfig } = useInputContext()
  const [didInit,setDidInit] = useState(false);
  
    return (
      <div className="p-4 d-flex">
        <canvas
          id="tp"
          className="border m-auto w-100"
          style={{ height: "85vh" }}
        ></canvas>
        {!didInit&&(() => {
          init(document.getElementById("tp"));
          setDidInit(true);
        })()}
        <div
          className="p-1"
          style={{
            border: "50%",
            backgroundColor: touchConfig.mouseDown?touchConfig.mouseDownHold?"green":'red': "steelblue",
            position: "fixed",
            top: touchConfig.mouseY - 3,
              left: touchConfig.mouseX - 3,
            pointerEvents:'none'
          }}
        ></div>
      </div>
    );
};

export default Panel;
