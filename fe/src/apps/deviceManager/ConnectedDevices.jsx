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
    <div className="min-w-75 bg-[#070809] text-gray-200">
      <div className="w-full">
        <div className="w-full p-3">
          <MainHeader />
          <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4">
            <div className="rounded-3xl border border-white/10 bg-[#111] shadow-2xl overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="grid gap-3 max-h-[80vh] overflow-y-auto">
                  {sessions
                    .filter((sess) =>
                      (JSON.stringify(sess) + getDeviceType(sess.agent))
                        .toLocaleLowerCase()
                        .includes(key),
                    )
                    .map((device, i) => (
                      <div
                        key={"$d-" + device.addr + device.agent + i}
                        className="group flex flex-wrap items-center gap-3 rounded-3xl border border-white/10 bg-[#0d0d11] p-4 transition hover:border-white/20 hover:bg-white/10 cursor-pointer"
                        onClick={() => {
                          setModal(
                            <ConnectedDevice socketid={device.socketid} />,
                          );
                        }}
                      >
                        <div className="flex min-w-37.5 items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-[#111] text-2xl text-white">
                            {getDeviceType(device.agent) == "mobile" ? (
                              <FaMobile />
                            ) : (
                              <FaDesktop />
                            )}
                          </div>
                          <div className="text-sm font-medium text-white">
                            {device.addr == "127.0.0.1"
                              ? "HOST - " + device.addr
                              : device.addr}
                          </div>
                        </div>
                        <div className="min-w-40 flex-1 text-sm text-white/80">
                          {device.agent}
                        </div>
                        <div className="min-w-40 text-sm text-white/80">
                          {device.socketid}
                        </div>
                        <div className="min-w-40 text-sm text-white/60">
                          {device.lastAccess.split("GMT")[0]}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
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
