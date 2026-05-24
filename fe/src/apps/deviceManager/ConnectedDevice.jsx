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
    <div className="container p-2">
      <div className="paper text-light shadow p-3">
        <h3 className="text-light fw-bold mb-4">Device Details</h3>
        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="d-flex align-items-center mb-3">
              <div className="pe-3 fs-1 icon">
                {getDeviceType(device?.agent) === "mobile" ? (
                  <FaMobile />
                ) : (
                  <FaDesktop />
                )}
              </div>
              <div>
                <h5 className="text-light mb-0">
                  {device.addr == "127.0.0.1"
                    ? "HOST - " + device.addr
                    : device.addr}
                </h5>
                <div className="text-muted">{device.type}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-lg-6 px-4 pb-4">
            <div className="paper shadow row p-3 px-2">
              <h5 className="text-light mb-3">Running Activities</h5>
              {activities.map((activity) => (
                <>
                  <div
                    className="paper shadow mb-2 p-3"
                    onClick={()=>toggleActivity(activity)}
                  >
                    <div className="d-flex">
                      <img
                        src={activity.icon}
                        alt=""
                        className="rounded my-auto"
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                      />
                      <div className="my-auto d-flex ps-2 fs-4 fw-bold w-100">
                        <div className="fs-6">
                          {" "}
                          {activity.name}
                          <div className="small">
                            <small>
                              {(activity?.href || "").replace(
                                "/fsexplorer",
                                ""
                              ) || activity?.location}
                            </small>
                          </div>
                        </div>
                        <button
                          className="btn p-1 py-0 ms-auto my-auto fs-5 btn-danger"
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
          <div className="col-lg-6 ">
            <div className="paper shadow p-3 mb-4">
              <h5 className="text-light mb-3">Actions</h5>
              <div
                className="paper shadow mb-2 p-1 me-1 "
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
                <div className="d-flex flex-column">
                  <div>
                    <button className="btn p-1 py-0 ms-auto my-auto fs-5 py-1 btn-primary">
                      <FaFileWaveform
                        alt=""
                        className="rounded fs-1 my-auto"
                        style={{
                          width: "50px",
                        }}
                      />
                    </button>
                  </div>
                  <div className="small">
                    <small>Open a file</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="paper shadow p-3">
              <h5 className="text-light mb-3">User Information</h5>
              <div className="mb-2">
                <strong>Address:</strong> {device?.addr}
              </div>
              <div className="mb-2">
                <strong>User Agent:</strong> {device?.agent}
              </div>
            </div>
            <div className="paper shadow mt-4 p-3">
              <h5 className="text-light mb-3">Session Information</h5>
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
          <button className="btn btn-danger" onClick={ejectDevice}>
            Eject Device
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectedDevice;
