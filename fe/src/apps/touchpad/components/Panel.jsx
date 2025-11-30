import React, { useEffect, useState } from "react";
import { useInputContext } from "../../../state/InputContext";
import { BiInfoCircle } from "react-icons/bi";
import { toast } from "react-toastify";
import { useStateContext } from "../../../state/StateContext";

const Panel = () => {
  const { init, touchConfig, mouseDownHold, socket } = useInputContext();
  const { setMenuPos } = useStateContext();
  const [didInit, setDidInit] = useState(false);
  const [_, setToaster] = useState(0);

  const blink = (id = "") => {
    const el = document.getElementById(id);
    const interval = setInterval(() => {
      el.style.outline = "8px solid steelblue";
      setTimeout(() => {
        el.style.outline = "";
      }, 100);
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
    }, 1200);
  };

  const levels = [
    () => {
      localStorage.toastData =
        "Welcome to the fsdiscover Remote input tour guide";
      setToaster(
        (prev) =>
          (localStorage.lastToast = toast.info(
            <ToastModel
              done={false}
              prev={prev || "0"}
              next={() => tourGuide(1)}
            />,
            { autoClose: false }
          ))
      );
    },
    () => {
      localStorage.toastData =
        "The rectangular box is the touchpad, swipe or drag on it to move the mouse";
      setToaster(
        (prev) =>
          (localStorage.lastToast = toast.info(
            <ToastModel
              done={false}
              prev={prev || "0"}
              next={() => tourGuide(2)}
            />,
            { autoClose: false }
          ))
      );
      setTimeout(() => {
        blink("tp");
      }, 600);
    },
    () => {
      localStorage.toastData = "On the mouse bar are controls for the mouse";
      setToaster(
        (prev) =>
          (localStorage.lastToast = toast.info(
            <ToastModel
              done={false}
              prev={prev || "0"}
              next={() => tourGuide(3)}
            />,
            { autoClose: false }
          ))
      );
      setTimeout(() => {
        blink("mouseBarInner");
      }, 600);
    },
    () => {
      localStorage.toastData =
        "Swipe on the scrollbar to scroll in any direction, also funtions as middle click";
      setToaster(
        (prev) =>
          (localStorage.lastToast = toast.info(
            <ToastModel
              done={false}
              prev={prev || "0"}
              next={() => tourGuide(4)}
            />,
            { autoClose: false }
          ))
      );
      setTimeout(() => {
        blink("scrollBar");
      }, 600);
    },
    () => {
      localStorage.toastData =
        "Click on the keyboard icon to open remote keyboard";
      setToaster(
        (prev) =>
          (localStorage.lastToast = toast.info(
            <ToastModel
              done={false}
              prev={prev || "0"}
              next={() => tourGuide(5)}
            />,
            { autoClose: false }
          ))
      );
      setTimeout(() => {
        blink("start");
      }, 600);
    },
    () => {
      localStorage.toastData =
        "On mobile or touchscreen keyboards, Key inputs might produce unexpected behaviors, in such scenarios, use the key along with SHIFT.";
      setToaster(
        (prev) =>
          (localStorage.lastToast = toast.info(
            <ToastModel
              done={false}
              prev={prev || "0"}
              next={() => tourGuide(6)}
            />,
            { autoClose: false }
          ))
      );
    },
    () => {
      localStorage.toastData =
        "If you are facing difficulty connecting, check your network connection or the logs for errors, if everything looks fine and you still can't connect, Go to the admin page and eject some redundant devices to continue.";
      setToaster(
        (prev) =>
          (localStorage.lastToast = toast.info(
            <ToastModel
              done={false}
              prev={prev || "0"}
              next={() => tourGuide(7)}
            />,
            { autoClose: false }
          ))
      );
    },
    () => {
      localStorage.toastData =
        "<div>On MacOS, Remote input relies on Native tools such as Iterm.app for accesibility access, If remote input is not working, go to <code>System Settings -> Security & Privacy -> Privacy tab -> Accessibility </code> and ensure <code>Iterm.app</code> and <code>Intellij IDEA.app</code> are <code>Enabled</code> <div><a href='/macos-guide.png' target='_blank'><img src='/macos-guide.png' style='width: 100%;' class='rounded mt-2 shadow mb-2'> </a></div><small>Click Image to exapnd it</small></div>";
      setToaster(
        (prev) =>
          (localStorage.lastToast = toast.info(
            <ToastModel
              done={false}
              prev={prev || "0"}
              next={() => tourGuide(8)}
            />,
            { autoClose: false }
          ))
      );
    },
    () => {
      localStorage.toastData =
        "Hurray! You have reached the end of this guide. Good luck";
      setToaster(
        (localStorage.lastToast = toast.info((prev) => (
          <ToastModel
            done={true}
            prev={prev || "0"}
            next={() => {
              null;
            }}
          />
        )))
      );
    },
  ];

  function tourGuide(level = 0) {
    levels[level](level);
  }

  useEffect(() => {
    setMenuPos({
      x: window.innerWidth - 60,
      y: 15,
    });
  }, []);

  return (
    <div
      className="d-flex"
      style={{
        overflow: "hidden",
        maxWidth: "99vw",
      }}
    >
      <div
        className={`active rounded btn p-1 px-2`}
        style={{
          position: "fixed",
          top: "1.2rem",
          left: "1.2rem",
          zIndex: socket.connected ? 10 : 10000,
        }}
        onClick={({ target }) => {
          socket.connected || !String(target.innerHTML).includes("Conn")
            ? tourGuide(0)
            : toast(`
              Socket Might not be connect due to poor internet or an authorization issue, please refresh the browser, if error persists, check network devices, if it still persists try to log in again or go to admin>devices and eject some redundant devices and refresh or lastly, check if the FSdiscover session is still running or restart FSdiscover on the host computer all over again.
            `);
          if (!socket.connected || String(target.innerHTML).includes("Conn")) {
            target.classList.add("d-none");
            setTimeout(() => {
              target.classList.remove("d-none");
            }, 7000);
          }
        }}
      >
        <BiInfoCircle className="icon" />{" "}
        {socket.connected ? (
          ""
        ) : (
          <small className="bg-warning text-dark" style={{ zIndex: 10 }}>
            Not Connected
          </small>
        )}
      </div>
      <div
        className="mt-auto mx-auto"
        style={{
          border: "50%",
          backgroundColor: mouseDownHold
            ? "green"
            : touchConfig.mouseDown
            ? touchConfig.mouseDownHold
              ? "green"
              : "red"
            : touchConfig.scollDown
            ? "yellow"
            : "#efefef",
          pointerEvents: "none",
          height: "2px",
          position: "fixed",
          top: "0px",
          left: "0px",
          right: "0px",
          zIndex: 1,
          marginLeft: "0px",
          minWidth: "110vw",
        }}
      ></div>
      <canvas
        id="tp"
        className="border"
        style={{
          height: "100vh",
          position: "fixed",
          width: "99.99vw",
        }}
      ></canvas>
      {!didInit &&
        (() => {
          init(document.getElementById("tp"));
          setDidInit(true);
        })()}
      <div
        className="p-1"
        style={{
          border: "50%",
          backgroundColor: mouseDownHold
            ? "green"
            : touchConfig.mouseDown
            ? touchConfig.mouseDownHold
              ? "green"
              : "red"
            : "steelblue",
          position: "fixed",
          top: touchConfig.mouseY - 3,
          left: touchConfig.mouseX - 3,
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
};

export default Panel;

function ToastModel({ data, next, done }) {
  return (
    <>
      <div
        dangerouslySetInnerHTML={{ __html: data || localStorage.toastData }}
      ></div>
      <div className="d-flex mt-1">
        <div className="me-auto">
          <button
            className="btn-primary p-1 px-2 btn-small btn"
            onClick={() => {
              toast.dismiss(localStorage.lastToast);
              next();
            }}
            style={{
              fontSize: ".8em",
            }}
          >
            {!done ? "Next" : "Done"}
          </button>
        </div>
      </div>
    </>
  );
}
