import {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { keyMap } from "../assets/keymap";
import { useStateContext } from "./StateContext";

const context = createContext();


function clamp(val) {
  return val > -30 && val < 30 ? val : 0;
}

function getXY(e) {
  const t = e.touches?.item(0) ?? e.changedTouches?.item(0);
  return {
    x: e.clientX ?? t?.clientX ?? 0,
    y: e.clientY ?? t?.clientY ?? 0,
  };
}

function fingerPrint({ code, keyCode, key }) {
  return `${code}${keyCode}${key}`;
}

function judgeEvent({ keyCode, key, code }) {
  return { code, key, keyCode };
}

// ---

const InputContext = ({ children }) => {
  const { socket } = useStateContext();

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

  const [downKeys, setDownKeys] = useState([]);
  const [pad, setPad] = useState(null);
  const [err, setErr] = useState("");
  const [status, setStatus] = useState("");
  const [hasPannel, setHasPannel] = useState(undefined);
  const [keyVal, setKeyVal] = useState("");
  const [badKey, setBadKey] = useState(false);
  const [mouseDownHold, setMouseDownHold] = useState(false);
  const [lastPress, setLastPress] = useState(Date.now());

  const isMouseDown = useRef(false);
  const isScrollDown = useRef(false);
  const mouseHistory = useRef([]);
  const msTimeoutRef = useRef(null);
  const lastEmitted = useRef({});
  const pressIdRef = useRef(null);

  const downKeysRef = useRef(new Set());

  const hasMounted = useRef(false);

  const handleSocketError = useCallback((e) => {
    setErr("ERROR: " + e);
    setTimeout(() => !e.includes("termina") && setErr(""), 6000);
  }, []);

  const handleSocketConnect = useCallback(() => {
    setStatus("Connected... Validating device");
    setTimeout(() => setStatus(""), 4000);
  }, []);

  useEffect(() => {
    socket.on("error", handleSocketError);
    socket.on("mouseDownHold", setMouseDownHold);
    socket.on("disconnect", () => setStatus("Connection Lost... Retrying"));
    socket.on("connect", handleSocketConnect);

    return () => {
      socket.off("error", handleSocketError);
      socket.off("mouseDownHold", setMouseDownHold);
      socket.off("disconnect");
      socket.off("connect", handleSocketConnect);
    };
  }, [socket, handleSocketError, handleSocketConnect]);

  const drawMove = useCallback((e) => {
    e.stopPropagation();
    clearTimeout(msTimeoutRef.current);

    const { x, y } = getXY(e);

    setTouchConfig((prev) => {
      const dispX = isMouseDown.current ? clamp(x - prev.mouseX) : 0;
      const dispY = isMouseDown.current ? clamp(y - prev.mouseY) : 0;

      const hist = mouseHistory.current;
      hist.push({ dispX, dispY });
      if (hist.length > 10) hist.shift();

      return {
        ...prev,
        dispX,
        dispY,
        lastX: prev.mouseX,
        lastY: prev.mouseY,
        mouseX: x,
        mouseY: y,
        mouseIsMoving: true,
        mouseDown: isMouseDown.current,
        click: false,
      };
    });

    msTimeoutRef.current = setTimeout(() => {
      setTouchConfig((prev) => ({
        ...prev,
        mouseIsMoving: false,
        click: false,
      }));
    }, 400);
  }, []);

  const drawStart = useCallback((e) => {
    e.stopPropagation();
    isMouseDown.current = true;
    mouseHistory.current = [];

    const pressId = Date.now();
    pressIdRef.current = pressId;

    const { x, y } = getXY(e);

    setTouchConfig((prev) => ({
      ...prev,
      dispX: 0,
      dispY: 0,
      mouseDown: true,
      mouseDownHold: false,
      click: false,
      lastMouseDownX: x,
      lastMouseDownY: y,
      lastX: x,
      lastY: y,
    }));

    setTimeout(() => {
      // Stale if a new press/release happened while this timer was running
      if (pressIdRef.current !== pressId) return;
      const didMove = mouseHistory.current.some((h) => h.dispX || h.dispY);
      if (isMouseDown.current && !didMove) {
        setTouchConfig((prev) => ({
          ...prev,
          mouseDownHold: true,
          click: false,
        }));
      }
    }, 300);
  }, []);

  const click = useCallback((e) => {
    e.stopPropagation();
    isMouseDown.current = false;
    pressIdRef.current = null;
    setTouchConfig((prev) => ({ ...prev, mouseDown: false, click: "left" }));
  }, []);

  const altClick = useCallback((e) => {
    e.stopPropagation();
    isMouseDown.current = false;
    pressIdRef.current = null;
    setTouchConfig((prev) => ({ ...prev, mouseDown: false, click: "right" }));
  }, []);

  const drawEnd = useCallback((e) => {
    e.stopPropagation();
    isMouseDown.current = false;
    pressIdRef.current = null;
    mouseHistory.current = mouseHistory.current.map(() => ({
      dispX: 0,
      dispY: 0,
    }));

    const { x, y } = getXY(e);

    setTouchConfig((prev) => ({
      ...prev,
      mouseDown: false,
      mouseDownHold: false,
      mouseDownHoldExt: false,
      click: false,
      lastMouseUpX: x || prev.lastX,
      lastMouseUpY: y || prev.lastY,
      lastX: 0,
      lastY: 0,
    }));
  }, []);

  const scrollStart = useCallback((e) => {
    isScrollDown.current = true;
    const { x, y } = getXY(e);
    setTouchConfig((prev) => ({
      ...prev,
      scrollX: 0,
      scrollY: 0,
      scrollDown: true,
      scrollPointX: x,
      scrollPointY: y,
      click: false,
    }));
  }, []);

  const scrollMove = useCallback((e) => {
    const { x, y } = getXY(e);
    setTouchConfig((prev) => ({
      ...prev,
      scrollX: isScrollDown.current ? clamp(x - prev.scrollPointX) : 0,
      scrollY: isScrollDown.current ? clamp(y - prev.scrollPointY) : 0,
      scrollDown: true,
      click: false,
      scrollPointX: x,
      scrollPointY: y,
    }));
  }, []);

  const scrollEnd = useCallback((e) => {
    isScrollDown.current = false;
    const { x, y } = getXY(e);
    setTouchConfig((prev) => ({
      ...prev,
      scrollX: 0,
      scrollY: 0,
      scrollDown: false,
      click: false,
      scrollPointX: x,
      scrollPointY: y,
    }));
  }, []);

  const init = useCallback(() => {
    const attempt = () => {
      const el = document.getElementById("tp");
      if (!el) return setTimeout(attempt, 500);

      setPad(el);
      setTouchConfig((prev) => ({ ...prev, ready: true }));

      el.ontouchmove = el.onmousemove = drawMove;
      el.ontouchstart = el.onmousedown = drawStart;
      el.ontouchend = el.ontouchcancel = el.onmouseup = drawEnd;
      el.onclick = click;
      el.oncontextmenu = altClick;
    };
    setTimeout(attempt, 500);
  }, [drawMove, drawStart, drawEnd, click, altClick]);

  function isBad(e) {
    if (e.key === "Backspace") setKeyVal("");
    return e.keyCode === 229;
  }

  const handleKeydown = useCallback(
    (e) => {
      e.preventDefault();
      if (isBad(e)) return setBadKey(true);

      const data = judgeEvent(e);
      const print = fingerPrint(data);

      if (downKeysRef.current.has(print)) return;
      downKeysRef.current.add(print);
      socket.emit("keydown", keyMap[data.code || data.key]);
      setDownKeys((prev) => [data, ...prev]);
    },
    [socket],
  );

  const handleKeyUp = useCallback(
    (e) => {
      e.preventDefault();
      if (isBad(e)) return setBadKey(true);

      const data = judgeEvent(e);
      const print = fingerPrint(data);

      if (!downKeysRef.current.has(print)) return;
      downKeysRef.current.delete(print);
      socket.emit("keyup", keyMap[data.code || data.key]);
      setDownKeys((prev) => prev.filter((k) => fingerPrint(k) !== print));
    },
    [socket],
  );

  const toggleKeyboard = useCallback((state = false) => {
    setTouchConfig((prev) => ({ ...prev, hasKeyboard: state }));
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (!touchConfig.mouseIsMoving) {
      setTouchConfig((prev) => ({ ...prev, dispX: 0, dispY: 0, click: false }));
    }
  }, [touchConfig.mouseIsMoving]);

  useEffect(() => {
    if (!badKey) return;
    const fabKey = keyMap[`Key${keyVal.toUpperCase()}`];
    if (fabKey && downKeys.length) {
      socket.emit("keydown", fabKey);
      socket.emit("keyup", fabKey);
    } else {
      socket.emit("keypress", keyVal);
    }
    setBadKey(false);
  }, [lastPress]);

  useEffect(() => {
    const { dispX, dispY, click, mouseDown, mouseDownHold, scrollX, scrollY } =
      touchConfig;
    const prev = lastEmitted.current;

    if (
      prev.dispX === dispX &&
      prev.dispY === dispY &&
      prev.click === click &&
      prev.mouseDown === mouseDown &&
      prev.mouseDownHold === mouseDownHold &&
      prev.scrollX === scrollX &&
      prev.scrollY === scrollY
    )
      return;

    lastEmitted.current = {
      dispX,
      dispY,
      click,
      mouseDown,
      mouseDownHold,
      scrollX,
      scrollY,
    };

    try {
      socket.emit("pointerEvent", touchConfig);
    } catch {
      setErr("Failed to sync pointer data. Please check your connection.");
    }
  }, [
    touchConfig.dispX,
    touchConfig.dispY,
    touchConfig.click,
    touchConfig.mouseDown,
    touchConfig.mouseDownHold,
    touchConfig.scrollX,
    touchConfig.scrollY,
  ]);

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
        keyConfig: { downKeys },
        hasPannel,
        setHasPannel,
        keyVal,
        setKeyVal,
        socket,
        setLastPress,
        downKeys,
        setDownKeys,
        mouseDownHold,
      }}
    >
      <div
        className="text-sm pt-14 p-5 py-6 justify-center left-0 right-0 fixed z-20"
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          pointerEvents: "none",
        }}
      >
        {err && <div className="slideUp w-full flex text-center">{err}</div>}
        <br />
        <div className="text-sm w-full text-center">{status}</div>
      </div>
      {children}
    </context.Provider>
  );
};

export default InputContext;
export const useInputContext = () => useContext(context);
