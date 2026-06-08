import React, { useEffect, useState } from "react";
import { useStateContext } from "../state/StateContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../../axios/api";
import { toast } from "material-react-toastify";
import {
  FaCompress,
  FaDesktop,
  FaExpandArrowsAlt,
  FaLock,
  FaMobile,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlaceHolder from "../components/PlaceHolder";

const SysAdminIndex = () => {
  const {
    fetchConfig,
    visitors,
    forbidden,
    setForbidden,
    protectedRoutes,
    setProtectedRoutes,
    hostname,
    changePass,
    devices,
    setDevices,
    traffic,
    setTraffic,
    setScrollConfig,
    runtimeConfig,
    setRuntimeConfig,
  } = useStateContext();
  const navigate = useNavigate();
  const [category, setCategory] = useState("Visitors");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function forbid(visitor) {
    try {
      const res = await api.put("/admin/rq/forbidden", visitor);
      setForbidden(res.data);
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>,
      );
    }
  }

  async function eject(device) {
    try {
      const res = await api.post("/admin/rq/devices/rem", device);
      setDevices(res.data);
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>,
      );
    }
  }

  async function ejectVisitor(visitor) {
    try {
      const res = await api.post("/admin/rq/visitors/rem", visitor);
      setVisitors(res.data);
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>,
      );
    }
  }

  async function pardon(forbidden) {
    try {
      const res = await api.post("/admin/rq/forbidden/pardon", forbidden);
      setForbidden(res.data);
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>,
      );
    }
  }

  async function unprotectRoute(route) {
    try {
      const res = await api.put("/admin/rq/protectedroutes", { route });
      setProtectedRoutes(res.data);
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>,
      );
    }
  }

  async function updateRuntimeConfig(newConfig) {
    const cfg = newConfig || runtimeConfig;
    const tst = toast.loading("Updating");
    try {
      const res = await api.put("/admin/rq/runtime", cfg);
      setRuntimeConfig(res.data);
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>,
      );
    } finally {
      toast.dismiss(tst);
    }
  }

  async function getRuntimeConfig() {
    const tst = toast.loading("Gathering resources");
    try {
      const res = await api.get("/admin/rq/runtime");
      setRuntimeConfig(res.data);
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>,
      );
    } finally {
      toast.dismiss(tst);
    }
  }

  async function logout(sudo) {
    if (!confirm("Logout?") && !sudo) {
      return;
    }
    try {
      await api.post("/admin/rq/logout");
      localStorage.access = "";
      location.href = location.origin;
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>,
      );
      navigate("/login");
      localStorage.access = "";
    }
  }

  function autoScroll() {
    setTimeout(() => {
      if (category === "Network Traffic") {
        document.getElementById("bottom")?.scrollIntoView({ inline: "center" });
      }
    }, 40);
  }

  useEffect(() => {
    document.title = "FSdiscover - " + hostname + " : Admin";
    fetchConfig();
    const pushLog = ({ detail }) => {
      setTraffic((prev) => [
        ...prev,
        { ...detail, message: detail.message.split("-")[0] },
      ]);
      const cfg = {
        top: scrollY,
        height: document.documentElement.scrollHeight - window.innerHeight,
      };
      setScrollConfig(cfg);
      autoScroll();
    };
    window.addEventListener("netlog", pushLog);
    return () => {
      window.removeEventListener("netlog", pushLog);
    };
  }, [hostname, category]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#070809] text-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto bg-[#111] p-5 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 border-r border-white/5 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between lg:hidden mb-6">
          <span className="text-xl font-bold">Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg bg-white/5 p-2 hover:bg-white/10"
          >
            <FaTimes />
          </button>
        </div>

        <Link to="/" className="mb-8 flex items-center gap-3">
          <LazyLoadImage
            effect="opacity"
            placeholder={<PlaceHolder />}
            src="/icon.png"
            draggable={false}
            className="h-12 w-12 rounded-2xl bg-white/5 p-2"
            alt="FSdiscover Logo"
          />
          <div>
            <p className="text-lg font-semibold">{hostname}</p>
            <p className="text-sm text-white/60">Administrator</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-2">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/50">
            Navigation
          </p>
          {[
            { value: "Visitors", label: "Visitors" },
            { value: "Forbidden", label: "Forbidden" },
            { value: "Protected Routes", label: "Protected Routes" },
            { value: "Devices", label: "Devices" },
            { value: "Network Traffic", label: "Network Traffic" },
            { value: "Active Sessions", label: "Active Sessions" },
            { value: "RuntimeConfiguration", label: "Runtime Configuration" },
          ].map((item) => (
            <button
              key={item.value}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${
                category === item.value
                  ? "bg-white/10 text-white border border-white/10"
                  : "bg-transparent text-white/80 hover:bg-white/5"
              }`}
              onClick={() => {
                setCategory(item.value);
                setSidebarOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 space-y-3">
          <button
            className="w-full rounded-2xl border border-white/10 bg-[#0d0d11] px-4 py-3 text-left text-white hover:bg-white/10 transition flex items-center gap-2"
            onClick={changePass}
          >
            <FaLock /> Change Password
          </button>
          <button
            className="w-full rounded-2xl border border-white/10 bg-red-600 px-4 py-3 text-left text-white hover:bg-red-700 transition flex items-center gap-2"
            onClick={() => logout()}
          >
            <BiLogOut /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#070809] p-4 lg:p-8">
        <div className="mb-6 flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#111] p-5 shadow-2xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/50">
                Administrator Dashboard
              </p>
              <h1 className="text-xl font-semibold text-white">
                {hostname} - Admin
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/60">
                Monitor visitors, traffic, sessions, devices, and runtime
                configuration from one place.
              </p>
            </div>
            <button
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen(true)}
              className="ml-auto inline-flex items-center justify-center rounded-lg bg-white/5 p-3 text-white hover:bg-white/10 lg:hidden"
            >
              <FaBars />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-[#0d0d11] p-4 text-center">
              <div className="text-xs text-white/50">Visitors</div>
              <div className="mt-1 text-xl font-semibold text-white">
                {visitors.length}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0d0d11] p-4 text-center">
              <div className="text-xs text-white/50">Traffic</div>
              <div className="mt-1 text-xl font-semibold text-white">
                {traffic.length}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0d0d11] p-4 text-center">
              <div className="text-xs text-white/50">Devices</div>
              <div className="mt-1 text-xl font-semibold text-white">
                {devices.length}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-3xl border border-white/10 bg-[#111] p-4 shadow-xl">
            <p className="text-sm text-white/60">Current Category</p>
            <p className="mt-2 text-lg font-semibold">{category}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#111] p-4 shadow-xl">
            <p className="text-sm text-white/60">Traffic Events</p>
            <p className="mt-2 text-lg font-semibold">{traffic.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#111] p-4 shadow-xl">
            <p className="text-sm text-white/60">Runtime Config</p>
            <p className="mt-2 text-lg font-semibold">
              {Object.keys(runtimeConfig || {}).length}
            </p>
          </div>
        </div>

        <section className="space-y-6">
          {(category === "All" || category === "Visitors") && (
            <div className="rounded-3xl border border-white/10 bg-[#0d0d11] p-4 shadow-2xl overflow-x-auto">
              <h3 className="mb-4 text-xl font-semibold">Visitors</h3>
              <div className="min-w-[700px] grid gap-3 rounded-3xl border border-white/10 bg-[#111] p-3">
                <div className="grid grid-cols-5 gap-3 border-b border-white/10 pb-3 text-sm uppercase tracking-[0.2em] text-white/50">
                  <div>Type / Address</div>
                  <div>User Agent</div>
                  <div>Last Access</div>
                  <div>First Access</div>
                  <div>Action</div>
                </div>
                {visitors.map((u, i) => (
                  <div
                    key={"v" + u?.addr + u?.agent}
                    className={`grid grid-cols-5 items-center gap-3 rounded-2xl border border-white/10 p-3 text-sm ${
                      i % 2 !== 0 ? "bg-white/5" : "bg-[#0d0d11]"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#111] text-lg">
                        {getDeviceType(u.agent) === "mobile" ? (
                          <FaMobile />
                        ) : (
                          <FaDesktop />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-medium text-white">{u.type}</div>
                        <div className="truncate text-xs text-white/60">
                          {u?.addr}
                        </div>
                      </div>
                    </div>
                    <div className="truncate text-white/70">{u?.agent}</div>
                    <div className="text-white/70">
                      {u?.lastAccess.split("(")[0]}
                    </div>
                    <div className="text-white/70">{u?.date.split("(")[0]}</div>
                    <div className="flex gap-2">
                      <button
                        className="rounded-xl bg-gray-600 px-3 py-1 text-sm font-medium hover:bg-gray-700 transition"
                        onClick={() => ejectVisitor(u)}
                      >
                        Eject
                      </button>
                      <button
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700 transition"
                        onClick={() => forbid(u)}
                      >
                        Forbid
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(category === "All" || category === "Forbidden") && (
            <div className="rounded-3xl border border-white/10 bg-[#0d0d11] p-4 shadow-2xl overflow-x-auto">
              <h3 className="mb-4 text-xl font-semibold">Forbidden</h3>
              <div className="min-w-[700px] grid gap-3 rounded-3xl border border-white/10 bg-[#111] p-3">
                <div className="grid grid-cols-5 gap-3 border-b border-white/10 pb-3 text-sm uppercase tracking-[0.2em] text-white/50">
                  <div>Type / Address</div>
                  <div>User Agent</div>
                  <div>Last Access</div>
                  <div>First Access</div>
                  <div>Action</div>
                </div>
                {forbidden.map((u, i) => (
                  <div
                    key={"f" + u?.addr + u?.agent}
                    className={`grid grid-cols-5 items-center gap-3 rounded-2xl border border-white/10 p-3 text-sm ${
                      i % 2 !== 0 ? "bg-white/5" : "bg-[#0d0d11]"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#111] text-lg">
                        {getDeviceType(u.agent) === "mobile" ? (
                          <FaMobile />
                        ) : (
                          <FaDesktop />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-medium text-white">{u.type}</div>
                        <div className="truncate text-xs text-white/60">
                          {u?.addr}
                        </div>
                      </div>
                    </div>
                    <div className="truncate text-white/70">{u?.agent}</div>
                    <div className="text-white/70">
                      {u?.lastAccess.split("(")[0]}
                    </div>
                    <div className="text-white/70">{u?.date.split("(")[0]}</div>
                    <div>
                      <button
                        className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
                        onClick={() => pardon(u)}
                      >
                        Pardon
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {category === "Protected Routes" && (
            <div className="rounded-3xl border border-white/10 bg-[#0d0d11] p-4 shadow-2xl">
              <h3 className="mb-4 text-xl font-semibold">Protected Routes</h3>
              <div className="grid gap-3 rounded-3xl border border-white/10 bg-[#111] p-3 text-sm text-white/70">
                {protectedRoutes.map((u, i) => (
                  <div
                    key={"f" + u}
                    className={`flex items-center justify-between gap-3 rounded-2xl border border-white/10 p-3 ${
                      i % 2 !== 0 ? "bg-white/5" : "bg-[#0d0d11]"
                    }`}
                  >
                    <div className="truncate">{u}</div>
                    <button
                      className="shrink-0 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
                      onClick={() => unprotectRoute(u)}
                    >
                      Free Route
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(category === "All" || category === "Devices") && (
            <div className="rounded-3xl border border-white/10 bg-[#0d0d11] p-4 shadow-2xl overflow-x-auto">
              <h3 className="mb-4 text-xl font-semibold">Devices</h3>
              <div className="min-w-[800px] grid gap-3 rounded-3xl border border-white/10 bg-[#111] p-3 text-sm text-white/70">
                <div className="grid grid-cols-6 gap-3 border-b border-white/10 pb-3 uppercase tracking-[0.2em] text-white/50">
                  <div>ID</div>
                  <div>Address</div>
                  <div>Agent</div>
                  <div>Type</div>
                  <div>Date</div>
                  <div>Action</div>
                </div>
                {devices.map((device, i) => (
                  <div
                    key={"v" + device?.clientId + device?.type}
                    className={`grid grid-cols-6 items-center gap-3 rounded-2xl border border-white/10 p-3 text-sm ${
                      i % 2 !== 0 ? "bg-white/5" : "bg-[#0d0d11]"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#111] text-lg text-white">
                        {getDeviceType(device?.user?.agent) === "mobile" ? (
                          <FaMobile />
                        ) : (
                          <FaDesktop />
                        )}
                      </div>
                      <div className="truncate">{device?.clientId}</div>
                    </div>
                    <div className="truncate">{device?.user?.addr}</div>
                    <div className="truncate">{device?.user?.agent}</div>
                    <div>{device?.type}</div>
                    <div>{device?.date}</div>
                    <div className="flex gap-2">
                      <button
                        className="rounded-xl bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 transition"
                        onClick={() => eject(device)}
                      >
                        Eject
                      </button>
                      {!forbidden.find(
                        (u) =>
                          u?.addr === device.user.addr &&
                          u?.agent === device?.user?.agent,
                      ) && (
                        <button
                          className="rounded-xl bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 transition"
                          onClick={() => forbid(device.user)}
                        >
                          Forbid
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(category === "All" || category === "Network Traffic") && (
            <NetworkTraffic
              forbid={forbid}
              pardon={pardon}
              data={traffic}
              forbidden={forbidden}
            />
          )}

          {(category === "All" || category === "Active Sessions") && (
            <ActiveSessions />
          )}

          {(category === "All" || category === "RuntimeConfiguration") && (
            <RuntimeConfig
              runtimeConfig={runtimeConfig}
              setRuntimeConfig={setRuntimeConfig}
              updateRuntimeConfig={updateRuntimeConfig}
              getRuntimeConfig={getRuntimeConfig}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default SysAdminIndex;

function NetworkTraffic({ data, forbid, forbidden, pardon }) {
  const [hasPaging, setHasPaging] = useState(true);
  const items = Array.isArray(data) ? data : [];
  return (
    <div
      id="NetworkTraffic"
      className="rounded-3xl border border-white/10 bg-[#0d0d11] p-4 shadow-2xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-xl font-semibold">Network Traffic</h3>
        <div className="flex items-center gap-3 text-sm text-white/60">
          <div>{items.length} events</div>
          <button
            onClick={() => setHasPaging((p) => !p)}
            className="rounded-xl bg-white/10 px-4 py-2 font-medium text-white hover:bg-white/20 transition"
          >
            {hasPaging ? "Recent" : "All"}
          </button>
        </div>
      </div>

      <div className="mt-4 divide-y divide-white/5 overflow-x-auto">
        <div className="min-w-[600px]">
          {(hasPaging
            ? items.slice(items.length > 100 ? items.length - 100 : 0)
            : items
          ).map(({ message, user }, i) => {
            const isForbidden = Boolean(
              forbidden.find(
                (v) => user?.addr === v.addr && user?.agent === v.agent,
              ),
            );
            return (
              <div
                key={"nt" + i}
                className={`flex items-center gap-4 py-3 ${
                  i % 2 !== 0 ? "bg-white/5" : ""
                }`}
              >
                <div className="flex w-3/4 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#111] text-lg text-white">
                    {getDeviceType(user?.agent) === "mobile" ? (
                      <FaMobile />
                    ) : (
                      <FaDesktop />
                    )}
                  </div>
                  <div className="truncate text-sm text-white/80">
                    {message}
                  </div>
                </div>
                <div className="ml-auto shrink-0">
                  <button
                    onClick={() => (isForbidden ? pardon(user) : forbid(user))}
                    className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition ${
                      isForbidden
                        ? "bg-white/10 hover:bg-white/20"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isForbidden ? "Pardon" : "Forbid"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div id="bottom"></div>
    </div>
  );
}

function RuntimeConfig({
  runtimeConfig,
  setRuntimeConfig,
  getRuntimeConfig,
  updateRuntimeConfig,
}) {
  const { apps } = useStateContext();
  const [sessionValue, setSessionValue] = useState(0);
  const [sessionUnit, setSessionUnit] = useState("hours");
  function handleChange({ target }) {
    const { name, type, value, checked } = target;
    let val;
    if (type === "checkbox") val = checked;
    else if (
      type === "select-one" &&
      ["noAuthFsWrite", "noAuthFsRead", "autoUpdate"].includes(name)
    )
      val = value === "true";
    else val = value;
    setRuntimeConfig((prev) => ({ ...prev, [name]: val }));
  }

  useEffect(() => {
    getRuntimeConfig();
  }, []);

  useEffect(() => {
    // initialize session value/unit from runtimeConfig.sessionMaxAge (ms)
    const ms = Number(runtimeConfig?.sessionMaxAge || 0);
    if (ms > 0) {
      // default UI shows hours
      setSessionUnit("hours");
      setSessionValue(ms / 3600000);
    } else {
      setSessionUnit("hours");
      setSessionValue(1);
    }
  }, [runtimeConfig]);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d0d11] p-4 shadow-2xl">
      <div className="flex items-cente sticky -top-8 py-4  bg-[#0d0d11] ">
        <h3 className="text-xl font-semibold">Runtime Configuration</h3>
        <div className="ml-auto ">
          <button
            onClick={() => {
              // convert sessionValue + sessionUnit to milliseconds
              let ms = 0;
              const v = Number(sessionValue) || 0;
              switch (sessionUnit) {
                case "seconds":
                  ms = Math.round(v * 1000);
                  break;
                case "minutes":
                  ms = Math.round(v * 60000);
                  break;
                case "days":
                  ms = Math.round(v * 86400000);
                  break;
                default:
                  // hours
                  ms = Math.round(v * 3600000);
              }
              const payload = { ...(runtimeConfig || {}), sessionMaxAge: ms };
              updateRuntimeConfig(payload);
            }}
            className="rounded-2xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Save Config
          </button>
        </div>
      </div>

      <div className="mt-4 text-sm text-white/70 space-y-4">
        <div>
          These are settings for FSdiscover. Modifying any of these will affect
          the behaviour of FSdiscover installed on your system.
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#111] p-4 block">
          <label className="block text-sm text-white/60">
            Public Directory
          </label>
          <div className="text-sm text-white/60 mt-2">
            Public Directory is the directory FSdiscover's File explorer is
            allowed to access. Ensure the directory exists on the host and is
            absolute.
          </div>
          <input
            type="text"
            value={runtimeConfig?.publicDir || ""}
            name="publicDir"
            className="w-full rounded-2xl border border-white/10 px-3 py-2 bg-transparent mt-2"
            onChange={handleChange}
          />
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#111] p-4 block">
          <label className="block text-sm text-white/60">
            Default Upload Directory
          </label>
          <div className="text-sm text-white/60 mt-2">
            Default upload destination for files uploaded through FSdiscover. If
            empty, uploads go to the user's current directory.
          </div>
          <input
            type="text"
            value={runtimeConfig?.defaultUploadDir || ""}
            name="defaultUploadDir"
            className="w-full rounded-2xl border border-white/10 px-3 py-2 bg-transparent mt-2"
            onChange={handleChange}
          />
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#111] p-4 block">
          <label className="block text-sm text-white/60">
            Upload Files without Authorization
          </label>
          <div className="text-sm text-white/60 mt-2">
            Controls whether users who are not logged in can upload files to the
            host via FSdiscover.
          </div>
          <select
            name="noAuthFsWrite"
            value={String(runtimeConfig?.noAuthFsWrite)}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 px-3 py-2 bg-transparent mt-2"
          >
            <option value={"false"}>Don't Allow</option>
            <option value={"true"}>Allow</option>
          </select>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#111] p-4 block">
          <label className="block text-sm text-white/60">
            Safe Mode Upload Directory
          </label>
          <div className="text-sm text-white/60 mt-2">
            Directory where files uploaded via Safe Mode are placed. Leave empty
            to use default upload directory.
          </div>
          <input
            type="text"
            value={runtimeConfig?.safemodeUploadDir || ""}
            name="safemodeUploadDir"
            className="w-full rounded-2xl border border-white/10 px-3 py-2 bg-transparent mt-2"
            onChange={handleChange}
          />
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#111] p-4 block">
          <label className="block text-sm text-white/60">
            Access Files without Authorization
          </label>
          <div className="text-sm text-white/60 mt-2">
            Controls whether unauthenticated users can read files through
            FSdiscover.
          </div>
          <select
            name="noAuthFsRead"
            value={String(runtimeConfig?.noAuthFsRead)}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 px-3 py-2 bg-transparent mt-2"
          >
            <option value={"false"}>Don't Allow</option>
            <option value={"true"}>Allow</option>
          </select>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#111] p-4 block">
          <label className="block text-sm text-white/60">
            Automatic Updates
          </label>
          <div className="text-sm text-white/60 mt-2">
            Controls whether FSdiscover automatically checks for and stages
            updates for next launch.
          </div>
          <select
            name="autoUpdate"
            value={String(runtimeConfig?.autoUpdate)}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 px-3 py-2 bg-transparent mt-2"
          >
            <option value={"false"}>Don't Allow</option>
            <option value={"true"}>Allow</option>
          </select>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#111] p-4 block">
          <label className="block text-sm text-white/60">Session Max Age</label>
          <div className="text-sm text-white/60 mt-2">
            Specify how long a session remains valid before requiring re-login.
            Choose a value and unit; this will be converted to milliseconds on
            save.
          </div>
          <div className="mt-2 flex w-full gap-2">
            <input
              type="number"
              min={0}
              step="any"
              value={sessionValue}
              onChange={(e) => setSessionValue(Number(e.target.value))}
              className="w-3/4 rounded-2xl border border-white/10 px-3 py-2 bg-transparent"
            />
            <select
              value={sessionUnit}
              onChange={(e) => setSessionUnit(e.target.value)}
              className="w-1/4 rounded-2xl border border-white/10 px-3 py-2 bg-transparent"
            >
              <option className="text-white bg-black" value="seconds">
                Seconds
              </option>
              <option className="text-white bg-black" value="minutes">
                Minutes
              </option>
              <option className="text-white bg-black" value="hours">
                Hours
              </option>
              <option className="text-white bg-black" value="days">
                Days
              </option>
            </select>
          </div>
          <div className="text-xs text-white/50 mt-2">
            Default unit: hours | Current maxAge:{" "}
            {runtimeConfig?.sessionMaxAge || 0} ms
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#111] p-4 block">
          <label className="block text-sm text-white/60">Userspace</label>
          <div className="text-sm text-white/60 mt-2">
            Choose default userspace for this installation.
          </div>
          <select
            name="userspace"
            value={runtimeConfig?.userspace || "individual"}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 px-3 py-2 bg-transparent mt-2"
          >
            <option value="individual">Individual</option>
            <option value="organization">Organization</option>
            <option value="public_space">Public Space</option>
          </select>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#111] p-4 block">
          <label className="block text-sm text-white/60">Node Type</label>
          <div className="text-sm text-white/60 mt-2">
            Whether this instance acts as a child or parent node in a cluster.
          </div>
          <select
            name="nodeType"
            value={runtimeConfig?.nodeType || "child"}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 px-3 py-2 bg-transparent mt-2"
          >
            <option value="child">Child</option>
            <option value="parent">Parent</option>
          </select>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#111] p-4 block">
          <label className="block text-sm text-white/60">Safe Mode</label>
          <div className="text-sm text-white/60 mt-2">
            When enabled, FSdiscover runs with safer defaults and may disable
            risky features.
          </div>
          <div className="mt-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="safeMode"
                checked={!!runtimeConfig?.safeMode}
                onChange={handleChange}
              />
              <span className="text-sm text-white/60">Enable Safe Mode</span>
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#111] p-4 block">
          <label className="block text-sm text-white/60">
            Allowed Services
          </label>
          <div className="text-sm text-white/60 mt-2">
            Select which services are shown and started by FSdiscover on launch.
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {apps.map((app, i) => {
              const isAllowed = (runtimeConfig?.apps || []).includes(
                app?.location,
              );
              return (
                <div
                  key={i}
                  onClick={() => {
                    if (isAllowed) {
                      setRuntimeConfig((prev) => ({
                        ...prev,
                        apps: prev.apps.filter((a) => a !== app?.location),
                      }));
                    } else {
                      setRuntimeConfig((prev) => ({
                        ...prev,
                        apps: [...(prev?.apps || []), app?.location],
                      }));
                    }
                  }}
                  className={`p-1 rounded cursor-pointer border border-white/5 ${isAllowed ? "outline outline-2 outline-steelblue" : ""}`}
                >
                  <img
                    src={app?.icon}
                    alt={app?.name}
                    className="w-14 rounded"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveSessions() {
  const { sessions, setSessions, socket, setForbidden, forbidden } =
    useStateContext();

  async function forbid(visitor) {
    try {
      const res = await api.put("/admin/rq/forbidden", visitor);
      setForbidden(res.data);
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>,
      );
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/rq/sessions");
        setSessions(res.data || []);
      } catch {}
    })();
    const parseSession = (data) => setSessions(data);
    socket.on("sessionEvent", parseSession);
    socket.emit("getSessions");
    return () => socket.off("sessionEvent", parseSession);
  }, []);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d0d11] p-4 shadow-2xl overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Active Sessions</h3>
        <div className="text-sm font-medium text-white/60">
          {sessions.length} connections
        </div>
      </div>

      <div className="min-w-[700px] divide-y divide-white/5 rounded-3xl border border-white/10 bg-[#111] p-3">
        {sessions.map((u, i) => {
          const isHidden = Boolean(
            forbidden.find((v) => u?.addr === v.addr && u?.agent === v.agent),
          );
          if (isHidden) return null;

          return (
            <div
              key={u?.socketid || i}
              className={`flex items-center gap-4 py-3 px-2 ${
                i % 2 !== 0 ? "bg-white/5" : ""
              } rounded-xl`}
            >
              <div className="flex w-2/5 items-center gap-3 overflow-hidden">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#111] text-lg text-white">
                  {getDeviceType(u?.agent) === "mobile" ? (
                    <FaMobile />
                  ) : (
                    <FaDesktop />
                  )}
                </div>
                <div className="truncate text-sm font-medium text-white/80">
                  {u?.socketid} / {u?.addr}
                </div>
              </div>
              <div className="w-1/3 truncate text-sm text-white/70">
                {u?.agent}
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-4">
                <div className="text-xs text-white/50">
                  {u?.lastAccess?.split("(")[0]}
                </div>
                <button
                  onClick={() => forbid(u)}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                >
                  Forbid
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getDeviceType(userAgent) {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent) ? "mobile" : "desktop";
}
