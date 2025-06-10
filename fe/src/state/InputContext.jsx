import { useContext, createContext, useState, useEffect } from "react";
import api, { baseUrl } from "../../axios/api";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

// Create the socket instance outside the component
export const socket = io(baseUrl, {
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
    ready: false,
    mouseDownHold: false,
    mouseIsMoving: false,
  });
  const [pad, setPad] = useState("");
  const [err, setErr] = useState("");
  const [msTimeout, setMsTimeout] = useState(0);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  const init = () => {
    setTimeout(() => {
      const pad = document.getElementById("tp");
      if (!pad) {
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
      pad.onmouseup = drawEnd;

      function drawMove(e) {
        clearTimeout(msTimeout);
        setTouchConfig((prev) => ({
          ...prev,
          dispX: localStorage.mouseDown
            ? (e.clientX || e.touches.item(0).clientX) - prev.mouseX
            : 0,
          dispY: localStorage.mouseDown
            ? (e.clientY || e.touches.item(0).clientY) - prev.mouseY
            : 0,
          lastX: prev.mouseX,
          lastY: prev.mouseY,
          mouseX: e.clientX || e.touches.item(0).clientX,
          mouseY: e.clientY || e.touches.item(0).clientY,
          mouseIsMoving: true,
        }));
        setMsTimeout(
          setTimeout(() => {
            setTouchConfig((prev) => ({ ...prev, mouseIsMoving: false }));
          }, 400)
        );
      }

      function drawStart(e) {
        const id = "" + Date.now();
        setTouchConfig((prev) => {
          localStorage.mouseDown = "true";
          return {
            ...prev,
            dispX: 0,
            dispY: 0,
            mouseDown: true,
            mouseDownHold: false,
            lastMouseDownX: e.clientX || e.touches.item(0).clientX,
            lastMouseDownY: e.clientY || e.touches.item(0).clientY,
          };
        });
        setTimeout(() => {
          if (localStorage.mouseDown) {
            setTouchConfig((prev) => ({ ...prev, mouseDownHold: true }));
          }
          localStorage.clickId = id;
        }, 250);
      }

      function drawEnd(e) {
        localStorage.mouseDown = "";
        setTouchConfig((prev) => ({
          ...prev,
          mouseDown: false,
          mouseDownHold: false,
          lastMouseUpX: e.clientX || e.touches.item(0)?.clientX || prev?.lastX,
          lastMouseUpY: e.clientY || e.touches.item(0)?.clientY || prev?.lastY,
        }));
      }
    }, 500);
  };

  useEffect(() => {
    !touchConfig.mouseIsMoving &&
      setTouchConfig((prev) => ({
        ...prev,
        dispX: 0,
        dispY: 0,
      }));
  }, [touchConfig.mouseIsMoving]);

  useEffect(() => {
    try {
      socket.emit("pointerEvent", touchConfig);
      setErr("");
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
      }}
    >
      {children}
      {/* <pre
        className="small p-5 fixed-top "
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          pointerEvents: "none",
        }}
      >
        {err && "ERROR: " + err}
        <br />
        {JSON.stringify(touchConfig)}
      </pre> */}
    </context.Provider>
  );
};

export default InputConext;
export const useInputContext = () => useContext(context);
