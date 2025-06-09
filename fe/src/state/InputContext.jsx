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
    LastX: 0,
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
      // socket.disconnect();
    };
  }, []);

  const init = () => {
    setTimeout(() => {
      const pad = document.getElementById("tp");
      if (!pad) {
        return init();
      }
      console.log("new pad", pad);
      setTouchConfig((prev) => {
        setPad(pad);
        return {
          ...prev,
          ready: true,
        };
      });
      pad.onmousemove = (e) => {
        clearTimeout(msTimeout);
        setTouchConfig((prev) => ({
          ...prev,
          dispX: e.clientX - prev.mouseX,
          dispY: e.clientY - prev.mouseY,
          lastX: prev.mouseX,
          lastY: prev.mouseY,
          mouseX: e.clientX,
          mouseY: e.clientY,
          mouseIsMoving: true,
        }));
        setMsTimeout(
          setTimeout(() => {
            setTouchConfig((prev) => ({ ...prev, mouseIsMoving: false }));
          }, 400)
        );
      };
      pad.onmousedown = (e) => {
        const id = "" + Date.now();
        setTouchConfig((prev) => {
          localStorage.mouseDown = "true";
          return {
            ...prev,
            dispX: 0,
            dispY: 0,
            mouseDown: true,
            mouseDownHold: false,
            lastMouseDownX: e.clientX,
            lastMouseDownY: e.clientY,
          };
        });
        setTimeout(() => {
          if (localStorage.mouseDown) {
            setTouchConfig((prev) => ({ ...prev, mouseDownHold: true }));
          }
          localStorage.clickId = id;
        }, 250);
      };
      pad.onmouseup = (e) => {
        localStorage.mouseDown = "";
        setTouchConfig((prev) => ({
          ...prev,
          mouseDown: false,
          mouseDownHold: false,
          lastMouseUpX: e.clientX,
          lastMouseUpY: e.clientY,
        }));
      };
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
      <pre
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
      </pre>
    </context.Provider>
  );
};

export default InputConext;
export const useInputContext = () => useContext(context);
