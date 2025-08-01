import React from "react";
import Delay from "../../../components/Delay";
import { useInputContext } from "../../../state/InputContext";
import KeyboardFocusable from "./KeyboardFocusable";
import { useState } from "react";
// import { toast } from "react-toastify";

const Controller = () => {
  const { click, altClick, scrollStart, scrollMove, scrollEnd, socket } =
    useInputContext();
  const [inflate,setInflate]=useState(false)
  return (
    <div>
      <Delay delay={800}>
        <div
          id="mouseBar"
          className={`fixed-bottom d-flex ${false && "d-none"}`}
          style={{
            bottom: "10px",
            height: "70px",
            // zIndex: ,
          }}
        >
          <div
            id="mouseBarInner"
            className="custom-navmenu mx-auto text-light slideUp p-2 col-11 col-sm-10 col-md-8 col-xl-9 mb-2 bg-dark rounded d-flex text-light"
          >
            <button
              className="btn text-light active shadow themebg"
              onClick={click}
              style={{
                minWidth: window.innerWidth < 300 ? "30px" : "70px",
                fontSize: ".6em",
              }}
            >
              <small
                id="lc"
                style={{
                  pointerEvents: "none",
                  zIndex: -1,
                }}
              ></small>
            </button>
            <div className="m-auto px-1 d-flex h-100 w-100">
              <div
                onClick={() => {
                  !inflate && socket.emit("middleclick")
                  inflate && setInflate(false);
                }}
                id="scrollBar"
                onTouchStart={(e) => {
                  scrollStart(e)
                  setInflate(true);
                  e.target.focus()
                }}
                onTouchMove={scrollMove}
                onTouchEnd={(e)=>{
                  scrollEnd(e)
                }}
                onTouchCancel={(e)=>{
                  scrollEnd(e)
                }}
                onMouseDown={scrollStart}
                onMouseMove={scrollMove}
                onMouseUp={scrollEnd}
                onFocus={() => {
                  setInflate(true);
                }}
                onBlur={() => {
                  setInflate(false);
                }}
                className={`active rounded d-flex w-100 ${
                  !inflate && "h-100"
                } text-center my-auto`}
                style={{
                  minWidth: "40px",
                  fontSize: ".7em",
                  position: "relative",
                  bottom: inflate && "34px",
                  height: "80px",
                }}
              >
                <small className="m-auto" id="noPoint" style={{}}></small>
              </div>
            </div>
            <button
              className="btn text-light active shadow themebg"
              style={{
                minWidth: window.innerWidth < 300 ? "30px" : "70px",
                fontSize: ".6em",
              }}
              onClick={altClick}
            >
              <small
                id="rc"
                style={{
                  pointerEvents: "none",
                  // zIndex: -1,
                }}
              ></small>
            </button>
          </div>
          <div
            className="p-3 w-100 fixed  bottom d-flex"
            style={{
              position: "fixed",
              bottom: window.innerWidth > 780 ? "0" : "70px",
              left: "4px",
              zIndex: -1,
            }}
          >
            <KeyboardFocusable />
          </div>
        </div>
      </Delay>
    </div>
  );
};

export default Controller;
