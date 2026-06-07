import React, { useRef, useState } from "react";
import Folder from "./Folder";
import File from "./File";
import { FaDownload, FaEllipsisVertical, FaFileZipper } from "react-icons/fa6";
import { useFsContext } from "../../../state/FsContext";
import { BiDevices, BiLock } from "react-icons/bi";
import { useStateContext } from "../../../state/StateContext";
import { FaDesktop, FaMobile } from "react-icons/fa";
import api from "../../../../axios/api";
import { toast } from "material-react-toastify";
import ConnectedDevice from "../../deviceManager/ConnectedDevice";
import { useNavigate } from "react-router-dom";

const DirItem = ({ item, viewMode = "grid" }) => {
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
  const [hasDd, setHasDd] = useState(false);
  const btnRef = useRef(null);
  const [ddPos, setDdPos] = useState({ top: 0, left: 0 });

  const dropDownContent = (
    <div
      className="space-y-1"
      onClick={() => {
        setHasDd(false);
      }}
    >
      {type == "file" ? (
        <button
          className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-sm text-white/90 hover:bg-white/10 transition-colors"
          title="Download File"
          onClick={() => {
            const a = document.createElement("a");
            a.href = (location.pathname + "/" + psr?.name).replace(
              "fsexplorer/",
              "fsdownload/",
            );
            a.click();
          }}
        >
          <FaDownload className="text-sm" />
          <span>Download File</span>
        </button>
      ) : (
        <button
          className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-sm text-white/90 hover:bg-white/10 transition-colors"
          title="Download as compressed ZIP"
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
          <FaFileZipper className="text-sm" />
          <span>Download ZIP</span>
        </button>
      )}
      {!localStorage.access && (
        <button
          className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-sm text-white/90 hover:bg-white/10 transition-colors"
          title="Login for more options"
          onClick={() => {
            localStorage.go = location.pathname;
            navigate("/login");
          }}
        >
          <span className="text-rose-400">⚠</span>
          <span>Login for more</span>
        </button>
      )}
      {localStorage.access && (
        <>
          <button
            className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-sm text-white/90 hover:bg-white/10 transition-colors"
            title="Open With"
            onClick={() => {
              const path = location.pathname + "/" + item;
              const data = {
                action: "open",
                pathname: path,
                device: "",
              };
              setModal(<OpenWith data={data} sessions={sessions} />);
              setModalTitle(<h5 className="text-white">Choose a device</h5>);
            }}
          >
            <BiDevices className="text-sm" />
            <span>Open With</span>
          </button>
          <button
            className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-sm text-white/90 hover:bg-white/10 transition-colors"
            title="Protect Route"
            onClick={() => {
              const path = location.pathname.replace("/fsexplorer", "");
              forbidroute(url.replace("fs/", ""));
              getFs(path);
            }}
          >
            <BiLock className="text-sm" />
            <span>Protect Route</span>
          </button>
        </>
      )}
    </div>
  );

  return name.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(name.toLowerCase()) ? (
    <>
      <div
        className={`relative bg-[#111] rounded-3xl border border-white/10 shadow-2xl overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl duration-200 slideUp ${viewMode === "list" ? "flex flex-col gap-0" : ""}`}
        onClick={() => {
          if (hasDd) {
            setHasDd(false);
            return;
          }
          if (type === "folder") {
            navigate(location.pathname + "/" + item);
          } else {
            window.open(location.pathname + "/" + item, "_blank");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" && hasDd) {
            e.preventDefault();
            setHasDd(false);
            return;
          }
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (type === "folder") {
              navigate(location.pathname + "/" + item);
            } else {
              window.open(location.pathname + "/" + item, "_blank");
            }
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div
          className={`flex ${viewMode === "list" ? "flex-col sm:flex-row sm:items-center" : "items-center justify-between"} gap-3 p-3 `}
        >
          <div className="min-w-0 w-full">
            {type == "folder" ? <Folder data={psr} /> : <File data={psr} />}
            {viewMode !== "list" ? (
              <div className="text-xs px-2 text-gray-400 mt-1">
                {detailedType}
              </div>
            ) : null}
          </div>
          <button
            ref={btnRef}
            type="button"
            className="rounded-full  p-2 active text-gray-200 hover:bg-white/10 transition"
            title="More actions"
            onClick={(e) => {
              e.stopPropagation();
              const opening = !hasDd;
              if (opening) {
                const rect = e.currentTarget.getBoundingClientRect();
                setDdPos({
                  top: e.pageY + 20,
                  left: rect.left,
                  right: window.innerWidth - rect.right,
                });
              }
              setHasDd((prev) => !prev);
            }}
          >
            <FaEllipsisVertical className="icon" />
          </button>
        </div>
      </div>

      {hasDd && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setHasDd(false);
            }}
          />
          <div
            className="fixed z-50 rounded-3xl border border-white/10 bg-[#0d0d11] shadow-2xl slideUp min-w-55 max-w-xs"
            style={{
              top: `${ddPos.top}px`,
              left: ddPos.right < 300 ? "auto" : `${ddPos.left}px`,
              right: ddPos.right < 300 ? `${ddPos.right}px` : "auto",
            }}
          >
            <div className="rounded-3xl p-3">{dropDownContent}</div>
          </div>
        </>
      )}
    </>
  ) : (
    false
  );
};

export default DirItem;

function OpenWith({ data }) {
  const { setModal, setModalTitle } = useStateContext();
  const { sessions } = useStateContext();
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
        "Open failed with message: " +
          (error?.response?.data || error?.message),
      );
    }
  }

  return (
    <>
      <div
        className="max-w-4xl mx-auto p-3 px-4"
        style={{
          maxWidth: "90vw",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {!sessions.find((sess) => sess?.addr == "127.0.0.1") ? (
          <div
            key={"host-base-system="}
            className="active p-1 flex rounded c-pointer mb-2 flex flex-wrap -mx-2"
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
            <div className="pl-2 col-sm-2 mb-2 mt-1">HOST</div>
            <div className="pl-2 sm:w-5/12 px-2 mb-2 mt-1">
              Open "
              {(data?.pathname || "").slice(
                (data?.pathname || "").lastIndexOf("/") + 1,
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
              className="active p-1 flex rounded c-pointer mb-2 flex flex-wrap -mx-2"
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
              <div className="pl-2 col-sm-2 mb-2 mt-1">
                {device.addr == "127.0.0.1"
                  ? "HOST - " + device.addr
                  : device.addr}
              </div>
              <div className="pl-2 sm:w-5/12 px-2 mb-2 mt-1">
                {device.agent}{" "}
              </div>
              <div className="pl-2 col-sm-2 mb-2 mt-1">{device.socketid} </div>
              <div className="pl-2 col-sm-2 mb-2 mt-1">
                {device.lastAccess.split("GMT")[0]}{" "}
              </div>
            </div>
          ))}
        {(sessions || [])
          .filter((device) => device.addr !== "127.0.0.1")
          .map((device, i) => (
            <div
              key={device.addr + device.agent + i}
              className="active p-1 flex rounded c-pointer mb-2 flex flex-wrap -mx-2"
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
              <div className="pl-2 col-sm-2 mb-2 mt-1">
                {device.addr == "127.0.0.1" ? "HOST" : device.addr}
              </div>
              <div className="pl-2 sm:w-5/12 px-2 mb-2 mt-1">
                {device.agent}{" "}
              </div>
              <div className="pl-2 col-sm-2 mb-2 mt-1">{device.socketid} </div>
              <div className="pl-2 col-sm-2 mb-2 mt-1">
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
