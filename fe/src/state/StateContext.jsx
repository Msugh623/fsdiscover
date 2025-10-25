import { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import api, { remoteApi } from "../../axios/api";
import { io } from "socket.io-client";
import { baseUrl } from "../../axios/api";
import { FaTimes } from "react-icons/fa";
import actions from "../assets/actions";

const context = createContext();
// Create the socket instance outside the component
const socket = io(baseUrl, {
  auth: { token: localStorage.access || "" },
  autoConnect: Boolean(true),
});

const StateContext = ({ children }) => {
  const sprintet = {
    name: "App Info",
    location: "https://sprintet.onrender.com/fsdiscover",
    icon: "/info.png",
    pinned: true,
    about: "About Fsdiscover",
    category: "default",
  };

  const fsdiscover = {
    name: "Files",
    location: "/fsexplorer",
    icon: "/icon.png",
    pinned: true,
    about: "Sprintet File Explorer",
    category: "utility",
  };

  const touchpad = {
    name: "Remote Input",
    location: "/touchpad",
    icon: "/touchpad.png",
    pinned: true,
    about: "Remote touchpad for host machine",
    category: "utility",
  };

  const deviceMgr = {
    name: "Device Manager",
    location: "/devices",
    icon: "/device-manager.png",
    pinned: true,
    about: "Control Devices connected to host machine",
    category: "utility",
  };

  const sprintos = {
    name: "Sprint OS",
    location: "/os",
    icon: "/os.png",
    pinned: false,
    about: "Sprintet web Computer UI",
    category: "default",
  };

  const defaultApps = [fsdiscover, touchpad, deviceMgr, sprintet];

  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const location = useLocation();
  const [apps, setApps] = useState([...defaultApps]);
  const [modal, setModal] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const pinned = apps.filter((app) => app?.pinned);
  const [opened, setOpened] = useState([]);
  const [categories, setCategories] = useState([]);
  const [winIsFs, setWinIsFs] = useState(false);
  const [pop, setPop] = useState("");
  const [vw, setVw] = useState(window.innerWidth);
  const [hostname, setHostname] = useState("");
  const [forbidden, setForbidden] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [protectedRoutes, setProtectedRoutes] = useState([]);
  const [password, setPassword] = useState("");
  const [devices, setDevices] = useState([]);
  const [traffic, setTraffic] = useState([]);
  const [runtimeConfig, setRuntimeConfig] = useState({});
  const [profile, setProfile] = useState({});
  const [scrollConfig, setScrollConfig] = useState({
    top: scrollY,
    height: document.documentElement.scrollHeight,
  });
  const [menuPos, setMenuPos] = useState({
    x: 40,
    y: window.innerHeight - 80,
  });
  const [key, setKey] = useState("");
  const [sessions, setSessions] = useState([]);
  async function init() {
    window.onresize = () => setVw(window.innerWidth);
  }

  async function upDateWindow(loc, key, val) {
    setOpened((prev) => {
      return prev.map((item) =>
        item.id == loc || item.location == loc ? { ...item, [key]: val } : item
      );
    });
  }

  function setToTop() {
    const raised = localStorage?.focused;
    setTimeout(() => {
      setOpened((prev) => {
        return prev.map((item) =>
          item.id == raised ? { ...item, zIndex: 5 } : { ...item, zIndex: 3 }
        );
      });
    }, 600);
    setTimeout(() => {
      const ifr = document.getElementById("iframe-" + raised);
      ifr && ifr.focus();
    }, 700);
  }

  async function killWindow(id) {
    setOpened((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  }

  const defaults = () => {
    const defBig = {
      width: window.innerWidth,
      height: window.innerHeight,
      x: 0,
      y: 0,
    };
    return defBig;
  };

  async function openApp(loc, href = "") {
    const openedApp = opened.find((app) => app.location == loc);
    if (openedApp) {
      return upDateWindow(loc, "href", href);
    }
    const app =
      apps.find((app) => app.location == loc) || href ? fsdiscover : null;
    if (app == null) {
      toast.warning("WindowManager: App open failed")
      return;
    }
    const newApp = {
      ...app,
      ...defaults(),
      isMini: false,
      zIndex: 3,
      id: "" + Date.now(),
      href: href || "",
      x: 0,
      y: 0,
    };
    setOpened((prev) => [...prev, newApp]);
    localStorage.focused = newApp.id;
    setTimeout(() => {
      setToTop();
    }, 300);
  }

  function handleIconClick(loc, href) {
    const app = opened.find((app) => app.location == loc);
    if (app) {
      localStorage.focused = app.location;
      if (app.zIndex < 5) {
        return setToTop(loc);
      }
      return upDateWindow(loc, "isMini", !app.isMini);
    }
    openApp(loc, href);
  }

  const fetchSrc = async () => {
    try {
      const hn = await api.get("/hostname");
      setHostname(hn.data);
      const resProfile = await api.get("/profile");
      setProfile(resProfile.data);
      const resConf = await api.get("/runtime");
      setRuntimeConfig(resConf.data);
      // const appsRes = (await remoteApi.get("/rq/apps")).data;
      const psr = [...defaultApps];
      setApps(psr);
      const appName = searchParams.get("a") || "";
      const theApp = psr.find(
        (a) =>
          (a.name + "").toLowerCase() ==
          ("" + appName.replace("%20", " ")).toLowerCase()
      );
      if (theApp) {
        document.theApp = theApp.location;
      }
    } catch (err) {
      // location.pathname !== '/' && toast.error(`ERROR: ${err.message}`)
    }
  };

  async function forbidroute(route) {
    try {
      const res = await api.post("/admin/rq/protectedroutes", { route });
      setProtectedRoutes(res.data);
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>
      );
    }
  }

  const changePass = async () => {
    try {
      if (!confirm("Click OK to continue to password wizard")) {
        return;
      }
      const oldpassword = prompt("Enter current password");
      const newpassword = prompt("Enter new passord");
      const data = {
        oldpassword,
        newpassword,
      };
      await api.post("/admin/rq/change-password", data);
      await api.post("/admin/rq/logout");
      localStorage.access = "";
      location.pathname = "/";
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>
      );
    }
  };

  const fetchConfig = async () => {
    try {
      const resConfig = (await api.get("/admin/rq/config")).data;
      setPassword(resConfig.password);
      setVisitors(resConfig.visitors);
      setForbidden(resConfig.forbidden);
      setProtectedRoutes(resConfig.protectedRoutes || []);
      setDevices(resConfig.devices || []);
    } catch (err) {
      localStorage.access &&
        (() => {
          !("" + err?.response?.data).startsWith("<") &&
            toast.error(
              <div
                dangerouslySetInnerHTML={{
                  __html: `${err?.response?.data || err.message || "" + err}`,
                }}
              ></div>
            );
          if (err.response.status == 401) {
            !("" + err.response.data).startsWith("<") &&
              toast.error("ERROR: Authoraization Error... Login to continue");
            navigate("/login");
            localStorage.access == "";
          }
        })();
    }
  };

  useEffect(() => {
    api.defaults.headers.common["Authorization"] = localStorage?.access || "";
    init();
    fetchSrc();
    localStorage?.access && fetchConfig();
    socket.on("netlog", (data) => {
      window.dispatchEvent(new CustomEvent("netlog", { detail: data }));
    });
    localStorage?.access &&
      (async () => {
        try {
          const res = await api.get("/admin/rq/sessions");
          setSessions(res.data || []);
        } catch {}
      })();
    const parseSession = (data) => {
      setSessions(data);
    };
    localStorage?.access && socket.on("sessionEvent", parseSession);
    localStorage?.access && socket.emit("getSessions");
    window.onscroll = () => {
      setScrollConfig({
        top: scrollY,
        height: document.documentElement.scrollHeight - window.innerHeight,
      });
    };
    setTimeout(() => {
      setScrollConfig({
        top: scrollY,
        height: document.documentElement.scrollHeight - window.innerHeight,
      });
    }, 400);
    document.killWindow = killWindow;
    document.openApp = openApp;
    return () => {
      socket.off("sessionEvent", parseSession);
    };
  }, []);

  useEffect(() => {
    function parseAction(data) {
      actions[data.action](data, openApp);
    }
    socket.id && socket.on("exec-" + socket.id, parseAction);
    return () => {
      socket.off("exec-" + socket.id, parseAction);
    };
  }, [socket.id]);
  useEffect(() => {
    setScrollConfig({
      top: scrollY,
      height: document.documentElement.scrollHeight - window.innerHeight,
    });
  }, [location]);

  useEffect(() => {
    const categories = apps.map((app) => app.category);
    const filterd = categories.filter((app) => Boolean(app));
    const categoriesToSet = new Set([...filterd]);
    const categoriesToArr = [...categoriesToSet];
    setCategories(categoriesToArr);
    document.theApp &&
      (() => {
        openApp(document.theApp);
        document.theApp = "";
      })();
  }, [apps]);

  useEffect(() => {
    const fsWin = opened.find(
      (win) =>
        win.height >= window.innerHeight &&
        win.width >= window.innerWidth &&
        !win.isMini
    );
    setWinIsFs(Boolean(fsWin));
    socket.emit("activities", opened);
  }, [opened]);

  return (
    <context.Provider
      value={{
        apps,
        setApps,
        opened,
        setOpened,
        pinned,
        handleIconClick,
        upDateWindow,
        killWindow,
        winIsFs,
        defaults,
        setToTop,
        vw,
        openApp,
        sprintet,
        fsdiscover,
        fetchSrc,
        categories,
        setCategories,
        pop,
        setPop,
        hostname,
        forbidden,
        setForbidden,
        visitors,
        setVisitors,
        password,
        setPassword,
        fetchConfig,
        changePass,
        protectedRoutes,
        setProtectedRoutes,
        forbidroute,
        devices,
        setDevices,
        socket,
        traffic,
        setTraffic,
        scrollConfig,
        setScrollConfig,
        runtimeConfig,
        setRuntimeConfig,
        sessions,
        setSessions,
        setModal,
        setModalTitle,
        menuPos,
        setMenuPos,
        profile,
        key,
        setKey,
      }}
    >
      {children}
      <>
        <a id="url-mounter" href=""></a>
        {modal && (
          <div
            className="d-flex"
            style={{
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#00000020",
              zIndex: 1,
            }}
            onClick={() => setModal("")}
          >
            <div
              className="rounded m-auto p-2 d-flex slideUp flex-column"
              style={{
                backgroundColor: "#283344ff",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex pb-2">
                <div className=" text-light">{modalTitle}</div>
                <button
                  className="active ms-auto fs-6 p-0 px-2 my-auto rounded"
                  onClick={() => setModal("")}
                >
                  <FaTimes className="icon" />
                </button>
              </div>
              <div
                className="rounded"
                style={{
                  minWidth: "25vw",
                  minHeight: "30vh",

                  maxWidth: "90vw",
                  maxHeight: "75vh",
                  overflow: "auto",
                  backgroundColor: "#121b27ff",
                }}
              >
                {modal}
              </div>
            </div>
          </div>
        )}
      </>
    </context.Provider>
  );
};

export default StateContext;
export const useStateContext = () => useContext(context);
