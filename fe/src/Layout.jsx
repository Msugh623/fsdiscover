import React, { lazy, Suspense, useEffect } from "react";
import Opened from "./components/Opened";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useStateContext } from "./state/StateContext";
import { ToastContainer } from "material-react-toastify";
import Admin from "./pages/Admin";
import AdminIndex from "./pages/AdminIndex";
import Login from "./pages/authPages/Login";
import SafeMode from "./pages/SafeMode";
import NotFound from "./pages/NotFound";
import FileManager from "./apps/fsmanager/FileManager";
import FsContext from "./state/FsContext";
import MainSection from "./apps/fsmanager/MainSection";
import SysAdminIndex from "./pages/SysAdminIndex";
import Loader from "./components/Loader";
import Menu from "./components/Menu";
import ConnectedDevices from "./apps/deviceManager/ConnectedDevices";
import ConnectedDevice from "./apps/deviceManager/ConnectedDevice";
import Init from "./pages/Init";
const TouchPad = lazy(() => import("./apps/touchpad/Index"));

const Layout = () => {
  const { pop, openApp, safeMode, fetching } = useStateContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [params, _] = useSearchParams();

  useEffect(() => {
    const a = params.get("a");
    const href = params.get("href");
    if (href || a) {
      openApp(a, href);
      navigate(location.pathname);
    }
  }, []);

  // If safe mode is active and the user is not logged in, force frontend-only
  // navigation to the login page. Wait until fetching completes to avoid
  // redirecting while auth/safeMode state is still loading.
  useEffect(() => {
    if (!fetching && safeMode && !localStorage?.access) {
      if (location.pathname !== "/login") navigate("/");
    }
  }, [safeMode, fetching, navigate, location.pathname]);

  return (
    <>
      <Opened />
      <ToastContainer position="top-center" progressStyle={{ opacity: "0" }} />
      <Routes>
        <Route path="/init" element={<Init />} />
        <Route path="/login" element={<Login />} />

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
        </Route>

        {/* Home */}
        <Route path="/" element={<Admin />}>
          <Route
            index
            element={
              fetching ? (
                <Loader animate={true} />
              ) : safeMode && !localStorage?.access ? (
                <SafeMode />
              ) : (
                <AdminIndex />
              )
            }
          />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Pop Window Overlay Container */}
      {pop && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-10000 flex w-full animate-fade-in">
          {pop}
        </div>
      )}
      <Menu />
    </>
  );
};

export default Layout;
