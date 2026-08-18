import React, { useEffect, useState } from "react";
import MainHeader from "./components/MainHeader";
import { FaDesktop, FaMobile } from "react-icons/fa";
import { useStateContext } from "../../state/StateContext";
import ConnectedDevice from "./ConnectedDevice";
import api from "../../../axios/api";
import { toast } from "material-react-toastify";

const ConnectedDevices = () => {
  const { setModal, sessions, key, hostname } = useStateContext();
  useEffect(() => {
    document.title = hostname + " Device Manager - FSdiscover";
  }, []);

  const [config, setConfig] = useState({
    discovered: [],
    pairing: [],
    pairRequests: [],
    paired: [],
  });

  const loadConfig = async () => {
    try {
      const res = await api.get("/rq/neighborhood/config");
      setConfig(res.data || {});
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>,
      );
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const updateAction = async (endpoint, payload, successText) => {
    try {
      await api.post(`/rq/neighborhood/${endpoint}`, payload || {});
      if (successText) toast.success(successText);
      await loadConfig();
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>,
      );
    }
  };

  const renderBeamList = (items, type) => {
    if (!items || !items.length) {
      return (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0d0d11] p-3 text-sm text-white/45">
          No devices in this group yet.
        </div>
      );
    }

    return items.map((beam, index) => (
      <div
        key={`${type}-${beam.deviceID || beam.address || beam.hostname || index}`}
        className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0d0d11] p-3"
      >
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-white">
            {beam.hostname || "Unknown device"}
          </div>
          <div className="truncate text-xs text-white/50">
            {beam.address || beam.url || beam.deviceID || "No address"}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {type === "discovered" && (
            <button
              className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition"
              onClick={() =>
                updateAction("request-pairing", beam, "Pairing request sent")
              }
            >
              Pair
            </button>
          )}
          {(type === "pairRequests" || type === "pairing") && (
            <>
              <button
                className="rounded-xl bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition"
                onClick={() =>
                  updateAction("accept-pairing", beam, "Pair accepted")
                }
              >
                Accept
              </button>
              <button
                className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition"
                onClick={() =>
                  updateAction("reject-pairing", beam, "Pair request rejected")
                }
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-w-75 bg-[#070809] text-gray-200">
      <div className="w-full">
        <div className="w-full p-3">
          <MainHeader />
          <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 space-y-6">
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

            <div className="rounded-3xl border border-white/10 bg-[#111] p-4 shadow-2xl">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-white">
                  Neighborhood
                </h3>
                <button
                  onClick={loadConfig}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition"
                >
                  Refresh
                </button>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#0d0d11] p-4">
                  <div className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/50">
                    Discovered
                  </div>
                  <div className="space-y-2">
                    {renderBeamList(config.discovered, "discovered")}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d0d11] p-4">
                  <div className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/50">
                    Pair Requests
                  </div>
                  <div className="space-y-2">
                    {renderBeamList(config.pairRequests, "pairRequests")}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d0d11] p-4">
                  <div className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/50">
                    Pairing
                  </div>
                  <div className="space-y-2">
                    {renderBeamList(config.pairing, "pairing")}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d0d11] p-4">
                  <div className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/50">
                    Paired
                  </div>
                  <div className="space-y-2">
                    {renderBeamList(config.paired, "paired")}
                  </div>
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
