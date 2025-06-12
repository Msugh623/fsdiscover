import React from "react";
import Delay from "../../../components/Delay";
import { useInputContext } from "../../../state/InputContext";
import KeyboardFocusable from "./KeyboardFocusable";
import { toast } from "react-toastify";

const Controller = () => {
  const { click,
    altClick,
    scrollStart,
    scrollMove,
    scrollEnd } = useInputContext();
  return (
    <div>
      <Delay delay={800}>
        <div
          id="taskBar"
          className={`fixed-bottom d-flex ${false && "d-none"}`}
          style={{
            bottom: "10px",
            height: "70px",
            // zIndex: ,
          }}
        >
          <div
            id="taskbarInner"
            className="custom-navmenu mx-auto text-light slideUp p-2 col-11 col-sm-10 col-md-8 col-xl-9 mb-2 bg-dark rounded d-flex text-light"
          >
            <button
              className="btn text-light active shadow themebg"
              onClick={click}
              style={{
                minWidth: "70px",
                fontSize: ".6em",
              }}
            >
              <small id="lc"
                style={{
                  pointerEvents: "none",
                  zIndex: -1,
                }}
              >
               
              </small>
            </button>
            <div className="m-auto px-1 d-flex h-100 w-100">
              <div
                id="scrollbar"
                onTouchStart={scrollStart}
                onTouchMove={scrollMove}
                onTouchEnd={scrollEnd}
                onTouchCancel={scrollEnd}
                onMouseDown={scrollStart}
                onMouseMove={scrollMove}
                onMouseUp={scrollEnd}
                className="active rounded d-flex w-100 h-100 text-center my-auto"
                style={{
                  minWidth: "70px",
                  fontSize: ".7em",
                }}
              >
                <small className="m-auto" id="noPoint" style={{
                  
                }}>
                 
                </small>
              </div>
            </div>
            <button
              className="btn text-light active shadow themebg"
              style={{
                minWidth: "70px",
                fontSize: ".6em",
              }}
              onClick={altClick}
            >
              <small id="rc"
                style={{
                  pointerEvents: "none",
                  // zIndex: -1,
                }}
              >
              </small>
            </button>
          </div>
          <div
        className="p-3 w-100 fixed  bottom d-flex"
        style={{
          position: "fixed",
          bottom: window.innerWidth > 700 ? "0" : "70px",
          left: "4px",
          zIndex:-1
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
