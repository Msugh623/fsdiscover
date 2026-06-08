import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../state/StateContext";
import { FaDesktop, FaMobile, FaTimes } from "react-icons/fa";
import { toast } from "material-react-toastify";
import api from "../../../axios/api";
import { FaFileWaveform, FaSpinner } from "react-icons/fa6";

const ConnectedDevice = ({ socketid }) => {
  const [socketId, setsocketId] = useState();
  const { sessions, setModal, setModalTitle } = useStateContext();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const activities = device?.activities || [];
  const navigate = useNavigate();

  useEffect(() => {
    const foundDevice =
      sessions.find((d) => d.socketid == socketid) ||
      sessions.find((d) => d.addr == socketid);
    if (foundDevice) {
      setsocketId(foundDevice.socketid);
    }
    setDevice(foundDevice);
    setModalTitle("Connected Device");
  }, [socketid, sessions]);

  const getDeviceType = (userAgent) => {
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(userAgent) ? "mobile" : "desktop";
  };

  const closeActivity = async (activity) => {
    try {
      await api.post("/admin/rq/exec", {
        action: "close",
        socketid: socketId || socketid,
        location: activity.location,
        href: activity.href,
        id: activity.id,
      });
      toast.success("Activity closed")
    } catch (err) {
      toast.error(err?.response?.data || err.message || "Something went wrong");
    }
  };

  const toggleActivity = async (activity) => {
    try {
      await api.post("/admin/rq/exec", {
        action: "toggle",
        socketid: socketId || socketid,
        location: activity.location,
        href: activity.href,
        id: activity.id,
      });
      toast.success("Activity minimized")
    } catch (err) {
      toast.error(err?.response?.data || err.message || "Something went wrong");
    }
  };
  const ejectDevice = async () => {
    try {
      navigate("/admin");
    } catch (err) {
      toast.error(
        err?.response?.data || err.message || "Failed to eject device",
      );
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 15000);
  }, []);

  if (!device) {
    return (
      <div className="my-auto p-4 w-full h-full flex items-center justify-center">
        {loading ? (
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-white" />
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#111] p-6 text-white shadow-2xl w-full max-w-sm text-center">
            <h3 className="text-white font-bold mb-2">Device not found</h3>
            <p className="text-white/60 text-sm break-all">
              ID: {socketId || socketid}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 h-full max-h-[90vh] overflow-y-auto">
      <div className="rounded-2xl border border-white/10 bg-[#111] shadow-2xl text-white">
        <div className="bg-[#0c0c10] border-b border-white/10 p-4 rounded-t-2xl sticky top-0 z-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#070708] text-2xl sm:text-3xl text-white">
                {getDeviceType(device?.agent) === "mobile" ? (
                  <FaMobile />
                ) : (
                  <FaDesktop />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/50 mb-1">
                  Connected device
                </p>
                <h3 className="text-lg sm:text-2xl font-bold text-white truncate">
                  {device.addr === "127.0.0.1"
                    ? `HOST : ${device.addr}`
                    : device.addr}
                </h3>
                <p className="text-xs sm:text-sm text-white/60 truncate">
                  {device.type}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 w-full">
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-[#1a1a1a] p-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition active:scale-95"
                onClick={() => setModal("")}
              >
                Close
              </button>
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-[#1a1a1a] p-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition active:scale-95"
                onClick={() => {
                  document.toastId = toast.info("Choose a file to open", {
                    autoClose: false,
                  });
                  setModal("");
                  navigate("/fsexplorer");
                }}
              >
                Open file
              </button>
              <button
                type="button"
                className="col-span-2 lg:col-span-1 rounded-xl border border-red-500/20 bg-red-600/10 p-3 text-xs sm:text-sm font-semibold text-red-500 hover:bg-red-600/20 transition active:scale-95"
                onClick={ejectDevice}
              >
                Eject device
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 p-4">
          <aside className="w-full lg:w-[240px] flex flex-col gap-4">
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
              <button
                onClick={() =>
                  document
                    .getElementById("activities")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-xl border border-white/10 bg-[#1a1a1a] p-2 text-xs text-white/80 hover:bg-white/10 text-center lg:text-left font-bold"
              >
                Activities
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("info")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-xl border border-white/10 bg-[#1a1a1a] p-2 text-xs text-white/80 hover:bg-white/10 text-center lg:text-left font-bold"
              >
                User Info
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("session")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-xl border border-white/10 bg-[#1a1a1a] p-2 text-xs text-white/80 hover:bg-white/10 text-center lg:text-left font-bold"
              >
                Session
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4 text-xs sm:text-sm text-white/70 space-y-2 break-all">
              <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2">
                Device Info
              </p>
              <p>
                <strong className="text-white">ID:</strong>{" "}
                {socketId || socketid}
              </p>
              <p>
                <strong className="text-white">IP:</strong> {device?.addr}
              </p>
              <p>
                <strong className="text-white">Type:</strong> {device?.type}
              </p>
              <p>
                <strong className="text-white">Time:</strong>{" "}
                {new Date(device.lastAccess).toLocaleTimeString()}
              </p>
            </div>
          </aside>

          <div className="flex-1 flex flex-col gap-4">
            <section
              id="activities"
              className="rounded-xl border border-white/10 bg-[#0d0d11] p-4 scroll-mt-20"
            >
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-sm sm:text-base font-bold text-white">
                  Activities
                </h5>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-md text-white/70 font-bold">
                  {activities.length} active
                </span>
              </div>
              {activities.length ? (
                <div className="flex flex-col gap-2">
                  {activities.map((activity) => (
                    <button
                      key={activity.id || activity.href}
                      onClick={() => toggleActivity(activity)}
                      className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#1a1a1a] p-3 text-left transition hover:bg-white/10 w-full overflow-hidden active:scale-[0.98]"
                    >
                      <img
                        src={activity.icon}
                        alt=""
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover bg-black/50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">
                          {activity.name}
                        </div>
                        <div className="text-[10px] sm:text-xs text-white/50 truncate">
                          {(activity?.href || "").replace("/fsexplorer", "") ||
                            activity?.location}
                        </div>
                      </div>
                      <div className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-red-500/20 hover:text-red-500 transition"
                        onClick={(e) => {
                        e.stopPropagation()
                        closeActivity(activity)
                      }}
                      >
                        <FaTimes size={12} />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-white/40 text-center py-4 font-bold">
                  No active processes
                </div>
              )}
            </section>

            <section
              id="info"
              className="rounded-xl border border-white/10 bg-[#0d0d11] p-4 scroll-mt-20"
            >
              <h5 className="text-sm sm:text-base font-bold text-white mb-3">
                User Agent
              </h5>
              <div className="rounded-lg bg-[#1a1a1a] p-3 text-xs sm:text-sm text-white/70 break-words whitespace-pre-wrap">
                {device?.agent}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedDevice;
