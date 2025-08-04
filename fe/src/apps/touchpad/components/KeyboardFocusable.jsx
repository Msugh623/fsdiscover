import React, { useRef } from "react";
import { useState } from "react";
import { useInputContext } from "../../../state/InputContext";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaBackspace,
  FaBackward,
  FaExpandArrowsAlt,
  FaForward,
  FaPause,
  FaPlay,
  FaRegKeyboard,
  FaWindows,
} from "react-icons/fa";
import { useEffect } from "react";
import Menu from "../../../components/Menu";
import { BiX } from "react-icons/bi";

const KeyboardFocusable = ({ hasDivider }) => {
  const [panelClassName, setPanelClassName] = useState("d-none");
  const [href, setHref] = useState(location.href);
  const strokerRef = useRef(null);
  const {
    toggleKeyboard,
    setKeyVal,
    keyVal,
    hasPannel,
    setHasPannel,
    handleKeyUp,
    handleKeydown,
    setLastPress,
    socket,
    downKeys,
    setDownKeys,
  } = useInputContext();

  const [mediaKeys, setMediaKeys] = useState(false);
  const [otherKeys, setOtherKeys] = useState(false);
  const [inputHadFocus, setInputHadFocus] = useState(false);
  const [controller, setController] = useState(false);

  function handleVirtualKey(e, killfocus) {
    killfocus && inputHadFocus && strokerRef.current.focus();
    if (e.target.value == "toggle") {
      return handleToggleKey(e.target.id);
    }
    socket.emit("keytype", e.target.id);
  }

  function handleToggleKey(key) {
    if (downKeys.includes(key)) {
      socket.emit("keyup", key);
    } else {
      socket.emit("keydown", key);
    }
  }

  useEffect(() => {
    location.href !== href && setHref(location.href);
  }, [location.href == href]);

  useEffect(() => {
    if (!hasPannel) {
      if (hasPannel == undefined) {
        return;
      }
      toggleKeyboard(false);
      setPanelClassName("slideOut");
      setTimeout(() => {
        setPanelClassName("d-none");
      }, 500);
    } else {
      setPanelClassName("d-block");
      toggleKeyboard(true);
    }
  }, [hasPannel]);

  useEffect(() => {
    socket.on("downkeys", (data) => {
      setDownKeys(data || []);
    });
    if(!socket.connected){
      socket.connect()
    }
  }, []);

  return (
    <>
      {controller && (
        <VirtualNavigator
          handleVirtualKey={handleVirtualKey}
          closeController={() => setController(false)}
        />
      )}
      <div className="menu-panel">
        <div className="mx-auto col-12 col-sm-10 col-md-8 col-xl-9">
          <div
            className={`inner ani  rounded shadow-lg p-3 text-light bg-dark text-left slideUp ${panelClassName}`}
            style={{
              // zIndex: ,
              // bottom: "10px",
              position: "relative",
            }}
          >
            <div
              className="row text-light ani"
              style={{
                minHeight: "400px !important",
                height: "20vh",
                maxHeight: "80vh",
                // overflowX: 'auto',
                // overflowY:'visible'
              }}
            >
              <div className="d-flex px-0 px-md-1 pb-2 virtualKeyboard">
                <div className="row">
                  <h5
                    className="text-light ps-3 m-0 mt-0 mb-0"
                    style={{
                      maxWidth: "fit-content",
                      pointerEvents: "none",
                      position: "relative",
                      bottom: "6px",
                    }}
                  >
                    Remote Keyboard
                  </h5>
                  {/* First row */}
                  <div className="d-flex col-md-12">
                    <div className="p-1  d-flex">
                      <button
                        onClick={() => {
                          setOtherKeys((prev) => !prev);
                          inputHadFocus && strokerRef.current.focus();
                        }}
                        className={`btn border text-light w-100 text-center ${
                          otherKeys && "active"
                        }`}
                      >
                        {!otherKeys ? "More" : "Less"}
                      </button>
                    </div>
                    <VirtualKey
                      isAlt={otherKeys}
                      id={"Escape"}
                      onClick={(e) => handleVirtualKey(e)}
                    >
                      Esc
                    </VirtualKey>
                    <VirtualKey
                      isAlt={otherKeys}
                      id={"Tab"}
                      onClick={(e) => handleVirtualKey(e)}
                    >
                      Tab
                    </VirtualKey>
                    <VirtualKey
                      isAlt={otherKeys}
                      id={"End"}
                      onClick={(e) => handleVirtualKey(e)}
                    >
                      End
                    </VirtualKey>
                    <VirtualKey
                      alt={
                        <VirtualKey
                          id={"Backspace"}
                          onClick={(e) => handleVirtualKey(e)}
                        >
                          <FaBackspace
                            style={{
                              fontSize: "1.6em",
                              rotate: "180deg",
                              pointerEvents: "none",
                              rotate: "",
                            }}
                          />
                        </VirtualKey>
                      }
                      isAlt={otherKeys}
                      id={"PageUp"}
                      onClick={(e) => handleVirtualKey(e)}
                    >
                      PgUp
                    </VirtualKey>
                  </div>

                  {/* Second Row */}
                  <div className="d-flex col-lg-12">
                    <div className=" p-1 d-flex">
                      <button
                        id="LeftSuper"
                        onClick={(e) => handleVirtualKey(e)}
                        className="btn text-light border w-100"
                      >
                        <FaWindows
                          style={{
                            fontSize: "1.6em",
                            rotate: "180deg",
                            pointerEvents: "none",
                          }}
                        />
                      </button>
                    </div>
                    <VirtualKey
                      isAlt={otherKeys}
                      id={"LeftControl"}
                      value={"toggle"}
                      className={downKeys.includes("LeftControl") && "active"}
                      onClick={(e) => handleVirtualKey(e)}
                    >
                      Ctrl
                    </VirtualKey>
                    <VirtualKey
                      isAlt={otherKeys}
                      id={"LeftAlt"}
                      value={"toggle"}
                      className={downKeys.includes("LeftAlt") && "active"}
                      onClick={(e) => handleVirtualKey(e)}
                    >
                      Alt
                    </VirtualKey>
                    <VirtualKey
                      isAlt={otherKeys}
                      id={"LeftShift"}
                      value={"toggle"}
                      className={downKeys.includes("LeftShift") && "active"}
                      onClick={(e) => handleVirtualKey(e)}
                    >
                      Shift
                    </VirtualKey>
                    <VirtualKey
                      alt={
                        <VirtualKey
                          id={"Enter"}
                          onClick={(e) => handleVirtualKey(e)}
                        >
                          Enter
                        </VirtualKey>
                      }
                      isAlt={otherKeys}
                      id={"PageDown"}
                      onClick={(e) => handleVirtualKey(e)}
                    >
                      PgDown
                    </VirtualKey>
                  </div>
                </div>
                <div className="ms-auto mt-auto">
                  <div className="d-flex">
                    <div className="col-4 p-1 d-flex">
                      {otherKeys ? (
                        <button
                          id="Delete"
                          onClick={(e) => handleVirtualKey(e)}
                          className="btn pe-4 text-light border w-100"
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          id="Insert"
                          onClick={() => {
                            setController(true);
                          }}
                          className="btn pe-4 text-center text-light border w-100"
                        >
                          {/* <FaExpandArrowsAlt className=""
                            style={{ rotate: "45deg", pointerEvents: "none" }}
                          /> */}
                          <small className="small">Present</small>
                        </button>
                      )}
                    </div>
                    {mediaKeys ? (
                      <div className="col-4 p-1  d-flex">
                        <button
                          id="AudioPlay"
                          onClick={(e) => handleVirtualKey(e)}
                          className="btn text-light border w-100 text-center"
                        >
                          <FaPlay
                            className="icon"
                            style={{ padding: "1px", pointerEvents: "none" }}
                          />
                        </button>
                      </div>
                    ) : (
                      <div className="col-4 p-1  d-flex">
                        <button
                          id="Up"
                          onClick={(e) => handleVirtualKey(e)}
                          className="btn text-light border w-100 text-center"
                        >
                          <FaArrowUp style={{ pointerEvents: "none" }} />
                        </button>
                      </div>
                    )}
                    <div className="col-4 p-1  d-flex">
                      <button
                        onClick={() => {
                          setMediaKeys((prev) => !prev);
                          inputHadFocus && strokerRef.current.focus();
                        }}
                        className={`btn border text-light w-100 text-center ${
                          mediaKeys && "active"
                        }`}
                      >
                        {!mediaKeys ? "Media" : "Arrow"}
                      </button>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="d-flex">
                    {!mediaKeys ? (
                      <>
                        {/* Nav Keys */}
                        <div className="col-4 p-1  d-flex">
                          <button
                            id="Left"
                            onClick={(e) => handleVirtualKey(e)}
                            className="btn border text-light w-100 text-center"
                          >
                            <FaArrowLeft style={{ pointerEvents: "none" }} />
                          </button>
                        </div>
                        <div className="col-4 p-1  d-flex">
                          <button
                            id="Down"
                            onClick={(e) => handleVirtualKey(e)}
                            className="btn border text-light w-100 text-center"
                          >
                            <FaArrowDown style={{ pointerEvents: "none" }} />
                          </button>
                        </div>
                        <div className="col-4 p-1  d-flex">
                          <button
                            id="Right"
                            onClick={(e) => handleVirtualKey(e)}
                            className="btn border text-light w-100 text-center"
                          >
                            <FaArrowRight style={{ pointerEvents: "none" }} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-4 p-1  d-flex">
                          <button
                            id="AudioPrev"
                            onClick={(e) => handleVirtualKey(e)}
                            className="btn border text-light w-100 text-center"
                          >
                            <FaBackward style={{ pointerEvents: "none" }} />
                          </button>
                        </div>
                        <div className="col-4 p-1  d-flex">
                          <button
                            id="AudioPlay"
                            onClick={(e) => handleVirtualKey(e)}
                            className="btn border text-light w-100 text-center"
                          >
                            <FaPause
                              className="icon"
                              style={{ padding: "1px", pointerEvents: "none" }}
                            />
                          </button>
                        </div>
                        <div className="col-4 p-1  d-flex">
                          <button
                            id="AudioNext"
                            onClick={(e) => handleVirtualKey(e)}
                            className="btn border text-light w-100 text-center"
                          >
                            <FaForward style={{ pointerEvents: "none" }} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-2">
                <input
                  type="text"
                  onKeyDown={handleKeydown}
                  onKeyUp={handleKeyUp}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  aria-multiline="false"
                  onFocus={() => {
                    setTimeout(() => {
                      setInputHadFocus(true);
                    }, 250);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setInputHadFocus(false);
                    }, 250);
                  }}
                  onChange={({ target }) => {
                    const { value } = target;
                    setKeyVal((prev) =>
                      value.length <= 2
                        ? target.value[value.length - 1] || target.value
                        : (() => {
                            if (value.length - prev.length == 1) {
                              return target.value[value.length - 1];
                            }
                            const i = value.indexOf(prev);
                            return value
                              .slice(i + i.length + 1, value.length)
                              .replace(prev, "");
                          })()
                    );
                    setLastPress(Date.now());
                  }}
                  className={`form-control bg-dark border rounded text-light ${
                    inputHadFocus && "border-primary"
                  }`}
                  placeholder={"Write Here (Writeup will not display here)"}
                  value={keyVal}
                  autoFocus
                  ref={strokerRef}
                  id="keystroker"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="start"
        title="Keyboard Menu"
        className={`app my-auto p-2 py-1 btn fs-5 ${hasPannel && "active"}`}
        onClick={() => {
          setHasPannel((prev) => !prev), setKeyVal("");
        }}
      >
        <FaRegKeyboard
          className="text-light"
          style={{
            fontSize: "35px",
          }}
        />
      </div>
      <Menu hasDivider={false} />
      {hasDivider !== false && (
        <div
          className="divider my-auto mx-2"
          style={{ width: "1px", background: "#efefef60", height: "80%" }}
        ></div>
      )}
    </>
  );
};

export default KeyboardFocusable;

function VirtualKey({ children, id, onClick, className, value, isAlt, alt }) {
  return !isAlt || !alt ? (
    <div className=" p-1 d-flex">
      <button
        id={id}
        value={value || ""}
        onClick={(e) => onClick(e)}
        className={`btn text-light border w-100 ${className}`}
      >
        {children}
      </button>
    </div>
  ) : (
    alt
  );
}

function VirtualNavigator({ handleVirtualKey, closeController }) {
  return (
    <>
      <div
        className="d-flex fadeIn pb-5"
        style={{
          position: "fixed",
          left: "0",
          right: "0",
          top: "0",
          bottom: "0",
          backgroundColor: "#061e2cfa",
          zIndex: 10,
          backdropFilter:'blur(20px)'
        }}
      >
        <div
          className="m-auto slideUp shadow border text-light active p-3"
          style={{
            borderRadius: "25px",
          }}
        >
          <h4 className="text-light d-flex">
            Presentation Controller{" "}
            <button
              className="ms-auto active rounded my-auto me-1 border"
              onClick={closeController}
            >
              <BiX />
            </button>
          </h4>
          <div className="d-flex">
            {/* Left Key */}
            <div className=" p-1  d-flex">
              <button
                id="Left"
                onClick={(e) => handleVirtualKey(e, true)}
                className="btn border my-auto text-light h-100 w-100 text-center"
                style={{
                  width: "25vw",
                  minWidth: "25vw",
                  maxWwidth: "25vw",
                  minHeight: "25vw",
                }}
              >
                <FaArrowLeft style={{ pointerEvents: "none" }} />
              </button>
            </div>

            {/* Up Key */}
            <div className="d-flex flex-column">
              <div className=" p-1 mb-auto d-flex">
                <button
                  id="Up"
                  style={{
                    width: "25vw",
                    minWidth: "25vw",
                    maxWidth: "25vw",
                    minHeight: "25vh",
                  }}
                  onClick={(e) => handleVirtualKey(e)}
                  className="btn text-light border w-100 text-center"
                >
                  <FaArrowUp style={{ pointerEvents: "none" }} />
                </button>
              </div>

              {/* Down Key */}
              <div className=" p-1 mt-auto d-flex">
                <button
                  id="Down"
                  style={{
                    width: "25vw",
                    minWidth: "25vw",
                    maxWwidth: "25vw",
                    minHeight: "25vh",
                  }}
                  onClick={(e) => handleVirtualKey(e, true)}
                  className="btn border text-light w-100 text-center"
                >
                  <FaArrowDown style={{ pointerEvents: "none" }} />
                </button>
              </div>
            </div>

            {/* Right Key */}
            <div className=" p-1  d-flex">
              <button
                id="Right"
                onClick={(e) => handleVirtualKey(e, true)}
                className="btn border my-auto text-light w-100 h-100 text-center"
                style={{
                  width: "25vw",
                  minWidth: "25vw",
                  maxWwidth: "25vw",
                  minHeight: "25vw",
                }}
              >
                <FaArrowRight style={{ pointerEvents: "none" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
