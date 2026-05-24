import React, { lazy, Suspense, useEffect } from "react";
import TaskBar from "./components/TaskBar";
import Opened from "./components/Opened";
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Background from "./components/Background";
import { useStateContext } from "./state/StateContext";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { ToastContainer } from "react-toastify";
import Admin from "./pages/Admin";
import AddApp from "./pages/AddApp";
import AdminIndex from "./pages/AdminIndex";
import Login from "./pages/authPages/Login";
import FileManager from "./apps/fsmanager/FileManager";
import FsContext from "./state/FsContext";
import MainSection from "./apps/fsmanager/MainSection";
import SysAdminIndex from "./pages/SysAdminIndex";
import Loader from "./components/Loader";
import Menu from "./components/Menu";
import ConnectedDevices from "./apps/deviceManager/ConnectedDevices";
import ConnectedDevice from "./apps/deviceManager/ConnectedDevice";
const TouchPad = lazy(() => import("./apps/touchpad/Index"));

const Layout = () => {
  const { pop, openApp } = useStateContext();
  const location = useLocation();
  const navigate=useNavigate()
  const [params, _] = useSearchParams();
  useEffect(() => {
    const a = params.get("a");
    const href = params.get("href");
    if (href || a) {
      openApp(a, href);
      navigate(location.pathname)
    }
  }, []);
  return (
    <>
      <Opened />
      <ToastContainer progressStyle={{ opacity: "0" }} />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* File Explorer */}
        <Route
          path="fsexplorer"
          element={
            <FsContext>
              <FileManager />
            </FsContext>
          }
        >
          <Route index element={<MainSection />} />
          <Route path="*" element={<MainSection />} />
        </Route>

        <Route
          path="/touchpad"
          element={
            <>
              {location.pathname.includes("touchpad") && (
                <Suspense fallback={<Loader animate={true} />}>
                  <Admin sudo={true}>
                    <TouchPad />
                  </Admin>
                </Suspense>
              )}
            </>
          }
        />
        <Route path="/devices" element={<Admin sudo={true} />}>
          <Route index element={<ConnectedDevices />} />
          <Route path=":addr" element={<ConnectedDevice />} />
        </Route>
        {/* Home */}
        <Route path="/admin" element={<Admin sudo={true} />}>
          <Route index element={<SysAdminIndex />} />
          <Route path="app" element={<AddApp />} />
        </Route>

        {/* Home */}
        <Route path="/" element={<Admin />}>
          <Route index element={<AdminIndex />} />
          <Route path="app/add" element={<AddApp />} />
        </Route>

        {/* Desktop UI Replical */}
        <Route
          path="/os"
          element={
            <>
              <Background />
              <Outlet />
            </>
          }
        >
          <Route index element={<TaskBar />} />
          <Route path="/os:page" element={<TaskBar />} />
        </Route>
      </Routes>
      {pop && (
        <div
          className="d-flex w-100"
          style={{
            position: "fixed",
            top: "0px",
            bottom: "0px",
            right: "0px",
            leftt: "0px",
            backgroundColor: "#afefff10",
            zIndex: "10000",
          }}
        >
          {pop}
        </div>
      )}
      <Menu />
    </>
  );
};

export default Layout;
