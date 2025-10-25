import React, { useState } from "react";
import Folder from "./Folder";
import File from "./File";
import { FaDownload, FaEllipsisVertical, FaFileZipper } from "react-icons/fa6";
import { useFsContext } from "../../../state/FsContext";
import { BiDevices, BiLock } from "react-icons/bi";
import { useStateContext } from "../../../state/StateContext";
import { FaDesktop, FaMobile } from "react-icons/fa";
import api from "../../../../axios/api";
import { toast } from "react-toastify";
import ConnectedDevice from "../../deviceManager/ConnectedDevice";
import { useNavigate } from "react-router-dom";

const DirItem = ({ item }) => {
  const { key, getFs } = useFsContext();
  const navigate = useNavigate();
  const { forbidroute, sessions, setModal, setModalTitle } = useStateContext();
  const type = item.includes(".") ? "file" : "folder";
  const extension = item.slice(item.lastIndexOf(".") + 1) || "";
  const name = item;
  const detailedType =
    type == "file" ? extension.toUpperCase() + " file" : "Folder";
  const url = location.pathname.replace("/fsexplorer", "fs") + "/" + item;
  const psr = {
    type,
    name,
    detailedType,
    extension,
    size: 0,
    createdAt: "",
    modifiedAt: "",
    url,
  };
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hasDd, setHasDd] = useState(false);

  const dropDownContent = (
    <div
      className=" p-1 small themebg rounded inner"
      onClick={() => {
        setHasDd(false);
      }}
      style={{
        position: "relative",
      }}
    >
      {type == "file" ? (
        <div
          className="p-1 rounded active"
          title="Download File"
          style={{ cursor: "pointer" }}
          onClick={() => {
            const a = document.createElement("a");
            a.href = location.pathname + "/" + psr?.name;
            a.download = psr.name;
            a.click();
          }}
        >
          <FaDownload className="icon" /> Download File
        </div>
      ) : (
        <div
          className="p-1 rounded active"
          title="Download as compressed ZIP"
          style={{ cursor: "pointer" }}
          onClick={() => {
            const a = document.createElement("a");
            a.href =
              location.pathname.replace("/fsexplorer", "/zipper") +
              "/" +
              psr?.name;
            a.download = psr.name;
            a.click();
          }}
        >
          <FaFileZipper className="icon" /> Download ZIP
        </div>
      )}
      {!localStorage.access && (
        <div
          className="p-1 mt-1 text-center rounded active"
          title="Download as compressed ZIP"
          style={{ cursor: "pointer" }}
          onClick={() => {
            localStorage.go = location.pathname;
            navigate("/login");
          }}
        >
          Login for more
        </div>
      )}
      {localStorage.access && (
        <div
          className="p-1 mt-1 rounded active"
          title="Download as compressed ZIP"
          style={{ cursor: "pointer" }}
          onClick={() => {
            const path = location.pathname + "/" + item;
            const data = {
              action: "open",
              pathname: path,
              device: "",
            };
            setModal(<OpenWith data={data} sessions={sessions} />);
            setModalTitle(<h5 className="text-light">Choose a device</h5>);
          }}
        >
          <BiDevices className="icon" /> Open With
        </div>
      )}
      {localStorage.access && (
        <div
          className="p-1 mt-1 rounded active"
          title="Download as compressed ZIP"
          style={{ cursor: "pointer" }}
          onClick={() => {
            const path = location.pathname.replace("/fsexplorer", "");
            forbidroute(url.replace("fs/", ""));
            getFs(path);
          }}
        >
          <BiLock className="icon" /> Protect Route
        </div>
      )}
    </div>
  );

  return name.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(name.toLowerCase()) ? (
    <div className="fs-5 my-1 d-flex active p-2">
      {type == "folder" ? <Folder data={psr} /> : <File data={psr} />}
      <div className="ms-auto">
        <div>
          <div
            className="pe-2"
            title="Download File"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              setHasDd((prev) => !prev);
              setPos({
                x: e.clientX,
                y: e.clientY,
              });
            }}
          >
            <FaEllipsisVertical className="icon" />
          </div>
        </div>
        {hasDd && (
          <>
            <div
              className=""
              onClick={(e) => {
                e.stopPropagation();
                setHasDd(false);
              }}
              style={{
                position: "fixed",
                top: 0 + "px",
                bottom: 0 + "px",
                left: "0px",
                right: "0px",
                // background: '#0e0e030',
                zIndex: "5",
              }}
            ></div>
            <div
              className="themebg small rounded"
              style={{
                width: "150px",
                position: "fixed",
                top: pos.y + "px",
                left: pos.x - 150 + "px",
                zIndex: 6,
              }}
            >
              <div className="active rounded p-1">{dropDownContent}</div>
            </div>
          </>
        )}
      </div>
    </div>
  ) : (
    false
  );
};

export default DirItem;

function OpenWith({ data }) {
  const { setModal, setModalTitle } = useStateContext();
  const {sessions}=useStateContext()
  async function handleSelect(id) {
    const meta = {
      ...data,
      socketid: id,
    };
    try {
      await api.post("/admin/rq/exec", meta);
      id !== "host"
        ? setModal(<ConnectedDevice socketid={id} />)
        : setModal(<ConnectedDevice socketid={"127.0.0.1"} />);
      setModalTitle("");
      document.toastId && toast.dismiss(document.toastId);
    } catch (error) {
      toast.error(
        "Open failed with message: " + (error?.response?.data || error?.message)
      );
    }
  }

  return (
    <>
      <div
        className="container p-3 px-4 "
        style={{
          maxWidth: "90vw",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {!sessions.find((sess) => sess?.addr == "127.0.0.1") ? (
          <div
            key={"host-base-system="}
            className="active p-1 d-flex rounded c-pointer mb-2 row"
            onClick={() => {
              handleSelect("host");
            }}
            style={{
              overflow: "auto",
            }}
          >
            <div className="icon col-sm-1 mb-2 mt-1">
              <FaDesktop />
            </div>
            <div className="ps-2 col-sm-2 mb-2 mt-1">HOST</div>
            <div className="ps-2 col-sm-5 mb-2 mt-1">
              Open "
              {(data?.pathname || "").slice(
                (data?.pathname || "").lastIndexOf("/") + 1
              )}
              " with the host computer running fsdiscover{" "}
            </div>
          </div>
        ) : (
          <></>
        )}
        {(sessions || [])
          .filter((device) => device.addr == "127.0.0.1")
          .map((device, i) => (
            <div
              key={device.addr + device.agent + i}
              className="active p-1 d-flex rounded c-pointer mb-2 row"
              onClick={() => {
                handleSelect(device.socketid);
              }}
              style={{
                overflow: "auto",
              }}
            >
              <div className="icon col-sm-1 mb-2 mt-1">
                {getDeviceType(device.agent) == "mobile" ? (
                  <FaMobile />
                ) : (
                  <FaDesktop />
                )}
              </div>
              <div className="ps-2 col-sm-2 mb-2 mt-1">
                {device.addr == "127.0.0.1"
                  ? "HOST - " + device.addr
                  : device.addr}
              </div>
              <div className="ps-2 col-sm-5 mb-2 mt-1">{device.agent} </div>
              <div className="ps-2 col-sm-2 mb-2 mt-1">{device.socketid} </div>
              <div className="ps-2 col-sm-2 mb-2 mt-1">
                {device.lastAccess.split("GMT")[0]}{" "}
              </div>
            </div>
          ))}
        {(sessions || [])
          .filter((device) => device.addr !== "127.0.0.1")
          .map((device, i) => (
            <div
              key={device.addr + device.agent + i}
              className="active p-1 d-flex rounded c-pointer mb-2 row"
              onClick={() => {
                handleSelect(device.socketid);
              }}
              style={{
                overflow: "auto",
              }}
            >
              <div className="icon col-sm-1 mb-2 mt-1">
                {getDeviceType(device.agent) == "mobile" ? (
                  <FaMobile />
                ) : (
                  <FaDesktop />
                )}
              </div>
              <div className="ps-2 col-sm-2 mb-2 mt-1">
                {device.addr == "127.0.0.1" ? "HOST" : device.addr}
              </div>
              <div className="ps-2 col-sm-5 mb-2 mt-1">{device.agent} </div>
              <div className="ps-2 col-sm-2 mb-2 mt-1">{device.socketid} </div>
              <div className="ps-2 col-sm-2 mb-2 mt-1">
                {device.lastAccess.split("GMT")[0]}{" "}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

function getDeviceType(userAgent) {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent) ? "mobile" : "desktop";
}
