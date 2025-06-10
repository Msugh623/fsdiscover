import React, { useState } from "react";
import { useInputContext } from "../../../state/InputContext";

const Panel = () => {
  const { init, touchConfig } = useInputContext()
  const [didInit,setDidInit] = useState(false);
  
    return (
      <div className="d-flex" style={{
        overflow: 'hidden',
        maxWidth:'99vw'
      }} >
        <canvas
          id="tp"
          className="border"
          style={{
            height: "85vh",
            position: 'fixed',
            top: '1.2rem',
            left: '1.2rem',
            right: '1.2rem',
            width:'calc( 100vw - 2.4rem )'
           }}
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
