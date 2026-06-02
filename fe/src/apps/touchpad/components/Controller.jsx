import React from "react";
import Delay from "../../../components/Delay";
import { useInputContext } from "../../../state/InputContext";
import KeyboardFocusable from "./KeyboardFocusable";
import { useState } from "react";
// import { toast } from "material-react-toastify";

const Controller = () => {
  const { click, altClick, scrollStart, scrollMove, scrollEnd, socket } =
    useInputContext();
  const [inflate, setInflate] = useState(false);
  return (
    <div>
      <Delay delay={800}>
        <div
          id="mouseBar"
          className={`fixed left-2 right-2 bottom-0 pb-1 d-flex ${false && "d-none"}`}
        >
          <div
            id="mouseBarInner"
            className=" mx-auto slideUp p-2  md:w-2/3 px-2  mb-2 bg-[#111] rounded-3xl flex text-white border border-white/10 shadow-2xl"
          >
            <button
              className="text-white active shadow-lg bg-[#0d0d11] hover:bg-white/10 rounded-2xl transition max-h-14"
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
            <div className="m-auto px-1 flex h-14 w-full">
              <div
                onClick={() => {
                  !inflate && socket.emit("middleclick");
                  inflate && setInflate(false);
                }}
                id="scrollBar"
                onTouchStart={(e) => {
                  scrollStart(e);
                  setInflate(true);
                  e.target.focus();
                }}
                onTouchMove={scrollMove}
                onTouchEnd={(e) => {
                  scrollEnd(e);
                }}
                onTouchCancel={(e) => {
                  scrollEnd(e);
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
                className={`rounded-2xl flex w-full ${
                  !inflate ? "max-h-14" : "min-h-28 relativ bottom-14"
                } text-center my-auto bg-[#141414] transition border border-white/10`}
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
              className="text-white active shadow-lg bg-[#0d0d11] hover:bg-white/10 rounded-2xl transition max-h-14"
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
            className="fixed left-0 right-0 flex justify-center"
            style={{
              position: "fixed",
              bottom: window.innerWidth > 780 ? "60px" : "110px",
              zIndex: 60,
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "1200px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <KeyboardFocusable />
            </div>
          </div>
        </div>
      </Delay>
    </div>
  );
};

export default Controller;
