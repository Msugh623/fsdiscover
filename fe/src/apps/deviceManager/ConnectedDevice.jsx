import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../state/StateContext";
import { FaDesktop, FaMobile, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../../axios/api";
import { FaFileWaveform, FaSpinner } from "react-icons/fa6";

const ConnectedDevice = ({ socketid }) => {
  const [socketId, setsocketId] = useState();
  const { sessions, setModal } = useStateContext();
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
        err?.response?.data || err.message || "Failed to eject device"
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
          <>
            <div className="text-center pt-4 px-5 mt-4">
              <FaSpinner className="spinner fs-1" />
            </div>
          </>
        ) : (
          <>
            <h3 className="text-danger">Device not found</h3>
            <p>
              The device with ID or Address {socketId || socketid} could not be
              found.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 p-2">
      <div className="paper text-white shadow-lg p-3">
        <h3 className="text-white fw-bold mb-4">Device Details</h3>
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="lg:w-1/2 px-2">
            <div className="flex items-center mb-3">
              <div className="pr-3 fs-1 icon">
                {getDeviceType(device?.agent) === "mobile" ? (
                  <FaMobile />
                ) : (
                  <FaDesktop />
                )}
              </div>
              <div>
                <h5 className="text-white mb-0">
                  {device.addr == "127.0.0.1"
                    ? "HOST - " + device.addr
                    : device.addr}
                </h5>
                <div className="text-gray-400">{device.type}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="lg:w-1/2 px-2 px-4 pb-4">
            <div className="paper shadow-lg flex flex-wrap -mx-2 p-3 px-2">
              <h5 className="text-white mb-3">Running Activities</h5>
              {activities.map((activity) => (
                <>
                  <div
                    className="paper shadow-lg mb-2 p-3"
                    onClick={()=>toggleActivity(activity)}
                  >
                    <div className="flex">
                      <img
                        src={activity.icon}
                        alt=""
                        className="rounded my-auto"
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                      />
                      <div className="my-auto flex pl-2 text-2xl fw-bold w-full">
                        <div className="text-lg">
                          {" "}
                          {activity.name}
                          <div className="text-sm">
                            <small>
                              {(activity?.href || "").replace(
                                "/fsexplorer",
                                ""
                              ) || activity?.location}
                            </small>
                          </div>
                        </div>
                        <button
                          className="p-1 py-0 ml-auto my-auto text-xl bg-red-600 text-white hover:bg-red-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            closeActivity(activity);
                          }}
                        >
                          <FaTimes className="icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ))}
              <div className="px-3">
                {" "}
                {!activities?.length ? "No running activities" : ""}
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 px-2">
            <div className="paper shadow-lg p-3 mb-4">
              <h5 className="text-white mb-3">Actions</h5>
              <div
                className="paper shadow-lg mb-2 p-1 mr-1"
                style={{
                  width: "fit-content",
                }}
                onClick={() => {
                  document.toastId = toast.info(
                    `Choose a file you want to open with ${
                      device.addr == "127.0.0.1"
                        ? "HOST - " + device.addr
                        : device.addr
                    }`,
                    {
                      autoClose: false,
                    }
                  );
                  setModal("");
                  navigate("/fsexplorer");
                }}
              >
                <div className="flex flex flex-col">
                  <div>
                    <button className="p-1 py-0 ml-auto my-auto text-xl py-1 bg-blue-600 text-white hover:bg-blue-700">
                      <FaFileWaveform
                        alt=""
                        className="rounded fs-1 my-auto"
                        style={{
                          width: "50px",
                        }}
                      />
                    </button>
                  </div>
                  <div className="text-sm">
                    <small>Open a file</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="paper shadow-lg p-3">
              <h5 className="text-white mb-3">User Information</h5>
              <div className="mb-2">
                <strong>Address:</strong> {device?.addr}
              </div>
              <div className="mb-2">
                <strong>User Agent:</strong> {device?.agent}
              </div>
            </div>
            <div className="paper shadow-lg mt-4 p-3">
              <h5 className="text-white mb-3">Session Information</h5>
              <div className="mb-2">
                <strong>Type:</strong> {getDeviceType(device?.user?.agent)}
              </div>
              <div className="mb-2">
                <strong>Connected Since:</strong>{" "}
                {new Date(device.lastAccess).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button className="bg-red-600 text-white hover:bg-red-700" onClick={ejectDevice}>
            Eject Device
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectedDevice;
