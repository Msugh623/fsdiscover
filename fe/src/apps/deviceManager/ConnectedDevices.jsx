import React, { useEffect } from "react";
import MainHeader from "./components/MainHeader";
import { FaDesktop, FaMobile } from "react-icons/fa";
import { useStateContext } from "../../state/StateContext";
import ConnectedDevice from "./ConnectedDevice";

const ConnectedDevices = () => {
  const { setModal, sessions, key, hostname } = useStateContext();
  useEffect(() => {
    document.title = hostname + " Device Manager - FSdiscover";
  }, []);

  return (
    <div
      style={{
        minWidth: "300px",
      }}
    >
      <div className="flex w-full">
        <div
          className="w-full bg-gray-900"
          style={{
            minWidth: window.innerWidth < 500 ? "100vw" : "",
          }}
        >
          <MainHeader />
          <>
            <div
              className="max-w-4xl mx-auto px-4 p-3 px-4"
              style={{
                maxWidth: "90vw",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              {sessions
                .filter((sess) =>
                  (JSON.stringify(sess) + getDeviceType(sess.agent))
                    .toLocaleLowerCase()
                    .includes(key)
                )
                .map((device, i) => (
                  <div
                    key={"$d-" + device.addr + device.agent + i}
                    className="active p-1 flex rounded c-pointer mb-2 flex flex-wrap -mx-2"
                    onClick={() => {
                      setModal(<ConnectedDevice socketid={device.socketid} />);
                    }}
                    style={{
                      overflow: "auto",
                    }}
                  >
                    <div className="pl-2 col-sm-2 mb-2 mt-1">
                      <div className="icon mb-2 text-2xl mt-1">
                        {getDeviceType(device.agent) == "mobile" ? (
                          <FaMobile />
                        ) : (
                          <FaDesktop />
                        )}
                      </div>
                      {device.addr == "127.0.0.1"
                        ? "HOST - " + device.addr
                        : device.addr}
                    </div>
                    <div className="pl-2 mt-auto sm:w-5/12 px-2 mb-2 mt-1">
                      {device.agent}{" "}
                    </div>
                    <div className="pl-2 mt-auto col-sm-3 mb-2 mt-1">
                      {device.socketid}{" "}
                    </div>
                    <div className="pl-2 mt-auto col-sm-2 mb-2 mt-1">
                      {device.lastAccess.split("GMT")[0]}{" "}
                    </div>
                  </div>
                ))}
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

function getDeviceType(userAgent) {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent) ? "mobile" : "desktop";
}

export default ConnectedDevices;
