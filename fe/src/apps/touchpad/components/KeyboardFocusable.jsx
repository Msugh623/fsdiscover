import React, { useRef } from "react";
import { useState } from "react";
import { useInputContext } from "../../../state/InputContext";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaBackward,
  FaForward,
  FaPause,
  FaPlay,
  FaRegKeyboard,
} from "react-icons/fa";
import { useEffect } from "react";
import Menu from "../../../components/Menu";
import { toast } from "react-toastify";

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
  } = useInputContext();

  const [downKeys, setDownKeys] = useState([]);
  const [mediaKeys, setMediaKeys] = useState(false);

  function handleVirtualKey(e) {
    strokerRef.current.focus &&
      window.innerWidth < 780 &&
      strokerRef.current.focus();
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
  }, []);

  return (
    <>
      <div className="menu-panel">
        <div className="mx-auto col-12 col-sm-10 col-md-8 col-xl-9">
          <div
            className={`inner ani  rounded shadow-lg p-3 text-light bg-dark text-left slideUp ${panelClassName}`}
            style={{
              // zIndex: ,
              bottom: "10px",
              position: "relative",
            }}
          >
            <div
              className="row text-light ani"
              style={{
                minHeight: "400px !important",
                height: "24vh",
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
                    <div className=" p-1 d-flex">
                      <button
                        id="Escape"
                        onClick={(e) => handleVirtualKey(e)}
                        className="btn text-light border w-100"
                      >
                        Esc
                      </button>
                    </div>
                    <div className=" p-1 d-flex">
                      <button
                        id="Tab"
                        onClick={(e) => handleVirtualKey(e)}
                        className="btn text-light border w-100"
                      >
                        Tab
                      </button>
                    </div>

                    <div className=" p-1 d-flex">
                      <button
                        id="End"
                        onClick={(e) => handleVirtualKey(e)}
                        className="btn text-light border w-100"
                      >
                        End
                      </button>
                    </div>
                    <div className=" p-1 d-flex">
                      <button
                        id="PageUp"
                        onClick={(e) => handleVirtualKey(e)}
                        className="btn text-light border w-100"
                      >
                        PgUp
                      </button>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="d-flex col-lg-12">
                    <div className=" p-1 d-flex">
                      <button
                        id="LeftControl"
                        value="toggle"
                        onClick={(e) => handleVirtualKey(e)}
                        className={`btn text-light border w-100 ${
                          downKeys.includes("LeftControl") && "active"
                        }`}
                      >
                        Ctrl
                      </button>
                    </div>
                    <div className=" p-1 d-flex">
                      <button
                        id="LeftAlt"
                        value="toggle"
                        onClick={(e) => handleVirtualKey(e)}
                        className={`btn text-light border w-100 ${
                          downKeys.includes("LeftAlt") && "active"
                        }`}
                      >
                        Alt
                      </button>
                    </div>
                    <div className=" p-1 d-flex">
                      <button
                        id="LeftShift"
                        value="toggle"
                        onClick={(e) => handleVirtualKey(e)}
                        className={`btn text-light border w-100 ${
                          downKeys.includes("LeftShift") && "active"
                        }`}
                      >
                        Shift
                      </button>
                    </div>
                    <div className=" p-1 d-flex">
                      <button
                        id="PageDown"
                        onClick={(e) => handleVirtualKey(e)}
                        className="btn text-light border w-100"
                      >
                        PgDown
                      </button>
                    </div>
                  </div>
                </div>
                <div className="ms-auto mt-auto">
                  <div className="d-flex">
                    <div className="col-4 p-1 d-flex">
                      <button
                        id="Insert"
                        onClick={(e) => handleVirtualKey(e)}
                        className="btn pe-4 text-light border w-100"
                      >
                        Insert
                      </button>
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
                        onClick={() => setMediaKeys((prev) => !prev)}
                        className="btn border text-light w-100 text-center"
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
                  aria-multiline="true"
                  onChange={({ target }) => {
                    setKeyVal(
                      target.value[target.value.length - 1] || target.value
                    );
                    setLastPress(Date.now());
                  }}
                  className="form-control bg-dark border rounded text-light"
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
        onClick={() => setHasPannel((prev) => !prev)}
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
