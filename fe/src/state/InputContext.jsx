import { useContext, createContext, useState, useEffect } from "react";
import { baseUrl } from "../../axios/api";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { keyMap } from "../assets/keymap";

// Create the socket instance outside the component
const socket = io(baseUrl, {
  auth: { token: localStorage.token || "" },
  autoConnect: true,
});

const context = createContext();

const InputConext = ({ children }) => {
  const [touchConfig, setTouchConfig] = useState({
    dispX: 0,
    dispY: 0,
    lastX: 0,
    lastY: 0,
    mouseX: 0,
    mouseY: 0,
    lastMouseDownX: 0,
    lastMouseDownY: 0,
    lastMouseUpX: 0,
    lastMouseUpY: 0,
    mouseDown: false,
    mouseAlt: false,
    ready: false,
    click: false,
    mouseDownHold: false,
    mouseDownHoldExt: false,
    mouseIsMoving: false,
    scrollX: 0,
    scrollY: 0,
    scrollPointX: 0,
    scrollPointY: 0,
    scrollDown: false,
    hasKeyboard: false,
  });
  const [keyConfig, setKeyConfig] = useState({
    downKeys: [],
  });
  const [pad, setPad] = useState("");
  const [err, setErr] = useState("");
  const [msTimeout, setMsTimeout] = useState(0);
  const [hasPannel, setHasPannel] = useState(undefined);
  const [keyVal, setKeyVal] = useState("");
  const [badKey, setBadKey] = useState(false);
  const [lastPress,setLastPress]=useState(Date.now())
  function ensinRange(val) {
    if (val < 20 && val > -20) {
      return val;
    }
    return 0;
  }
  useEffect(() => {
    socket.on("error", (err) => {
      setErr("ERROR: " + err);
      setTimeout(() => setErr(""), 6000);
    });
    return () => {
      !location.href.includes(":5173") && socket.disconnect();
      !location.href.includes(":5173") && location.reload();
    };
  }, []);

  const init = () => {
    setTimeout(() => {
      const pad = document.getElementById("tp");
      const scrollbar = document.getElementById("scrollbar");
      if (!pad && !scrollbar) {
        return init();
      }

      setTouchConfig((prev) => {
        setPad(pad);
        return {
          ...prev,
          ready: true,
        };
      });
      pad.ontouchmove = drawMove;
      pad.onmousemove = drawMove;
      pad.ontouchstart = drawStart;
      pad.onmousedown = drawStart;
      pad.ontouchend = drawEnd;
      pad.ontouchcancel = drawEnd;
      pad.onmouseup = drawEnd;
      pad.onclick = click;
      pad.oncontextmenu = altClick;
    }, 500);
  };

  function drawMove(e) {
    e.stopPropagation();
    clearTimeout(msTimeout);
    setTouchConfig((prev) => {
      const diffX = localStorage.mouseDown
        ? (e.clientX || e.touches.item(0).clientX) - prev.mouseX
        : 0;
      const diffY = localStorage.mouseDown
        ? (e.clientY || e.touches.item(0).clientY) - prev.mouseY
        : 0;
      const newval = {
        ...prev,
        dispX: ensinRange(diffX),
        dispY: ensinRange(diffY),
        lastX: prev.mouseX,
        lastY: prev.mouseY,
        mouseX: e.clientX || e.touches.item(0).clientX,
        mouseY: e.clientY || e.touches.item(0).clientY,
        mouseIsMoving: true,
        mouseDown:Boolean(localStorage.mouseDown),
        click: false,
      };
      const msHist=JSON.parse(localStorage?.mouseHistory||'[]')
        let first = [...msHist, { dispX: newval.dispX, dispY: newval.dispY }]
        first.length > 10 && first.shift()
        localStorage.mouseHistory=JSON.stringify(first)
      return newval
    });
    setMsTimeout(
      setTimeout(() => {
        setTouchConfig((prev) => ({ ...prev, mouseIsMoving: false }));
      }, 400)
    );
  }

  function drawStart(e) {
    e.stopPropagation();
    const id = "" + Date.now();
    setTouchConfig((prev) => {
      localStorage.mouseDown = "true";
      return {
        ...prev,
        dispX: 0,
        dispY: 0,
        mouseDown: true,
        mouseDownHold: false,
        click: false,
        lastMouseDownX: e.clientX || e.touches.item(0).clientX,
        lastMouseDownY: e.clientY || e.touches.item(0).clientY,
        lastX: e.clientX || e.touches.item(0).clientX,
        lastY: e.clientY || e.touches.item(0).clientY,
      };
    });
    setTimeout(() => {
      const didMove=(localStorage?.mouseHistory?JSON.parse(localStorage?.mouseHistory):[]).find(instance=>instance.dispX||instance.dispY)
      if (localStorage.mouseDown && !Boolean(didMove)) {
        console.log(didMove)
        setTouchConfig((prev) => ({ ...prev, mouseDownHold: true }));
      }
      localStorage.clickId = id;
    }, 300);
  }

  function click(e) {
    e.stopPropagation();
    localStorage.mouseDown = "";
    setTouchConfig((prev) => ({
      ...prev,
      mouseDown: false,
      click: "left",
    }));
  }

  function altClick(e) {
    e.stopPropagation();
    localStorage.mouseDown = "";
    setTouchConfig((prev) => ({
      ...prev,
      mouseDown: false,
      click: "right",
    }));
  }

  function drawEnd(e) {
    e.stopPropagation();
    localStorage.mouseDown = "";
    setTouchConfig((prev) => ({
      ...prev,
      mouseDown: false,
      mouseDownHold: false,
      mouseDownHoldExt: false,
      click: false,
      lastMouseUpX: e.clientX || e.touches.item(0)?.clientX || prev?.lastX,
      lastMouseUpY: e.clientY || e.touches.item(0)?.clientY || prev?.lastY,
      lastX: 0,
      lastY: 0,
    }));
    const msHist = JSON.parse(localStorage?.mouseHistory || "[]");
    let first = msHist.map(() => ({ dispX: 0, dispY: 0 }))
    localStorage.mouseHistory = JSON.stringify(first);
  }

  function scrollStart(e) {
    localStorage.scrollDown = "true";
    setTouchConfig((prev) => {
      return {
        ...prev,
        scrollX: 0,
        scrollY: 0,
        scrollDown: true,
        scrollPointX: e.clientX || e.touches.item(0)?.clientX,
        scrollPointY: e.clientY || e.touches.item(0)?.clientY,
      };
    });
  }

  function scrollMove(e) {
    setTouchConfig((prev) => {
      const diffX = localStorage.scrollDown
        ? (e.clientX || e.touches.item(0).clientX) - prev.scrollPointX
        : 0;
      const diffY = localStorage.scrollDown
        ? (e.clientY || e.touches.item(0).clientY) - prev.scrollPointY
        : 0;
      return {
        ...prev,
        scrollX: ensinRange(diffX),
        scrollY: ensinRange(diffY),
        scrollPointX: e.clientX || e.touches.item(0)?.clientX,
        scrollPointY: e.clientY || e.touches.item(0)?.clientY,
      };
    });
  }

  function scrollEnd(e) {
    localStorage.scrollDown = "";
    setTouchConfig((prev) => {
      return {
        ...prev,
        scrollX: 0,
        scrollY: 0,
        scrollDown: false,
        scrollPointX: e.clientX || e.touches.item(0)?.clientX,
        scrollPointY: e.clientY || e.touches.item(0)?.clientY,
      };
    });
  }

  function fingerPrint(key = {}) {
    return "" + key.code + key.keyCode + key.key;
  }

  function judgeEvent(e) {
    const { keyCode, key, code } = e;
    const model = {
      code,
      key: key,
      keyCode,
    };
    return model;
  }

  function isBad(e) {
    e.key=='Backspace'&&setKeyVal('')
    return e.keyCode == 229;
  }

  function handleKeydown(e) {
    e.preventDefault();
    if (isBad(e)) {
      return setBadKey(true);
    }
    const data = judgeEvent(e);
    const print = fingerPrint(data);
    const inDownKeys = keyConfig.downKeys.find((k) => fingerPrint(k) == print);
    if (!inDownKeys) {
      setKeyConfig((prev) => ({
        ...prev,
        downKeys: [data, ...prev.downKeys],
      }));
      const key = keyMap[data.code || data.key];
      socket.emit("keydown", key);
    }
  }

  function handleKeyUp(e) {
    e.preventDefault();
    if (isBad(e)) {
      return setBadKey(true);
    }
    const data = judgeEvent(e);
    const print = fingerPrint(data);
    const inDownKeys = keyConfig.downKeys.find((k) => fingerPrint(k) == print);
    if (inDownKeys) {
      setKeyConfig((prev) => ({
        ...prev,
        downKeys: prev.downKeys.filter((k) => fingerPrint(k) !== print),
      }));
      const key = keyMap[data.code||data.key];
      socket.emit("keyup", key);
    }
  }

  function toggleKeyboard(state = false) {
    setTouchConfig((prev) => ({
      ...prev,
      hasKeyboard: state,
    }));
  }

  useEffect(() => {
    !touchConfig.mouseIsMoving &&
      setTouchConfig((prev) => ({
        ...prev,
        dispX: 0,
        dispY: 0,
      }));
  }, [touchConfig.mouseIsMoving]);

  useEffect(() => {
    if (badKey) {
      socket.emit("keypress", keyVal);
    }
  }, [lastPress]);

  useEffect(() => {
    try {
      socket.emit("pointerEvent", touchConfig);
      // setErr("");
    } catch {
      setErr("Failed to sync pointer data. Please check your connection.");
    }
  }, [touchConfig]);

  return (
    <context.Provider
      value={{
        touchConfig,
        setTouchConfig,
        init,
        pad,
        click,
        altClick,
        scrollStart,
        scrollMove,
        scrollEnd,
        toggleKeyboard,
        handleKeydown,
        handleKeyUp,
        keyConfig,
        setKeyConfig,
        hasPannel,
        setHasPannel,
        keyVal,
        setKeyVal,
        socket,
        setLastPress
      }}
    >
      {" "}
      <pre
        className="small p-5 fixed-top "
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          pointerEvents: "none",
        }}
      >
        {err && <div className="slideUp d-flex text-center">{err}</div>}
        <br />
        {JSON.stringify(keyConfig)}
        <div className="m-auto">{keyVal}</div>
        {`${touchConfig.mouseDownHoldExt}`}
      </pre>
      {children}
    </context.Provider>
  );
};

export default InputConext;
export const useInputContext = () => useContext(context);
