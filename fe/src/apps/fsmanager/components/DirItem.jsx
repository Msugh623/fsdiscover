import React, { useRef, useState } from "react";
import Folder from "./Folder";
import File from "./File";
import {
  FaCopy,
  FaDownload,
  FaEllipsisVertical,
  FaFileZipper,
} from "react-icons/fa6";
import { useFsContext } from "../../../state/FsContext";
import { BiDevices, BiLock } from "react-icons/bi";
import { useStateContext } from "../../../state/StateContext";
import { FaDesktop, FaMobile, FaShare } from "react-icons/fa";
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
            title={
              "Share " +
              `"${name}"` +
              (type == "folder" ? " as Compressed Zip" : "")
            }
            onClick={() => {
              const path = location.pathname + "/" + item;
              const data = {
                action: "permit",
                pathname: path,
                type: "once",
              };
              setModal(
                <Share
                  meta={{
                    ...psr,
                    zipUrl:
                      location.pathname.replace("/fsexplorer", "/zipper") +
                      "/" +
                      psr?.name,
                  }}
                  data={data}
                  sessions={sessions}
                />,
              );
              setModalTitle(<h5 className="text-white">Share {name}</h5>);
            }}
          >
            <FaShare className="text-sm" />
            <span>Share</span>
          </button>
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
            className="rounded-full  p-2 active  text-gray-200 hover:bg-white/10 transition"
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
    try {
      const targetSession =
        id === "host"
          ? null
          : sessions.find((session) => session.socketid === id);
      const permission = await api.post("/admin/rq/genpem", {
        oneTime: false,
        session: targetSession,
        durationMs: 300000,
      });
      const separator = data.pathname.includes("?") ? "&" : "?";
      const meta = {
        ...data,
        pathname: `${data.pathname}${separator}pem=${permission.data.id}`,
        socketid: id,
      };
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
              <div className="icon col-sm-1 my-auto">
                {getDeviceType(device.agent) == "mobile" ? (
                  <FaMobile />
                ) : (
                  <FaDesktop />
                )}
              </div>
              <div className="pl-2 col-sm-2 mb-2 mt-1">
                {device.addr == "127.0.0.1"
                  ? "HOST - " + device.addr
                  : device.addr}{" "}
                - {device?.deviceName}
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
              <div className="icon col-sm-1 my-auto">
                {getDeviceType(device.agent) == "mobile" ? (
                  <FaMobile />
                ) : (
                  <FaDesktop />
                )}
              </div>
              <div className="pl-2 col-sm-2 mb-2 mt-1">
                {device.addr == "127.0.0.1" ? "HOST" : device.addr} -{" "}
                {device?.deviceName}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

function Share({ data, meta }) {
  const { setModal, setModalTitle } = useStateContext();
  const { sessions, safeMode } = useStateContext();
  const fixUrl = location.href + "/" + meta.name;
  const [url, setUrl] = useState(fixUrl);
  const [conf, setConf] = useState({
    usePermision: false,
    oneTimeUse: true,
    path: fixUrl,
    session: {},
  });

  const selectedSession = conf.session?.addr ? conf.session : null;
  const canCopy = !safeMode || conf.usePermision;

  const generatePermissionUrl = async () => {
    const response = await api.post("/admin/rq/genpem", {
      ...conf,
      session: selectedSession,
      oneTime: conf.oneTimeUse,
      durationMs: conf.durationMs,
    });
    const separator = fixUrl.includes("?") ? "&" : "?";
    return `${fixUrl}${separator}pem=${response.data.id}`;
  };

  const copyShareUrl = async () => {
    if (!canCopy) {
      toast.info("Enable Use Permission before copying in Safe Mode");
      return;
    }

    try {
      const shareUrl = conf.usePermision
        ? await generatePermissionUrl()
        : fixUrl;
      setUrl(shareUrl);
      setTimeout(() => {
        const fileInput = document.getElementById("fileUrl");
        fileInput.focus();
        fileInput.select();
        document.execCommand("copy");
        toast.success(`Link to ${meta.name} copied to clipboard`);
        setTimeout(
          () =>
            toast.info(
              "Make sure your other device is also connected to the same network or Wi-Fi",
            ),
          2500,
        );
      }, 400);
    } catch (err) {
      toast.error(
        err?.response?.data || err.message || "Unable to create link",
      );
    }
  };

  return (
    <>
      <div
        className="max-w-4xl mx-auto p-3 px-4"
        style={{
          maxWidth: "90vw",
          minWidth: "40vw",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <div className="mb-3 flex border p-2 rounded-3xl">
          <input
            id="fileUrl"
            type="text"
            className="focus:border-none px-1 pe-2 overflow-hidden my-auto rounded-3xl w-full"
            value={url}
          />
          <button
            autoFocus
            disabled={!canCopy}
            className="transition-all bg-[#00789c] hover:bg-[#006888] active:bg-[#005974] disabled:cursor-not-allowed disabled:opacity-40 p-2 px-4 rounded-3xl min-w-max"
            onClick={copyShareUrl}
          >
            <div>
              <FaCopy className="inline" /> Copy
            </div>
          </button>
        </div>
        <div className="space-y-3 rounded-3xl border border-white/10 bg-[#111] p-4 text-sm text-white/80">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={conf.usePermision}
              disabled={Boolean(selectedSession)}
              onChange={(event) =>
                setConf((prev) => ({
                  ...prev,
                  usePermision: event.target.checked,
                }))
              }
            />
            <span>Use Permision</span>
          </label>

          {safeMode && !conf.usePermision && (
            <p className="text-xs text-amber-300">
              Safe Mode requires a permission link before this URL can be
              copied.
            </p>
          )}

          <div>
            <div className="mb-2 text-xs uppercase tracking-[0.15em] text-white/45">
              Allow a session
            </div>
            <div className="space-y-2">
              {(sessions || []).map((session, index) => {
                const selected =
                  selectedSession?.addr === session.addr &&
                  selectedSession?.agent === session.agent;
                return (
                  <button
                    type="button"
                    key={`${session.addr}-${session.agent}-${index}`}
                    className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition ${
                      selected
                        ? "border-blue-400 bg-blue-500/20"
                        : "border-white/10 bg-black/20 hover:bg-white/10"
                    }`}
                    onClick={() =>
                      setConf((prev) => ({
                        ...prev,
                        usePermision: true,
                        session: selected ? {} : session,
                      }))
                    }
                  >
                    <span className="truncate">
                      {session.deviceName || session.addr}
                    </span>
                    <span className="ml-3 shrink-0 text-xs text-white/50">
                      {selected ? "Selected" : session.addr}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/45">
              Permission lifetime
            </span>
            <select
              value={conf.oneTimeUse ? "one-time" : String(conf.durationMs)}
              onChange={(event) => {
                const value = event.target.value;
                setConf((prev) =>
                  value === "one-time"
                    ? { ...prev, oneTimeUse: true, durationMs: undefined }
                    : {
                        ...prev,
                        oneTimeUse: false,
                        durationMs: Number(value),
                      },
                );
              }}
              className="w-full rounded-2xl border border-white/10 bg-[#0d0d11] px-3 py-2 text-white"
            >
              <option value="one-time">One time</option>
              <option value="300000">5 minutes</option>
              <option value="3600000">1 hour</option>
              <option value="86400000">1 day</option>
              <option value="604800000">7 days</option>
            </select>
          </label>
        </div>
      </div>
    </>
  );
}
function getDeviceType(userAgent) {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent) ? "mobile" : "desktop";
}
