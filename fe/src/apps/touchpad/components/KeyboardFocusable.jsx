import React, { useRef, useState, useEffect } from "react";
import { useInputContext } from "../../../state/InputContext";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaBackspace,
  FaBackward,
  FaForward,
  FaPause,
  FaPlay,
  FaRegKeyboard,
  FaTimes,
  FaWindows,
} from "react-icons/fa";
import { BiVolumeLow, BiX } from "react-icons/bi";
import Delay from "../../../components/Delay";
import { toast } from "material-react-toastify";

const KeyboardFocusable = ({ hasDivider }) => {
  const [panelClassName, setPanelClassName] = useState("hidden");
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

  function handleVirtualKey(e) {
    inputHadFocus && strokerRef.current.focus();
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
        setPanelClassName("hidden");
      }, 500);
    } else {
      setPanelClassName("block");
      toggleKeyboard(true);
    }
  }, [hasPannel]);

  useEffect(() => {
    socket.on("downkeys", (data) => {
      setDownKeys(data || []);
    });
    if (!socket.connected) {
      socket.connect();
    }
  }, []);
  useEffect(() => {
    console.log(keyVal);
  }, [keyVal]);
  return (
    <>
      {controller && (
        <VirtualNavigator
          handleVirtualKey={handleVirtualKey}
          closeController={() => setController(false) || setHasPannel(true)}
        />
      )}
      <div className="menu-panel relative bottom">
        <div className="mx-auto w-full sm:w-11/12 md:w-5/6 xl:w-3/4 px-2">
          <div
            className={`inner keyboard-panel ani rounded-3xl border border-white/10 bg-[#111] shadow-2xl p-4 text-gray-200 text-left slideUp relative ${panelClassName}`}
          >
            <div className="flex items-center justify-between w-full m-0 mb-4 pl-1">
              <h5 className="text-white m-0 font-medium text-sm lg:text-base">
                Remote Keyboard
              </h5>
              <button
                aria-label="Close keyboard panel"
                onClick={() => {
                  setHasPannel(false);
                  toggleKeyboard(false);
                }}
                className="ml-4 rounded border border-white/10 p-1 hover:bg-white/10 text-white transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Grid Layout Container */}
            <div className="grid grid-cols-[5fr_3fr] gap-2 sm:gap-8 md:gap-12 lg:gap-28 mb-4">
              {/* Left Grid: 5 Columns */}
              <div className="grid grid-cols-5 gap-0.5 sm:g-1 md:gap-2">
                <VirtualKey
                  id="MoreToggle"
                  onClick={() => {
                    setOtherKeys((prev) => !prev);
                    inputHadFocus && strokerRef.current.focus();
                  }}
                  className={`border border-white/10 rounded-2xl px-1 sm:px-2 py-2 text-white hover:bg-white/10 transition ${
                    otherKeys ? "bg-white/10" : ""
                  }`}
                >
                  {!otherKeys ? "More" : "Less"}
                </VirtualKey>
                <VirtualKey
                  isAlt={otherKeys}
                  id={"Escape"}
                  onClick={handleVirtualKey}
                >
                  Esc
                </VirtualKey>
                <VirtualKey
                  isAlt={otherKeys}
                  id={"Tab"}
                  onClick={handleVirtualKey}
                >
                  Tab
                </VirtualKey>
                <VirtualKey
                  isAlt={otherKeys}
                  id={"End"}
                  onClick={handleVirtualKey}
                >
                  End
                </VirtualKey>

                {!mediaKeys ? (
                  <VirtualKey
                    id={otherKeys ? "Backspace" : "PageUp"}
                    onClick={handleVirtualKey}
                  >
                    {otherKeys ? (
                      <FaBackspace className="pointer-events-none" />
                    ) : (
                      "PgUp"
                    )}
                  </VirtualKey>
                ) : (
                  <VirtualKey
                    isAlt={otherKeys}
                    id={"VolumeUp"}
                    onClick={handleVirtualKey}
                  >
                    Vol +
                  </VirtualKey>
                )}

                <VirtualKey id="LeftSuper" onClick={handleVirtualKey}>
                  <FaWindows className="text-base sm:text-lg md:text-xl rotate-180 pointer-events-none" />
                </VirtualKey>
                <VirtualKey
                  isAlt={otherKeys}
                  id={"LeftControl"}
                  value={"toggle"}
                  className={
                    downKeys.includes("LeftControl") ? "bg-white/10" : ""
                  }
                  onClick={handleVirtualKey}
                >
                  Ctrl
                </VirtualKey>
                <VirtualKey
                  isAlt={otherKeys}
                  id={"LeftAlt"}
                  value={"toggle"}
                  className={downKeys.includes("LeftAlt") ? "bg-white/10" : ""}
                  onClick={handleVirtualKey}
                >
                  Alt
                </VirtualKey>
                <VirtualKey
                  isAlt={otherKeys}
                  id={"LeftShift"}
                  value={"toggle"}
                  className={
                    downKeys.includes("LeftShift") ? "bg-white/10" : ""
                  }
                  onClick={handleVirtualKey}
                >
                  Shift
                </VirtualKey>

                {!mediaKeys ? (
                  <VirtualKey
                    alt={
                      <VirtualKey id={"Enter"} onClick={handleVirtualKey}>
                        Enter
                      </VirtualKey>
                    }
                    isAlt={otherKeys}
                    id={"PageDown"}
                    onClick={handleVirtualKey}
                  >
                    <span className="hidden sm:inline">PgDown</span>
                    <span className="sm:hidden inline">PgDn</span>
                  </VirtualKey>
                ) : (
                  <VirtualKey
                    isAlt={otherKeys}
                    id={"VolumeDown"}
                    onClick={handleVirtualKey}
                  >
                    <span className="">Vol -</span>
                  </VirtualKey>
                )}
              </div>

              {/* Right Grid: 3 Columns */}
              <div className="grid grid-cols-3 gap-0.5 sm:g-1 md:gap-2">
                {otherKeys ? (
                  <VirtualKey id="Delete" onClick={handleVirtualKey}>
                    Delete
                  </VirtualKey>
                ) : (
                  <VirtualKey
                    id="Insert"
                    onClick={() =>
                      setController(true) ||
                      document.getElementById("start").click()
                    }
                  >
                    <span className="">Present</span>
                  </VirtualKey>
                )}

                {mediaKeys ? (
                  <VirtualKey id="AudioPlay" onClick={handleVirtualKey}>
                    <FaPlay className="pointer-events-none" />
                  </VirtualKey>
                ) : (
                  <VirtualKey id="Up" onClick={handleVirtualKey}>
                    <FaArrowUp className="pointer-events-none" />
                  </VirtualKey>
                )}

                <VirtualKey
                  id="MediaToggle"
                  onClick={() => {
                    setMediaKeys((prev) => !prev);
                    inputHadFocus && strokerRef.current.focus();
                  }}
                  className={`${mediaKeys ? "bg-white/10" : ""}`}
                >
                  {!mediaKeys ? "Media" : "Arrow"}
                </VirtualKey>

                {!mediaKeys ? (
                  <>
                    <VirtualKey id="Left" onClick={handleVirtualKey}>
                      <FaArrowLeft className="pointer-events-none" />
                    </VirtualKey>
                    <VirtualKey id="Down" onClick={handleVirtualKey}>
                      <FaArrowDown className="pointer-events-none" />
                    </VirtualKey>
                    <VirtualKey id="Right" onClick={handleVirtualKey}>
                      <FaArrowRight className="pointer-events-none" />
                    </VirtualKey>
                  </>
                ) : (
                  <>
                    <VirtualKey id="AudioPrev" onClick={handleVirtualKey}>
                      <FaBackward className="pointer-events-none" />
                    </VirtualKey>
                    <VirtualKey id="AudioPlay" onClick={handleVirtualKey}>
                      <FaPause className="pointer-events-none" />
                    </VirtualKey>
                    <VirtualKey id="AudioNext" onClick={handleVirtualKey}>
                      <FaForward className="pointer-events-none" />
                    </VirtualKey>
                  </>
                )}
              </div>
            </div>

            {/* Input Field Area */}
            <div className="w-full">
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
                        })(),
                  );
                  setLastPress(Date.now());
                }}
                className={`w-full px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-[#0d0d11] border border-white/10 rounded-2xl text-gray-200 outline-none transition ${
                  inputHadFocus ? "border-sky-400" : "border-white/10"
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

      <div
        id="start"
        title="Keyboard Menu"
        className={`app fixed left-4 md:bottom-4 bottom-28 rounded-xl my-auto p-2 transition ${
          hasPannel
            ? "bg-white/10 text-white"
            : "bg-[#0d0d11] text-gray-200 hover:bg-white/10"
        }`}
        onClick={() => {
          setHasPannel((prev) => !prev);
          setKeyVal("");
        }}
      >
        <FaRegKeyboard className="text-white text-[2em]" />
      </div>

      {hasDivider !== false && (
        <div className="my-auto mx-2 w-px h-[80%] bg-white/40"></div>
      )}
    </>
  );
};

export default KeyboardFocusable;

function VirtualKey({ children, id, onClick, className, value, isAlt, alt }) {
  return !isAlt || !alt ? (
    <button
      id={id}
      value={value || ""}
      onClick={(e) => onClick(e)}
      className={`rounded-xl border border-white/10 bg-[#0d0d11] text-white flex justify-center items-center hover:bg-white/10 transition text-[0.50rem] sm:text-[0.75rem] md:text-[0.85rem] px-1.5 sm:px-2 md:px-3 py-2 min-w-0 ${className || ""}`}
    >
      {children}
    </button>
  ) : (
    alt
  );
}

function VirtualNavigator({ handleVirtualKey, closeController }) {
  useEffect(() => {
    const killCtr = (e) => {
      e.code == "Escape" && closeController();
    };
    window.addEventListener("keydown", killCtr);

    return () => {
      window.removeEventListener("keydown", killCtr);
    };
  }, []);

  return (
    <div className="flex fixed z-50 inset-0 bg-[#061e2cfa]backdrop-blur-md pb-5 fadeIn">
      <div className="m-auto slideUp  shadow-lg border border-white/10 bg-[#0d0d11] text-white p-3 rounded-[25px] virtualKeyboard">
        <h4 className="text-white flex items-center mb-4">
          Presentation Controller{" "}
          <button
            className="ml-auto rounded border border-white/10 p-1 hover:bg-white/10 transition"
            onClick={closeController}
          >
            <BiX className="text-base sm:text-lg md:text-xl text-white" />
          </button>
        </h4>
        <div className="flex gap-2">
          {/* Left Key */}
          <div className="flex">
            <VirtualKey
              id="Left"
              onClick={(e) => handleVirtualKey(e, true)}
              className="rounded-2xl border-white/10 bg-[#0d0d11] text-white flex justify-center items-center text-base sm:text-lg md:text-xl hover:bg-white/10 transition w-[25vw] h-[40vh]"
            >
              <FaArrowLeft className="pointer-events-none" />
            </VirtualKey>
          </div>

          {/* Up/Down Keys */}
          <div className="flex flex-col gap-2">
            <div className="flex h-full">
              <VirtualKey
                id="Up"
                onClick={(e) => handleVirtualKey(e)}
                className="rounded-2xl border-white/10 bg-[#0d0d11] text-white flex justify-center items-center text-base sm:text-lg md:text-xl hover:bg-white/10 transition w-[25vw] h-[20vh]"
              >
                <FaArrowUp className="pointer-events-none" />
              </VirtualKey>
            </div>
            <div className="flex h-full">
              <VirtualKey
                id="Down"
                onClick={(e) => handleVirtualKey(e, true)}
                className="rounded-2xl border-white/10 bg-[#0d0d11] text-white flex justify-center items-center text-base sm:text-lg md:text-xl hover:bg-white/10 transition w-[25vw] h-[19vh]"
              >
                <FaArrowDown className="pointer-events-none" />
              </VirtualKey>
            </div>
          </div>

          {/* Right Key */}
          <div className="flex">
            <VirtualKey
              id="Right"
              onClick={(e) => handleVirtualKey(e, true)}
              className="rounded-2xl border-white/10 bg-[#0d0d11] text-white flex justify-center items-center text-base sm:text-lg md:text-xl hover:bg-white/10 transition w-[25vw] h-[40vh]"
            >
              <FaArrowRight className="pointer-events-none" />
            </VirtualKey>
          </div>
        </div>
      </div>
    </div>
  );
}
