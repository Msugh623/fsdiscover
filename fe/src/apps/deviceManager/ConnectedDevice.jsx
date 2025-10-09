import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../state/StateContext";
import { FaDesktop, FaMobile, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../../axios/api";
import { BiX } from "react-icons/bi";

const ConnectedDevice = ({ socketid }) => {
  const { sessions } = useStateContext();
  const [device, setDevice] = useState(null);
  const activities = device?.activities || [];
  const navigate=useNavigate()

  useEffect(() => {
    const foundDevice = sessions.find((d) => d.socketid == socketid);
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
        socketid,
        location: activity.location,
        href: activity.href,
      });
    } catch (err) {
      toast.error(
        err?.response?.data || err.message || "Failed to eject device"
      );
    }
  };

  const ejectDevice = async () => {
    try {
      navigate("/admin")
    } catch (err) {
      toast.error(
        err?.response?.data || err.message || "Failed to eject device"
      );
    }
  };

  if (!device) {
    console.log(sessions);
    return (
      <div className="p-4">
        <h3 className="text-danger">Device not found</h3>
        <p>The device with ID {socketid} could not be found.</p>
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
                {getDeviceType(device?.user?.agent) === "mobile" ? (
                  <FaMobile />
                ) : (
                  <FaDesktop />
                )}
              </div>
              <div>
                <h5 className="text-light mb-0">{device.addr}</h5>
                <div className="text-muted">{device.type}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-lg-6 pb-4">
            <div className="paper shadow row p-3">
              <h5 className="text-light mb-3">Running Activities</h5>
              {activities.map((activity) => (
                <>
                  <div className="paper shadow p-3">
                    <div className="d-flex">
                      <img
                        src={activity.icon}
                        alt=""
                        className="rounded"
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                      />
                      <div className="my-auto d-flex ps-2 fs-4 fw-bold w-100">
                        {activity.name}
                        <button
                          className="btn p-1 py-0 ms-auto my-auto fs-5 btn-danger"
                          onClick={() => {
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
            </div>
          </div>
          <div className="col-lg-6">
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
