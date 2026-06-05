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
      <div className="my-auto p-4 fadeIn">
        {loading ? (
          <div className="text-center pt-4 px-5 mt-4">
            <FaSpinner className="spinner fs-1 text-white" />
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#111] p-6 text-white shadow-2xl">
            <h3 className="text-white mb-2">Device not found</h3>
            <p className="text-white/80">
              The device with ID or Address {socketId || socketid} could not be
              found.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-0 py-0">
      <div className="rounded-3xl border border-white/10 bg-[#111] shadow-2xl text-white overflow-hidden max-h-[85vh]">
        <div className="bg-[#0c0c10] border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4 min-w-0 w-full">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-[#070708] text-3xl text-white">
                {getDeviceType(device?.agent) === "mobile" ? (
                  <FaMobile />
                ) : (
                  <FaDesktop />
                )}
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-2">
                  Connected device
                </p>
                <h3 className="text-2xl font-semibold text-white truncate max-w-full">
                  {device.addr == "127.0.0.1"
                    ? `HOST - ${device.addr}`
                    : device.addr}
                </h3>
                <p className="text-sm text-white/60 truncate">{device.type}</p>
              </div>
            </div>

            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full min-w-0">
              <button
                type="button"
                className="rounded-3xl border border-white/10 bg-[#111] px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition"
                onClick={() => setModal("")}
              >
                Close
              </button>
              <button
                type="button"
                className="rounded-3xl border border-white/10 bg-[#111] px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition min-w-0"
                onClick={() => {
                  document.toastId = toast.info(
                    `Choose a file you want to open with ${
                      device.addr == "127.0.0.1"
                        ? "HOST - " + device.addr
                        : device.addr
                    }`,
                    { autoClose: false },
                  );
                  setModal("");
                  navigate("/fsexplorer");
                }}
              >
                Open file
              </button>
              <button
                type="button"
                className="rounded-3xl border border-white/10 bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 transition min-w-0"
                onClick={ejectDevice}
              >
                Eject device
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-2 lg:hidden">
            {[
              { id: "activities", label: "Activities" },
              { id: "info", label: "User Info" },
              { id: "session", label: "Session" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="w-full rounded-3xl border border-white/10 bg-[#111] px-4 py-3 text-left text-sm text-white/80 hover:bg-white/10 transition"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[220px_1fr] p-4 sm:p-6">
          <aside className="hidden lg:block space-y-4">
            <div className="rounded-3xl border border-white/10 bg-[#0d0d11] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-3">
                Navigate
              </p>
              {[
                { id: "activities", label: "Activities" },
                { id: "info", label: "User Info" },
                { id: "session", label: "Session" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    document
                      .getElementById(item.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="w-full rounded-2xl px-4 py-3 text-left text-sm text-white/80 hover:bg-white/10 transition"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0d0d11] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-3">
                Device summary
              </p>
              <div className="space-y-3 text-sm text-white/70">
                <div>
                  <span className="text-white/60">Socket ID:</span>
                  <div className="break-all max-w-full">
                    {socketId || socketid}
                  </div>
                </div>
                <div>
                  <span className="text-white/60">Address:</span> {device?.addr}
                </div>
                <div>
                  <span className="text-white/60">Type:</span> {device?.type}
                </div>
                <div>
                  <span className="text-white/60">Connected:</span>{" "}
                  {new Date(device.lastAccess).toLocaleString()}
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            <section
              id="activities"
              className="rounded-3xl pb-5 border border-white/10 bg-[#0d0d11] p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h5 className="text-lg font-semibold text-white">
                    Running Activities
                  </h5>
                  <p className="text-sm text-white/60">
                    Tap an activity to toggle its state.
                  </p>
                </div>
                <span className="text-sm text-white/50">
                  {activities.length} active
                </span>
              </div>

              {activities.length ? (
                <div className="grid gap-3 mt-4">
                  {activities.map((activity) => (
                    <button
                      key={activity.id || activity.href}
                      type="button"
                      onClick={() => toggleActivity(activity)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111] p-4 text-left transition hover:border-white/20 hover:bg-white/10"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={activity.icon}
                          alt=""
                          className="h-10 w-10 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-semibold text-white truncate">
                            {activity.name}
                          </div>
                          <div className="text-sm text-white/60 truncate break-words max-w-full">
                            {(activity?.href || "").replace(
                              "/fsexplorer",
                              "",
                            ) || activity?.location}
                          </div>
                        </div>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white/80 flex-shrink-0">
                          <FaTimes />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-white/60">No running activities</div>
              )}
            </section>

            <section
              id="info"
              className="rounded-3xl border border-white/10 bg-[#0d0d11] p-4"
            >
              <h5 className="text-lg font-semibold text-white mb-3">
                User Information
              </h5>
              <div className="grid gap-3 text-sm text-white/80">
                <div className="rounded-2xl bg-[#111] p-4">
                  <div className="text-white/60">Address</div>
                  <div className="mt-2 text-white">{device?.addr}</div>
                </div>
                <div className="rounded-2xl bg-[#111] p-4">
                  <div className="text-white/60">User Agent</div>
                  <div className="mt-2 text-white">{device?.agent}</div>
                </div>
              </div>
            </section>

            <section
              id="session"
              className="rounded-3xl border border-white/10 bg-[#0d0d11] p-4"
            >
              <h5 className="text-lg font-semibold text-white mb-3">
                Session Information
              </h5>
              <div className="grid gap-3 text-sm text-white/80">
                <div className="rounded-2xl bg-[#111] p-4">
                  <div className="text-white/60">Type</div>
                  <div className="mt-2 text-white">
                    {getDeviceType(device?.user?.agent)}
                  </div>
                </div>
                <div className="rounded-2xl bg-[#111] p-4">
                  <div className="text-white/60">Connected Since</div>
                  <div className="mt-2 text-white">
                    {new Date(device.lastAccess).toLocaleString()}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedDevice;
